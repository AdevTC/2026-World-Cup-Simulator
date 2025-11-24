import React from 'react';
import { PAST_CHAMPIONS } from '../../data/constants';

export const TeamName = ({ name, pot, showPot, isPrint = false }) => {
  const isChamp = PAST_CHAMPIONS.includes(name);
  return (
    <span className={`font-medium flex items-center gap-1 ${isPrint ? 'text-black' : ''}`}>
      <span className={isChamp ? 'champion-text font-black tracking-wide' : ''}>{name}</span>
      {showPot && <span className="text-[10px] opacity-60 font-mono text-gray-500 dark:text-gray-400">(B{pot})</span>}
    </span>
  );
};