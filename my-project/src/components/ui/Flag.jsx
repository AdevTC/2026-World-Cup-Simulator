import React from 'react';
import { FLAGS } from '../../data/constants';

export const Flag = ({ name, size = "w-6 h-4" }) => {
  const code = FLAGS[name];
  if (!code) return <span className="bg-gray-200 w-6 h-4 inline-block rounded-sm mr-2 align-middle"></span>;
  return (
    <img 
      src={`https://flagcdn.com/${code}.svg`} 
      alt={name} 
      className={`${size} object-cover rounded-sm inline-block mr-2 shadow-sm border border-black/10 align-middle`} 
    />
  );
};