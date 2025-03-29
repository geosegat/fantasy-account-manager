# MU Manager

MU Manager é uma aplicação web para gerenciar personagens do jogo MU Online, focada no acompanhamento de estatísticas de farm. Desenvolvido para jogadores que desejam monitorar seu progresso de forma organizada e acessível.

**Você pode utilizar acessando:** [https://mumanager.netlify.app/](https://mumanager.netlify.app/)

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
- **Histórico Completo:**
  - Registro temporal de todas as alterações
  - Opções para filtrar os dados, por nome, quantidade de resetes, data etc...
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

## Prints das Telas

### Dashboard

![Dashboard para cadastrar/editar e visualizar alguns dados](https://i.imgur.com/HzsJx9w.png)

### Histórico

![Tela de histórico com opções de filtrar a partir de qualquer dado](https://i.imgur.com/L7hK8tw.png)

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
