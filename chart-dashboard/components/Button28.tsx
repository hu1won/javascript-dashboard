'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const Button28: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/button28');
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      Button 28
    </button>
  );
};

export default Button28;

