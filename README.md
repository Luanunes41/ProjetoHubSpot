# ProjetoHubSpot

Este é um projeto de integração e extensão da plataforma HubSpot, com o objetivo de automatizar processos, personalizar funcionalidades e explorar o uso de UI Extensions e Webhooks.

## 🚀 Funcionalidades

- 📦 UI Extensions com React (ex: `calcados.jsx`)
- ⚙️ Funções Serverless para lógica personalizada (`calcados-function.js`)
- 🔄 Webhooks para eventos automatizados do HubSpot
- 📁 Estrutura organizada em pastas para escalabilidade e manutenibilidade

## 🛠️ Tecnologias Utilizadas

- JavaScript (Node.js)
- React
- JSON (configuração de UI Extensions e Serverless)
- HubSpot CLI
- Git e GitHub

## 📂 Estrutura do Projeto

ProjetoHub/
├── LICENSE.md
├── README.md
├── hsproject.json
├── src/
│ └── app/
│ ├── app.functions/
│ │ ├── calcados-function.js
│ │ ├── package.json
│ │ └── serverless.json
│ ├── extensions/
│ │ ├── calcados.jsx
│ │ ├── example-card.json
│ │ └── package.json
│ ├── webhooks/
│ │ └── webhooks.json
│ └── app.json
