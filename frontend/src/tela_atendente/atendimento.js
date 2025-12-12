// Sistema de gerenciamento de pedidos para atendimento
let pedidos = [];
let filtroAtivo = 'todos';

// Elementos DOM
const containerPedidos = document.querySelector('.painel');
const btnFiltros = document.querySelectorAll('.filtros button');

// Inicialização COMPLETA (Pedidos + Produtos)
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Iniciando sistema de atendimento...');
  
  // === PEDIDOS ===
  carregarPedidos();
  configurarFiltros();
  
  // Atualizar pedidos a cada 5 segundos
  setInterval(carregarPedidos, 5000);
  
  // === PRODUTOS - Inicializar elementos DOM ===
  menuBtns = document.querySelectorAll('.menu-btn');
  paineis = document.querySelectorAll('.painel');
  btnNovoProduto = document.getElementById('btnNovoProduto');
  modalProduto = document.getElementById('modalProduto');
  formProduto = document.getElementById('formProduto');
  gridProdutos = document.getElementById('gridProdutos');
  buscaProdutos = document.getElementById('buscaProdutos');
  
  console.log('📦 Elementos DOM encontrados:', {
    menuBtns: menuBtns.length,
    paineis: paineis.length,
    btnNovoProduto: !!btnNovoProduto,
    gridProdutos: !!gridProdutos
  });
  
  // === PRODUTOS - Configurar ===
  configurarMenuNavegacao();
  carregarProdutos();
  configurarModalProduto();
  configurarFiltrosCategorias();
  configurarBusca();
  configurarUploadImagem();
  
  // === STORAGE EVENTS ===
  // Escutar mudanças do localStorage em outras abas/janelas
  window.addEventListener('storage', function(e) {
    if (e.key === 'pedidosFinalizados') {
      carregarPedidos();
      mostrarNotificacao('📦 Novo pedido recebido!');
    }
    
    if (e.key === 'produtosCardapio') {
      carregarProdutos();
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

// ============================================
// SISTEMA DE GERENCIAMENTO DE PRODUTOS
// ============================================

let produtos = [];
let produtoEditando = null;
let categoriaFiltroAtiva = 'todas';

// Elementos DOM - Produtos (serão inicializados após DOM carregar)
let menuBtns;
let paineis;
let btnNovoProduto;
let modalProduto;
let formProduto;
let gridProdutos;
let buscaProdutos;

// Configurar navegação entre painéis
function configurarMenuNavegacao() {
  menuBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      // Remover ativo de todos
      menuBtns.forEach(b => b.classList.remove('ativo'));
      paineis.forEach(p => p.classList.remove('ativo'));
      
      // Ativar clicado
      btn.classList.add('ativo');
      paineis[index].classList.add('ativo');
    });
  });
}

// Produtos padrão (os que já existem na tela de produtos)
const produtosPadrao = [
  {
    id: 'default-1',
    nome: 'Burger Clássico',
    categoria: 'comidas',
    preco: '25.90',
    descricao: 'Burger artesanal com carne bovina, queijo, alface e tomate',
    imagem: '../Tela_Produtos/img_produto/photo-1568901346375-23c9450c58cd.avif',
    estoque: 50,
    estoqueMinimo: 10,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 'default-2',
    nome: 'Pizza Margherita',
    categoria: 'comidas',
    preco: '35.90',
    descricao: 'Pizza tradicional com molho de tomate, mussarela e manjericão',
    imagem: '../Tela_Produtos/img_produto/photo-1593560708920-61dd98c46a4e.avif',
    estoque: 30,
    estoqueMinimo: 10,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 'default-3',
    nome: 'Sanduíche Natural',
    categoria: 'comidas',
    preco: '18.90',
    descricao: 'Sanduíche integral com frango, vegetais frescos e molho especial',
    imagem: '../Tela_Produtos/img_produto/photo-1528735602780-2552fd46c7af.avif',
    estoque: 40,
    estoqueMinimo: 10,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 'default-4',
    nome: 'Refrigerante',
    categoria: 'bebidas',
    preco: '5.90',
    descricao: 'Lata 350ml - Diversos sabores',
    imagem: '../Tela_Produtos/img_produto/photo-1544145945-f90425340c7e.avif',
    estoque: 100,
    estoqueMinimo: 20,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 'default-5',
    nome: 'Suco Natural',
    categoria: 'bebidas',
    preco: '8.90',
    descricao: 'Copo 300ml - Laranja, Limão, Abacaxi',
    imagem: '../Tela_Produtos/img_produto/photo-1595981267035-7b04ca84a82d.avif',
    estoque: 80,
    estoqueMinimo: 15,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 'default-6',
    nome: 'Água Mineral',
    categoria: 'bebidas',
    preco: '3.50',
    descricao: 'Garrafa 500ml - Com ou sem gás',
    imagem: '../Tela_Produtos/img_produto/photo-1497534446932-c925b458314e.avif',
    estoque: 120,
    estoqueMinimo: 25,
    dataCriacao: new Date().toISOString()
  }
];

// Carregar produtos do localStorage
function carregarProdutos() {
  console.log('📦 Carregando produtos...');
  const produtosStorage = localStorage.getItem('produtosCardapio');
  
  let produtosCustomizados = [];
  
  if (produtosStorage) {
    const todosProdutos = JSON.parse(produtosStorage);
    // Separar produtos customizados (IDs que não começam com 'default-')
    produtosCustomizados = todosProdutos.filter(p => !p.id.startsWith('default-'));
    console.log('✅ Produtos customizados carregados:', produtosCustomizados.length);
  }
  
  // SEMPRE incluir produtos padrão + produtos customizados
  produtos = [...produtosPadrao, ...produtosCustomizados];
  console.log('✅ Total de produtos:', produtos.length, '(Padrão:', produtosPadrao.length, '+ Customizados:', produtosCustomizados.length, ')');
  
  renderizarProdutos();
}

// Salvar produtos no localStorage
function salvarProdutos() {
  localStorage.setItem('produtosCardapio', JSON.stringify(produtos));
}

// Renderizar produtos no grid
function renderizarProdutos() {
  console.log('🎨 Renderizando produtos...', {
    total: produtos.length,
    gridProdutos: !!gridProdutos,
    buscaProdutos: !!buscaProdutos
  });
  
  if (!gridProdutos) {
    console.error('❌ Elemento gridProdutos não encontrado!');
    return;
  }
  
  const termoBusca = buscaProdutos ? buscaProdutos.value.toLowerCase() : '';
  
  let produtosFiltrados = produtos.filter(p => {
    const matchCategoria = categoriaFiltroAtiva === 'todas' || p.categoria === categoriaFiltroAtiva;
    const matchBusca = p.nome.toLowerCase().includes(termoBusca) || 
                       p.descricao.toLowerCase().includes(termoBusca);
    return matchCategoria && matchBusca;
  });
  
  console.log('📊 Produtos filtrados:', produtosFiltrados.length);
  
  if (produtosFiltrados.length === 0) {
    gridProdutos.innerHTML = `
      <div class="sem-produtos">
        <i class="fas fa-box-open"></i>
        <p>Nenhum produto encontrado</p>
        <small>Adicione produtos clicando no botão "Novo Produto"</small>
      </div>
    `;
    return;
  }
  
  const html = produtosFiltrados.map(produto => `
    <div class="card-produto-gerenciar" data-id="${produto.id}">
      <div class="imagem-produto-card">
        ${produto.imagem ? 
          `<img src="${produto.imagem}" alt="${produto.nome}" />` :
          `<div class="sem-imagem"><i class="fas fa-image"></i></div>`
        }
        ${produto.categoria === 'comidas' ? 
          '<span class="badge-categoria comida">Comida</span>' :
          '<span class="badge-categoria bebida">Bebida</span>'
        }
      </div>
      
      <div class="info-produto-card">
        <h4>${produto.nome}</h4>
        <p class="descricao-curta">${produto.descricao}</p>
        
        <div class="preco-estoque">
          <span class="preco-produto">R$ ${produto.preco}</span>
          <span class="estoque-produto ${produto.estoque < produto.estoqueMinimo ? 'baixo' : ''}">
            <i class="fas fa-boxes"></i> ${produto.estoque || 0}
          </span>
        </div>
        
        <div class="acoes-produto">
          <button class="btn-editar-produto" onclick="editarProduto('${produto.id}')">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn-deletar-produto" onclick="deletarProduto('${produto.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  console.log('✅ HTML gerado, inserindo no grid...');
  gridProdutos.innerHTML = html;
  console.log('✅ Produtos renderizados com sucesso!');
}

// Configurar modal de produto
function configurarModalProduto() {
  btnNovoProduto.addEventListener('click', abrirModalNovoProduto);
  
  document.getElementById('fecharModalProduto').addEventListener('click', fecharModalProduto);
  document.getElementById('cancelarProduto').addEventListener('click', fecharModalProduto);
  
  // Fechar ao clicar fora
  modalProduto.addEventListener('click', function(e) {
    if (e.target === modalProduto) {
      fecharModalProduto();
    }
  });
  
  // Contadores de caracteres
  document.getElementById('nomeProduto').addEventListener('input', function() {
    this.nextElementSibling.textContent = `${this.value.length}/80 caracteres`;
  });
  
  document.getElementById('descricaoProduto').addEventListener('input', function() {
    this.nextElementSibling.textContent = `${this.value.length}/300 caracteres`;
  });
  
  // Máscara de preço
  document.getElementById('precoProduto').addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    valor = (valor / 100).toFixed(2);
    e.target.value = valor.replace('.', ',');
  });
  
  // Submit do formulário
  formProduto.addEventListener('submit', salvarProduto);
}

// Abrir modal para novo produto
function abrirModalNovoProduto() {
  produtoEditando = null;
  document.getElementById('tituloModalProduto').textContent = 'Novo Produto';
  formProduto.reset();
  document.getElementById('previewImagem').innerHTML = '';
  modalProduto.classList.add('ativo');
}

// Editar produto
function editarProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
  
  produtoEditando = produto;
  document.getElementById('tituloModalProduto').textContent = 'Editar Produto';
  
  document.getElementById('nomeProduto').value = produto.nome;
  document.getElementById('categoriaProduto').value = produto.categoria;
  document.getElementById('precoProduto').value = produto.preco.replace('.', ',');
  document.getElementById('descricaoProduto').value = produto.descricao;
  document.getElementById('quantidadeEstoque').value = produto.estoque || 0;
  document.getElementById('estoqueMinimo').value = produto.estoqueMinimo || 10;
  
  // Preview da imagem
  if (produto.imagem) {
    document.getElementById('previewImagem').innerHTML = `
      <img src="${produto.imagem}" alt="Preview" />
      <button type="button" class="btn-remover-imagem" onclick="removerImagem()">
        <i class="fas fa-times"></i>
      </button>
    `;
  }
  
  modalProduto.classList.add('ativo');
}

// Deletar produto
function deletarProduto(id) {
  if (confirm('Tem certeza que deseja deletar este produto?')) {
    produtos = produtos.filter(p => p.id !== id);
    salvarProdutos();
    renderizarProdutos();
    mostrarNotificacao('✅ Produto deletado com sucesso!');
  }
}

// Salvar produto
function salvarProduto(e) {
  e.preventDefault();
  
  const nome = document.getElementById('nomeProduto').value.trim();
  const categoria = document.getElementById('categoriaProduto').value;
  const preco = document.getElementById('precoProduto').value.replace(',', '.');
  const descricao = document.getElementById('descricaoProduto').value.trim();
  const estoque = parseInt(document.getElementById('quantidadeEstoque').value) || 0;
  const estoqueMinimo = parseInt(document.getElementById('estoqueMinimo').value) || 10;
  
  const imagemElement = document.querySelector('#previewImagem img');
  const imagem = imagemElement ? imagemElement.src : '';
  
  if (produtoEditando) {
    // Editar produto existente
    const index = produtos.findIndex(p => p.id === produtoEditando.id);
    produtos[index] = {
      ...produtoEditando,
      nome,
      categoria,
      preco,
      descricao,
      estoque,
      estoqueMinimo,
      imagem
    };
    mostrarNotificacao('✅ Produto atualizado com sucesso!');
  } else {
    // Novo produto
    const novoProduto = {
      id: Date.now().toString(),
      nome,
      categoria,
      preco,
      descricao,
      estoque,
      estoqueMinimo,
      imagem,
      dataCriacao: new Date().toISOString()
    };
    produtos.push(novoProduto);
    mostrarNotificacao('✅ Produto adicionado com sucesso!');
  }
  
  salvarProdutos();
  renderizarProdutos();
  fecharModalProduto();
}

// Fechar modal
function fecharModalProduto() {
  modalProduto.classList.remove('ativo');
  formProduto.reset();
  produtoEditando = null;
}

// Configurar filtros de categorias
function configurarFiltrosCategorias() {
  document.querySelectorAll('.filtro-cat').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filtro-cat').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      
      categoriaFiltroAtiva = btn.dataset.categoria;
      renderizarProdutos();
    });
  });
}

// Configurar busca
function configurarBusca() {
  buscaProdutos.addEventListener('input', renderizarProdutos);
}

// Configurar upload de imagem
function configurarUploadImagem() {
  const uploadArea = document.getElementById('uploadArea');
  const inputImagem = document.getElementById('imagemProduto');
  const previewArea = document.getElementById('previewImagem');
  
  uploadArea.addEventListener('click', () => inputImagem.click());
  
  inputImagem.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) processarImagem(file);
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processarImagem(file);
    }
  });
}

// Processar imagem
function processarImagem(file) {
  if (file.size > 5 * 1024 * 1024) {
    alert('Imagem muito grande! Máximo 5MB.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('previewImagem').innerHTML = `
      <img src="${e.target.result}" alt="Preview" />
      <button type="button" class="btn-remover-imagem" onclick="removerImagem()">
        <i class="fas fa-times"></i>
      </button>
    `;
  };
  reader.readAsDataURL(file);
}

// Remover imagem
function removerImagem() {
  document.getElementById('previewImagem').innerHTML = '';
  document.getElementById('imagemProduto').value = '';
}
