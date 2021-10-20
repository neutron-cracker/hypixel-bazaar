import { existsSync } from "https://deno.land/std/fs/mod.ts";

const dataJson = await Deno.readTextFile('./data.json')
const { products } = JSON.parse(dataJson)

const cacheJson = existsSync('./cache.json') ? await Deno.readTextFile('./cache.json') : JSON.stringify({ bazaartracker: {} })
const cache = JSON.parse(cacheJson)

const productIds = Object.keys(products).map(productId => productId.toLocaleLowerCase())

const getImageFromBazaarTracker = async (id: string) => {
    const response = await fetch(`https://bazaartracker.com/product/${id}`)
    const html = await response.text()
    const base64Images = html.match(/src="(data:image\/[^;]+;base64[^"]+)"/i)
    return base64Images?.[1]
}

const saveImage = (base64: string, id: string) => {
    const data = base64.split(',')
    const realBits = data[1].trim()
    const pixels = atob(realBits)
    const fileData = Uint8Array.from(pixels, c => c.charCodeAt(0))
    return Deno.writeFile(`./${id}.png`, fileData)
}

for (const productId of productIds) {
    let image
    // if (!(productId in cache.bazaartracker)) image = await getImageFromBazaarTracker(productId)

    // const image = await getImageFromBazaarTracker(productId)
    // if (image) await saveImage(image, productId)
}


Deno.writeTextFile(`./cache.json`, JSON.stringify(cache, null, 2))
