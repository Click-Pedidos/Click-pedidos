// Carrinho de compras
let carrinho = [];
let pedidosFinalizados = [];

// Elementos DOM
const modal = document.getElementById('modalCarrinho');
const btnAbrirCarrinho = document.getElementById('abrirCarrinho');
const btnFecharModal = document.getElementById('fecharModal');
const badgeCarrinho = document.getElementById('badgeCarrinho');
const itensCarrinhoDiv = document.getElementById('itensCarrinho');
const carrinhoVazioDiv = document.getElementById('carrinhoVazio');
const totalCarrinhoSpan = document.getElementById('totalCarrinho');
const btnFinalizarPedido = document.getElementById('finalizarPedido');

// Elementos do modal de pedidos
const modalPedidos = document.getElementById('modalPedidos');
const btnAbrirPedidos = document.getElementById('abrirPedidos');
const btnFecharModalPedidos = document.getElementById('fecharModalPedidos');
const listaPedidosDiv = document.getElementById('listaPedidos');
const pedidosVazioDiv = document.getElementById('pedidosVazio');

// Elementos do modal de pagamento
const modalPagamento = document.getElementById('modalPagamento');
const btnFecharModalPagamento = document.getElementById('fecharModalPagamento');
const valorPagamentoSpan = document.getElementById('valorPagamento');
const nomeClientePagamentoSpan = document.getElementById('nomeClientePagamento');
const numeroPedidoSpan = document.getElementById('numeroPedido');
const btnCopiarPix = document.getElementById('copiarPix');
const btnConfirmarPagamento = document.getElementById('confirmarPagamento');
const btnCancelarPagamento = document.getElementById('cancelarPagamento');

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
  // Configurar as abas
  configurarAbas();
  
  // Configurar os botões de adicionar ao carrinho
  configurarBotoesAdicionar();
  
  // Configurar modal
  configurarModal();
  
  // Configurar modal de pedidos
  configurarModalPedidos();
  
  // Configurar modal de pagamento
  configurarModalPagamento();
  
  // Carregar carrinho do localStorage
  carregarCarrinho();
  
  // Carregar pedidos finalizados
  carregarPedidosFinalizados();
  
  // Escutar mudanças do localStorage em outras abas/janelas (atendimento)
  window.addEventListener('storage', function(e) {
    if (e.key === 'pedidosFinalizados') {
      carregarPedidosFinalizados();
      renderizarPedidosAnteriores();
    }
  });
});

// Configurar navegação entre abas
function configurarAbas() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const produtosSections = document.querySelectorAll(".produtos");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tab = this.dataset.tab;

      // Remover classe active de todos os botões
      tabBtns.forEach((btn) => btn.classList.remove("active"));

      // Remover classe active de todas as seções
      produtosSections.forEach((section) =>
        section.classList.remove("active")
      );

      // Adicionar classe active ao botão clicado
      this.classList.add("active");

      // Adicionar classe active à seção correspondente
      document.querySelector(`.produtos.${tab}`).classList.add("active");
    });
  });
}

// Configurar botões de adicionar ao carrinho
function configurarBotoesAdicionar() {
  const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
  
  botoesAdicionar.forEach(btn => {
    btn.addEventListener('click', function() {
      const cardProduto = this.closest('.card-produto');
      const produtoAcoes = this.closest('.produto-acoes');
      const areaSelecao = produtoAcoes.querySelector('.area-selecao');
      const preco = parseFloat(cardProduto.dataset.preco);
      
      // Esconder botão "Adicionar ao carrinho"
      this.style.display = 'none';
      
      // Mostrar área de seleção
      areaSelecao.style.display = 'block';
      
      // Resetar quantidade para 1
      const quantidadeSpan = areaSelecao.querySelector('.qtd-card');
      quantidadeSpan.textContent = '1';
      
      // Atualizar valor no botão
      const valorSpan = areaSelecao.querySelector('.valor-add');
      valorSpan.textContent = `R$ ${preco.toFixed(2)}`;
    });
  });
  
  // Configurar botões de diminuir quantidade no card
  const botoesDiminuir = document.querySelectorAll('.btn-dim-card');
  botoesDiminuir.forEach(btn => {
    btn.addEventListener('click', function() {
      const areaSelecao = this.closest('.area-selecao');
      const quantidadeSpan = areaSelecao.querySelector('.qtd-card');
      const valorSpan = areaSelecao.querySelector('.valor-add');
      const cardProduto = this.closest('.card-produto');
      const preco = parseFloat(cardProduto.dataset.preco);
      const produtoAcoes = this.closest('.produto-acoes');
      const btnAdicionar = produtoAcoes.querySelector('.btn-adicionar');
      
      let quantidade = parseInt(quantidadeSpan.textContent);
      
      if (quantidade > 1) {
        quantidade--;
        quantidadeSpan.textContent = quantidade;
        const total = preco * quantidade;
        valorSpan.textContent = `R$ ${total.toFixed(2)}`;
      } else if (quantidade === 1) {
        // Voltar ao estado inicial quando chegar a 0
        areaSelecao.style.display = 'none';
        btnAdicionar.style.display = 'block';
        quantidadeSpan.textContent = '1';
      }
    });
  });
  
  // Configurar botões de aumentar quantidade no card
  const botoesAumentar = document.querySelectorAll('.btn-aum-card');
  botoesAumentar.forEach(btn => {
    btn.addEventListener('click', function() {
      const areaSelecao = this.closest('.area-selecao');
      const quantidadeSpan = areaSelecao.querySelector('.qtd-card');
      const valorSpan = areaSelecao.querySelector('.valor-add');
      const cardProduto = this.closest('.card-produto');
      const preco = parseFloat(cardProduto.dataset.preco);
      
      let quantidade = parseInt(quantidadeSpan.textContent);
      quantidade++;
      quantidadeSpan.textContent = quantidade;
      const total = preco * quantidade;
      valorSpan.textContent = `R$ ${total.toFixed(2)}`;
    });
  });
  
  // Configurar botão de adicionar com valor
  const botoesAdicionarValor = document.querySelectorAll('.btn-adicionar-valor');
  botoesAdicionarValor.forEach(btn => {
    btn.addEventListener('click', function() {
      const cardProduto = this.closest('.card-produto');
      const areaSelecao = this.closest('.area-selecao');
      const quantidadeSpan = areaSelecao.querySelector('.qtd-card');
      const quantidade = parseInt(quantidadeSpan.textContent);
      const produtoAcoes = this.closest('.produto-acoes');
      const btnAdicionar = produtoAcoes.querySelector('.btn-adicionar');
      
      const produto = {
        nome: cardProduto.dataset.nome,
        preco: parseFloat(cardProduto.dataset.preco),
        categoria: cardProduto.dataset.categoria
      };
      
      // Adicionar ao carrinho com a quantidade selecionada
      const itemExistente = carrinho.find(item => item.nome === produto.nome);
      
      if (itemExistente) {
        itemExistente.quantidade += quantidade;
      } else {
        carrinho.push({
          ...produto,
          quantidade: quantidade
        });
      }
      
      // Salvar e atualizar
      salvarCarrinho();
      atualizarBadgeCarrinho();
      
      // Esconder área de seleção e mostrar botão novamente
      areaSelecao.style.display = 'none';
      btnAdicionar.style.display = 'block';
      
      // Resetar quantidade
      quantidadeSpan.textContent = '1';
      
      // Mostrar feedback
      mostrarNotificacao(`${quantidade}x ${produto.nome} adicionado ao carrinho!`);
    });
  });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
  // Verificar se o produto já está no carrinho
  const itemExistente = carrinho.find(item => item.nome === produto.nome);
  
  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1
    });
  }
  
  // Salvar no localStorage
  salvarCarrinho();
  
  // Atualizar interface
  atualizarBadgeCarrinho();
  
  // Mostrar feedback visual
  mostrarNotificacao('Produto adicionado ao carrinho!');
}

// Remover produto do carrinho
function removerDoCarrinho(nomeProduto) {
  carrinho = carrinho.filter(item => item.nome !== nomeProduto);
  salvarCarrinho();
  renderizarCarrinho();
  atualizarBadgeCarrinho();
  mostrarNotificacao('Produto removido do carrinho');
}

// Atualizar quantidade
function atualizarQuantidade(nomeProduto, novaQuantidade) {
  const item = carrinho.find(item => item.nome === nomeProduto);
  
  if (item) {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(nomeProduto);
    } else {
      item.quantidade = novaQuantidade;
      salvarCarrinho();
      renderizarCarrinho();
      atualizarBadgeCarrinho();
    }
  }
}

// Renderizar itens do carrinho
function renderizarCarrinho() {
  if (carrinho.length === 0) {
    itensCarrinhoDiv.style.display = 'none';
    carrinhoVazioDiv.style.display = 'flex';
    document.getElementById('subtotalCarrinho').textContent = 'R$ 0,00';
    document.getElementById('totalCarrinho').textContent = 'R$ 0,00';
    return;
  }
  
  itensCarrinhoDiv.style.display = 'block';
  carrinhoVazioDiv.style.display = 'none';
  
  itensCarrinhoDiv.innerHTML = carrinho.map(item => {
    const subtotalItem = item.preco * item.quantidade;
    return `
    <div class="item-carrinho-resumo">
      <div class="item-linha">
        <div class="item-quantidade-nome">
          <span class="qtd-badge">${item.quantidade}x</span>
          <span class="item-nome">${item.nome}</span>
        </div>
        <div class="item-valor">R$ ${subtotalItem.toFixed(2)}</div>
      </div>
      <div class="item-acoes">
        <div class="quantidade-controle">
          <button class="btn-quantidade" onclick="atualizarQuantidade('${item.nome}', ${item.quantidade - 1})">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantidade">${item.quantidade}</span>
          <button class="btn-quantidade" onclick="atualizarQuantidade('${item.nome}', ${item.quantidade + 1})">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <button class="btn-remover" onclick="removerDoCarrinho('${item.nome}')" title="Remover item">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
      <div class="item-preco-unitario">
        <small>R$ ${item.preco.toFixed(2)} cada</small>
      </div>
    </div>
  `;
  }).join('');
  
  // Atualizar total
  atualizarTotal();
}

// Atualizar total do carrinho
function atualizarTotal() {
  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  document.getElementById('subtotalCarrinho').textContent = `R$ ${total.toFixed(2)}`;
  document.getElementById('totalCarrinho').textContent = `R$ ${total.toFixed(2)}`;
}

// Atualizar badge do carrinho
function atualizarBadgeCarrinho() {
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  badgeCarrinho.textContent = totalItens;
  
  if (totalItens > 0) {
    badgeCarrinho.style.display = 'inline-block';
  } else {
    badgeCarrinho.style.display = 'none';
  }
}

// Configurar modal
function configurarModal() {
  // Abrir modal
  btnAbrirCarrinho.addEventListener('click', function(e) {
    e.preventDefault();
    renderizarCarrinho();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
  
  // Fechar modal
  btnFecharModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  // Fechar modal ao clicar fora
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  // Finalizar pedido
  btnFinalizarPedido.addEventListener('click', finalizarPedido);
}

// Configurar modal de pedidos
function configurarModalPedidos() {
  // Abrir modal
  btnAbrirPedidos.addEventListener('click', function(e) {
    e.preventDefault();
    renderizarPedidosAnteriores();
    modalPedidos.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
  
  // Fechar modal
  btnFecharModalPedidos.addEventListener('click', function() {
    modalPedidos.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  // Fechar modal ao clicar fora
  modalPedidos.addEventListener('click', function(e) {
    if (e.target === modalPedidos) {
      modalPedidos.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

// Finalizar pedido
function finalizarPedido() {
  if (carrinho.length === 0) {
    mostrarNotificacao('Seu carrinho está vazio!', 'erro');
    return;
  }
  
  // Calcular total
  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  
  // Gerar número do pedido
  const numeroPedido = 'PED-' + Date.now().toString().slice(-6);
  
  // Preencher dados do modal de pagamento
  valorPagamentoSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  numeroPedidoSpan.textContent = numeroPedido;
  
  // Fechar modal do carrinho e abrir modal de pagamento
  modal.style.display = 'none';
  modalPagamento.style.display = 'flex';
}

// Configurar modal de pagamento
function configurarModalPagamento() {
  // Fechar modal de pagamento
  btnFecharModalPagamento.addEventListener('click', function() {
    modalPagamento.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  // Fechar modal ao clicar fora
  modalPagamento.addEventListener('click', function(e) {
    if (e.target === modalPagamento) {
      modalPagamento.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  // Copiar código PIX
  btnCopiarPix.addEventListener('click', function() {
    const codigoPix = document.getElementById('codigoPix').textContent;
    
    navigator.clipboard.writeText(codigoPix).then(() => {
      btnCopiarPix.innerHTML = '<i class="fas fa-check"></i> Código Copiado!';
      btnCopiarPix.classList.add('copiado');
      
      setTimeout(() => {
        btnCopiarPix.innerHTML = '<i class="fas fa-copy"></i> Copiar Código PIX';
        btnCopiarPix.classList.remove('copiado');
      }, 3000);
      
      mostrarNotificacao('Código PIX copiado com sucesso!', 'sucesso');
    }).catch(err => {
      mostrarNotificacao('Erro ao copiar código PIX', 'erro');
    });
  });
  
  // Confirmar pagamento
  btnConfirmarPagamento.addEventListener('click', function() {
    // Obter dados do pedido atual
    const numeroPedido = numeroPedidoSpan.textContent;
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    
    // Criar objeto do pedido
    const pedido = {
      numero: numeroPedido,
      data: new Date().toISOString(),
      itens: [...carrinho],
      total: total,
      status: 'finalizado',
      statusAtendimento: 'pendente',
      clienteNotificado: false
    };
    
    // Salvar pedido na lista de pedidos finalizados
    pedidosFinalizados.push(pedido);
    salvarPedidosFinalizados();
    renderizarPedidosAnteriores();
    
    // Limpar carrinho
    carrinho = [];
    salvarCarrinho();
    atualizarBadgeCarrinho();
    sincronizarControlesQuantidade();
    
    // Fechar modal
    modalPagamento.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Mostrar mensagem de sucesso
    mostrarNotificacao(`✅ Pedido ${numeroPedido} realizado com sucesso! Você pode consultar no carrinho.`, 'sucesso');
  });
  
  // Cancelar pagamento
  btnCancelarPagamento.addEventListener('click', function() {
    modalPagamento.style.display = 'none';
    document.body.style.overflow = 'auto';
    mostrarNotificacao('Pagamento cancelado', 'info');
  });
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Carregar carrinho do localStorage
function carregarCarrinho() {
  const carrinhoSalvo = localStorage.getItem('carrinho');
  if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo);
    atualizarBadgeCarrinho();
    sincronizarControlesQuantidade();
  }
}

// Salvar pedidos finalizados no localStorage
function salvarPedidosFinalizados() {
  localStorage.setItem('pedidosFinalizados', JSON.stringify(pedidosFinalizados));
}

// Carregar pedidos finalizados do localStorage
function carregarPedidosFinalizados() {
  const pedidosSalvos = localStorage.getItem('pedidosFinalizados');
  if (pedidosSalvos) {
    pedidosFinalizados = JSON.parse(pedidosSalvos);
    renderizarPedidosAnteriores();
  }
}

// Renderizar pedidos anteriores no carrinho
function renderizarPedidosAnteriores() {
  if (pedidosFinalizados.length === 0) {
    listaPedidosDiv.style.display = 'none';
    pedidosVazioDiv.style.display = 'flex';
    return;
  }
  
  listaPedidosDiv.style.display = 'flex';
  pedidosVazioDiv.style.display = 'none';
  listaPedidosDiv.innerHTML = '';
  
  // Mostrar todos os pedidos (mais recentes primeiro)
  const pedidosOrdenados = [...pedidosFinalizados].reverse();
  
  pedidosOrdenados.forEach(pedido => {
    const pedidoItem = document.createElement('div');
    pedidoItem.className = 'pedido-item';
    
    const dataFormatada = new Date(pedido.data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Obter informações do status
    const statusInfo = obterStatusInfo(pedido.statusAtendimento || 'pendente');
    
    pedidoItem.innerHTML = `
      <div class="pedido-header">
        <span class="pedido-numero"><i class="fas fa-receipt"></i> ${pedido.numero}</span>
        <span class="pedido-status-badge" style="background: ${statusInfo.cor}; color: ${statusInfo.corTexto};">${statusInfo.texto}</span>
      </div>
      <div class="pedido-info">
        <p><i class="far fa-calendar"></i> ${dataFormatada}</p>
        <p><i class="fas fa-shopping-bag"></i> ${pedido.itens.length} ${pedido.itens.length === 1 ? 'item' : 'itens'}</p>
        <p class="pedido-total"><i class="fas fa-dollar-sign"></i> Total: R$ ${pedido.total.toFixed(2).replace('.', ',')}</p>
      </div>
    `;
    
    listaPedidosDiv.appendChild(pedidoItem);
  });
}

// Função auxiliar para obter informações de status
function obterStatusInfo(status) {
  const statusMap = {
    'pendente': { texto: '⏳ Pendente', cor: '#fff3cd', corTexto: '#856404' },
    'preparando': { texto: '👨‍🍳 Preparando', cor: '#cfe2ff', corTexto: '#084298' },
    'pronto': { texto: '✅ Pronto', cor: '#d1e7dd', corTexto: '#0a3622' },
    'finalizado': { texto: '✓ Entregue', cor: '#e2e3e5', corTexto: '#41464b' }
  };
  
  return statusMap[status] || statusMap['pendente'];
}

// Sincronizar controles de quantidade com o carrinho
function sincronizarControlesQuantidade() {
  // Resetar todos os cards primeiro
  document.querySelectorAll('.area-selecao').forEach(area => {
    area.style.display = 'none';
  });
  document.querySelectorAll('.btn-adicionar').forEach(btn => {
    btn.style.display = 'block';
  });
}

// Mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
  // Remover notificação anterior se existir
  const notificacaoExistente = document.querySelector('.notificacao');
  if (notificacaoExistente) {
    notificacaoExistente.remove();
  }
  
  // Criar nova notificação
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao notificacao-${tipo}`;
  notificacao.innerHTML = `
    <i class="fas fa-${tipo === 'sucesso' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${mensagem}</span>
  `;
  
  document.body.appendChild(notificacao);
  
  // Animar entrada
  setTimeout(() => {
    notificacao.classList.add('mostrar');
  }, 10);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notificacao.classList.remove('mostrar');
    setTimeout(() => {
      notificacao.remove();
    }, 300);
  }, 3000);
}
