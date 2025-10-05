# Atualizar Dockerfile para servir o frontend com live-server

Descrição

Este issue documenta as alterações realizadas no `Dockerfile` do projeto Click-pedidos para permitir a execução do frontend usando `live-server` dentro de um container Docker.

Alterações principais

- Atualizado `Dockerfile` para usar `node:20-alpine` como imagem base.
- Trabalha no diretório `/app`.
- Copia `package.json` (e `package-lock.json` se presente) e executa `npm install` para instalar dependências. Observação: `live-server` está listado em `devDependencies`, por isso o `npm install` instala devDeps também.
- Copia todo o conteúdo do projeto para o container.
- Expõe a porta `8080` (port padrão do `live-server`).
- Define o comando de entrada para iniciar o servidor com: `npx live-server frontend/src/ --host=0.0.0.0 --port=8080 --quiet` para aceitar conexões externas e reduzir saída de logs.

Arquivos adicionados/alterados

- `Dockerfile` (modificado)
  - Inicia `live-server` na pasta `frontend/src/` e expõe 8080.
- `.dockerignore` (adicionado)
  - Ignora `node_modules`, logs, arquivos de IDE, e pastas de build.
- `.github/ISSUE_DOCKERFILE.md` (este arquivo) — documentação da issue.

Comandos recomendados

- Construir imagem Docker:

```bash
docker build -t click-pedidos:latest .
```

- Executar container (mapeando porta 8080):

```bash
docker run -d --name click-pedidos -p 8080:8080 click-pedidos:latest
```

- Verificar logs:

```bash
docker logs -f click-pedidos
```

Verificações e troubleshooting

- Se você não tem Docker instalado, instale-o no seu sistema antes de tentar.
- Se o build falhar por dependências, tente rodar `npm install` localmente para ver mensagens mais detalhadas.
- Se o site não responder no host, confirme que o container está ativo com `docker ps` e que a porta 8080 está mapeada.

Próximos passos sugeridos

- (Opcional) Converter o `Dockerfile` para multi-stage build para reduzir o tamanho da imagem.
- (Opcional) Mover `live-server` para `dependencies` se for necessário rodar em produção com Docker sem instalar devDependencies.
- (Opcional) Adicionar um `Dockerfile.prod` com servidor estático (por exemplo `nginx`) servindo os arquivos estáticos gerados por um processo de build.

Status

- Alterações realizadas e testadas localmente até a etapa de build (comandos fornecidos). Execução do container precisa ser feita no host do usuário ou CI que tenha Docker disponível.
