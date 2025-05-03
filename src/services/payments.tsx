export const handleCheckout = async (priceId: string, userId: string) => {
  try {
    const paymentUrl = import.meta.env.VITE_STRIPE_URL;
    if (!paymentUrl) {
  throw new Error("Stripe URL not configured.");
}
    const response = await fetch(paymentUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, priceId }),
    });
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || "Unable to create checkout session.");
    }
  } catch (err: any) {
    console.error("Checkout error:", err);
    alert("Failed to initiate checkout. Please try again later.");
  }
};
