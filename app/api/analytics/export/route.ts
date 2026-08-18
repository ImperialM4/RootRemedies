// GET /api/analytics/export
// Downloads all tracked events as CSV. Admin-only.

import { NextRequest, NextResponse } from "next/server";
import { exportEventsCSV } from "@/lib/analytics/events";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const csv      = exportEventsCSV();
  const filename = `rootremedies-events-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type":        "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control":       "no-store",
    },
  });
}
