export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  const origin =
    req.headers.get('Origin') ||
    req.headers.get('origin') ||
    'https://app.base44.com';

  try {
    const { tier } = await req.json();

    const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_LOCATION_ID');

    if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
      console.error('Missing Square credentials');
      return new Response(
        JSON.stringify({ error: 'Missing Square credentials' }),
        { status: 500 }
      );
    }

    const tierConfig = {
      centauri: {
        name: 'Centauri Plan',
        amount: 1900,
        note: 'Centauri monthly subscription',
      },
      andromeda: {
        name: 'Andromeda Plan',
        amount: 3900,
        note: 'Andromeda monthly subscription',
      },
    };

    const config = tierConfig[tier];

    if (!config) {
      return new Response(JSON.stringify({ error: 'Invalid tier' }), {
        status: 400,
      });
    }

    const idempotencyKey = `${tier}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    const body = {
      idempotency_key: idempotencyKey,
      description: config.note,
      quick_pay: {
        name: config.name,
        price_money: {
          amount: config.amount,
          currency: 'USD',
        },
        location_id: SQUARE_LOCATION_ID,
      },
      checkout_options: {
        redirect_url: `${origin}/payment-success?tier=${tier}`,
      },
      payment_note: config.note,
    };

    const response = await fetch(
      'https://connect.squareup.com/v2/online-checkout/payment-links',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Square-Version': '2024-01-18',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Square error:', data);
      return new Response(
        JSON.stringify({
          error: data.errors?.[0]?.detail || 'Square error',
        }),
        { status: 500 }
      );
    }

    const checkoutUrl = data.payment_link?.url;

    return new Response(JSON.stringify({ checkoutUrl }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('Checkout error:', err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}