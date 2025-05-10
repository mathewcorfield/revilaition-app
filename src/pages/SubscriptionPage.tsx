import React from "react";
import { useNavigate } from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import PricingCard from "@/components/PricingCard";
import pricingData from "@/config/pricingConfig.json";
import { handleCheckout } from "@/services/payments";
import { useUser } from "@/context/UserContext";
import {PageFooter} from '@/components/PageFooter';
import {PageHeader} from "@/components/PageHeader";
import { Button } from "@/components/ui/button";



const SubscriptionPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const handleSelect = (priceId: string) => {
    handleCheckout(priceId, user.id);
  };
  const actions = (
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} />
        </Button>
);
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader isTrial={false} actions={actions} title="Choose Your Plan"/>
      <main className="flex-grow">
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingData.plans.map((plan) => (
                <PricingCard
                  key={plan.priceId}
                  planName={plan.planName}
                  price={plan.price}
                  features={plan.features}
                  buttonText={plan.buttonText}
                  priceId={plan.priceId}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <PageFooter />
    </div>
  );
};

export default SubscriptionPage;
