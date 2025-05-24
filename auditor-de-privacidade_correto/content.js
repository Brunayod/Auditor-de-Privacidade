// Este arquivo é necessário para interagir com a página web
document.addEventListener('DOMContentLoaded', function() {
    // O código aqui será executado quando a página carregar
});

// Arquivo para interagir com a página web
function coletarDados() {
    // Função que será chamada pelo popup.js
    return {
        url: window.location.href,
        title: document.title
    };
}

// Função para auditar a página
function auditarPagina() {
    console.log('Iniciando auditoria...');
    const risks = [];
    const dados = {
        url: window.location.href,
        title: document.title,
        risks: risks,
        privacyScore: 0,
        scanComplete: true
    };

    // Função auxiliar para adicionar riscos
    function adicionarRisco(tipo, mensagem, exemplo) {
        // Verifica se já existe um risco deste tipo
        const riscoExistente = risks.find(r => r.type === tipo);
        if (riscoExistente) {
            riscoExistente.count++;
            if (exemplo && !riscoExistente.examples.includes(exemplo)) {
                riscoExistente.examples.push(exemplo);
            }
        } else {
            risks.push({
                type: tipo,
                message: mensagem,
                count: 1,
                examples: exemplo ? [exemplo] : []
            });
        }
    }

    // Procura por campos sensíveis em formulários
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const type = input.type.toLowerCase();
        const name = (input.name || input.id || '').toLowerCase();
        const value = input.value.toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();
        
        // Verifica campos de senha
        if (type === 'password') {
            adicionarRisco('password', 'Campo de senha detectado', input.name || input.id || 'senha');
        }
        
        // Verifica campos de email
        if (type === 'email' || name.includes('email') || placeholder.includes('email')) {
            adicionarRisco('email', 'Campo de email detectado', input.name || input.id || 'email');
        }
        
        // Verifica campos de documento
        if (name.includes('cpf') || name.includes('cnpj') || placeholder.includes('cpf') || placeholder.includes('cnpj')) {
            adicionarRisco('document', 'Campo de documento detectado', input.name || input.id);
        }

        // Verifica campos de telefone
        if (type === 'tel' || name.includes('telefone') || name.includes('phone') || placeholder.includes('telefone')) {
            adicionarRisco('phone', 'Campo de telefone detectado', input.name || input.id);
        }

        // Verifica campos de cartão de crédito
        if (name.includes('card') || name.includes('cartao') || placeholder.includes('cartão')) {
            adicionarRisco('creditcard', 'Campo de cartão de crédito detectado', input.name || input.id);
        }
    });

    // Procura por dados sensíveis no texto da página
    const textContent = document.body.innerText;
    
    // Regex para diferentes tipos de dados
    const patterns = {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        cpf: /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g,
        phone: /(\(?\d{2}\)?\s?)?9?\d{4}-?\d{4}/g,
        creditCard: /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g
    };

    // Procura por padrões no texto
    for (const [tipo, regex] of Object.entries(patterns)) {
        const matches = textContent.match(regex);
        if (matches) {
            const mensagens = {
                email: 'Email exposto no texto da página',
                cpf: 'CPF exposto no texto da página',
                phone: 'Telefone exposto no texto da página',
                creditCard: 'Número de cartão exposto no texto da página'
            };
            adicionarRisco(tipo, mensagens[tipo], matches[0]);
        }
    }

    // Procura por elementos específicos que podem conter dados sensíveis
    const elements = document.querySelectorAll('p, span, div, td, th, li');
    elements.forEach(element => {
        const text = element.innerText.toLowerCase();
        
        // Procura por labels que indicam dados sensíveis
        if (text.includes('cpf:') || text.includes('cnpj:')) {
            adicionarRisco('document', 'Documento exposto na página', element.innerText);
        }
        if (text.includes('email:') || text.includes('e-mail:')) {
            adicionarRisco('email', 'Email exposto na página', element.innerText);
        }
        if (text.includes('telefone:') || text.includes('tel:') || text.includes('celular:')) {
            adicionarRisco('phone', 'Telefone exposto na página', element.innerText);
        }
        if (text.includes('endereço:') || text.includes('endereco:')) {
            adicionarRisco('address', 'Endereço exposto na página', element.innerText);
        }
    });

    // Calcula pontuação de privacidade baseada na quantidade e tipo de riscos
    let pontuacao = 0;
    risks.forEach(risk => {
        switch(risk.type) {
            case 'password':
                pontuacao += 20;
                break;
            case 'document':
            case 'creditcard':
                pontuacao += 30;
                break;
            case 'email':
            case 'phone':
                pontuacao += 15;
                break;
            case 'address':
                pontuacao += 10;
                break;
            default:
                pontuacao += 5;
        }
        // Adiciona pontos extras para múltiplas ocorrências
        pontuacao += (risk.count - 1) * 5;
    });

    dados.privacyScore = Math.min(100, pontuacao);
    console.log('Auditoria concluída:', dados);
    
    return dados;
}

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Mensagem recebida:', request);
    if (request.action === "auditar") {
        console.log('Iniciando auditoria...');
        const resultado = auditarPagina();
        console.log('Enviando resposta:', resultado);
        sendResponse(resultado);
    }
    return true; // Mantém a conexão aberta para resposta assíncrona
}); 