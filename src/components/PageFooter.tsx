import React from 'react';
import { GraduationCap, Mail, Github, Linkedin, Twitter as TwitterIcon } from 'lucide-react';
import { RevilAItionText } from "@/components/RevilAItionText";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6">        
    <div className="border-t border-gray-200 mt-6 pt-4 text-center text-sm text-gray-600">
        <p>© {year} RevilAItion. All rights reserved.</p>
    </div>
    </footer>
  );
};

export default Footer;
