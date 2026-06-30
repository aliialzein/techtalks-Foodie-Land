import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma"
import { RegistrationInput, LoginInput } from "./auth_schema"


async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}


function createToken(userId: string, email: string, role: string) {
  return jwt.sign(
    { id: userId, email, role },         
    process.env.JWT_SECRET!,              
    // { expiresIn: process.env.JWT_EXPIRES_IN }
    { expiresIn: "7d" }
  )
}

export function readToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string
    email: string
    role: string
  }
}

export async function register(data: RegistrationInput) {

  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new Error("Email already in use")

  const hashedPassword = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      name:     data.name,
      email:    data.email,
      password: hashedPassword,
      role:     data.role,
    },
  })

  const token = createToken(user.id, user.email, user.role)
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
}

export async function login(data: LoginInput) {

  const user = await prisma.user.findUnique({ where: { email: data.email } })

  if (!user) throw new Error("Invalid email please try again")

  const match = await bcrypt.compare(data.password, user.password)
  if (!match) throw new Error("Password is inccorect")

  const token = createToken(user.id, user.email, user.role)
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
}


export async function logout() {
  return { message: "Logged out. Delete your token on the client." }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  if (!user) throw new Error("User not found")
  return user
}