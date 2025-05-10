import React from 'react';

export const PageFooter: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6">        
        <p>© {year} RevilAItion. All rights reserved.</p>
    </footer>
  );
};