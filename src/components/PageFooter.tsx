import React from 'react';
import { GraduationCap, Mail, Github, Linkedin, Twitter as TwitterIcon } from 'lucide-react';
import { RevilAItionText } from "@/components/RevilAItionText";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-brand-purple" />
              <span className="font-bold text-lg text-gray-900"><RevilAItionText /></span>
            </div>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <a href="mailto:info@revilaition.com" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                info@revilaition.com
              </a>
            </div>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-600 text-sm">
                Proud to be created in Wales.
                </p>
            </div>
        </div>
        </div>
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-sm text-gray-600">
          <p>© {year} RevilAItion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
