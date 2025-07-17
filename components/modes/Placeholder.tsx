
import React from 'react';

interface PlaceholderProps {
  title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-base-100 rounded-lg p-8 h-[450px] text-center">
      <h2 className="text-2xl font-bold text-base-content mb-2">{title}</h2>
      <p className="text-base-content/70">This feature is under construction. Stay tuned!</p>
       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mt-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 16v-2m8-6h2M4 12H2m15.364 6.364l1.414 1.414M4.222 5.636l1.414 1.414M19.778 5.636l-1.414 1.414M6.636 19.778l-1.414 1.414" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    </div>
  );
};

export default Placeholder;
