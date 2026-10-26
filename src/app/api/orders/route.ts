import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Order } from "@/lib/db/types";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userPages = db.getPages(session.userId);
  const allowedPageIds = new Set(userPages.map((p) => p.pageId));

  const pageId = req.nextUrl.searchParams.get("pageId") || undefined;
  if (pageId && !allowedPageIds.has(pageId)) {
    return NextResponse.json({ error: "Forbidden: Page does not belong to user" }, { status: 403 });
  }

  const allOrders = db.getOrders(pageId);
  const orders = pageId
    ? allOrders
    : allOrders.filter((o) => allowedPageIds.has(o.pageId));

  return NextResponse.json({ orders });
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
    }

    const userPages = db.getPages(session.userId);
    const allowedPageIds = new Set(userPages.map((p) => p.pageId));

    const existingOrders = db.getOrders();
    const targetOrder = existingOrders.find((o) => o.id === orderId);
    if (!targetOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!allowedPageIds.has(targetOrder.pageId)) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to modify this order." }, { status: 403 });
    }

    const updated = db.updateOrderStatus(orderId, status as Order["status"]);
    if (!updated) {
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
