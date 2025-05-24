document.addEventListener('DOMContentLoaded', () => {
  console.log('Sentinel carregado');
  
  // Elementos da UI
  const elements = {
    btnAuditar: document.getElementById("btnAuditar"),
    btnExportPDF: document.getElementById("btnExportPDF"),
    btnExportJSON: document.getElementById("btnExportJSON"),
    scoreValue: document.getElementById("scoreValue"),
    scoreCircle: document.getElementById("scoreCircle"),
    riskLevel: document.getElementById("riskLevel"),
    resultado: document.getElementById("resultado"),
    loadingText: document.getElementById("loadingText")
  };

  // Estado da aplicação
  let auditData = null;
  const { jsPDF } = window.jspdf || {};

  // Configura listeners
  elements.btnAuditar.addEventListener("click", handleAuditClick);
  elements.btnExportPDF.addEventListener("click", () => auditData && exportAsPDF(auditData));
  elements.btnExportJSON.addEventListener("click", () => auditData && exportAsJSON(auditData));

  // Função principal
  async function handleAuditClick() {
    try {
      setLoading(true);
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error("Nenhuma aba aberta");
      if (tab.url.startsWith('chrome://')) throw new Error("Não pode auditar esta página");

      // Primeiro, injeta o content script
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      } catch (e) {
        console.log('Script já injetado ou erro na injeção:', e);
      }

      // Aguarda um momento para garantir que o script foi carregado
      await new Promise(resolve => setTimeout(resolve, 100));

      // Obtém resultados
      const response = await chrome.tabs.sendMessage(tab.id, { action: "auditar" });

      if (!response) throw new Error("Falha na auditoria");
      
      auditData = response;
      updateUI(response);
      setExportEnabled(true);
      
    } catch (error) {
      console.error("Erro:", error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Atualiza UI
  function updateUI(data) {
    elements.scoreValue.textContent = data.privacyScore;
    
    // Define o nível de risco
    let riskLevel = "Baixo";
    if (data.privacyScore > 70) riskLevel = "Alto";
    else if (data.privacyScore > 40) riskLevel = "Médio";
    
    elements.riskLevel.textContent = `${riskLevel} risco`;
    elements.riskLevel.className = `risk-${riskLevel.toLowerCase()}`;
    
    const risksList = data.risks.length ? 
      data.risks.map(risk => `
        <li>
          <div class="risk-header">
            ${getRiskIcon(risk.type)} <strong>${risk.message}</strong>
            <span class="risk-count">(${risk.count}x)</span>
          </div>
          ${risk.examples?.length ? `<div class="examples">Exemplo: ${risk.examples[0]}</div>` : ''}
        </li>
      `).join('') : 
      '<li class="no-risks"><span class="icon-info"></span> Nenhum risco encontrado</li>';
    
    elements.resultado.innerHTML = risksList;
  }

  // Helpers
  function setLoading(isLoading) {
    elements.btnAuditar.disabled = isLoading;
    elements.loadingText.style.display = isLoading ? 'block' : 'none';
    elements.btnAuditar.innerHTML = isLoading ? 
      '<span class="icon-search"></span> Analisando...' : 
      '<span class="icon-search"></span> Auditar Perfil';
  }

  function setExportEnabled(enabled) {
    elements.btnExportPDF.disabled = !enabled;
    elements.btnExportJSON.disabled = !enabled;
  }

  function showError(message) {
    elements.resultado.innerHTML = `
      <li class="error-message">
        <span class="icon-error"></span> ${message}
      </li>
    `;
  }

  function getRiskIcon(type) {
    const icons = {
      password: '<span class="icon-password"></span>',
      email: '<span class="icon-email"></span>',
      document: '<span class="icon-cpf"></span>',
      default: '<span class="icon-warning"></span>'
    };
    return icons[type] || icons.default;
  }

  // Exportação
  function exportAsPDF(data) {
    try {
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFontSize(16);
      doc.text("Relatório de Privacidade", 20, 20);
      
      // Dados
      doc.setFontSize(12);
      doc.text(`URL: ${data.url}`, 20, 40);
      doc.text(`Pontuação: ${data.privacyScore}%`, 20, 50);
      
      // Riscos
      doc.text("Riscos encontrados:", 20, 70);
      let y = 80;
      data.risks.forEach(risk => {
        doc.text(`- ${risk.message} (${risk.count}x)`, 30, y);
        y += 10;
      });
      
      // Salva
      doc.save("relatorio-privacidade.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      showError("Erro ao exportar PDF");
    }
  }

  function exportAsJSON(data) {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio-privacidade.json';
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar JSON:", error);
      showError("Erro ao exportar JSON");
    }
  }
});
