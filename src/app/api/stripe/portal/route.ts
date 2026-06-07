import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { stripeCustomerId } = await req.json();

    if (!stripeCustomerId) {
      return new NextResponse('Customer ID is required', { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[STRIPE_PORTAL]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
