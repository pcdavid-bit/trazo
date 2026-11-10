function escapar(valor) {
  return String(valor == null ? "" : valor).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});
}
function listaVisivel() { return pedidos.filter(function(p){return perfilAtual!=="Cliente"||p.cliente===clienteAtual;}); }
function podeVer(p) { return !!p && !!perfilAtual && (perfilAtual!=="Cliente"||p.cliente===clienteAtual); }
function atualizarPrazos() {
  var hoje=dataLocal(new Date());
  pedidos.forEach(function(p){
    var ativo=["Entregue","Recusado","Cancelado"].indexOf(p.status)===-1;
    p.atrasado=ativo&&p.previsao<hoje;p.risco=ativo&&p.previsao<=hoje;
    if(p.status==="Entregue") p.noPrazo=new Date(p.entregueEm||p.timeline[p.timeline.length-1].data)<=new Date(p.previsao+"T23:59:59");
  });
}
function notificar(p,etapa) { notificacoes.unshift({pedidoId:p.id,cliente:p.cliente,texto:"Pedido #"+p.id+": "+etapa,data:new Date().toISOString()}); }
function registrarStatus(p,status) {p.status=status;p.timeline.push({etapa:status,data:new Date().toISOString()});notificar(p,status);}
function devolverEstoque(p) {
  if(!p.estoqueReservado)return;
  p.itens.forEach(function(i){var produto=pegarProduto(i.produtoId);if(produto)produto.estoque+=i.qtd;});
  p.estoqueReservado=false;
}
function telaNotificacoes() {
  var lista=notificacoes.filter(function(n){return perfilAtual!=="Cliente"||n.cliente===clienteAtual;});
  var html='<main class="page"><div class="page-head"><div><span class="eyebrow">Notificações</span><h1>Atualizações dos pedidos</h1><p>Mudanças realizadas durante esta sessão.</p></div></div><section class="order-list">';
  if(!lista.length)html+='<div class="empty"><h3>Nenhuma atualização nesta sessão.</h3><p>Novos pedidos e mudanças de status aparecerão aqui.</p></div>';
  lista.forEach(function(n){html+='<article class="order-card"><div><h3>'+escapar(n.texto)+'</h3><p>'+formatarDataHora(n.data)+'</p></div><button class="btn btn-secondary" onclick="abrirPedido('+n.pedidoId+')">Ver pedido</button></article>';});
  return html+'</section></main>';
}
function telaRotas() {
  var regioes=["Centro","Norte","Sul"];
  var html='<main class="page"><div class="page-head"><div><span class="eyebrow">Expedição</span><h1>Pedidos por região</h1><p>Agrupamento para organizar as entregas. Dentro de cada região, vence primeiro quem tem o menor prazo.</p></div></div>';
  regioes.forEach(function(regiao){
    var lista=pedidos.filter(function(p){return p.regiao===regiao&&["Aprovado","Em separação","Expedido","Em rota"].indexOf(p.status)!==-1;}).sort(function(a,b){return a.previsao.localeCompare(b.previsao);});
    html+='<section class="panel route-panel"><h2>'+regiao+' <small>('+lista.length+')</small></h2><div class="order-list">';
    if(!lista.length)html+='<p>Sem pedidos nesta região.</p>';
    lista.forEach(function(p){html+='<article class="order-card"><div><h3>#'+p.id+' · '+escapar(p.cliente)+'</h3><p>'+escapar(p.endereco)+'</p><p>Previsão: '+formatarData(p.previsao)+'</p></div>'+badgeStatus(p.status,p.risco)+'<button class="btn btn-secondary" onclick="abrirPedido('+p.id+')">Detalhes</button></article>';});
    html+='</div></section>';
  });return html+'</main>';
}
function modalFormulario(titulo,conteudo,confirmar) {
  fecharModal();var fundo=document.createElement('div');fundo.id='modal-formulario';fundo.className='modal-backdrop';
  fundo.innerHTML='<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo"><h3 id="modal-titulo">'+escapar(titulo)+'</h3>'+conteudo+'<div class="modal-actions"><button class="btn btn-secondary" id="modal-cancelar">Cancelar</button><button class="btn btn-primary" id="modal-confirmar">Confirmar</button></div></section>';
  document.body.appendChild(fundo);document.getElementById('modal-cancelar').onclick=fecharModal;document.getElementById('modal-confirmar').onclick=confirmar;
  var campo=fundo.querySelector('input,select,textarea');if(campo)campo.focus();
}
function fecharModal() {var modal=document.getElementById('modal-formulario');if(modal)modal.remove();}
function abrirEntrega(id) {
  modalFormulario('Confirmar entrega #'+id,'<label for="recebedor">Nome de quem recebeu</label><input id="recebedor" maxlength="100" class="form-control" placeholder="Nome completo">',function(){confirmarEntrega(id,document.getElementById('recebedor').value);});
}
function confirmarEntrega(id,nome) {
  var p=pegarPedido(id);
  if(perfilAtual!=="Expedição"||!p||p.status!=="Em rota")return;
  if(!nome.trim()||nome.trim().length<2){mostrarToast('Informe o nome de quem recebeu.');return;}
  p.recebedor=nome.trim();p.entregueEm=new Date().toISOString();p.estoqueReservado=false;registrarStatus(p,'Entregue');fecharModal();mostrarToast('Entrega confirmada.');renderizarSistema();
}
function abrirAvaliacao(id) {
  var p=pegarPedido(id);if(perfilAtual!=="Cliente"||!podeVer(p)||p.status!=="Entregue"||p.avaliacao)return;
  modalFormulario('Avaliar entrega #'+id,'<label for="nota-entrega">Nota</label><select id="nota-entrega" class="form-control"><option value="">Escolha de 1 a 5 estrelas</option><option value="1">1 estrela</option><option value="2">2 estrelas</option><option value="3">3 estrelas</option><option value="4">4 estrelas</option><option value="5">5 estrelas</option></select><label for="comentario-entrega">Comentário</label><textarea id="comentario-entrega" class="form-control" maxlength="500" placeholder="Como foi a entrega?"></textarea>',function(){salvarAvaliacao(id,Number(document.getElementById('nota-entrega').value),document.getElementById('comentario-entrega').value);});
}
function salvarAvaliacao(id,nota,comentario) {
  var p=pegarPedido(id);if(perfilAtual!=="Cliente"||!podeVer(p)||p.status!=="Entregue"||p.avaliacao)return;
  if(!Number.isInteger(nota)||nota<1||nota>5||!comentario.trim()){mostrarToast('Escolha de 1 a 5 estrelas e escreva um comentário.');return;}
  p.avaliacao={nota:nota,comentario:comentario.trim(),data:new Date().toISOString()};fecharModal();mostrarToast('Avaliação registrada. Obrigado!');renderizarSistema();
}
function complementosPedido(p) {
  var html='';
  if(p.motivoRecusa) html+='<section class="panel route-panel"><h3>Motivo da recusa</h3><p>'+escapar(p.motivoRecusa)+'</p></section>';
  if(p.status==='Cancelado'||p.status==='Recusado')html+='<p>Encerrado em '+formatarDataHora(p.timeline[p.timeline.length-1].data)+'. Os itens reservados voltaram ao estoque.</p>';
  if(p.recebedor)html+='<section class="panel route-panel"><h3>Comprovante da entrega</h3><p>Recebido por '+escapar(p.recebedor)+'</p><p>'+formatarDataHora(p.entregueEm)+'</p></section>';
  if(p.avaliacao)html+='<section class="panel route-panel"><h3>Avaliação: '+p.avaliacao.nota+' de 5 estrelas</h3><p>'+escapar(p.avaliacao.comentario)+'</p></section>';
  else if(perfilAtual==='Cliente'&&p.status==='Entregue')html+='<button class="btn btn-primary route-panel" onclick="abrirAvaliacao('+p.id+')">Avaliar entrega</button>';
  return html;
}
