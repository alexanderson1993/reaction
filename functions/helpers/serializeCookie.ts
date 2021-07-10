import cookie from "cookie";
// @ts-expect-error
import encrypter from "cookie-encrypter";

const secret = (process.env.COOKIE_SECRETS || "").padEnd(32, "5").slice(0, 32);
export function serializeCookie(value: string) {
  const hour = 3600000;
  const twoWeeks = 14 * 24 * hour;
  const myCookie = cookie.serialize(
    "fyreworks_auth",
    encrypter.encryptCookie(value, { key: secret }),
    {
      secure: true,
      httpOnly: true,
      path: "/",
      maxAge: twoWeeks,
    }
  );
  return myCookie;
}

export function getCookie(cookie: string) {
  return encrypter.decryptCookie(cookie, { key: secret });
}
