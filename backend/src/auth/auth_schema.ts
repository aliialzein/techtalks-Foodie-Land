import {z} from "zod"

export type RegistrationInput = {
  name:string
  email:string
  password:string
  role?: "CUSTOMER" | "OWNER" | "ADMIN"
}

export type LoginInput={
  email:string
  password:string
}

export const registerSchema = z.object({
  name: z.string(),

  email: z.string().email("SEnter a valid email"),

  password: z.string(),
  role: z.enum(["CUSTOMER","OWNER","ADMIN"]).optional().default("CUSTOMER")
})

export const loginSchema = z.object({

  email: z.string().email("SEnter a valid email"),

  password: z.string(),
})