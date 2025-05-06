import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import PricingCard from '@/components/PricingCard';
import TestimonialCard from '@/components/TestimonialCard';
import Footer from '@/components/Footer';
import {   Brain,   BookOpen,   PencilRuler,   LineChart,   Sparkles,   MessageSquareText,   BarChart3} from 'lucide-react';
import pricingData from "@/config/pricingConfig.json";
import featureData from "@/config/featuresConfig.json";
import testimonialData from "@/config/testimonialsConfig.json";

const Index = () => {
  const navigate = useNavigate();
  const handleSelect = (priceId: string) => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features of Revilaition</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform offers everything you need to excel in your studies.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureData.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section id="stats" className="py-16 bg-gradient-to-r from-brand-purple/90 to-brand-lightPurple/90 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">94%</div>
                <p className="text-white/80">of users improved their grades</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">45 min</div>
                <p className="text-white/80">average time saved per study session</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <p className="text-white/80">students already on the waitlist</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from students and educators who are already experiencing the benefits of our AI study assistant.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonialData.map((testimonial, index) => (
                <TestimonialCard 
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  rating={testimonial.rating}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pricing Options - Further discounts available for early subscribers.
              </p>
            </div>
            
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
        
        {/* How It Works Section */}
        <section id="howitworks" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How RevilAItion Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our simple process helps you transform your study habits and achieve better results.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-brand-purple text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
                <p className="text-gray-600">Create your account and tell us about your study goals and subjects.</p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-brand-purple text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-3">Get Personalized Plan</h3>
                <p className="text-gray-600">Receive a customized study plan based on your goals and learning style.</p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-brand-purple text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-3">Study Smarter</h3>
                <p className="text-gray-600">Use our AI tools to learn more effectively and track your progress.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
