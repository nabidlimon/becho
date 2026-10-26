/**
 * BECHO — Local Webhook Simulator Script
 * Simulates incoming Facebook Messenger Webhook events (multi-bursts, photos, order closures).
 * 
 * Usage:
 *   node scripts/simulate_webhook.js
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function postWebhookEvent(senderPsid, text, imageUrl) {
  const payload = {
    object: "page",
    entry: [
      {
        id: "100234812398124",
        time: Date.now(),
        messaging: [
          {
            sender: { id: senderPsid },
            recipient: { id: "100234812398124" },
            timestamp: Date.now(),
            message: {
              mid: "mid_" + Math.random().toString(36).substring(2, 9),
              text: text || undefined,
              attachments: imageUrl
                ? [
                    {
                      type: "image",
                      payload: { url: imageUrl },
                    },
                  ]
                : undefined,
            },
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(`${BASE_URL}/api/webhooks/meta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log(`[Event Sent] Status: ${res.status} | Text: "${text || imageUrl}"`);
  } catch (err) {
    console.error("Failed to send webhook event:", err.message);
  }
}

async function runSimulation() {
  console.log("==================================================");
  console.log("🚀 Simulating 3-Message Rapid Burst from Customer...");
  console.log("==================================================");

  const psid = "buyer_sim_" + Date.now();

  // Burst 1
  await postWebhookEvent(psid, "Hi");
  await new Promise((r) => setTimeout(r, 600));

  // Burst 2
  await postWebhookEvent(psid, "Is the royal blue maxi dress available in size L?");
  await new Promise((r) => setTimeout(r, 800));

  // Burst 3
  await postWebhookEvent(psid, "Delivery to House 24, Road 7, Uttara, Dhaka? Phone: 01712345678");

  console.log("\n✅ All 3 messages dispatched in < 2 seconds.");
  console.log("The 3.5s Redis sliding-window debouncer will merge them into 1 coherent AI sales response!");
}

runSimulation();
