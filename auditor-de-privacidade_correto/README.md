# 🛡️ Auditor de Privacidade (Sentinel)

O Sentinel é uma extensão de navegador que analisa páginas de redes sociais para identificar riscos à privacidade. Focando em ser prática, acessível e clara, a ferramenta atua como um vigilante da sua segurança online, identificando informações sensíveis que podem estar expostas a cibercriminosos, seja de forma consciente ou inconsciente.

## 🎯 Sobre o Projeto

Esta extensão para o Chrome foi desenvolvida com o objetivo de:
- 🔍 Analisar páginas web em busca de dados sensíveis expostos
- ⚠️ Alertar sobre riscos à privacidade
- 📊 Fornecer relatórios claros e acionáveis
- 🛡️ Proteger usuários contra exposição inadvertida de dados

## ✨ Funcionalidades

- 🔍 Análise automática de campos de formulário
- 📝 Detecção de dados sensíveis no conteúdo da página
- 📊 Pontuação de risco de privacidade
- 📄 Exportação de relatórios em PDF e JSON
- 🚨 Identificação de diversos tipos de dados sensíveis:
  - Emails
  - CPF/CNPJ
  - Telefones
  - Cartões de crédito
  - Senhas
  - Endereços

## 🚀 Como Usar

1. Clone este repositório ou baixe os arquivos
2. Abra o Chrome e acesse `chrome://extensions/`
3. Ative o "Modo do desenvolvedor" (canto superior direito)
4. Clique em "Carregar sem compactação"
5. Selecione a pasta do projeto

Após a instalação:
1. Navegue até a página que deseja analisar
2. Clique no ícone da extensão na barra de ferramentas
3. Clique em "Auditar Perfil"
4. Visualize os resultados e exporte se necessário

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Chrome Extension API
- jsPDF (para geração de PDF)

## 👥 Contribuidores

- [Bruna Ferreira]
- [Jheniffer Ribeiro]
- [Leticia Mirella]
- [Maria Edwirgens]

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Adicione suas mudanças (`git add .`)
4. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Push para a Branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

## 🐛 Encontrou um bug?

Caso encontre algum problema, por favor abra uma Issue:

1. Descreva claramente o problema
2. Inclua os passos para reproduzir
3. Inclua screenshots se possível
4. Descreva o comportamento esperado

## 📸 Screenshots

[Aqui você pode adicionar screenshots da sua extensão em funcionamento]

## 🙏 Agradecimentos

Agradecimentos especiais a todos que contribuíram para este projeto!

---

## 🚀 Como funciona

1. O usuário acessa uma página (ex: um perfil no Facebook ou Instagram).
2. Abre a extensão e clica no botão **"Auditar Perfil"**.
3. A extensão varre todo o conteúdo visível da página.
4. É gerado um relatório com:
   - Pontuação de privacidade (0–100)
   - Nível de risco (baixo, médio ou alto)
   - Lista de dados encontrados
5. O relatório pode ser exportado em **PDF ou JSON**.

---

## 🛠️ Tecnologias utilizadas

- **HTML, CSS e JavaScript**
- **Chrome Extensions API (Manifest V3)**
- **jsPDF** – para geração de arquivos PDF
- **Font Awesome (via CDN)** – para ícones visuais

---

## ⚙️ Instalação para desenvolvedores

1. Clone este repositório:
   ```bash
   git clone https://gitlab.com/seu-usuario/auditor-de-privacidade.git

