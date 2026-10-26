import { config } from "../config";

export interface BufferedMessage {
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  senderPsid: string;
  pageId: string;
  timestamp: number;
}

export interface DebounceBatch {
  senderPsid: string;
  pageId: string;
  combinedText: string;
  imageUrls: string[];
  audioUrls: string[];
}

type BatchHandler = (batch: DebounceBatch) => Promise<void>;

class MultiBurstDebouncer {
  private buffers: Map<string, BufferedMessage[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private handler: BatchHandler | null = null;
  private windowMs: number;

  constructor(windowMs: number = config.debounce.windowMs) {
    this.windowMs = windowMs;
  }

  setHandler(handler: BatchHandler) {
    this.handler = handler;
  }

  addMessage(msg: BufferedMessage) {
    const key = `${msg.pageId}:${msg.senderPsid}`;

    // Append to buffer
    const currentList = this.buffers.get(key) || [];
    currentList.push(msg);
    this.buffers.set(key, currentList);

    // Clear existing timer if any (sliding window reset)
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
    }

    // Set new expiration timer
    const timer = setTimeout(async () => {
      this.timers.delete(key);
      const messages = this.buffers.get(key) || [];
      this.buffers.delete(key);

      if (messages.length === 0 || !this.handler) return;

      // Aggregate text, photos, and audio
      const textParts: string[] = [];
      const imageUrls: string[] = [];
      const audioUrls: string[] = [];

      for (const m of messages) {
        if (m.text?.trim()) textParts.push(m.text.trim());
        if (m.imageUrl) imageUrls.push(m.imageUrl);
        if (m.audioUrl) audioUrls.push(m.audioUrl);
      }

      const batch: DebounceBatch = {
        senderPsid: msg.senderPsid,
        pageId: msg.pageId,
        combinedText: textParts.join("\n"),
        imageUrls,
        audioUrls,
      };

      try {
        await this.handler(batch);
      } catch (err) {
        console.error("Error executing debounced batch handler:", err);
      }
    }, this.windowMs);

    this.timers.set(key, timer);
  }
}

// Global singleton instance
export const debouncer = new MultiBurstDebouncer();
