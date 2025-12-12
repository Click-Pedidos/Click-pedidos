# Click Pedidos

**Click Pedidos** é uma solução completa voltada para pequenas empresas que desejam facilitar o atendimento aos clientes, gerenciar produtos e controlar pedidos em tempo real.

## 🚀 Como Executar o Projeto

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Click-Pedidos/Click-pedidos.git
cd Click-pedidos
```

2. Instale as dependências:
```bash
npm install
```

### Executando o Projeto

**Opção 1: Página inicial (escolha entre Cliente ou Atendente)**
```bash
npm run dev
```

**Opção 2: Abrir direto a tela de produtos (clientes)**
```bash
npm run dev:produtos
```

**Opção 3: Abrir direto a tela de atendimento**
```bash
npm run dev:atendimento
```

O projeto abrirá automaticamente no navegador em `http://localhost:8080`

## 📋 Funcionalidades

### Para Clientes (Tela de Produtos)
✅ Visualizar cardápio completo com fotos  
✅ Adicionar produtos ao carrinho  
✅ Acompanhar pedidos em tempo real  
✅ Ver status de preparo (pendente, preparando, pronto)  
✅ Finalizar pedido com pagamento PIX  
✅ Design totalmente responsivo  

### Para Atendentes (Tela de Atendimento)

**Aba Pedidos:**
✅ Visualizar todos os pedidos em tempo real  
✅ Filtrar por status (Pendentes, Preparando, Prontos, Finalizados)  
✅ Atualizar status dos pedidos  
✅ Notificações de novos pedidos  

**Aba Produtos:**
✅ Gerenciar cardápio completo (CRUD)  
✅ Adicionar novos produtos com imagem  
✅ Editar produtos existentes  
✅ Deletar produtos permanentemente  
✅ Controle de estoque com alertas  
✅ Busca e filtros por categoria  
✅ Sincronização automática com tela de clientes  

**Aba Estoque:**
🔄 Em desenvolvimento

## 🔄 Sincronização em Tempo Real

O sistema utiliza **localStorage** e **Storage Events** para sincronização automática entre as telas:

- Atendente adiciona produto → Aparece para clientes instantaneamente
- Atendente atualiza pedido → Cliente vê mudança em tempo real
- Atendente deleta produto → Remove da tela de clientes automaticamente
- Funciona entre múltiplas abas e janelas abertas

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+ (Vanilla)
- Font Awesome 6.0.0
- LocalStorage API
- Storage Events API
- FileReader API (upload de imagens)
- Live Server (desenvolvimento)

## 📱 Responsividade

✅ Desktop (1920px+)  
✅ Laptop (1366px)  
✅ Tablet (768px)  
✅ Mobile (480px, 360px)  

## 📁 Estrutura do Projeto

```
Click-pedidos/
├── frontend/
│   └── src/
│       ├── index.html (Página inicial)
│       ├── Tela_Produtos/
│       │   ├── index_produto.html
│       │   ├── styles_produtos.css
│       │   └── scripts/
│       │       └── scriptsTelaProdutos.js
│       └── tela_atendente/
│           ├── atendimento.html
│           ├── style.css
│           └── atendimento.js
├── package.json
└── README.md
```

## 🎯 Produtos Padrão Incluídos

O sistema já vem com 6 produtos pré-configurados:

**Comidas:**
- Burger Clássico (R$ 25,90)
- Pizza Margherita (R$ 35,90)
- Sanduíche Natural (R$ 18,90)

**Bebidas:**
- Refrigerante (R$ 5,90)
- Suco Natural (R$ 8,90)
- Água Mineral (R$ 3,50)

Todos os produtos podem ser editados ou removidos pelo atendente.

## 💾 Persistência de Dados

Todos os dados são salvos localmente no navegador:
- **produtosCardapio**: Lista completa de produtos
- **produtosDeletados**: IDs de produtos removidos permanentemente
- **pedidosFinalizados**: Histórico de pedidos

## 🔐 Controle de Acesso

- **Tela de Produtos**: Acesso público para clientes
- **Tela de Atendimento**: Acesso direto via URL

## 📝 Scripts Disponíveis

```bash
npm run dev              # Inicia servidor na página inicial
npm run dev:produtos     # Inicia direto na tela de produtos
npm run dev:atendimento  # Inicia direto na tela de atendimento
npm run lint             # Verifica código JavaScript
npm run lint:css         # Verifica código CSS
```

## 🐛 Troubleshooting

**Produtos não aparecem?**
- Limpe o localStorage: `localStorage.clear()` no console do navegador
- Atualize a página (F5)

**Sincronização não funciona?**
- Verifique se as abas estão no mesmo domínio/porta
- Storage Events funcionam apenas entre abas diferentes

**Imagem não carrega?**
- Verifique se o tamanho é menor que 5MB
- Formatos aceitos: JPG, PNG, HEIC

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

ISC

## ✨ Melhorias Implementadas

- ✅ Sistema completo de gerenciamento de produtos
- ✅ Upload de imagens com preview
- ✅ Sincronização bidirecional em tempo real
- ✅ Persistência permanente de dados
- ✅ Interface moderna e responsiva
- ✅ Controle de estoque com alertas
- ✅ Filtros e busca dinâmica
- ✅ Notificações de feedback
- ✅ Validação completa de formulários
