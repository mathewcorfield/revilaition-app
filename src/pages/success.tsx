const fetchSessionDetails = async (sessionId: string) => {
  paymenturl = import.meta.env.VITE_STRIPE_URL
  const res = await fetch(`${paymenturl}/get-session?session_id=${sessionId}`);
  const session = await res.json();
  console.log('Stripe session info:', session);
};
