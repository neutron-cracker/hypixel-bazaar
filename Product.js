export class Product {

    constructor (productData) {
        Object.assign(this, productData.quick_status)
    }

    get absoluteProfit () {
        return this.buyPrice - this.sellPrice
    }

    get name () {
        const name = this.productId.toLowerCase().replaceAll('_', ' ')
        return name[0].toUpperCase() + name.substr(1)
    }

    get instantVsOrderRatio () {
        if (!this.sellVolume || !this.buyOrders || !this.buyVolume || !this.sellOrders) return 0
        return this.sellVolume / this.buyOrders * (this.buyVolume / this.sellOrders)
    }
}