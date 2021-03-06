import { Handler } from "@netlify/functions";
import stripeInit from "stripe";

// @ts-expect-error
const stripe = stripeInit(process.env.STRIPE_SECRET_KEY || "");

const handler: Handler = async (event, context) => {
  if (event.httpMethod === "POST") {
    const body = new URLSearchParams(event.body || "");

    const price = parseInt(body.get("price") || "5", 10) * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Reaction Purchase",
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://reaction.fyreworks.us?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://reaction.fyreworks.us?canceled=true`,
    });
    return {
      statusCode: 303,

      headers: { location: session.url },
    };
  }
  return {
    statusCode: 404,
  };
};

export { handler };
