// Idempotent demo seed. Safe to run repeatedly.
//
//   npx prisma db seed
//
// Creates:
//   - an OWNER account that owns "Demo Diner" (for the owner panel)
//   - a CUSTOMER account with one order at Demo Diner
//   - an ADMIN account (for the restaurant approval panel)
//
// The generated Prisma client is CommonJS, so we load it (and bcryptjs) via
// createRequire. Prisma's CLI loads .env before running this, so DATABASE_URL
// is already set.

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("../src/generated/prisma/index.js");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const OWNER_EMAIL = "owner@foodieland.test";
const OWNER_PASSWORD = "owner1234";
const CUSTOMER_EMAIL = "demo@foodieland.test";
const CUSTOMER_PASSWORD = "demo1234";
const ADMIN_EMAIL = "admin@foodieland.test";
const ADMIN_PASSWORD = "admin1234";

async function upsertUser(email, name, role, plainPassword) {
  const password = await bcrypt.hash(plainPassword, 10);
  return prisma.user.upsert({
    where: { email },
    update: { role },
    create: { name, email, password, role },
  });
}

async function ensureFood(restaurantId, name, price) {
  const existing = await prisma.food.findFirst({ where: { restaurantId, name } });
  if (existing) return existing;
  return prisma.food.create({ data: { restaurantId, name, price } });
}

async function main() {
  const owner = await upsertUser(OWNER_EMAIL, "Demo Owner", "OWNER", OWNER_PASSWORD);
  const customer = await upsertUser(
    CUSTOMER_EMAIL,
    "Demo Customer",
    "CUSTOMER",
    CUSTOMER_PASSWORD,
  );
  await upsertUser(ADMIN_EMAIL, "Demo Admin", "ADMIN", ADMIN_PASSWORD);

  // Demo Diner is owned by the owner account (reassign if it already exists).
  let restaurant = await prisma.restaurant.findFirst({
    where: { name: "Demo Diner" },
  });
  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: {
        ownerId: owner.id,
        name: "Demo Diner",
        description: "Seeded demo restaurant",
      },
    });
  } else if (restaurant.ownerId !== owner.id) {
    restaurant = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { ownerId: owner.id },
    });
  }

  const burger = await ensureFood(restaurant.id, "Classic Burger", 10.5);
  const fries = await ensureFood(restaurant.id, "Fries", 5.25);

  // Only create an order if this customer has none yet (keeps re-runs clean).
  const existingOrder = await prisma.order.findFirst({
    where: { userId: customer.id },
  });
  if (!existingOrder) {
    const items = [
      { foodId: burger.id, nameSnapshot: burger.name, priceSnapshot: burger.price, quantity: 2 },
      { foodId: fries.id, nameSnapshot: fries.name, priceSnapshot: fries.price, quantity: 1 },
    ];
    const totalPrice =
      Math.round(items.reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0) * 100) / 100;

    await prisma.order.create({
      data: {
        userId: customer.id,
        restaurantId: restaurant.id,
        status: "PREPARING",
        totalPrice,
        items: { create: items },
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log(`   Owner login    → ${OWNER_EMAIL} / ${OWNER_PASSWORD}`);
  console.log(`   Customer login → ${CUSTOMER_EMAIL} / ${CUSTOMER_PASSWORD}`);
  console.log(`   Admin login    → ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`   Restaurant: ${restaurant.name} (${restaurant.id}) owned by ${owner.id}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });