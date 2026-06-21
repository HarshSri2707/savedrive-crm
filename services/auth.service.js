// Admin auth business logic. All Prisma + credential checks live here.
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

// Verify admin credentials and, if valid, return a signed session token.
// Returns null for both unknown email and wrong password, so callers can
// surface a single generic message without revealing which admins exist.
export async function authenticateAdmin(email, password) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;

  const passwordOk = await bcrypt.compare(password, admin.password);
  if (!passwordOk) return null;

  const token = await signToken({ sub: admin.id, email: admin.email });
  return { token };
}
