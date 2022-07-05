/*
  07

  - No index.html, comente a div com a classe "container" que contém a tabela;
  - Descomente: 
    - A <div> com a classe "container" abaixo da div que você acabou de 
      comentar;
    - A <link> que importa o style.css;
  - Construa uma aplicação de conversão de moedas. O HTML e CSS são os que 
    você está vendo no browser (após salvar os arquivos);
  - Você poderá modificar a marcação e estilos da aplicação depois. No momento, 
    concentre-se em executar o que descreverei abaixo;
    - Quando a página for carregada: 
      - Popule os <select> com tags <option> que contém as moedas que podem ser
        convertidas. "BRL" para real brasileiro, "EUR" para euro, "USD" para 
        dollar dos Estados Unidos, etc.
      - O option selecionado por padrão no 1º <select> deve ser "USD" e o option
        no 2º <select> deve ser "BRL";
      - O parágrafo com data-js="converted-value" deve exibir o resultado da 
        conversão de 1 USD para 1 BRL;
      - Quando um novo número for inserido no input com 
        data-js="currency-one-times", o parágrafo do item acima deve atualizar 
        seu valor;
      - O parágrafo com data-js="conversion-precision" deve conter a conversão 
        apenas x1. Exemplo: 1 USD = 5.0615 BRL;
      - O conteúdo do parágrafo do item acima deve ser atualizado à cada 
        mudança nos selects;
      - O conteúdo do parágrafo data-js="converted-value" deve ser atualizado à
        cada mudança nos selects e/ou no input com data-js="currency-one-times";
      - Para que o valor contido no parágrafo do item acima não tenha mais de 
        dois dígitos após o ponto, você pode usar o método toFixed: 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    - Para obter as moedas com os valores já convertidos, use a Exchange rate 
      API: https://www.exchangerate-api.com/;
      - Para obter a key e fazer requests, você terá que fazer login e escolher
        o plano free. Seus dados de cartão de crédito não serão solicitados.
*/
const exchangerateContainer = document.querySelector('.container')
const selectOne = document.querySelector('[data-js="currency-one"]')
const selectTwo = document.querySelector('[data-js="currency-two"]')
const paragraphConverted = document.querySelector('[data-js="converted-value"]')
const paragraphConvercion = document.querySelector('[data-js="conversion-precision"]')
const times = document.querySelector('[data-js="currency-one-times"]')

const apiKey = '1d0cef765035f56fa50737e9'

const getEndPointURL = currency =>
  `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`

const getFetchData = async url => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Não foi possível obter os dados')
    }

    return await response.json()
  } catch ({ name, message }) {
    alert(`${name}: ${message}`)
  }
}

const getTemplateOptions = (ratesProperty, selectedRate) => ratesProperty
  .map(rate =>
    `<option ${rate === selectedRate ? 'selected' : null}>${rate}</option>`)
  .join('')

const getTimes = ({ conversion_rates }) => {
  times.addEventListener('input', e => {
    paragraphConverted.textContent = (e.target.value * conversion_rates[selectTwo.value].toFixed(2))
  })

  return times
}

const getSelectTwo = ({ conversion_rates }) => {
  selectTwo.addEventListener('input', e => {
    const selectedTwoValue = conversion_rates[e.target.value]

    paragraphConverted.textContent = (selectedTwoValue * times.value).toFixed(2)
    paragraphConvercion.textContent =
      `1 ${selectOne.value} = ${1 * conversion_rates[selectTwo.value]} ${e.target.value}`
  })

  return selectTwo
}

const getSelectExchangerete = async () => {
  const { conversion_rates } = await getFetchData(getEndPointURL('USD'))
  const ratesProperty = Object.keys(conversion_rates)

  const insertTemplateOptions = selectedRate =>
    getTemplateOptions(ratesProperty, selectedRate)

  selectOne.innerHTML = insertTemplateOptions('USD')
  selectTwo.innerHTML = insertTemplateOptions('BRL')

  paragraphConverted.textContent = conversion_rates.BRL.toFixed(2)
  paragraphConvercion.textContent = `1 USD = ${conversion_rates.BRL.toFixed(2)} BRL`

  getTimes({ conversion_rates })
  getSelectTwo({ conversion_rates })
}

selectOne.addEventListener('input', async e => {
  const { conversion_rates } = await getFetchData(getEndPointURL(e.target.value))

  paragraphConverted.textContent = (conversion_rates[selectTwo.value] * times.value).toFixed(2)
  paragraphConvercion.textContent = `1 ${selectOne.value} = ${1 * conversion_rates[selectTwo.value]} ${selectTwo.value}`
})

getSelectExchangerete()