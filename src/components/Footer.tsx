
import React from 'react';
import { Brain, Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-brand-purple" />
              <span className="font-bold text-lg text-gray-900">StudySpark</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              AI-powered study assistant to help you learn smarter, not harder.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 hover:text-brand-purple transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-purple transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-purple transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">Home</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">Features</a></li>
              <li><a href="#testimonials" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">Testimonials</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">GDPR</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h4 className="font-semibold mb-4 text-gray-900">Contact</h4>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <a href="mailto:hello@studyspark.ai" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                hello@studyspark.ai
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              123 Learning Avenue<br />
              Knowledge City, KL 12345
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} StudySpark. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
