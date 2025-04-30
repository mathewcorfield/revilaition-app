import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, CheckCircle, LightbulbIcon, BookOpenCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-hero-pattern">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="md:order-1 order-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span>Your Personal</span>
              <span className="gradient-heading block"> AI Tutor Assistant</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Transform your revision process with Revilaition's AI-powered learning tools that adapt to your unique study needs and help you achieve better results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" className="bg-brand-purple hover:bg-brand-darkPurple text-white">
                <Link to="/login" className="flex items-center gap-2">
                  Join the waitlist <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-brand-purple h-5 w-5" />
                <span className="text-gray-700">Personalized study plans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-brand-purple h-5 w-5" />
                <span className="text-gray-700">Interactive practice questions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-brand-purple h-5 w-5" />
                <span className="text-gray-700">Real-time progress tracking</span>
              </div>
            </div>
          </div>
          
          <div className="md:order-2 order-1 relative">
            <div className="relative bg-white rounded-2xl shadow-xl p-5 md:p-8 border border-gray-100 animate-float">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-full bg-brand-purple/10">
                  <LightbulbIcon className="h-6 w-6 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">RevilAItion</h3>
                  <p className="text-sm text-gray-500">Personalized AI assistance</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-gray-700">What are the main causes of World War I?</p>
                </div>
                <div className="ml-8 p-4 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
                  <p className="text-gray-700">The main causes of World War I include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    <li>Militarism</li>
                    <li>Alliances</li>
                    <li>Imperialism</li>
                    <li>Nationalism</li>
                  </ul>
                  <p className="mt-2 text-gray-700">Would you like me to suggest methods to help remember these?</p>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-brand-lightPurple text-white p-2 rounded-lg text-sm font-medium">
                <div className="flex items-center gap-2">
                  <BookOpenCheck className="h-4 w-4" />
                  <span>AI-powered explanations</span>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 -top-10 -right-10 h-64 w-64 rounded-full bg-brand-lightPurple/20 blur-3xl"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
