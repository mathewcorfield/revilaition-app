
import React from 'react';
import { Button } from "@/components/ui/button";
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/login">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-brand-purple" />
          <span className="font-bold text-xl text-gray-900">Revilaition</span>
        </div>
          </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-700 hover:text-brand-purple transition-colors">Features</a>
          <a href="#testimonials" className="text-gray-700 hover:text-brand-purple transition-colors">Testimonials</a>
          <a href="#pricing" className="text-gray-700 hover:text-brand-purple transition-colors">Pricing</a>
        </div>
        
        <Button variant="outline" className="hidden md:flex border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white">
          <a href="#signup">Join waitlist</a>
        </Button>
        
        <Button className="md:hidden" variant="ghost" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

