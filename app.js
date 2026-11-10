
var app = document.getElementById("app");
var toast = document.getElementById("toast");

var produtos = JSON.parse(JSON.stringify(produtosBase));
var pedidos = JSON.parse(JSON.stringify(pedidosBase));
var carrinho = [];

var perfilAtual = "";
var areaEscolhida = "Cliente";
var paginaAtual = "dashboard";
var pedidoSelecionado = 0;
var buscaAtual = "";
var categoriaAtual = "Todas";
var emailAtual = "";
var clienteAtual = "Padaria do João";
var rotaAtual = "Todas";
var notificacoes = [];

var etapas = ["Recebido", "Aprovado", "Em separação", "Expedido", "Em rota", "Entregue"];

function mostrarLogin() {
  var html = "";
  html += '<main class="login-screen">';
  html += '  <section class="login-brand">';
  html += '    <div class="login-copy">';
  html += '      <img src="logo-trazo.png" alt="Trazo">';
  html += '      <h1>Pedidos em movimento, do início ao destino.</h1>';
  html += '      <p>Centralize compras, acompanhe cada etapa e mantenha cliente, comercial e expedição na mesma rota.</p>';
  html += '    </div>';
  html += '    <div class="route-mark">Do pedido à entrega.</div>';
  html += '  </section>';
  html += '  <section class="login-panel">';
  html += '    <div class="login-card">';
  html += '      <h2>Entrar</h2>';
  html += '      <p>Acesse sua conta para continuar.</p>';
  html += '      <div class="form-group"><label for="email">E-mail</label><input id="email" class="form-control" type="email" placeholder="nome@empresa.com"></div>';
  html += '      <div class="form-group"><label for="senha">Senha</label><input id="senha" class="form-control" type="password" placeholder="••••••••"></div>';
  html += '      <div class="form-group"><label>Área de acesso</label>';
  html += '        <div class="roles">';
  html += montarCardArea("Cliente", "CL", "Pedidos e entregas");
  html += montarCardArea("Comercial", "CO", "Análise de pedidos");
  html += montarCardArea("Expedição", "EX", "Separação e envio");
  html += '        </div>';
  html += '      </div>';
  html += '<div class="form-group"><label for="cliente-login">Cliente da simulação</label><select id="cliente-login" class="form-control">' + clientesBase.map(function(c) { return '<option' + (c.nome === clienteAtual ? ' selected' : '') + '>' + escapar(c.nome) + '</option>'; }).join('') + '</select></div>';
  html += '<p class="demo-hint">Demonstração: use qualquer e-mail válido e uma senha com 4 caracteres. Dados reiniciam ao atualizar a página.</p>';
  html += '      <button id="btn-entrar" class="btn btn-primary" style="width:100%">Entrar</button>';
  html += '    </div>';
  html += '  </section>';
  html += '</main>';

  app.innerHTML = html;
  document.getElementById('btn-entrar').onclick = entrar;
}

function montarCardArea(nome, sigla, subtitulo) {
  var classe = "role-card";
  if (areaEscolhida === nome) {
    classe += " selected";
  }

  var html = "";
  html += '<div class="' + classe + '" onclick="selecionarArea(\'' + nome + '\')">';
  html += '  <div class="role-icon">' + sigla + '</div>';
  html += '  <div><strong>' + nome + '</strong><span>' + subtitulo + '</span></div>';
  html += '</div>';
  return html;
}

function selecionarArea(nome) {
  if (document.getElementById('cliente-login')) clienteAtual = document.getElementById('cliente-login').value;
  areaEscolhida = nome;
  var emailDigitado = "";
  var senhaDigitada = "";
  if (document.getElementById("email")) {
    emailDigitado = document.getElementById("email").value;
    senhaDigitada = document.getElementById("senha").value;
  }
  mostrarLogin();
  document.getElementById("email").value = emailDigitado;
  document.getElementById("senha").value = senhaDigitada;
}

function entrar() {
  var email = document.getElementById("email").value;
  var senha = document.getElementById("senha").value;

  if (email === "" || senha === "") {
    mostrarToast("Preencha e-mail e senha.");
    return;
  }

  if (senha.length < 4) {
    mostrarToast("A senha deve ter pelo menos 4 caracteres.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { mostrarToast('Informe um e-mail válido.'); return; }
  clienteAtual = document.getElementById('cliente-login').value;
  emailAtual = email;
  perfilAtual = areaEscolhida;
  paginaAtual = "dashboard";
  renderizarSistema();
}

function sair() {
  carrinho = [];
  perfilAtual = "";
  areaEscolhida = "Cliente";
  paginaAtual = "dashboard";
  pedidoSelecionado = 0;
  buscaAtual = "";
  categoriaAtual = "Todas";
  mostrarLogin();
}

function renderizarSistema() {
  atualizarPrazos();
  if (perfilAtual === "") {
    mostrarLogin();
    return;
  }

  var html = "";
  html += '<div class="app-shell">';
  html += montarHeader();
  html += '<div class="fade-in">';

  if (paginaAtual === "dashboard") {
    html += telaDashboard();
  } else if (paginaAtual === "catalogo") {
    html += telaCatalogo();
  } else if (paginaAtual === "carrinho") {
    html += telaCarrinho();
  } else if (paginaAtual === "pedidos") {
    html += telaPedidos();
  } else if (paginaAtual === "detalhe") {
    html += telaDetalhePedido();
  } else if (paginaAtual === "comercial") {
    html += telaComercial();
  } else if (paginaAtual === "notificacoes") {
    html += telaNotificacoes();
  } else if (paginaAtual === "rotas") {
    html += telaRotas();
  } else if (paginaAtual === "expedicao") {
    html += telaExpedicao();
  } else {
    html += telaDashboard();
  }

  html += "</div></div>";
  app.innerHTML = html;
  ativarEventosTela();
}

function montarHeader() {
  var html = "";
  html += '<header class="topbar">';
  html += '  <div class="brand"><img src="logo-trazo.png" alt="Trazo"></div>';
  html += '  <nav class="nav">';
  html += montarBotoesMenu();
  html += '  </nav>';
  html += '  <div class="header-actions">';
  html += '    <button class="icon-btn" title="Notificações" aria-label="Notificações" onclick="trocarPagina(\'notificacoes\')"><img src="bell.svg" alt=""></button>';
  html += '    <button class="profile-chip" onclick="sair()">';
  html += '      <strong>' + nomeDoPerfil() + '</strong>';
  html += '      <span>' + perfilAtual + ' · sair</span>';
  html += '    </button>';
  html += '  </div>';
  html += '</header>';
  return html;
}

function montarBotoesMenu() {
  var html = "";
  var itens = [];
  if (perfilAtual === "Cliente") {
    itens = [
      ["dashboard", "Início"],
      ["catalogo", "Catálogo"],
      ["carrinho", "Carrinho (" + quantidadeTotalCarrinho() + ")"],
      ["pedidos", "Pedidos"]
    ];
  } else if (perfilAtual === "Comercial") {
    itens = [
      ["dashboard", "Início"],
      ["comercial", "Análises"],
      ["pedidos", "Pedidos"]
    ];
  } else {
    itens = [
      ["dashboard", "Início"],
      ["expedicao", "Expedição"],
      ["pedidos", "Pedidos"]
    ];
  }

  if (perfilAtual === "Expedição") itens.push(["rotas", "Rotas"]);
  if (perfilAtual === "Cliente") itens.push(["notificacoes", "Notificações"]);
  for (var i = 0; i < itens.length; i++) {
    var classe = "";
    if (paginaAtual === itens[i][0]) {
      classe = ' class="active"';
    }
    html += '<button' + classe + ' onclick="trocarPagina(\'' + itens[i][0] + '\')">' + itens[i][1] + '</button>';
  }
  return html;
}

function nomeDoPerfil() {
  if (perfilAtual === "Cliente") return escapar(clienteAtual);
  if (perfilAtual === "Comercial") return "Equipe Comercial";
  return "Centro de Expedição";
}

function trocarPagina(nome) {
  var permitidas = perfilAtual === "Cliente" ? ["dashboard","catalogo","carrinho","pedidos","detalhe","notificacoes"] : perfilAtual === "Comercial" ? ["dashboard","comercial","pedidos","detalhe","notificacoes"] : ["dashboard","expedicao","rotas","pedidos","detalhe","notificacoes"];
  if (permitidas.indexOf(nome) === -1) { mostrarToast("Esta tela pertence a outro perfil."); return; }
  paginaAtual = nome;
  if (nome !== "detalhe") {
    pedidoSelecionado = 0;
  }
  renderizarSistema();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function ativarEventosTela() {
  if (paginaAtual === "catalogo") {
    if (document.getElementById("campo-busca")) {
      document.getElementById("campo-busca").oninput = function () {
        var cursor = this.selectionStart;
        buscaAtual = this.value;
        renderizarSistema();
        var campo = document.getElementById("campo-busca");
        campo.focus(); campo.setSelectionRange(cursor,cursor);
      };
    }
    if (document.getElementById("filtro-categoria")) {
      document.getElementById("filtro-categoria").onchange = function () {
        categoriaAtual = this.value;
        renderizarSistema();
      };
    }
  }
}

function telaDashboard() {
  var pedidosVisiveis = listaVisivel();
  var total = pedidosVisiveis.length;
  var emAndamento = 0;
  var entregues = 0;
  var entreguesNoPrazo = 0;
  var emRisco = 0;
  var somaDias = 0;
  var qtdDias = 0;

  for (var i = 0; i < pedidosVisiveis.length; i++) {
    if (pedidosVisiveis[i].status !== "Entregue" && pedidosVisiveis[i].status !== "Cancelado" && pedidosVisiveis[i].status !== "Recusado") {
      emAndamento++;
    }
    if (pedidosVisiveis[i].status === "Entregue") {
      entregues++;
      if (pedidosVisiveis[i].noPrazo === true) {
        entreguesNoPrazo++;
      }
      var inicio = new Date(pedidosVisiveis[i].timeline[0].data);
      var fim = new Date(pedidosVisiveis[i].timeline[pedidosVisiveis[i].timeline.length - 1].data);
      var dias = (fim - inicio) / 86400000;
      somaDias += dias;
      qtdDias++;
    }
    if (pedidosVisiveis[i].risco === true) {
      emRisco++;
    }
  }

  var percentualPrazo = 0;
  if (entregues > 0) {
    percentualPrazo = Math.round((entreguesNoPrazo / entregues) * 100);
  }

  var media = 0;
  if (qtdDias > 0) {
    media = (somaDias / qtdDias).toFixed(1);
  }

  var html = '<main class="page">';
  html += '<section class="hero-strip">';
  html += '  <span class="eyebrow">' + perfilAtual + '</span>';
  if (perfilAtual === "Cliente") {
    html += '  <h2>Acompanhe seus pedidos sem precisar perguntar onde eles estão.</h2>';
    html += '  <p>A Trazo conecta as etapas do pedido com uma visão simples, organizada e rápida.</p>';
    html += '  <div class="hero-actions"><button class="btn btn-primary" onclick="trocarPagina(\'catalogo\')">Novo pedido</button><button class="btn btn-secondary" onclick="trocarPagina(\'pedidos\')">Acompanhar pedidos</button></div>';
  } else if (perfilAtual === "Comercial") {
    html += '  <h2>Da entrada do pedido à aprovação, tudo em um único fluxo.</h2>';
    html += '  <p>Visualize, aprove ou recuse os pedidos recebidos com rapidez.</p>';
    html += '  <div class="hero-actions"><button class="btn btn-primary" onclick="trocarPagina(\'comercial\')">Ver análises</button></div>';
  } else {
    html += '  <h2>Organize a expedição priorizando o que precisa sair primeiro.</h2>';
    html += '  <p>A fila visual ajuda a avançar os pedidos por etapa.</p>';
    html += '  <div class="hero-actions"><button class="btn btn-primary" onclick="trocarPagina(\'expedicao\')">Abrir expedição</button></div>';
  }
  html += '</section>';

  html += '<section class="kpis">';
  html += kpiCard("Pedidos", total, "registrados");
  html += kpiCard("Em andamento", emAndamento, "fluxos ativos");
  html += kpiCard("Tempo médio", media + "d", "pedido → entrega");
  html += kpiCard("Entregas no prazo", percentualPrazo + "%", emRisco + " pedido(s) em risco");
  html += '</section>';

  html += '<section class="grid-2">';
  html += '<div class="panel"><div class="panel-head"><h3>Pedidos recentes</h3><button class="btn btn-ghost" onclick="trocarPagina(\'pedidos\')">Ver todos</button></div>';
  html += '<div class="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Valor</th><th>Status</th></tr></thead><tbody>';

  var pedidosVisiveisOrdenados = pedidosVisiveis.slice().sort(function(a, b) {
    return new Date(b.data) - new Date(a.data);
  });

  for (var j = 0; j < pedidosVisiveisOrdenados.length && j < 5; j++) {
    var pedido = pedidosVisiveisOrdenados[j];
    html += '<tr onclick="abrirPedido(' + pedido.id + ')" style="cursor:pointer">';
    html += '<td><strong>#' + pedido.id + '</strong><br><small>' + formatarData(pedido.data) + '</small></td>';
    html += '<td>' + pedido.cliente + '</td>';
    html += '<td>' + moeda(totalDoPedido(pedido)) + '</td>';
    html += '<td>' + badgeStatus(pedido.status, pedido.risco) + '</td>';
    html += '</tr>';
  }

  html += '</tbody></table></div></div>';

  html += '<aside class="panel"><div class="panel-head"><h3>Status atual</h3></div><div class="status-list">';
  var contagemStatus = contarStatus(pedidosVisiveis);
  for (var nome in contagemStatus) {
    html += '<div class="status-row"><span>' + nome + '</span><strong>' + contagemStatus[nome] + '</strong></div>';
  }
  html += '</div></aside>';
  html += '</section>';

  html += '</main>';
  return html;
}

function kpiCard(titulo, valor, subtitulo) {
  return '<div class="kpi"><span>' + titulo + '</span><strong>' + valor + '</strong><small>' + subtitulo + '</small></div>';
}

function telaCatalogo() {
  var html = '<main class="page">';
  html += '<div class="page-head"><div><span class="eyebrow">Catálogo</span><h1>Produtos para o seu próximo pedido.</h1><p>Busque, filtre e adicione ao carrinho com o estoque já visível.</p></div>';
  html += '<button class="btn btn-secondary" onclick="trocarPagina(\'carrinho\')">Carrinho · ' + quantidadeTotalCarrinho() + '</button></div>';

  html += '<div class="filters">';
  html += '<div class="search-box"><input id="campo-busca" value="' + escapar(buscaAtual) + '" placeholder="Buscar produto..."></div>';
  html += '<select id="filtro-categoria">';
  var categorias = listarCategorias();
  for (var i = 0; i < categorias.length; i++) {
    var selecionado = categorias[i] === categoriaAtual ? ' selected' : '';
    html += '<option' + selecionado + '>' + categorias[i] + '</option>';
  }
  html += '</select></div>';

  html += '<section class="product-grid">';
  if (!produtos.some(produtoPassaNoFiltro)) html += '<p>Nenhum produto encontrado. Tente outro nome ou categoria.</p>';
  for (var j = 0; j < produtos.length; j++) {
    if (produtoPassaNoFiltro(produtos[j])) {
      html += cardProduto(produtos[j]);
    }
  }
  html += '</section>';
  html += '</main>';
  return html;
}

function listarCategorias() {
  var categorias = ["Todas"];
  for (var i = 0; i < produtos.length; i++) {
    if (categorias.indexOf(produtos[i].categoria) === -1) {
      categorias.push(produtos[i].categoria);
    }
  }
  return categorias;
}

function produtoPassaNoFiltro(produto) {
  var buscaOk = true;
  var categoriaOk = true;

  if (buscaAtual !== "") {
    buscaOk = produto.nome.toLowerCase().indexOf(buscaAtual.toLowerCase()) !== -1;
  }

  if (categoriaAtual !== "Todas") {
    categoriaOk = produto.categoria === categoriaAtual;
  }

  return buscaOk && categoriaOk;
}

function cardProduto(produto) {
  var html = "";
  html += '<article class="product-card">';
  html += '  <div class="product-media"><img src="' + produto.imagem + '" alt="' + produto.nome + '"></div>';
  html += '  <div class="product-body">';
  html += '    <span class="product-category">' + produto.categoria + '</span>';
  html += '    <h3>' + produto.nome + '</h3>';
  html += '    <p>' + produto.unidade + '</p>';
  html += '    <div class="product-bottom">';
  html += '      <div class="product-price"><strong>' + moeda(produto.preco) + '</strong><small>' + produto.estoque + ' disponíveis</small></div>';
  html += '      <button class="btn btn-primary" ' + (produto.estoque < 1 ? 'disabled' : '') + ' onclick="adicionarAoCarrinho(' + produto.id + ')">Adicionar</button>';
  html += '    </div>';
  html += '  </div>';
  html += '</article>';
  return html;
}

function adicionarAoCarrinho(id) {
  if (perfilAtual !== "Cliente") return;
  var produto = pegarProduto(id);
  if (!produto || produto.estoque < 1) { mostrarToast("Produto sem estoque disponível."); return; }
  var posicao = -1;

  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].produtoId === id) {
      posicao = i;
    }
  }

  if (posicao === -1) {
    carrinho.push({
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      qtd: 1,
      imagem: produto.imagem
    });
  } else {
    if (carrinho[posicao].qtd + 1 > produto.estoque) {
      mostrarToast("Quantidade acima do estoque disponível.");
      return;
    }
    carrinho[posicao].qtd++;
  }

  mostrarToast("Produto adicionado ao carrinho.");
  renderizarSistema();
}

function telaCarrinho() {
  var html = '<main class="page">';

  if (carrinho.length === 0) {
    html += '<div class="page-head"><div><span class="eyebrow">Carrinho</span><h1>Seu carrinho está vazio.</h1><p>Adicione produtos para montar seu próximo pedido.</p></div></div>';
    html += '<div class="empty"><h3>Nenhum item por aqui.</h3><p>Abra o catálogo para começar.</p><button class="btn btn-primary" onclick="trocarPagina(\'catalogo\')">Abrir catálogo</button></div>';
    html += '</main>';
    return html;
  }

  html += '<div class="page-head"><div><span class="eyebrow">Carrinho</span><h1>Revise antes de enviar.</h1><p>Altere quantidades ou remova itens antes de finalizar o pedido.</p></div></div>';
  html += '<div class="cart-list">';

  for (var i = 0; i < carrinho.length; i++) {
    var item = carrinho[i];
    html += '<div class="cart-item">';
    html += '  <img src="' + item.imagem + '" alt="' + item.nome + '">';
    html += '  <div><strong>' + item.nome + '</strong><br><small>' + moeda(item.preco) + ' por unidade</small></div>';
    html += '  <div class="qty-control"><button onclick="mudarQuantidade(' + item.produtoId + ', -1)">−</button><strong>' + item.qtd + '</strong><button onclick="mudarQuantidade(' + item.produtoId + ', 1)">+</button></div>';
    html += '  <div><strong>' + moeda(item.qtd * item.preco) + '</strong><br><button class="btn btn-ghost" onclick="removerDoCarrinho(' + item.produtoId + ')">Remover</button></div>';
    html += '</div>';
  }

  html += '</div>';
  html += '<div class="cart-summary">';
  html += '  <div class="cart-total"><small>Total do pedido</small><strong>' + moeda(totalCarrinho()) + '</strong></div>';
  html += '  <div><button class="btn btn-secondary" onclick="trocarPagina(\'catalogo\')">Continuar comprando</button> <button class="btn btn-primary" onclick="finalizarPedido()">Finalizar pedido</button></div>';
  html += '</div>';
  html += '</main>';
  return html;
}

function mudarQuantidade(id, valor) {
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].produtoId === id) {
      var produto = pegarProduto(id);
      if (carrinho[i].qtd + valor < 1) {
        removerDoCarrinho(id);
        return;
      }
      if (carrinho[i].qtd + valor > produto.estoque) {
        mostrarToast("Quantidade acima do estoque disponível.");
        return;
      }
      carrinho[i].qtd += valor;
    }
  }
  renderizarSistema();
}

function removerDoCarrinho(id) {
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].produtoId === id) {
      carrinho.splice(i, 1);
      break;
    }
  }
  renderizarSistema();
}

function finalizarPedido() {
  if (perfilAtual !== "Cliente" || carrinho.length === 0) { mostrarToast("Adicione produtos ao carrinho."); return; }
  for (var item of carrinho) {
    var produto = pegarProduto(item.produtoId);
    if (!produto || !Number.isInteger(item.qtd) || item.qtd < 1 || item.qtd > produto.estoque) { mostrarToast("Revise as quantidades: estoque insuficiente."); return; }
  }
  if (!confirm("Confirmar pedido de " + moeda(totalCarrinho()) + "?")) return;
  var agora = new Date(), previsao = new Date(); previsao.setDate(previsao.getDate()+3);
  var cliente = clientesBase.find(function(c){return c.nome === clienteAtual;});
  var novoPedido = { id: Math.max.apply(null,pedidos.map(function(p){return p.id;}))+1, cliente: clienteAtual,
    endereco: cliente.endereco, regiao: cliente.regiao, data: agora.toISOString(), previsao: dataLocal(previsao),
    status:"Recebido", noPrazo:true, risco:false, estoqueReservado:true, itens:[], timeline:[{etapa:"Recebido",data:agora.toISOString()}] };
  for (var item of carrinho) { novoPedido.itens.push({produtoId:item.produtoId,nome:item.nome,qtd:item.qtd,preco:item.preco}); pegarProduto(item.produtoId).estoque -= item.qtd; }
  pedidos.unshift(novoPedido); carrinho=[]; notificar(novoPedido,"Recebido"); pedidoSelecionado=novoPedido.id; paginaAtual="detalhe";
  mostrarToast("Pedido #"+novoPedido.id+" criado com sucesso."); renderizarSistema();
}

function telaPedidos() {
  var html = '<main class="page">';
  html += '<div class="page-head"><div><span class="eyebrow">Pedidos</span><h1>';
  if (perfilAtual === "Cliente") {
    html += 'Meus pedidos';
  } else {
    html += 'Pedidos da operação';
  }
  html += '</h1><p>Acompanhe o andamento e abra qualquer pedido para ver cada etapa.</p></div></div>';
  html += '<section class="order-list">';

  for (var i = 0; i < pedidos.length; i++) {
    if (perfilAtual === "Cliente") {
      if (pedidos[i].cliente !== clienteAtual) {
        continue;
      }
    }

    html += '<article class="order-card">';
    html += '  <div><h3>Pedido #' + pedidos[i].id + '</h3><div class="order-meta"><span>' + formatarData(pedidos[i].data) + '</span><span>' + pedidos[i].itens.length + ' item(ns)</span><span>Previsão: ' + formatarData(pedidos[i].previsao) + '</span></div></div>';
    html += '  <div>' + badgeStatus(pedidos[i].status, pedidos[i].risco) + '</div>';
    html += '  <div class="order-value"><strong>' + moeda(totalDoPedido(pedidos[i])) + '</strong><button class="btn btn-ghost" onclick="abrirPedido(' + pedidos[i].id + ')">Ver detalhes</button></div>';
    html += '</article>';
  }

  html += '</section></main>';
  return html;
}

function abrirPedido(id) {
  if (!podeVer(pegarPedido(id))) { mostrarToast("Pedido indisponível para este cliente."); return; }
  pedidoSelecionado = id;
  paginaAtual = "detalhe";
  renderizarSistema();
}

function telaDetalhePedido() {
  var pedido = pegarPedido(pedidoSelecionado);
  if (!pedido || !podeVer(pedido)) {
    paginaAtual = "pedidos";
    return telaPedidos();
  }

  var html = '<main class="page">';
  html += '<div class="page-head"><div><button class="btn btn-ghost" onclick="trocarPagina(\'pedidos\')">← Voltar</button><span class="eyebrow">Pedido #' + pedido.id + '</span><h1>' + pedido.cliente + '</h1><p>Criado em ' + formatarDataHora(pedido.data) + ' · previsão ' + formatarData(pedido.previsao) + '</p></div>';
  html += '<div>' + badgeStatus(pedido.status, pedido.risco) + '</div></div>';

  html += '<section class="panel"><div class="timeline">';
  for (var i = 0; i < etapas.length; i++) {
    html += montarEtapaTimeline(pedido, etapas[i], i);
  }
  html += '</div></section>';

  html += '<section class="info-grid">';
  html += '<div class="info-card"><h4>Pedido</h4><p>Número #' + pedido.id + '</p><p>' + pedido.itens.length + ' item(ns)</p><p>Total: <strong>' + moeda(totalDoPedido(pedido)) + '</strong></p></div>';
  html += '<div class="info-card"><h4>Entrega</h4><p>' + escapar(pedido.endereco) + '</p><p>' + escapar(pedido.regiao) + '</p><p>Previsão: ' + formatarData(pedido.previsao) + '</p></div>';
  html += '<div class="info-card"><h4>Andamento</h4><p>' + (pedido.risco ? (pedido.atrasado ? "Pedido atrasado." : "Pedido em risco: entrega prevista para hoje.") : "Fluxo dentro do esperado.") + '</p><p>Status atual: ' + pedido.status + '</p></div>';
  html += '</section>';

  html += '<section class="panel"><div class="panel-head"><h3>Itens do pedido</h3></div><div class="table-wrap"><table><thead><tr><th>Produto</th><th>Quantidade</th><th>Unitário</th><th>Subtotal</th></tr></thead><tbody>';
  for (var j = 0; j < pedido.itens.length; j++) {
    html += '<tr><td>' + pedido.itens[j].nome + '</td><td>' + pedido.itens[j].qtd + '</td><td>' + moeda(pedido.itens[j].preco) + '</td><td>' + moeda(pedido.itens[j].preco * pedido.itens[j].qtd) + '</td></tr>';
  }
  html += '</tbody></table></div></section>';

  if (perfilAtual === "Cliente" && pedido.status !== "Expedido" && pedido.status !== "Em rota" && pedido.status !== "Entregue" && pedido.status !== "Cancelado" && pedido.status !== "Recusado") {
    html += '<div style="margin-top:16px;text-align:right"><button class="btn btn-danger" onclick="cancelarPedido(' + pedido.id + ')">Cancelar pedido</button></div>';
  }

  html += complementosPedido(pedido);
  html += '</main>';
  return html;
}

function montarEtapaTimeline(pedido, nomeEtapa, indice) {
  var concluida = false;
  var dataEtapa = "—";
  var indiceAtual = etapas.indexOf(pedido.status);

  for (var i = 0; i < pedido.timeline.length; i++) {
    if (pedido.timeline[i].etapa === nomeEtapa) {
      concluida = true;
      dataEtapa = formatarDataHora(pedido.timeline[i].data);
    }
  }

  var classe = "timeline-step";
  if (concluida) {
    classe += " done";
  }
  if (indice === indiceAtual) {
    classe += " current";
  }

  var html = "";
  html += '<div class="' + classe + '">';
  html += '<div class="timeline-dot">' + (concluida ? "✓" : (indice + 1)) + '</div>';
  html += '<strong>' + nomeEtapa + '</strong>';
  html += '<small>' + dataEtapa + '</small>';
  html += '</div>';
  return html;
}

function cancelarPedido(id) {
  var pedido=pegarPedido(id);
  if (perfilAtual !== "Cliente" || !podeVer(pedido) || ["Recebido","Aprovado","Em separação"].indexOf(pedido.status) === -1) { mostrarToast("Este pedido não pode ser cancelado."); return; }
  if (!confirm("Cancelar pedido #"+id+" e devolver os itens ao estoque?")) return;
  devolverEstoque(pedido); registrarStatus(pedido,"Cancelado"); mostrarToast("Pedido cancelado e estoque restituído."); renderizarSistema();
}

function telaComercial() {
  var html = '<main class="page">';
  html += '<div class="page-head"><div><span class="eyebrow">Comercial</span><h1>Pedidos aguardando decisão.</h1><p>Analise somente o necessário e encaminhe o pedido para a próxima etapa.</p></div></div>';
  html += '<section class="approval-grid">';

  var achou = false;
  for (var i = 0; i < pedidos.length; i++) {
    if (pedidos[i].status === "Recebido") {
      achou = true;
      html += '<article class="approval-card">';
      html += '<h3>Pedido #' + pedidos[i].id + '</h3>';
      html += '<p><strong>' + pedidos[i].cliente + '</strong><br>' + pedidos[i].itens.length + ' item(ns) · ' + moeda(totalDoPedido(pedidos[i])) + '<br>Previsão ' + formatarData(pedidos[i].previsao) + '</p>';
      html += '<div class="approval-actions">';
      html += '<button class="btn btn-primary" onclick="aprovarPedido(' + pedidos[i].id + ')">Aprovar</button>';
      html += '<button class="btn btn-secondary" onclick="abrirModalRecusa(' + pedidos[i].id + ')">Recusar</button>';
      html += '<button class="btn btn-ghost" onclick="abrirPedido(' + pedidos[i].id + ')">Detalhes</button>';
      html += '</div></article>';
    }
  }

  html += '</section>';

  if (!achou) {
    html += '<div class="empty"><h3>Nenhum pedido pendente.</h3><p>Todos os pedidos recebidos já foram analisados.</p></div>';
  }

  html += '</main>';
  return html;
}

function aprovarPedido(id) {
  var pedido=pegarPedido(id);
  if (perfilAtual !== "Comercial" || !pedido || pedido.status !== "Recebido") return;
  registrarStatus(pedido,"Aprovado"); mostrarToast("Pedido #"+id+" aprovado."); renderizarSistema();
}

function abrirModalRecusa(id) {
  if (perfilAtual !== "Comercial" || !pegarPedido(id) || pegarPedido(id).status !== "Recebido") return;
  var fundo = document.createElement("div");
  fundo.className = "modal-backdrop";
  fundo.innerHTML = '<div class="modal"><h3>Recusar pedido #' + id + '</h3><p>Informe um motivo curto para registrar a decisão.</p><textarea id="motivo-recusa" class="form-control" placeholder="Ex.: indisponibilidade de item..."></textarea><div class="modal-actions"><button id="fechar-modal" class="btn btn-secondary">Cancelar</button><button id="confirmar-recusa" class="btn btn-danger">Recusar pedido</button></div></div>';
  document.body.appendChild(fundo);

  document.getElementById("fechar-modal").onclick = function () {
    fundo.remove();
  };

  document.getElementById("confirmar-recusa").onclick = function () {
    var motivo = document.getElementById("motivo-recusa").value;
    if (motivo.trim() === "") {
      mostrarToast("Informe o motivo da recusa.");
      return;
    }
    var pedido = pegarPedido(id);
    if (pedido.status !== "Recebido") return;
    pedido.motivoRecusa = motivo.trim();
    devolverEstoque(pedido); registrarStatus(pedido,"Recusado");
    fundo.remove();
    mostrarToast("Pedido #" + id + " recusado.");
    renderizarSistema();
  };
}

function telaExpedicao() {
  var colunas = ["Aprovado", "Em separação", "Expedido", "Em rota", "Entregue"];
  var html = '<main class="page">';
  html += '<div class="page-head"><div><span class="eyebrow">Expedição</span><h1>Pedidos organizados por etapa.</h1><p>A fila prioriza a previsão mais próxima e facilita o avanço do fluxo.</p></div></div>';
  html += '<section class="kanban">';

  for (var c = 0; c < colunas.length; c++) {
    var nomeColuna = colunas[c];
    html += '<div class="kanban-col"><div class="kanban-title"><span>' + nomeColuna + '</span><span>' + contarPedidosNaColuna(nomeColuna) + '</span></div>';

    var lista = pedidos.slice().sort(function(a, b) {
      return new Date(a.previsao) - new Date(b.previsao);
    });

    for (var i = 0; i < lista.length; i++) {
      if (lista[i].status === nomeColuna) {
        html += '<article class="kanban-card">';
        html += '<strong>#' + lista[i].id + '</strong>';
        html += '<p>' + lista[i].cliente + '</p>';
        html += '<p>' + moeda(totalDoPedido(lista[i])) + ' · ' + formatarData(lista[i].previsao) + '</p>';
        if (lista[i].risco) {
          html += '<span class="risk">Prazo em atenção</span>';
        }
        if (nomeColuna !== "Entregue") {
          html += '<button class="btn btn-primary" onclick="avancarEtapa(' + lista[i].id + ')">Avançar etapa</button>';
        }
        html += '</article>';
      }
    }

    html += '</div>';
  }

  html += '</section></main>';
  return html;
}

function avancarEtapa(id) {
  var pedido=pegarPedido(id);
  if (perfilAtual !== "Expedição" || !pedido) return;
  var indice=etapas.indexOf(pedido.status);
  if (indice < 1 || indice >= etapas.length-1) return;
  if (etapas[indice+1] === "Entregue") { abrirEntrega(id); return; }
  registrarStatus(pedido,etapas[indice+1]); mostrarToast("Pedido #"+id+": "+pedido.status+"."); renderizarSistema();
}

function pegarProduto(id) {
  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].id === id) return produtos[i];
  }
  return null;
}

function pegarPedido(id) {
  for (var i = 0; i < pedidos.length; i++) {
    if (pedidos[i].id === id) return pedidos[i];
  }
  return null;
}

function contarStatus(lista) {
  var pedidos = lista || listaVisivel();
  var obj = {};
  for (var i = 0; i < pedidos.length; i++) {
    if (obj[pedidos[i].status] === undefined) {
      obj[pedidos[i].status] = 1;
    } else {
      obj[pedidos[i].status]++;
    }
  }
  return obj;
}

function contarPedidosNaColuna(nomeColuna) {
  var total = 0;
  for (var i = 0; i < pedidos.length; i++) {
    if (pedidos[i].status === nomeColuna) {
      total++;
    }
  }
  return total;
}

function quantidadeTotalCarrinho() {
  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    total += carrinho[i].qtd;
  }
  return total;
}

function totalCarrinho() {
  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    total += carrinho[i].qtd * carrinho[i].preco;
  }
  return total;
}

function totalDoPedido(pedido) {
  var total = 0;
  for (var i = 0; i < pedido.itens.length; i++) {
    total += pedido.itens[i].qtd * pedido.itens[i].preco;
  }
  return total;
}

function moeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(valor) {
  var data = new Date(valor.length === 10 ? valor+"T12:00:00" : valor);
  return data.toLocaleDateString("pt-BR");
}

function formatarDataHora(valor) {
  var data = new Date(valor);
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function badgeStatus(status, risco) {
  var classe = status.toLowerCase();
  classe = classe.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  classe = classe.replace(/ /g, "-");
  var html = '<span class="badge status-' + classe + '">' + status + '</span>';
  if (risco) {
    html += '<span class="risk">Prazo em atenção</span>';
  }
  return html;
}

function mostrarToast(texto) {
  toast.textContent = texto;
  toast.classList.add("show");
  clearTimeout(window.tempoToast);
  window.tempoToast = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

mostrarLogin();
