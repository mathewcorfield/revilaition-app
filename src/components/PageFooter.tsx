import React from 'react';

export const PageFooter: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 mt-6 pt-4 text-center text-sm text-gray-600">     
        <p>© {year} RevilAItion. All rights reserved.</p>
    </footer>
  );
};