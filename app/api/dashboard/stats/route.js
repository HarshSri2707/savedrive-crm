import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { getDashboardStats } from "@/services/dashboard.service";

// GET /api/dashboard/stats
// Returns lead counts and the latest leads for the admin dashboard.
// Guarded here (not just by middleware) since the middleware matcher only
// covers /admin/* pages, not API routes.
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}
