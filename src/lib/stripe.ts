import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey, {
          apiVersion: '2025-02-24.acacia' as any,
          appInfo: {
              name: 'Jelly Genetics Store',
              version: '1.0.0',
          },
      })
    : null
