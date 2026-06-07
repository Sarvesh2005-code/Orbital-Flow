import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse('User id is required', { status: 400 });
    }

    await adminDb.collection('users').doc(session.metadata.userId).update({
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      subscriptionStatus: 'active',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const userSnapshot = await adminDb
      .collection('users')
      .where('stripeSubscriptionId', '==', subscription.id)
      .limit(1)
      .get();

    if (!userSnapshot.empty) {
      const user = userSnapshot.docs[0];
      await user.ref.update({
        subscriptionStatus: subscription.status === 'active' ? 'active' : (subscription.status === 'canceled' ? 'canceled' : 'past_due'),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  return new NextResponse('Webhook processed', { status: 200 });
}
