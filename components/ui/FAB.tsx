import React from 'react';

const FAB: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className=" hidden md:flex fixed bottom-4 left-4 z-50  items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      aria-label="Floating Action Button">
      {children}
    </div>
  );
};

export default FAB;
