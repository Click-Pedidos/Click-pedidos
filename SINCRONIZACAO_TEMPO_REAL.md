# 🔄 Sincronização em Tempo Real

## Como Funciona

O sistema usa o **Storage Event** do navegador para sincronizar dados entre diferentes abas/janelas em tempo real, **sem necessidade de servidor ou banco de dados**.

## 📡 Tecnologia Utilizada

### LocalStorage + Storage Events

```javascript
// Quando uma aba modifica o localStorage
localStorage.setItem('pedidosFinalizados', JSON.stringify(pedidos));

// Outras abas detectam automaticamente a mudança
window.addEventListener('storage', function(e) {
  if (e.key === 'pedidosFinalizados') {
    // Recarregar dados atualizados
    carregarPedidos();
  }
});
```

## 🔄 Fluxo de Sincronização

### 1. Cliente faz pedido (Tela de Produtos)
```
Cliente adiciona ao carrinho
    ↓
Finaliza pedido
    ↓
Confirma pagamento PIX
    ↓
localStorage.setItem('pedidosFinalizados', ...) ← SALVA
    ↓
Storage Event disparado automaticamente
    ↓
Tela de Atendimento detecta mudança
    ↓
Novo pedido aparece (status: pendente)
```

### 2. Atendente processa pedido (Tela de Atendimento)
```
Atendente clica "Iniciar Preparo"
    ↓
Status muda para "preparando"
    ↓
localStorage.setItem('pedidosFinalizados', ...) ← ATUALIZA
    ↓
Storage Event disparado automaticamente
    ↓
Tela de Produtos detecta mudança
    ↓
Status atualizado em "Meus Pedidos"
```

### 3. Pedido pronto
```
Atendente clica "Marcar como Pronto"
    ↓
Status muda para "pronto"
    ↓
localStorage atualizado
    ↓
Cliente vê status "✅ Pronto" em tempo real
```

### 4. Pedido entregue
```
Atendente clica "Finalizar Pedido"
    ↓
Status muda para "finalizado"
    ↓
localStorage atualizado
    ↓
Cliente vê status "✓ Entregue"
```

## 🎯 Estados do Pedido

| Status | Emoji | Descrição | Quem Muda |
|--------|-------|-----------|-----------|
| **pendente** | ⏳ | Recém criado, aguardando preparo | Sistema (automático) |
| **preparando** | 👨‍🍳 | Sendo preparado pela cozinha | Atendente |
| **pronto** | ✅ | Pronto para retirada | Atendente |
| **finalizado** | ✓ | Entregue ao cliente | Atendente |

## 💻 Implementação

### Tela de Produtos (Cliente)

```javascript
// Ao confirmar pagamento
const pedido = {
  numero: 'PED-123456',
  data: new Date().toISOString(),
  itens: [...carrinho],
  total: 51.80,
  statusAtendimento: 'pendente',  // Status inicial
  clienteNotificado: false
};

pedidosFinalizados.push(pedido);
localStorage.setItem('pedidosFinalizados', JSON.stringify(pedidosFinalizados));

// Escutar mudanças do atendimento
window.addEventListener('storage', function(e) {
  if (e.key === 'pedidosFinalizados') {
    carregarPedidosFinalizados();      // Recarrega dados
    renderizarPedidosAnteriores();     // Atualiza interface
  }
});
```

### Tela de Atendimento (Staff)

```javascript
// Ao mudar status do pedido
function atualizarStatusPedido(numeroPedido, novoStatus) {
  const pedido = pedidos.find(p => p.numero === numeroPedido);
  pedido.statusAtendimento = novoStatus;
  
  localStorage.setItem('pedidosFinalizados', JSON.stringify(pedidos));
  renderizarPedidos();
}

// Escutar novos pedidos do cliente
window.addEventListener('storage', function(e) {
  if (e.key === 'pedidosFinalizados') {
    carregarPedidos();                 // Recarrega dados
    mostrarNotificacao('📦 Novo pedido recebido!');
  }
});
```

## 🌟 Vantagens

✅ **Tempo Real** - Atualização instantânea entre telas  
✅ **Sem Servidor** - Funciona totalmente offline  
✅ **Sem Banco de Dados** - Usa apenas localStorage  
✅ **Zero Configuração** - Funciona nativamente no navegador  
✅ **Leve** - Sem bibliotecas externas  
✅ **Confiável** - API nativa do navegador

## ⚠️ Limitações

🔸 **Mesma Máquina** - Funciona apenas entre abas do mesmo navegador  
🔸 **Mesmo Domínio** - Precisa ser o mesmo domínio/origem  
🔸 **Armazenamento Limitado** - localStorage tem limite de ~5-10MB  
🔸 **Sem Persistência** - Dados podem ser limpos pelo usuário

## 🧪 Como Testar

### Teste 1: Cliente → Atendimento
1. Abra a tela de produtos em uma aba
2. Abra a tela de atendimento em outra aba
3. Faça um pedido na tela de produtos
4. ✅ Pedido aparece automaticamente no atendimento

### Teste 2: Atendimento → Cliente
1. Com as duas telas abertas
2. No atendimento, clique "Iniciar Preparo" em um pedido
3. ✅ Status muda para "👨‍🍳 Preparando" na tela do cliente

### Teste 3: Fluxo Completo
1. Cliente faz pedido → Status: ⏳ Pendente
2. Atendente inicia preparo → Status: 👨‍🍳 Preparando
3. Atendente marca pronto → Status: ✅ Pronto
4. Cliente vê que está pronto
5. Atendente finaliza → Status: ✓ Entregue

## 🔧 Troubleshooting

### Pedidos não aparecem?
- Verifique se ambas as telas estão no mesmo domínio
- Abra o Console (F12) e veja se há erros
- Limpe o localStorage: `localStorage.clear()`

### Status não atualiza?
- Recarregue ambas as páginas
- Verifique se o listener de 'storage' está ativo
- Confira se o localStorage está habilitado

### Como limpar todos os pedidos?
```javascript
// No Console do navegador (F12)
localStorage.removeItem('pedidosFinalizados');
// Depois recarregue a página
```

## 📊 Estrutura de Dados

```json
{
  "numero": "PED-123456",
  "data": "2024-12-12T14:30:00.000Z",
  "itens": [
    {
      "nome": "Burger Clássico",
      "preco": 25.90,
      "quantidade": 2,
      "categoria": "comidas"
    }
  ],
  "total": 51.80,
  "statusAtendimento": "preparando",
  "clienteNotificado": false
}
```

## 🚀 Próximos Passos (Com Servidor)

Quando adicionar backend, pode migrar para:
- **WebSockets** - Sincronização em tempo real entre diferentes máquinas
- **Server-Sent Events (SSE)** - Push de atualizações do servidor
- **Banco de Dados** - PostgreSQL, MongoDB, etc.
- **API REST** - Centralizar dados no servidor

Mas por enquanto, o localStorage + Storage Events funciona perfeitamente para desenvolvimento local! 🎉
