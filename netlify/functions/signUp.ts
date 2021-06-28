import { Handler } from "@netlify/functions";
import { client, handleFaunaResponse } from "./helpers/fauna";
import { signUp, login, getSelf } from "./helpers/faunaActions";
import { serializeCookie } from "./helpers/serializeCookie";
import { User } from "./helpers/types";

const handler: Handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") throw new Error("Invalid HTTP Method");

    const { email, password } = JSON.parse(event.body || "");
    let { secret, ...user } = await validateCredentials({
      email: email.trim(),
      password,
    });
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

async function validateCredentials({
  displayName,
  email,
  password,
}: {
  displayName?: string | null;
  email: string | null;
  password: string | null;
}) {
  if (!email) throw { type: "email", message: "Email must not be blank." };
  if (!password)
    throw { type: "password", message: "Password must not be blank." };

  try {
    // First create a new user; this will throw if there is a failure.
    await handleFaunaResponse<User>(
      client.query(
        signUp({ displayName: displayName || email, email, password })
      )
    );

    // Log the user in
    const result = await handleFaunaResponse<{}, { secret: string }>(
      client.query(login({ email, password }))
    );
    const { secret } = result;
    const userResult = await handleFaunaResponse<User>(
      client.query(getSelf(), { secret })
    );
    return { ...userResult.data, secret };
  } catch (err) {
    if (err.message === "document is not unique.") {
      throw { type: "email", message: "Email address already exists." };
    } else {
      throw err;
    }
  }
}
