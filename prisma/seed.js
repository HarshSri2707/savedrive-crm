// Seeds the initial admin account.
// Run with: npx prisma db seed
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Credentials come from the environment (loaded from .env by Prisma's seed runner).
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed the admin."
    );
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // Idempotent: create the admin if missing, otherwise refresh the password.
  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: { password: hashed },
    create: { email: ADMIN_EMAIL, password: hashed },
  });

  console.log(`Seeded admin: ${ADMIN_EMAIL}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
