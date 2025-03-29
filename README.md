# MU Manager

MU Manager é uma aplicação web para gerenciar personagens do jogo MU Online, focada no acompanhamento de estatísticas de farm. Desenvolvido para jogadores que desejam monitorar seu progresso de forma organizada e acessível.

![Preview](https://mumanager.netlify.app/preview.jpg)  
**Link de produção:** [https://mumanager.netlify.app/](https://mumanager.netlify.app/)

## Funcionalidades Principais

- **Cadastro de Personagens:** Armazene múltiplos personagens com:
  - Nome
  - Quantidade de Resets
  - Soul (SS)
  - Master Reset (MR)
  - Pontos de Evento
  - Pontos PC
  - Gold
- **Estatísticas Consolidadas:** Visualize dados individuais ou totais de todos personagens
- **Histórico Completo:** Registro temporal de todas as alterações
- **Personalização:**
  - Tema escuro padrão
  - 3 opções de fontes
  - Design responsivo
- **Gestão de Dados:**
  - Exportação/importação em JSON
  - Armazenamento local via LocalStorage
  - Histórico reversível

## Tecnologias Utilizadas

- **Frontend:** Vite + TypeScript
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide
- **Persistência:** LocalStorage

## Instalação Local

```bash
# Clonar repositório
git clone [URL_DO_REPOSITORIO]

# Instalar dependências
npm install

# Executar ambiente de desenvolvimento
npm run dev

# Build para produção
npm run build
```
