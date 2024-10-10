const searchForm = document.querySelector('.search_form')
const productList = document.querySelector('.product_list')
const priceChart = document.querySelector('#priceChart')

let myChart = ''
searchForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    const inputValue = event.target[0].value

    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`)
    const data = await response.json()
    const products = data.results.slice(0, 10)

    displayItems(products)
    updatePriceChart(products)
})

function displayItems(products) {
    console.log(products)
    productList.innerHTML = products.map(product => `
        <div class="product_card">
            <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p classe="product_price">${product.price.toLocaleString('pt-BR', { style: "currency", currency: 'BRL' })}</p>
            <p classe="product_store">${product.seller.nickname}</p>
        </div>
    `).join('')
}

function updatePriceChart(products) {
    const ctx = priceChart.getContext('2d')

    if (myChart) {
        myChart.destroy()
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(product => product.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'Preço',
                data: products.map(product => product.price),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Preço Certo',
                            font: {
                                size: 18
                            }
                        }
                    }
                }
            }
        }

    })

}