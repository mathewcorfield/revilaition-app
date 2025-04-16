
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import TestimonialCard from '@/components/TestimonialCard';
import SignupForm from '@/components/SignupForm';
import Footer from '@/components/Footer';
import { 
  Brain, 
  BookOpen, 
  PencilRuler, 
  LineChart, 
  Sparkles, 
  MessageSquareText, 
  BarChart3
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Our AI adapts to your learning style and creates personalized study materials to help you understand complex topics."
    },
    {
      icon: BookOpen,
      title: "Comprehensive Resources",
      description: "Access a vast library of study materials, practice questions, and explanations across various subjects and curricula."
    },
    {
      icon: PencilRuler,
      title: "Custom Study Plans",
      description: "Get tailored study schedules based on your goals, strengths, and weaknesses to maximize your learning efficiency."
    },
    {
      icon: MessageSquareText,
      title: "Interactive Assistance",
      description: "Ask questions and get instant, detailed explanations to help you overcome challenging concepts."
    },
    {
      icon: LineChart,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics that highlight your strengths and areas for growth."
    },
    {
      icon: Sparkles,
      title: "Smart Revision",
      description: "Our spaced repetition system ensures you review information at the optimal time for maximum retention."
    }
  ];

  const testimonials = [
    {
      quote: "StudySpark transformed my study routine. I'm learning so much more efficiently now and seeing better results in my exams.",
      author: "Sarah J.",
      role: "University Student",
      rating: 5
    },
    {
      quote: "As a teacher, I recommend StudySpark to all my students. It's like having a personal tutor available 24/7.",
      author: "Michael T.",
      role: "High School Teacher",
      rating: 5
    },
    {
      quote: "The personalized study plans are amazing! StudySpark helped me organize my revision and focus on areas I was struggling with.",
      author: "Amy L.",
      role: "High School Student",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform offers everything you need to excel in your studies.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
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
        <section className="py-16 bg-gradient-to-r from-brand-purple/90 to-brand-lightPurple/90 text-white">
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
              {testimonials.map((testimonial, index) => (
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
        
        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How StudySpark Works</h2>
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
        
        {/* Call to Action / Sign Up Form */}
        <section id="signup" className="py-20 bg-hero-pattern">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Studies?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join our waitlist today and be among the first to experience the future of learning.
              </p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <SignupForm />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
