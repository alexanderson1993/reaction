import { q } from "./fauna";
import { User } from "./types";

export function signUp({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}) {
  return q.Create(q.Collection("users"), {
    credentials: { password },
    data: { displayName, email },
  });
}
export function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return q.Login(q.Match(q.Index("users_by_email"), email), {
    password,
    ttl: q.TimeAdd(q.Now(), 30, "day"),
  });
}

export function logout() {
  return q.Logout(true);
}

export function changePassword(email: string, password: string) {
  return q.Update(q.Match(q.Index("users_by_email"), email), {
    credentials: { password },
  });
}

export function getSelf() {
  return q.Get(q.CurrentIdentity());
}

export function updateSelf(update: Partial<Omit<User, "secret">>) {
  return q.Update(q.CurrentIdentity(), {
    data: update,
  });
}
