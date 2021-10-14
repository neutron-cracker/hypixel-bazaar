import { metrics } from "./metrics.js"

export class Product {

    constructor (productData) {
        Object.assign(this, productData.quick_status)
    }

    get name () {
        const name = this.productId.toLowerCase().replaceAll('_', ' ')
        return name[0].toUpperCase() + name.substr(1)
    }

    get absoluteProfit () {
        return this.buyPrice - this.sellPrice
    }

    get instantVsOrderRatio () {
        if (!this.sellVolume || !this.buyOrders || !this.buyVolume || !this.sellOrders) return 0
        return this.sellVolume / this.buyOrders * (this.buyVolume / this.sellOrders)
    }

    // get totalWeighted () {
    //     instantVsOrderWeighted * sliderwok + absoluteProfitWeighted * slider
    // }
}

for (const [name, metric] of Object.entries(metrics)) {
    Object.defineProperty(Product.prototype, name + 'Weighted', {
        get () {
            const normalizedTotal = metrics[name].max - metrics[name].min
            const normalizedValue = this[name] - metrics[name].min
            return normalizedValue / normalizedTotal
        }
    })
}
