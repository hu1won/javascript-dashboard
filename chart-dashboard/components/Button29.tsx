'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const Button29: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/button29');
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      Button 29
    </button>
  );
};

export default Button29;

