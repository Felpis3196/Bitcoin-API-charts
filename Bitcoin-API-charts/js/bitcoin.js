//Vamos consumir a API sobre o mercado de bitcoin, que retorna dados sobre compra e venda
// https://www.mercadobitcoin.net/api/BTC/trades/


// LER API COINBASE E PEGAR DADOS .JSON
async function carregarDados() {
  //ocultar a div erro se visivel
  const divErro = document.getElementById('div-erro')
  divErro.style.display = 'none'

  //chamando a API para obter dados
  await fetch('https://www.mercadobitcoin.net/api/BTC/trades/')   //chamando o endereço da api
    .then(response => response.json())                          //obtendo a resposta formatando como json
    .then(dados => prepararDados(dados))                        //chamando a função para gerar html dinâmico
    .catch(e => exibirErro(e.message));                         //exibindo erro na div-erro (se houver)
}

//função para mostrar o erro (quando ocorrer)

function exibirErro(mensagem) {
  let divErro = document.getElementById('div-erro')
  divErro.innerHTML = '<b>Erro ao acessar a API</b><br />' + mensagem;
  divErro.style.display = 'block'
}

//função para preparar os dados e gerar o html dinâmico
function prepararDados(dados) {
  // só faz alguma coisa se tiver dados
  if (dados.length > 0) {
    dados_linha = [['Índice', 'Preço',]];
    dados_pizza = [['Negociação', 'Volume']];

    //criando variaveis para acumular vendas e compras
    let vendas = 0
    let compras = 0

    //laço for para percorrer todos os dados

    for (let i = 0; i < dados.length; i++) {
      //se o registro atua for de sell 
      if (dados[i].type == 'sell') {
        //incluir os dados na var do gráfico de linhas
        dados_linha.push(
          [
            new Date(dados[i].date*1000),
            dados[i].price
          ]
        );
        //acumular o total de vendas
        vendas += dados[i].amount
      }
      else {
        compras += dados[i].amount
      }
    } // fim do for

    //inserindo os totais acumulados nos graficos
    dados_pizza.push(['Compras', compras])
    dados_pizza.push(['Vendas', vendas])

    //redesenhar os graficos com os novos dados
    drawLines()
    drawPizza()

  }//fim do if (se houver dados)
}//fim da function



//---------------------------DESENHANDO OS GRAFICOS---------------------------
// variaveis globais para os dados dos graficos
var dados_linha = [
  ['Índice', 'Preço',],
  ['0', 0]
]

var dados_pizza = [
  ['Negociação', 'Volume'],
  ['0', 0]
]


// GRAFICO DE LINHAS - variação de preços
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawLines);

function drawLines() {
  let data = google.visualization.arrayToDataTable(dados_linha);

  let options = {
    title: 'Bitcoin Price Chart',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  let chart = new google.visualization.LineChart(document.getElementById('grafico-precos'));

  chart.draw(data, options);
}


// GRAFICO DE PIZZA - volume

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawPizza);

function drawPizza() {

  let data = google.visualization.arrayToDataTable(dados_pizza);

  let options = {
    title: 'My Daily Activities'
  };

  let chart = new google.visualization.PieChart(document.getElementById('grafico-volume'));

  chart.draw(data, options);
}


