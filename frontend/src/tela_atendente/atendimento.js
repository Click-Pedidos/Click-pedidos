// Sistema de gerenciamento de pedidos para atendimento
let pedidos = [];
let filtroAtivo = 'todos';

// Elementos DOM
const containerPedidos = document.querySelector('.painel');
const btnFiltros = document.querySelectorAll('.filtros button');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  carregarPedidos();
  configurarFiltros();
  
  // Atualizar pedidos a cada 5 segundos
  setInterval(carregarPedidos, 5000);
  
  // Escutar mudanças do localStorage em outras abas/janelas
  window.addEventListener('storage', function(e) {
    if (e.key === 'pedidosFinalizados') {
      carregarPedidos();
      mostrarNotificacao('📦 Novo pedido recebido!');
    }
  });
});

// Carregar pedidos do localStorage
function carregarPedidos() {
  const pedidosFinalizados = localStorage.getItem('pedidosFinalizados');
  
  if (pedidosFinalizados) {
    const todosPedidos = JSON.parse(pedidosFinalizados);
    
    // Adicionar status aos pedidos se não tiverem
    pedidos = todosPedidos.map(pedido => ({
      ...pedido,
      statusAtendimento: pedido.statusAtendimento || 'pendente',
      clienteNotificado: pedido.clienteNotificado || false
    }));
    
    // Salvar pedidos atualizados
    salvarPedidos();
    renderizarPedidos();
    atualizarContadores();
  }
}

// Salvar pedidos no localStorage
function salvarPedidos() {
  localStorage.setItem('pedidosFinalizados', JSON.stringify(pedidos));
}

// Renderizar pedidos na tela
function renderizarPedidos() {
  // Remover pedidos anteriores (manter apenas título e filtros)
  const pedidosAntigos = document.querySelectorAll('.pedido');
  pedidosAntigos.forEach(p => p.remove());
  
  // Filtrar pedidos
  let pedidosFiltrados = pedidos;
  
  if (filtroAtivo === 'pendentes') {
    pedidosFiltrados = pedidos.filter(p => p.statusAtendimento === 'pendente');
  } else if (filtroAtivo === 'preparando') {
    pedidosFiltrados = pedidos.filter(p => p.statusAtendimento === 'preparando');
  } else if (filtroAtivo === 'prontos') {
    pedidosFiltrados = pedidos.filter(p => p.statusAtendimento === 'pronto');
  } else if (filtroAtivo === 'finalizados') {
    pedidosFiltrados = pedidos.filter(p => p.statusAtendimento === 'finalizado');
  }
  
  // Ordenar por data (mais recentes primeiro)
  pedidosFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));
  
  // Renderizar cada pedido
  pedidosFiltrados.forEach(pedido => {
    const pedidoElement = criarElementoPedido(pedido);
    containerPedidos.appendChild(pedidoElement);
  });
  
  // Mostrar mensagem se não houver pedidos
  if (pedidosFiltrados.length === 0) {
    const mensagem = document.createElement('div');
    mensagem.className = 'sem-pedidos';
    mensagem.innerHTML = `
      <p>Nenhum pedido ${filtroAtivo !== 'todos' ? filtroAtivo : 'encontrado'}</p>
    `;
    containerPedidos.appendChild(mensagem);
  }
}

// Criar elemento HTML do pedido
function criarElementoPedido(pedido) {
  const div = document.createElement('div');
  div.className = 'pedido';
  div.dataset.pedidoId = pedido.numero;
  
  const dataFormatada = new Date(pedido.data).toLocaleString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Determinar classe do status
  let statusClasse = 'pendente';
  let statusTexto = 'Pendente';
  
  if (pedido.statusAtendimento === 'preparando') {
    statusClasse = 'preparando';
    statusTexto = 'Preparando';
  } else if (pedido.statusAtendimento === 'pronto') {
    statusClasse = 'pronto';
    statusTexto = 'Pronto';
  } else if (pedido.statusAtendimento === 'finalizado') {
    statusClasse = 'finalizado';
    statusTexto = 'Finalizado';
  }
  
  // Montar lista de itens
  const itensHtml = pedido.itens.map(item => 
    `<li>${item.quantidade}x ${item.nome} <span>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span></li>`
  ).join('');
  
  // Criar HTML do pedido
  div.innerHTML = `
    <div class="pedido-hover">
      <h3>${pedido.numero}</h3>
      <span class="status ${statusClasse}">${statusTexto}</span>
    </div>
    <p><strong>Pagamento:</strong> PIX</p>
    <p><strong>Horário:</strong> ${dataFormatada}</p>
    
    <ul>
      ${itensHtml}
    </ul>
    
    <p class="total">Total: <span>R$ ${pedido.total.toFixed(2).replace('.', ',')}</span></p>
    
    ${criarBotoesAcao(pedido)}
  `;
  
  // Adicionar event listeners aos botões
  configurarBotoesPedido(div, pedido);
  
  return div;
}

// Criar botões de ação baseado no status
function criarBotoesAcao(pedido) {
  if (pedido.statusAtendimento === 'pendente') {
    return '<button class="btn btn-acao btn-iniciar">Iniciar Preparo</button>';
  } else if (pedido.statusAtendimento === 'preparando') {
    return '<button class="btn btn-acao btn-marcar-pronto">Marcar como Pronto</button>';
  } else if (pedido.statusAtendimento === 'pronto') {
    return `
      <div class="acoes">
        <button class="btn2-acao btn-finalizar">Finalizar Pedido</button>
        <button class="btn btn-secundario btn-avisar">Avisar Cliente</button>
      </div>
    `;
  } else {
    return '<div class="pedido-finalizado-msg">✓ Pedido Entregue</div>';
  }
}

// Configurar botões do pedido
function configurarBotoesPedido(elemento, pedido) {
  const btnIniciar = elemento.querySelector('.btn-iniciar');
  const btnMarcarPronto = elemento.querySelector('.btn-marcar-pronto');
  const btnFinalizar = elemento.querySelector('.btn-finalizar');
  const btnAvisar = elemento.querySelector('.btn-avisar');
  
  if (btnIniciar) {
    btnIniciar.addEventListener('click', () => atualizarStatusPedido(pedido.numero, 'preparando'));
  }
  
  if (btnMarcarPronto) {
    btnMarcarPronto.addEventListener('click', () => atualizarStatusPedido(pedido.numero, 'pronto'));
  }
  
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => atualizarStatusPedido(pedido.numero, 'finalizado'));
  }
  
  if (btnAvisar) {
    btnAvisar.addEventListener('click', () => avisarCliente(pedido.numero));
  }
}

// Atualizar status do pedido
function atualizarStatusPedido(numeroPedido, novoStatus) {
  const pedido = pedidos.find(p => p.numero === numeroPedido);
  
  if (pedido) {
    pedido.statusAtendimento = novoStatus;
    salvarPedidos();
    renderizarPedidos();
    atualizarContadores();
    
    mostrarNotificacao(`Pedido ${numeroPedido} ${obterMensagemStatus(novoStatus)}`);
  }
}

// Obter mensagem de status
function obterMensagemStatus(status) {
  const mensagens = {
    'preparando': 'em preparo',
    'pronto': 'está pronto!',
    'finalizado': 'finalizado'
  };
  return mensagens[status] || 'atualizado';
}

// Avisar cliente
function avisarCliente(numeroPedido) {
  const pedido = pedidos.find(p => p.numero === numeroPedido);
  
  if (pedido) {
    pedido.clienteNotificado = true;
    salvarPedidos();
    mostrarNotificacao(`Cliente notificado sobre o pedido ${numeroPedido}`);
  }
}

// Configurar filtros
function configurarFiltros() {
  btnFiltros.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remover classe ativo de todos
      btnFiltros.forEach(b => b.classList.remove('ativo'));
      
      // Adicionar classe ativo ao clicado
      this.classList.add('ativo');
      
      // Determinar filtro
      const texto = this.textContent.toLowerCase();
      
      if (texto.includes('todos')) {
        filtroAtivo = 'todos';
      } else if (texto.includes('pendentes')) {
        filtroAtivo = 'pendentes';
      } else if (texto.includes('preparando')) {
        filtroAtivo = 'preparando';
      } else if (texto.includes('prontos')) {
        filtroAtivo = 'prontos';
      } else if (texto.includes('finalizados')) {
        filtroAtivo = 'finalizados';
      }
      
      renderizarPedidos();
    });
  });
}

// Atualizar contadores dos filtros
function atualizarContadores() {
  const total = pedidos.length;
  const pendentes = pedidos.filter(p => p.statusAtendimento === 'pendente').length;
  const preparando = pedidos.filter(p => p.statusAtendimento === 'preparando').length;
  const prontos = pedidos.filter(p => p.statusAtendimento === 'pronto').length;
  const finalizados = pedidos.filter(p => p.statusAtendimento === 'finalizado').length;
  
  btnFiltros.forEach(btn => {
    const texto = btn.textContent.toLowerCase();
    
    if (texto.includes('todos')) {
      btn.textContent = `Todos (${total})`;
    } else if (texto.includes('pendentes')) {
      btn.textContent = `Pendentes (${pendentes})`;
    } else if (texto.includes('preparando')) {
      btn.textContent = `Preparando (${preparando})`;
    } else if (texto.includes('prontos')) {
      btn.textContent = `Prontos (${prontos})`;
    } else if (texto.includes('finalizados')) {
      btn.textContent = `Finalizados (${finalizados})`;
    }
  });
}

// Mostrar notificação
function mostrarNotificacao(mensagem) {
  const notificacao = document.createElement('div');
  notificacao.className = 'notificacao-atendimento';
  notificacao.textContent = mensagem;
  
  document.body.appendChild(notificacao);
  
  setTimeout(() => {
    notificacao.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notificacao.classList.remove('show');
    setTimeout(() => notificacao.remove(), 300);
  }, 3000);
}
