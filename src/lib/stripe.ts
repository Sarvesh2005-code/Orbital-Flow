import Stripe from 'stripe';

// Use a fallback string to prevent "next build" from crashing if the env var is missing
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build_only', {
  apiVersion: '2026-03-25.dahlia' as any, // Cast to any to bypass version mismatch if necessary, or use the literal type expected
});
