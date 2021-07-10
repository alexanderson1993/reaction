import { Handler } from "@netlify/functions";
import { client, handleFaunaResponse } from "./helpers/fauna";
import { getSelf, login } from "./helpers/faunaActions";
import { getCookie, serializeCookie } from "./helpers/serializeCookie";
import { User } from "./helpers/types";
import cookie from "cookie";
const handler: Handler = async (event, context) => {
  console.log("Lets go");
  try {
    if (event.httpMethod !== "GET") throw new Error("Invalid HTTP Method");

    console.log(cookie.parse(event.headers.cookie || ""));
    return {
      statusCode: 200,
      body: "{}",
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message, type: err.type }),
    };
  }
};

export { handler };
