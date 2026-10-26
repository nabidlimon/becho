export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
  facebookUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface FacebookPage {
  id: string;
  userId?: string;
  pageId: string;
  pageName: string;
  pageAvatarUrl?: string;
  pageAccessToken: string;
  verifyToken: string;
  appSecret?: string;
  isActive: boolean;
  personaTemplate: "fashion" | "gadgets" | "cosmetics" | "food" | "custom";
  customSystemPrompt?: string;
  insideCityDeliveryFee: number;
  outsideCityDeliveryFee: number;
  currency: string;
  allowDiscount: boolean;
  maxDiscountPercent: number;
  codEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  pageId: string;
  sku?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  images: string[];
  variants?: {
    sizes?: string[];
    colors?: string[];
  };
  visualTraits?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  pageId: string;
  psid: string;
  fullName: string;
  profilePic?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  totalOrdersCount: number;
  totalSpend: number;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: "customer" | "ai" | "human";
  messageType: "text" | "image" | "audio" | "carousel" | "receipt";
  content: string;
  mediaUrl?: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  pageId: string;
  customerId: string;
  psid: string;
  customerName: string;
  customerPic?: string;
  isAiActive: boolean;
  handoverTrigger?: string;
  unreadByHuman: boolean;
  lastMessagePreview: string;
  lastCustomerMessageAt: string;
  messages: Message[];
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  variant?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  pageId: string;
  customerId?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: "COD" | "ONLINE";
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}
