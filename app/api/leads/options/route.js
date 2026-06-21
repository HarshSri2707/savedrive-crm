import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { getLeadFilterOptions } from "@/services/lead.service";

// GET /api/leads/options
// Admin-only. Returns the distinct cities and states present in the leads,
// used to populate the filter dropdowns on the leads page.
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const options = await getLeadFilterOptions();
    return NextResponse.json(options);
  } catch (error) {
    console.error("Failed to load filter options:", error);
    return NextResponse.json(
      { error: "Failed to load filter options" },
      { status: 500 }
    );
  }
}
