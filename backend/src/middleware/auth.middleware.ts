import { NextRequest } from "next/server";
import { UnauthorizedError, ForbiddenError } from "@/util/errors";
import { readToken } from "@/modules/auth/token";

export function authenticate(
 req: NextRequest | Request
){
 const header =
 req.headers.get("authorization");
 if(!header?.startsWith("Bearer ")){
   throw new UnauthorizedError(
     "Missing authentication token"
   );
 }
 const token = header.split(" ")[1];
 try{
   return readToken(token);
 }catch{
   throw new UnauthorizedError(
    "Invalid token"
   );
 }
}

export interface AuthUser {
  id: string;
  email: string;
  role: "CUSTOMER" | "OWNER" | "ADMIN";
}

export function authorize(
  user: AuthUser,
  roles: AuthUser["role"][]
) {
  if (!roles.includes(user.role)) {
    throw new ForbiddenError(
      "Insufficient permissions"
    );
  }
}