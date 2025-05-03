export const handleCheckout = async (priceId: string, userId: string) => {
  try {
    const paymentUrl = import.meta.env.VITE_STRIPE_URL;
    if (!paymentUrl) {
  throw new Error("Stripe URL not configured.");
}
    const response = await fetch(`${paymentUrl}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, priceId }),
    });
if (!response.ok) {
  throw new Error(`Failed to create checkout session. Status: ${response.status}`);
}
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || "Unable to create checkout session.");
    }
  } catch (err: any) {
    console.error("Checkout error:", err);
    alert(`Failed to initiate checkout: ${err.message}. Please try again later.`);
  }
};

export const fetchCheckoutSession = async (sessionId: string) => {
    try {
      const paymentUrl = import.meta.env.VITE_STRIPE_URL;
    if (!paymentUrl) {
  throw new Error("Stripe URL not configured.");
}
  const response = await fetch(`${paymentUrl}/get-session?session_id=${sessionId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch session. Status: ${response.status}`);
  }
  return response.json();
  } catch (err: any) {
    console.error("Fetch session error:", err);
    throw new Error(`Error fetching session: ${err.message}`);
  }
};
