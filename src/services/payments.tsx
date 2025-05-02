export const handleCheckout = async (priceId: string, userId: string, navigate: Function) => {
  if (!userId) {
    alert("Please log in to subscribe");
    sessionStorage.setItem("pendingCheckout", JSON.stringify({ priceId }));
    navigate("/login");
    return;
  }
  const { data: profile, error } = await supabase
  .from('users') // or 'users' depending on your schema
  .select('stripe_customer_id')
  .eq('id', userId)
  .single();
  try {
    const paymentUrl = import.meta.env.VITE_STRIPE_URL;
    const response = await fetch(paymentUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, priceId }),
    });

    const data = await response.json();
    if (data.url) {
      sessionStorage.setItem("stripeCustomerId", data.customerId);
        const { error: updateError } = await supabase
    .from('users')
    .update({ stripe_customer_id: data.customerId })
    .eq('id', userId);
      window.location.href = data.url;
    } else {
      throw new Error(data.error || "Unable to create checkout session.");
    }
  } catch (err: any) {
    console.error("Checkout error:", err);
    alert("Failed to initiate checkout. Please try again later.");
  }
};
