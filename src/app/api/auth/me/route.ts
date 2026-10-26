import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession(req);

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null, pages: [] }, { status: 200 });
  }

  const user = db.getUserById(session.userId);
  const pages = db.getPages(session.userId);

  return NextResponse.json({
    authenticated: true,
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        }
      : session,
    pages,
  });
}
