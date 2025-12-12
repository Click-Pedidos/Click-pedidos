# Sistema de Atendimento - Click Pedidos

## 📋 Visão Geral

Sistema integrado de pedidos que conecta a tela de produtos (cliente) com a tela de atendimento (staff).

## 🔄 Fluxo de Integração

### 1. Cliente faz o pedido (Tela de Produtos)
- Cliente adiciona produtos ao carrinho
- Finaliza o pedido
- Realiza pagamento via PIX
- Pedido é salvo no localStorage com status `pendente`

### 2. Pedido aparece no Atendimento
- Sistema carrega automaticamente os pedidos do localStorage
- Atualiza a cada 5 segundos
- Mostra todos os pedidos em tempo real

### 3. Estados do Pedido

| Status | Cor | Descrição |
|--------|-----|-----------|
| Pendente | Laranja | Pedido recebido, aguardando início |
| Preparando | Azul | Pedido em preparo |
| Pronto | Verde | Pedido pronto para retirada |
| Finalizado | Cinza | Pedido entregue ao cliente |

## 🎯 Funcionalidades

### Tela de Produtos
- ✅ Adicionar produtos ao carrinho
- ✅ Visualizar carrinho
- ✅ Finalizar pedido
- ✅ Pagamento PIX
- ✅ Histórico de pedidos
- ✅ Botão de acesso ao atendimento

### Tela de Atendimento
- ✅ Visualizar todos os pedidos
- ✅ Filtrar por status
- ✅ Atualização automática (5s)
- ✅ Mudar status do pedido
- ✅ Notificar cliente
- ✅ Voltar para tela inicial

## 💾 Estrutura de Dados

### Objeto Pedido
```javascript
{
  numero: "PED-123456",          // ID único do pedido
  data: "2024-01-15T10:30:00",   // Data/hora do pedido
  itens: [                        // Array de produtos
    {
      nome: "Burger Clássico",
      preco: 25.90,
      quantidade: 2,
      categoria: "comidas"
    }
  ],
  total: 51.80,                   // Valor total
  statusAtendimento: "pendente",  // Status atual
  clienteNotificado: false        // Cliente foi avisado?
}
```

### LocalStorage
- **Chave**: `pedidosFinalizados`
- **Formato**: Array de objetos JSON
- **Compartilhado**: Entre tela de produtos e atendimento

## 🎨 Botões e Ações

### Status Pendente
- **Botão**: "Iniciar Preparo" (Laranja)
- **Ação**: Muda status para `preparando`

### Status Preparando
- **Botão**: "Marcar como Pronto" (Laranja)
- **Ação**: Muda status para `pronto`

### Status Pronto
- **Botões**: 
  - "Finalizar Pedido" (Verde) → status `finalizado`
  - "Avisar Cliente" (Verde) → Notificação ao staff

### Status Finalizado
- **Display**: "✓ Pedido Entregue" (Verde)
- **Ação**: Nenhuma (estado final)

## 📱 Responsividade

### Desktop (> 768px)
- Painel centralizado (700px)
- Filtros em linha horizontal
- Botões lado a lado

### Mobile (≤ 768px)
- Painel responsivo (95%)
- Filtros em grid flexível
- Botões em coluna

## 🔔 Notificações

O sistema exibe notificações para:
- ✅ Mudança de status
- ✅ Cliente notificado
- ⏱️ Aparecem por 3 segundos
- 📍 Canto superior direito

## 🚀 Como Usar

### Para o Cliente:
1. Acesse a tela de produtos
2. Adicione itens ao carrinho
3. Clique em "Carrinho"
4. Finalize o pedido
5. Copie o código PIX
6. Confirme o pagamento
7. Veja o pedido em "Meus Pedidos"

### Para o Atendente:
1. Acesse a tela de atendimento
2. Visualize os pedidos pendentes
3. Clique em "Iniciar Preparo"
4. Prepare o pedido
5. Clique em "Marcar como Pronto"
6. Clique em "Avisar Cliente" (opcional)
7. Clique em "Finalizar Pedido" quando entregar

## 🔗 Navegação

- **Produtos → Atendimento**: Botão "Atendimento" (Roxo)
- **Atendimento → Produtos**: Botão "← Voltar"

## ⚙️ Configurações

### Atualização Automática
```javascript
setInterval(carregarPedidos, 5000); // Atualiza a cada 5 segundos
```

### Filtros Disponíveis
- Todos
- Pendentes
- Preparando
- Prontos
- Finalizados

## 📊 Contadores

Os botões de filtro mostram a quantidade de pedidos em cada status:
- `Todos (5)` - Total de pedidos
- `Pendentes (2)` - Aguardando início
- `Preparando (1)` - Em preparo
- `Prontos (2)` - Prontos para retirada
- `Finalizados (0)` - Já entregues

## 🎨 Cores do Sistema

| Elemento | Cor | Código |
|----------|-----|--------|
| Pendente | Laranja | #f59e0b |
| Preparando | Azul | #3b82f6 |
| Pronto | Verde | #10b981 |
| Finalizado | Cinza | #6b7280 |
| Atendimento | Roxo | #6366f1 |

## 📁 Arquivos

### Tela de Atendimento
- `atendimento.html` - Estrutura HTML
- `atendimento.js` - Lógica do sistema
- `style.css` - Estilos

### Tela de Produtos
- `index_produto.html` - Estrutura HTML
- `scriptsTelaProdutos.js` - Lógica de pedidos
- `styles_produtos.css` - Estilos

## 🔧 Manutenção

### Limpar Pedidos Antigos
Para limpar todos os pedidos do localStorage:
```javascript
localStorage.removeItem('pedidosFinalizados');
```

### Resetar Sistema
1. Abra o Console do navegador (F12)
2. Execute: `localStorage.clear()`
3. Recarregue a página

## 📞 Suporte

Para problemas ou dúvidas sobre o sistema de atendimento, verifique:
1. LocalStorage está habilitado no navegador
2. JavaScript está ativado
3. Conexão com os arquivos está correta
4. Console do navegador para erros
