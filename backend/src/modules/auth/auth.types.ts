export type RegistrationInput = {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "OWNER" | "ADMIN";
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthResult = {
  token: string;
  user: AuthUser;
};