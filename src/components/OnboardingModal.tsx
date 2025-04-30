import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OnboardingModal = ({ setLevel, setCountry, onSubmit }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold">Complete Your Onboarding</h2>
        <div className="mt-4">
          <label className="block mb-2">What level are you studying at?</label>
          <Input
            type="text"
            placeholder="e.g., A-level"
            onChange={(e) => setLevel(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Which country are you based in?</label>
          <Input
            type="text"
            placeholder="e.g., United Kingdom"
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <Button className="mt-4" onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default OnboardingModal;
