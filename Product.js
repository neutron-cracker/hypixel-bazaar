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

    get totalWeighted () {
        return Object.keys(metrics).reduce((total, currentMetricKey) => {
            return total + this[currentMetricKey + 'Weighted'] * metrics[currentMetricKey].sortValue
        }, 0)
    }
}

for (const metric of Object.keys(metrics)) {
    Object.defineProperty(Product.prototype, metric + 'Weighted', {
        get () {
            const normalizedTotal = metrics[metric].max - metrics[metric].min
            const normalizedValue = this[metric] - metrics[metric].min
            return normalizedValue / normalizedTotal
        }
    })
}
