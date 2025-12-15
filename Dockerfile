# Dockerfile para executar o projeto Click-pedidos
# Imagem base Node.js para ambiente de desenvolvimento
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock (se existir) e instala dependências
COPY package.json package-lock.json* ./

# Instala dependências (inclui devDependencies porque o live-server está em devDependencies)
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copia o restante do código
COPY . .

# Porta usada pelo live-server (padrão 8080)
EXPOSE 8080

# Inicia o live-server apontando para a pasta de frontend e aceitando conexões externas
CMD ["npx", "live-server", "frontend/src/", "--host=0.0.0.0", "--port=8080", "--quiet"]
