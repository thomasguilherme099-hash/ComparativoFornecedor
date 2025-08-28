# Guia de Deploy para Netlify

## Visão Geral

Este projeto foi configurado para funcionar como uma aplicação estática que pode ser deployada na Netlify, usando JSONBin como backend para armazenamento de dados.

## Pré-requisitos

1. **Conta no GitHub** - Para armazenar o código
2. **Conta no Netlify** - Para fazer o deploy
3. **Conta no JSONBin** - Para armazenamento de dados

## Configuração do JSONBin

1. Acesse [jsonbin.io](https://jsonbin.io)
2. Crie uma conta gratuita
3. Gere uma API Key nas configurações
4. Crie um novo Bin para armazenar os dados
5. Copie o ID do Bin

## Deploy na Netlify

### 1. Preparação do Repositório

1. Faça push de todo o código para um repositório no GitHub
2. Certifique-se de que o arquivo `netlify.toml` está na raiz do projeto

### 2. Configuração na Netlify

1. Acesse [netlify.com](https://netlify.com) e faça login
2. Clique em "New site from Git"
3. Conecte com o GitHub e selecione o repositório
4. Configure as opções de build:
   - **Build command**: `npm run build:static`
   - **Publish directory**: `dist`
   - **Base directory**: deixe vazio

### 3. Variáveis de Ambiente

Na seção "Environment variables" da Netlify, configure:

```
VITE_STATIC_MODE=true
NODE_ENV=production
```

### 4. Deploy

1. Clique em "Deploy site"
2. Aguarde o build completar
3. Acesse o site usando a URL fornecida pela Netlify

## Configuração do JSONBin na Aplicação

1. Acesse a página de "Configurações" no site deployado
2. Vá para a aba "JSONBin"
3. Insira sua API Key e Bin ID
4. Clique em "Salvar Configuração"
5. Teste a conexão
6. Use "Salvar na Nuvem" para fazer backup dos dados padrão

## Estrutura da Aplicação Estática

A aplicação funciona da seguinte forma:

- **Frontend Only**: Não há servidor backend, apenas arquivos estáticos
- **Armazenamento**: Usa JSONBin como base de dados na nuvem
- **Dados Locais**: Mantém dados em memória durante a sessão
- **Sincronização**: Permite backup e restore via JSONBin

## Comandos Disponíveis

```bash
# Desenvolvimento (com servidor Express)
npm run dev

# Build para produção estática
npm run build:static

# Build tradicional (com servidor)
npm run build
```

## Funcionalidades

- ✅ Dashboard com KPIs e gráficos
- ✅ Gerenciamento de produtos
- ✅ Gerenciamento de concorrentes  
- ✅ Comparação de preços
- ✅ Relatórios de competitividade
- ✅ Backup e sincronização com JSONBin
- ✅ Interface responsiva
- ✅ Modo escuro/claro

## Limitações do Modo Estático

- Dados são perdidos ao recarregar a página (exceto configuração JSONBin)
- Sincronização manual via JSONBin
- Sem autenticação de usuário
- Sem notificações push

## Solução de Problemas

### Build falha na Netlify
- Verifique se o comando de build está correto
- Confirme que todas as dependências estão no package.json

### Dados não salvam
- Verifique a configuração do JSONBin
- Confirme que a API Key tem permissões necessárias
- Use "Salvar na Nuvem" periodicamente

### Site não carrega
- Verifique se o publish directory está correto
- Confirme que os redirects estão configurados no netlify.toml