import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia' as any, // Cast to any to bypass version mismatch if necessary, or use the literal type expected
});
