import { Handler } from "@netlify/functions";
import stripeInit from "stripe";
import gameData from "./gameData.json";

const stripe = new stripeInit(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2020-08-27",
});

const handler: Handler = async (event, context) => {
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}") as {
        sessionId?: string;
        email?: string;
      };
      const { sessionId, email } = body;
      let customerName!: string;
      if (sessionId) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session?.customer) throw new Error("Session doesn't exist.");
        const customer = await stripe.customers.retrieve(
          session.customer.toString()
        );
        customerName = customer.deleted ? "" : customer.name || "";
      }
      if (email) {
        const customers = await stripe.customers.list({ email });
        customerName = customers.data?.[0]?.name || "";
      }
      if (!customerName) throw new Error("Customer doesn't exist.");
      return {
        statusCode: 200,
        body: JSON.stringify({
          customerName,
          gameData,
        }),
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: err.message }),
        };
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Unknown Error." }),
      };
    }
  }
  return {
    statusCode: 404,
  };
};

export { handler };
