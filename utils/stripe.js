const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

exports.pay = async (success_url, cancel_url) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url,
        cancel_url
    })
    return session
}