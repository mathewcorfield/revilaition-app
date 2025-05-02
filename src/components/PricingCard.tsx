import React from 'react';
import { Star } from 'lucide-react';

interface PricingCardProps {
  planName: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  priceId: string;
  onSelect: (priceId: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  planName,
  price,
  features,
  buttonText,
  isPopular = false,
  priceId, 
  onSelect 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover-card-animation">
      {isPopular && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white py-1 px-3 rounded-full text-xs font-bold">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{planName}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-4">{price}</p>
      <ul className="mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700 mb-2">
            <span className="w-5 h-5 mr-2 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">✔</span>
            {feature}
          </li>
        ))}
      </ul>
      <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors" onClick={() => onSelect(priceId)}>
        {buttonText}
      </button>
    </div>
  );
};

export default PricingCard;
