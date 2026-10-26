import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Product } from "@/lib/db/types";

export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get("pageId") || undefined;
  const products = db.getProducts(pageId);
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if it's a batch import
    if (Array.isArray(body.products)) {
      const newItems: Product[] = body.products.map((p: any) => ({
        id: "prod-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
        pageId: p.pageId || "100234812398124",
        sku: p.sku || "SKU-" + Math.floor(1000 + Math.random() * 9000),
        title: p.title,
        description: p.description || "",
        category: p.category || "General",
        price: Number(p.price) || 0,
        discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
        stockQuantity: Number(p.stockQuantity) || 10,
        images: Array.isArray(p.images) ? p.images : p.imageUrl ? [p.imageUrl] : [],
        variants: p.variants || { sizes: ["Standard"] },
        visualTraits: p.visualTraits || p.title,
        isActive: true,
        createdAt: new Date().toISOString(),
      }));

      db.batchAddProducts(newItems);
      return NextResponse.json({
        success: true,
        count: newItems.length,
        message: `Imported ${newItems.length} products successfully!`,
      });
    }

    // Single product add
    const {
      pageId = "100234812398124",
      sku,
      title,
      description,
      category = "General",
      price,
      discountPrice,
      stockQuantity = 10,
      images = [],
      variants = { sizes: [], colors: [] },
      visualTraits,
    } = body;

    if (!title || price === undefined) {
      return NextResponse.json(
        { error: "Product title and price are required" },
        { status: 400 }
      );
    }

    const newProduct: Product = {
      id: "prod-" + Date.now(),
      pageId,
      sku: sku || "SKU-" + Math.floor(1000 + Math.random() * 9000),
      title,
      description: description || "",
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stockQuantity: Number(stockQuantity),
      images: Array.isArray(images) ? images : [],
      variants,
      visualTraits: visualTraits || title,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    db.saveProduct(newProduct);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const idFromQuery = url.searchParams.get("id");

    let id = idFromQuery;
    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const deleted = db.deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete product" }, { status: 500 });
  }
}
