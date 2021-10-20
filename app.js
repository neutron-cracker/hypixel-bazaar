import {render, html, svg} from 'https://cdn.skypack.dev/uhtml/async'
import { Product } from './Product.js'
import { metrics } from './metrics.js'

const response = await fetch("data.json")
const { products: productsData } = await response.json()
const originalProducts = Object.values(productsData).map(productData => new Product(productData))

const processProducts = () => {
    let processedProducts = [...originalProducts]

    for (const [name, { filterValue, filter} ] of Object.entries(metrics)) {
        processedProducts = processedProducts.filter(product => {
            return product[name] > filterValue
        })

        metrics[name].min = Math.min(...originalProducts.map(product => product[name]))
        metrics[name].max = Math.max(...originalProducts.map(product => product[name]))
    }

    processedProducts.sort((a, b) => b.totalWeighted - a.totalWeighted)
    
    return processedProducts
}

const sliderChange = (name, type) => event => {
    metrics[name][type + 'Value'] = parseFloat(event.target.value)
    draw(processProducts())
}

const form = () => {

    return Object.entries(metrics).map(([ name, { filterValue, sortValue, label, min, max } ]) => html`
        <div class="slider">
        <label>${label}</label>
    
        <input 
            type="range" 
            .value=${filterValue} 
            onchange=${sliderChange(name, 'filter')} 
            min=${min} 
            max=${max}
        >

        </div>

        <div class="slider">
        <label>${label} weight</label>
    
        <input 
            type="range" 
            .value=${sortValue} 
            onchange=${sliderChange(name, 'sort')} 
            min="0.001"
            max="1"
            step="0.001"
        >

        </div>
    `)
}

const table = (products) => {
    return html`
        ${products.map(product => html`
            <div>
            ${product.name}
            </div>
        `)}    
    `
}


const draw = (products) => {

    render(document.body, html`

        ${form(products)}
        ${table(products)}

    `)
}

draw(processProducts())