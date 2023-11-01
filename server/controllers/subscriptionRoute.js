import { stripe } from "../utils/stripe.js"

export async function getPrices(req, res){
    try {
        const prices = await stripe.prices.list({
            apiKey: process.env.STRIPE_SK
        })
        res.status(200).json({ success: true, data: prices})
    } catch (error) {
        console.log('FAILED TO FETCH PRICES', error)
        res.status(500).json({ success: false, data: 'Failed to fetch Prices'})
    }
}