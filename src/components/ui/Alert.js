// components/ui/alert.js
import React from 'react';

export const Alert = ({ children, className }) => {
  return (
    <div className={`bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 ${className}`}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children }) => {
  return <h4 className="font-bold mb-1">{children}</h4>;
};

export const AlertDescription = ({ children, className }) => {
  return <p className={`text-sm ${className}`}>{children}</p>;
};