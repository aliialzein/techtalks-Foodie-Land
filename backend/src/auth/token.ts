import jwt from "jsonwebtoken";

export function createToken(userId: string, email: string, role: string) {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}

export function readToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    email: string;
    role: string;
  };
}