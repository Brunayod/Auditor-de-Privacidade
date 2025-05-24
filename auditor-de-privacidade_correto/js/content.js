// Auditor de Privacidade Avançado + Função que varre todo o texto visivel da pagina
const bodyText = document.body.innerText;

// Padrões de detecção
const patterns = {
  email: {
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g,
    message: "E-mail exposto",
    risk: 20
  },
  phone: {
    regex: /(\(?\d{2}\)?\s?\d{4,5}-\d{4})|(\d{2}\s?\d{4,5}\s?\d{4})/g,
    message: "Telefone exposto",
    risk: 20
  },
  cpf: {
    regex: /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g,
    message: "CPF exposto",
    risk: 30
  },
  rg: {
    regex: /\d{2}\.?\d{3}\.?\d{3}-?[0-9A-Za-z]{1}/g,
    message: "RG exposto",
    risk: 25
  },
  password: {
    regex: /(senha|password|contraseña|密码|パスワード):?\s*[\w@#$%^&*]+/gi,
    message: "Senha exposta",
    risk: 40
  },
  location: {
    regex: /(localização|local|bairro|cidade|estou em|rua|avenida|logradouro|endereço|coordinates)/gi,
    message: "Localização exposta",
    risk: 15
  },
  creditCard: {
    regex: /\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/g,
    message: "Cartão de crédito exposto",
    risk: 35
  },
  cnpj: {
    regex: /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/g,
    message: "CNPJ exposto",
    risk: 30
  },
  medical: {
    regex: /(laudo médico|diagnóstico|prontuário|doença|treatment|diagnosis)/gi,
    message: "Informação médica exposta",
    risk: 25
  }
};

// Detecção de dados sensíveis
const detectedRisks = [];
let totalRiskScore = 0;
const foundItems = {};

for (const [type, pattern] of Object.entries(patterns)) {
  const matches = bodyText.match(pattern.regex);
  if (matches) {
    foundItems[type] = matches.length;
    totalRiskScore += pattern.risk * matches.length;
    detectedRisks.push({
      type: type,
      message: pattern.message,
      count: matches.length,
      examples: matches.slice(0, 3) // Mostra até 3 exemplos
    });
  }
}

// Calcula a pontuação de privacidade (0-100)
const privacyScore = Math.min(100, totalRiskScore);

// Determina o nível de risco
function getRiskLevel(score) {
  if (score > 70) return "Alto";
  if (score > 40) return "Médio";
  return "Baixo";
}

// Envia dados para o popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "auditar") {
    sendResponse({ 
      risks: detectedRisks,
      privacyScore: privacyScore,
      riskLevel: getRiskLevel(privacyScore),
      foundItems: foundItems,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      scanComplete: true
    });
  }
  return true; // Importante para manter a conexão aberta para resposta assíncrona
});
