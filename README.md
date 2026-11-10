# Trazo — Do pedido à entrega

**Startup:** Trazo  
**Tema:** Tema 1 — Do pedido à entrega, do Grand Prix SENAI.

Site para organizar pedidos de uma indústria de alimentos: o cliente faz a compra, o comercial analisa o pedido e a expedição acompanha o envio até a entrega.

## Integrantes

- David de Jesus
- Arthur Rigoni
- Albert Agnezi
- Gustavo Graciotti

## Como usar

**Site publicado:** https://pcdavid-bit.github.io/trazo/

**Repositório:** https://github.com/pcdavid-bit/trazo

Para usar localmente, abra `index.html` no navegador.

1. Escolha o perfil **Cliente**, **Comercial** ou **Expedição**.
2. No perfil Cliente, selecione uma empresa de exemplo.
3. Use `aluno@trazo.com` e a senha `1234` para a demonstração.

O login é simulado. O protótipo não cria contas nem envia credenciais a um servidor.

Os dados ficam em memória, com **12 pedidos e 10 produtos de exemplo**. Atualizar a página restaura os dados iniciais. Para acompanhar o mesmo pedido entre os perfis, use **sair** e entre no outro perfil na mesma aba, sem atualizar a página.

## Tecnologias

HTML5, CSS3 e JavaScript puro. O site não precisa de instalação, framework, back-end ou banco de dados.

## Estrutura

- `index.html`: página principal do site.
- `style.css`: cores, estilos e adaptação para celular.
- `data.js`: produtos, clientes e pedidos de exemplo.
- `app.js`: telas, navegação e ações principais.
- `recursos.js`: prazos, notificações, rotas, recebimento e avaliação.
- Arquivos `.png`: logotipo e imagens dos produtos.
- Arquivos `.svg`: ícones utilizados no site.

## RFs implementados

| RF | Prioridade | Função |
|---|---|---|
| RF01 | Essencial | Login e menus por perfil |
| RF02 | Essencial | Catálogo completo |
| RF03 | Desejável | Busca e categoria |
| RF04 | Essencial | Carrinho e totais |
| RF05 | Essencial | Pedido sequencial e previsão |
| RF06 | Desejável | Validação de estoque |
| RF07 | Essencial | Pedidos do cliente |
| RF08 | Essencial | Histórico por etapa |
| RF09 | Essencial | Aprovação e recusa |
| RF10 | Desejável | Kanban da expedição |
| RF11 | Desejável | Prioridade por prazo |
| RF12 | Desejável | Alertas de prazo |
| RF13 | Desejável | Cancelamento antes da expedição |
| RF14 | Desejável | Agrupamento por região |
| RF15 | Desejável | Recebedor e horário da entrega |
| RF16 | Desejável | Avaliação e comentário |
| RF17 | Essencial | Indicadores da operação |
| RF18 | Desejável | Central de notificações |

## Paleta de cores

| Uso | Cor |
|---|---|
| Primária — estrutura | `#172B4D` |
| Secundária — navegação | `#3B67F2` |
| Destaque — ações | `#FF8A3D` |
| Fundo | `#F6F8FC` |
| Texto | `#20242C` |

## Regras do protótipo

- Pedidos recebem número sequencial e previsão de três dias corridos.
- O estoque é validado na inclusão, alteração e finalização da compra.
- Cancelamento e recusa devolvem a reserva ao estoque uma única vez.
- O cliente acompanha seus próprios pedidos; os perfis operacionais veem o conjunto.
- O cancelamento é permitido antes da expedição. A recusa exige um motivo.
- A confirmação da entrega exige o nome do recebedor.
- A avaliação exige nota de 1 a 5 e comentário.
- As rotas agrupam pedidos por região; não fazem otimização em mapas.

## Publicação no GitHub Pages

O site está publicado no GitHub Pages a partir da pasta raiz da branch `main`, sem etapa de compilação manual. Os arquivos usam caminhos relativos, compatíveis com a hospedagem em um repositório do GitHub Pages.

## Sobre o projeto

Projeto didático com dados fictícios. A autenticação é demonstrativa e os dados não persistem ao atualizar a página. O desenvolvimento e a revisão tiveram apoio de IA. O logotipo e as imagens foram mantidos do material original da equipe.
