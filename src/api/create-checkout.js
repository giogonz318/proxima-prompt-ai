export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  const origin =
    req.headers.origin ||
    req.headers.referer ||
    'https://app.base44.com';

  try {
    const { tier } = req.body;

    const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
    const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

    if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
      return res.status(500).json({
        error: 'Missing Square credentials',
      });
    }

    const tierConfig = {
      centauri: {
        name: 'Proxima Centauri Plan',
        amount: 1900,
        note: 'Centauri monthly subscription',
      },
      andromeda: {
        name: 'Proxima Andromeda Plan',
        amount: 3900,
        note: 'Andromeda monthly subscription',
      },
    };

    const config = tierConfig[tier];

    if (!config) {
      return res.status(400).json({ error: 'Invalid tier' });
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
      return res.status(500).json({
        error: data?.errors?.[0]?.detail || 'Square error',
      });
    }

    return res.status(200).json({
      checkoutUrl: data.payment_link?.url,
    });
  } catch (err) {
    console.error('Checkout error:', err);

    return res.status(500).json({
      error: err.message || 'Server error',
    });
  }
}