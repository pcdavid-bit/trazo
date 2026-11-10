var produtosBase = [
  { id: 1, nome: "Filé de Frango Congelado", categoria: "Congelados", unidade: "1 kg", preco: 18.90, estoque: 80, imagem: "frango.png" },
  { id: 2, nome: "Arroz Tipo 1", categoria: "Mercearia", unidade: "5 kg", preco: 27.90, estoque: 120, imagem: "arroz.png" },
  { id: 3, nome: "Feijão Carioca", categoria: "Mercearia", unidade: "1 kg", preco: 8.90, estoque: 75, imagem: "feijao.png" },
  { id: 4, nome: "Leite Integral", categoria: "Laticínios", unidade: "1 L", preco: 4.20, estoque: 150, imagem: "leite.png" },
  { id: 5, nome: "Óleo de Soja", categoria: "Mercearia", unidade: "900 ml", preco: 7.50, estoque: 64, imagem: "oleo.png" },
  { id: 6, nome: "Massa Espaguete", categoria: "Mercearia", unidade: "500 g", preco: 5.40, estoque: 88, imagem: "massa.png" },
  { id: 7, nome: "Molho de Tomate", categoria: "Molhos", unidade: "300 g", preco: 3.80, estoque: 96, imagem: "molho.png" },
  { id: 8, nome: "Café Torrado", categoria: "Bebidas", unidade: "500 g", preco: 17.90, estoque: 42, imagem: "cafe.png" },
  { id: 9, nome: "Açúcar Cristal", categoria: "Mercearia", unidade: "1 kg", preco: 5.20, estoque: 110, imagem: "acucar.png" },
  { id: 10, nome: "Farinha de Trigo", categoria: "Mercearia", unidade: "1 kg", preco: 6.30, estoque: 74, imagem: "farinha.png" }
];

var pedidosBase = [
  {
    id: 12345, cliente: "Padaria do João", data: "2026-10-18T14:30:00", previsao: "2026-10-21",
    status: "Em rota", noPrazo: true, risco: false,
    itens: [
      { produtoId: 1, nome: "Filé de Frango Congelado", qtd: 10, preco: 18.90 },
      { produtoId: 2, nome: "Arroz Tipo 1", qtd: 8, preco: 27.90 }
    ],
    timeline: [
      { etapa: "Recebido", data: "2026-10-18T14:30:00" },
      { etapa: "Aprovado", data: "2026-10-18T16:10:00" },
      { etapa: "Em separação", data: "2026-10-19T08:20:00" },
      { etapa: "Expedido", data: "2026-10-19T14:00:00" },
      { etapa: "Em rota", data: "2026-10-20T09:00:00" }
    ]
  },
  {
    id: 12344, cliente: "Mercado União", data: "2026-10-15T09:00:00", previsao: "2026-10-17",
    status: "Entregue", noPrazo: true, risco: false,
    itens: [{ produtoId: 4, nome: "Leite Integral", qtd: 40, preco: 4.20 }],
    timeline: [
      { etapa: "Recebido", data: "2026-10-15T09:00:00" },
      { etapa: "Aprovado", data: "2026-10-15T10:30:00" },
      { etapa: "Em separação", data: "2026-10-15T13:00:00" },
      { etapa: "Expedido", data: "2026-10-16T08:00:00" },
      { etapa: "Em rota", data: "2026-10-16T09:00:00" },
      { etapa: "Entregue", data: "2026-10-16T13:20:00" }
    ]
  },
  {
    id: 12343, cliente: "Restaurante Sabor", data: "2026-10-19T11:00:00", previsao: "2026-10-22",
    status: "Em separação", noPrazo: true, risco: false,
    itens: [{ produtoId: 3, nome: "Feijão Carioca", qtd: 20, preco: 8.90 }],
    timeline: [
      { etapa: "Recebido", data: "2026-10-19T11:00:00" },
      { etapa: "Aprovado", data: "2026-10-19T13:00:00" },
      { etapa: "Em separação", data: "2026-10-20T08:10:00" }
    ]
  },
  {
    id: 12342, cliente: "Empório da Vila", data: "2026-10-16T15:40:00", previsao: "2026-10-19",
    status: "Entregue", noPrazo: false, risco: false,
    itens: [{ produtoId: 8, nome: "Café Torrado", qtd: 15, preco: 17.90 }],
    timeline: [
      { etapa: "Recebido", data: "2026-10-16T15:40:00" },
      { etapa: "Aprovado", data: "2026-10-16T17:00:00" },
      { etapa: "Em separação", data: "2026-10-17T09:00:00" },
      { etapa: "Expedido", data: "2026-10-18T08:00:00" },
      { etapa: "Em rota", data: "2026-10-19T09:30:00" },
      { etapa: "Entregue", data: "2026-10-20T10:10:00" }
    ]
  },
  {
    id: 12341, cliente: "Hotel Boa Vista", data: "2026-10-20T08:50:00", previsao: "2026-10-23",
    status: "Aprovado", noPrazo: true, risco: false,
    itens: [{ produtoId: 9, nome: "Açúcar Cristal", qtd: 25, preco: 5.20 }],
    timeline: [
      { etapa: "Recebido", data: "2026-10-20T08:50:00" },
      { etapa: "Aprovado", data: "2026-10-20T10:05:00" }
    ]
  },
  {
    id: 12340, cliente: "Padaria Central", data: "2026-10-20T10:20:00", previsao: "2026-10-22",
    status: "Recebido", noPrazo: true, risco: false,
    itens: [{ produtoId: 7, nome: "Molho de Tomate", qtd: 30, preco: 3.80 }],
    timeline: [{ etapa: "Recebido", data: "2026-10-20T10:20:00" }]
  },
  {
    id: 12339, cliente: "Mercado São José", data: "2026-10-17T08:15:00", previsao: "2026-10-20",
    status: "Expedido", noPrazo: true, risco: true,
    itens: [{ produtoId: 5, nome: "Óleo de Soja", qtd: 18, preco: 7.50 }],
    timeline: [
      { etapa: "Recebido", data: "2026-10-17T08:15:00" },
      { etapa: "Aprovado", data: "2026-10-17T09:30:00" },
      { etapa: "Em separação", data: "2026-10-18T08:00:00" },
      { etapa: "Expedido", data: "2026-10-20T07:00:00" }
    ]
  },
  {
    id: 12338, cliente: "Restaurante Maná", data: "2026-10-20T12:00:00", previsao: "2026-10-24",
    status: "Recebido", noPrazo: true, risco: false,
    itens: [
      { produtoId: 6, nome: "Massa Espaguete", qtd: 12, preco: 5.40 },
      { produtoId: 10, nome: "Farinha de Trigo", qtd: 10, preco: 6.30 }
    ],
    timeline: [{ etapa: "Recebido", data: "2026-10-20T12:00:00" }]
  }
];
// Exemplos relativos ao dia da demonstração. Nenhum dado é persistido.
function dataLocal(data) {
  return data.getFullYear()+"-"+String(data.getMonth()+1).padStart(2,"0")+"-"+String(data.getDate()).padStart(2,"0");
}
var clientesBase = [
  {nome:"Padaria do João",endereco:"Rua das Padarias, 123, Linhares/ES",regiao:"Centro"},
  {nome:"Mercado União",endereco:"Avenida Central, 40, Linhares/ES",regiao:"Centro"},
  {nome:"Restaurante Sabor",endereco:"Rua das Flores, 210, Linhares/ES",regiao:"Norte"},
  {nome:"Empório da Vila",endereco:"Rua do Comércio, 75, Linhares/ES",regiao:"Sul"},
  {nome:"Hotel Boa Vista",endereco:"Avenida Lagoa, 300, Linhares/ES",regiao:"Norte"},
  {nome:"Padaria Central",endereco:"Rua Principal, 12, Linhares/ES",regiao:"Centro"},
  {nome:"Mercado São José",endereco:"Rua Sul, 58, Linhares/ES",regiao:"Sul"},
  {nome:"Restaurante Maná",endereco:"Rua da Estação, 90, Linhares/ES",regiao:"Norte"}
];
// Os endereços são fictícios. Agrupamento por região, sem roteirização geográfica.
for (var extra=0;extra<4;extra++) {
  pedidosBase.push({id:12337-extra,cliente:extra%2 ? "Mercado União":"Padaria do João",status:["Recebido","Aprovado","Em separação","Em rota"][extra],
    itens:[{produtoId:2,nome:"Arroz Tipo 1",qtd:3+extra,preco:27.9}],timeline:[]});
}
var etapasBase=["Recebido","Aprovado","Em separação","Expedido","Em rota","Entregue"];
for (var i=0;i<pedidosBase.length;i++) {
  var pedido=pedidosBase[i], cliente=clientesBase.find(function(c){return c.nome===pedido.cliente;});
  var criacao=new Date(); criacao.setDate(criacao.getDate()-5-(i%3)); criacao.setHours(8,0,0,0);
  var previsao=new Date(); previsao.setDate(previsao.getDate()+[2,-2,1,-3,3,2,0,4,-1,1,0,2][i]);
  pedido.data=criacao.toISOString();pedido.previsao=dataLocal(previsao);pedido.endereco=cliente.endereco;pedido.regiao=cliente.regiao;
  pedido.timeline=[];
  for (var etapa=0;etapa<=etapasBase.indexOf(pedido.status);etapa++) {
    var momento=new Date(criacao.getTime()+etapa*6*3600000);
    if(pedido.status==="Entregue"&&etapa===5) { momento=new Date();momento.setDate(momento.getDate()-(i===1?3:2));momento.setHours(14,0,0,0); }
    pedido.timeline.push({etapa:etapasBase[etapa],data:momento.toISOString()});
  }
  pedido.estoqueReservado=pedido.status!=="Entregue";pedido.risco=false;
  if(pedido.status==="Entregue") {pedido.recebedor="Responsável do estabelecimento (exemplo)";pedido.entregueEm=pedido.timeline[5].data;pedido.noPrazo=new Date(pedido.entregueEm)<=new Date(pedido.previsao+"T23:59:59");}
}
