import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { fetchCheckoutSession } from "@/services/payments";

const SuccessPage = () => {
  const { user } = useUser();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Extract session_id from the URL
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (sessionId) {
        try {
          // Call your backend to get the checkout session status from Stripe
          const session = await fetchCheckoutSession(sessionId);
          
          if (session && session.payment_status === "paid") {
            setPaymentStatus("Your subscription was successful!");
          } else {
            setPaymentStatus("There was an issue with your payment.");
          }
        } catch (error) {
          console.error("Failed to fetch session:", error);
          setPaymentStatus("Error: Unable to verify payment.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPaymentStatus();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h1 className="text-3xl font-semibold text-green-600 mb-4">
            Payment {loading ? "Verifying..." : paymentStatus}
          </h1>
          
          {loading ? (
            <p className="text-gray-500">Please wait while we verify your payment...</p>
          ) : (
            <div className="mt-6">
              <p className="text-lg text-gray-800">
                {paymentStatus === "Your subscription was successful!" ? (
                  <span>Thank you for subscribing, {user?.name}!</span>
                ) : (
                  <span>If you believe this is an error, please contact support.</span>
                )}
              </p>

              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  Go to Dashboard
                </button>
                <button
                  className="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50"
                  onClick={() => window.location.href = "/"}
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SuccessPage;
