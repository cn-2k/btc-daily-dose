

# ₿ BTC Daily Dose

> Uma aplicação para análise automatizada de Bitcoin usando IA e web scraping

<div align="center">

![Nuxt 3](https://img.shields.io/badge/Nuxt-3.17.4-00DC82?style=for-the-badge&logo=nuxt.js)
![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT-412991?style=for-the-badge&logo=openai)
![Puppeteer](https://img.shields.io/badge/Puppeteer-Web%20Scraping-40E0D0?style=for-the-badge)

</div>

https://github.com/user-attachments/assets/0b62228a-810e-4148-86a5-91ff5ad86b52

## ✨ Sobre o Projeto

O **BTC Daily Dose** é uma aplicação web que fornece análises detalhadas do mercado de Bitcoin em tempo real. Utilizando web scraping inteligente e processamento de imagens com IA, a aplicação captura dados visuais de plataformas como TradingView e CoinGlass para gerar insights valiosos sobre movimentações de preço, suportes, resistências e mapas de liquidação.

## 🎯 Funcionalidades Principais

### 📊 **Análise Automatizada**
- **TradingView**: Captura e análise de gráficos do Bitcoin (limitado ao gráfico diário atualmente)
- **CoinGlass Liquidation Maps**: Monitoramento do mapa de liquidações do Bitcoin
- **Análise Combinada**: Insights unificados obtidos através da análise do gráfico do Bitcoin e do seu mapa de liquidação

### 🤖 **Inteligência Artificial**
- Processamento de imagens com OpenAI
- Análise de price action e padrões técnicos
- Identificação automática de suportes e resistências
- Insights baseados em prompts customizados

### 💬 **Chat Inteligente**
- Chat contextual pós-análise utilizando OpenAI
- Pesquisa na internet integrada
- Respostas baseadas na análise atual

### 🔄 **Tempo Real**
- Server-Sent Events (SSE) para updates em tempo real
- Feedback visual das operações em andamento (saiba o que está acontecendo enquanto espera xD)

## 🛠️ Stack Utilizada

<table>
<tr>
<td align="center"><strong>Frontend</strong></td>
<td align="center"><strong>Backend</strong></td>
<td align="center"><strong>Scraping</strong></td>
<td align="center"><strong>IA</strong></td>
</tr>
<tr>
<td>

- **Nuxt 3** - Vuejs Framework
- **Nuxt UI** - Conjunto de componentes UI
- **TailwindCSS** - Styling utilitário
- **VueUse** - Composables essenciais

</td>
<td>

- **Server API Routes** - Endpoints REST (Nitro/unjs/h3)
- **Server-Sent Events** - Comunicação real-time
- **TypeScript** - Tipagem estática
- **ESLint** - Qualidade de código

</td>
<td>

- **Puppeteer** - Automação web
- **Chromium** - Engine de renderização
- **Base64 Encoding** - Processamento de imagens

</td>
<td>

- **OpenAI GPT** - Análise de imagens e chat
- **Markdown Rendering** - Formatação e visualização de respostas

</td>
</tr>
</table>

## 🚀 Como Começar

### 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Chave da API OpenAI**

### 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/cn-2k/btc-daily-dose.git
cd btc-daily-dose
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
# Crie um arquivo .env na raiz do projeto
```bash
touch .env
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```
