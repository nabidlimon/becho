import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Order } from "@/lib/db/types";

export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get("pageId") || undefined;
  const orders = db.getOrders(pageId);
  return NextResponse.json({ orders });
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
    }

    const updated = db.updateOrderStatus(orderId, status as Order["status"]);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
