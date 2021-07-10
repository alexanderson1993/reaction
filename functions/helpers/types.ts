export interface User {
  displayName: string;
  email: string;
  bio?: string;
  profileUrl?: string;
  secret: string;
  isAdmin?: boolean;
}
