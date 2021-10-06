import {render, html, svg} from 'https://cdn.skypack.dev/uhtml/async'
import { Product } from './Product.js'

const response = await fetch("data.json")
const { products: productsData } = await response.json()
const originalProducts = Object.values(productsData).map(productData => new Product(productData))

const metrics = {
    absoluteProfit: { value: 0, sort: true, filter: true },
    instantVsOrderRatio: { value: 0, sort: true, filter: true  }
}

const processProducts = () => {
    let processedProducts = [...originalProducts]

    for (const [name, { value, filter} ] of Object.entries(metrics)) {
        if (filter) {
            processedProducts = processedProducts.filter(product => {
                return product[name] > value
            })
        }
    }

    // TODO multi dimension sort.
    for (const [name, { value, sort} ] of Object.entries(metrics)) {
        if (sort) {
            processedProducts.sort((a, b) => b[name] - a[name])
        }
    }
    
    return processedProducts
}

const draw = (products) => {

    const form = (products) => {

        const onchange = name => event => {
            metrics[name].value = parseFloat(event.target.value)
            draw(processProducts())
        }

        return Object.entries(metrics).map(([ name, { value } ]) => html`
            <input 
                type="range" 
                .value=${value} 
                onchange=${onchange(name)} 
                min=${Math.min(...originalProducts.map(product => product[name]))} 
                max=${Math.max(...originalProducts.map(product => product[name]))}
            >
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

    render(document.body, html`

        ${form(products)}
        ${table(products)}

    `)
}

draw(processProducts())