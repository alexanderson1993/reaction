import { Handler } from "@netlify/functions";
import { client, handleFaunaResponse } from "./helpers/fauna";
import { getSelf, login } from "./helpers/faunaActions";
import { serializeCookie } from "./helpers/serializeCookie";
import { User } from "./helpers/types";

async function validateCredentials(
  email: string | null,
  password: string | null
) {
  if (!email) throw { type: "email", message: "Email must not be blank." };
  if (!password)
    throw { type: "password", message: "Password must not be blank." };
  try {
    const result = await handleFaunaResponse<{}, { secret: string }>(
      client.query(login({ email, password }))
    );
    const { secret } = result;
    const userResult = await handleFaunaResponse<User>(
      client.query(getSelf(), { secret })
    );
    return { ...userResult.data, secret };
  } catch (err) {
    if (err.message === "Unauthorized")
      throw new Error("Invalid username/password combination.");
    throw err;
  }
}

const handler: Handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") throw new Error("Invalid HTTP Method");

    const { email, password } = JSON.parse(event.body || "");
    let { secret, ...user } = await validateCredentials(email, password);
    const cookie = serializeCookie(secret);
    return {
      statusCode: 200,
      headers: { "Set-Cookie": cookie },
      body: JSON.stringify(user),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message, type: err.type }),
    };
  }
};

export { handler };
