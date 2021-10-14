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

    // TODO multi dimension sort.
    for (const [name, { sort } ] of Object.entries(metrics)) {
        processedProducts.sort((a, b) => b[name] - a[name])
    }
    
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
        <label>${label}</label>
    
        <input 
            type="range" 
            .value=${sortValue} 
            onchange=${sliderChange(name, 'sort')} 
            min=${min} 
            max=${max}
        >

        </div>
    `)
}

const table = (products) => {
    return html`
    <table>
        <thead>
            <th>
                <td>Product</td>
            </th>
        </thead>
        <tbody>
            ${products.map(product => html`
                <tr>
                    <td>
                        ${product.name}
                    </td>
                </tr>
            `)}    
        </tbody>
    </table>
    `
}


const draw = (products) => {

    render(document.body, html`

        ${form(products)}
        ${table(products)}

    `)
}

draw(processProducts())