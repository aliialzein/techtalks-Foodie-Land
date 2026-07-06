// Idempotent demo seed: creates a demo customer with one order so the
// frontend Orders page has something to show. Safe to run repeatedly.
//
//   npx prisma db seed
//
// The generated Prisma client is CommonJS, so we load it (and bcryptjs) via
// createRequire. Prisma's CLI loads .env before running this, so DATABASE_URL
// is already set.

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("../src/generated/prisma/index.js");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@foodieland.test";
const DEMO_PASSWORD = "demo1234";

async function ensureFood(restaurantId, name, price) {
  const existing = await prisma.food.findFirst({ where: { restaurantId, name } });
  if (existing) return existing;
  return prisma.food.create({ data: { restaurantId, name, price } });
}

async function main() {
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: { name: "Demo Customer", email: DEMO_EMAIL, password, role: "CUSTOMER" },
  });

  let restaurant = await prisma.restaurant.findFirst({
    where: { name: "Demo Diner", ownerId: user.id },
  });
  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: {
        ownerId: user.id,
        name: "Demo Diner",
        description: "Seeded demo restaurant",
      },
    });
  }

  const burger = await ensureFood(restaurant.id, "Classic Burger", 10.5);
  const fries = await ensureFood(restaurant.id, "Fries", 5.25);

  // Only create an order if this customer has none yet (keeps re-runs clean).
  const existingOrder = await prisma.order.findFirst({ where: { userId: user.id } });
  if (!existingOrder) {
    const items = [
      { foodId: burger.id, nameSnapshot: burger.name, priceSnapshot: burger.price, quantity: 2 },
      { foodId: fries.id, nameSnapshot: fries.name, priceSnapshot: fries.price, quantity: 1 },
    ];
    const totalPrice =
      Math.round(items.reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0) * 100) / 100;

    await prisma.order.create({
      data: {
        userId: user.id,
        restaurantId: restaurant.id,
        status: "PREPARING",
        totalPrice,
        items: { create: items },
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log(`   Demo login → ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`   User id: ${user.id}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
