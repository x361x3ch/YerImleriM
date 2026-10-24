import React from 'react';
import { IconPack } from '../types';

export interface IconProps {
  name?: string;
  pack?: IconPack;
  className?: string;
  size?: number;
  color?: string; // used for outline/filled/minimal or tint
}

export const FLATICON_ITEMS: Array<{ id: string; nameTr: string; color: string; path: string }> = [
  {
    id: 'folder',
    nameTr: 'Klasör',
    color: '#5D9CEC',
    path: 'M10,4H4C2.9,4 2,4.9 2,6v12c0,1.1 0.9,2 2,2h16c1.1,0 2,-0.9 2,-2V8c0,-1.1 -0.9,-2 -2,-2h-8L10,4z',
  },
  {
    id: 'home',
    nameTr: 'Ev / Başlangıç',
    color: '#FFCE54',
    path: 'M12,3L2,12h3v8h6v-6h2v6h6v-8h3L12,3z',
  },
  {
    id: 'star',
    nameTr: 'Yıldız / Favori',
    color: '#F6BB42',
    path: 'M12,17.27L18.18,21l-1.64,-7.03L22,9.24l-7.19,-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z',
  },
  {
    id: 'heart',
    nameTr: 'Kalp / Beğeni',
    color: '#ED5565',
    path: 'M12,21.35l-1.45,-1.32C5.4,15.36 2,12.28 2,8.5C2,5.42 4.42,3 7.5,3c1.74,0 3.41,0.81 4.5,2.09C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.42 22,8.5c0,3.78 -3.4,6.86 -8.55,11.54L12,21.35z',
  },
  {
    id: 'book',
    nameTr: 'Kitap / Okuma',
    color: '#8CC152',
    path: 'M18,2H6C4.9,2 4,2.9 4,4v16c0,1.1 0.9,2 2,2h12c1.1,0 2,-0.9 2,-2V4C20,2.9 19.1,2 18,2zM6,4h5v8l-2.5,-1.5L6,12V4z',
  },
  {
    id: 'work',
    nameTr: 'İş / Proje',
    color: '#A0D468',
    path: 'M20,6h-4V4c0,-1.11 -0.89,-2 -2,-2h-4C8.89,2 8,2.89 8,4v2H4C2.89,6 2,6.89 2,8v11c0,1.11 0.89,2 2,2h16c1.11,0 2,-0.89 2,-2V8C22,6.89 21.11,6 20,6zM14,6h-4V4h4V6z',
  },
  {
    id: 'game',
    nameTr: 'Oyun / Eğlence',
    color: '#4FC1E9',
    path: 'M21.58,16.09l-1.09,-7.66C20.21,6.46 18.52,5 16.53,5H7.47C5.48,5 3.79,6.46 3.51,8.43l-1.09,7.66C2.2,17.63 3.39,19 4.94,19c0.68,0 1.32,-0.27 1.8,-0.75L9,16h6l2.25,2.25c0.48,0.48 1.13,0.75 1.8,0.75C20.61,19 21.8,17.63 21.58,16.09zM11,11H9v2H8v-2H6v-1h2V8h1v2h2V11zM15,10c-0.55,0 -1,-0.45 -1,-1s0.45,-1 1,-1s1,0.45 1,1S15.55,10 15,10zM17,12c-0.55,0 -1,-0.45 -1,-1s0.45,-1 1,-1s1,0.45 1,1S17.55,12 17,12z',
  },
  {
    id: 'shopping',
    nameTr: 'Alışveriş',
    color: '#FC6E51',
    path: 'M7,18c-1.1,0 -1.99,0.9 -1.99,2S5.9,22 7,22s2,-0.9 2,-2S8.1,18 7,18zM1,2v2h2l3.6,7.59l-1.35,2.45C5.09,14.32 5,14.65 5,15c0,1.1 0.9,2 2,2h12v-2H7.42c-0.14,0 -0.25,-0.11 -0.25,-0.25l0.03,-0.12L8.1,13h7.45c0.75,0 1.41,-0.41 1.75,-1.03l3.58,-6.49C20.96,5.34 21,5.17 21,5c0,-0.55 -0.45,-1 -1,-1H5.21l-0.94,-2H1zM17,18c-1.1,0 -1.99,0.9 -1.99,2s0.89,2 1.99,2s2,-0.9 2,-2S18.1,18 17,18z',
  },
  {
    id: 'music',
    nameTr: 'Müzik / Ses',
    color: '#AC92EC',
    path: 'M12,3v10.55c-0.59,-0.34 -1.27,-0.55 -2,-0.55c-2.21,0 -4,1.79 -4,4s1.79,4 4,4s4,-1.79 4,-4V7h4V3H12z',
  },
  {
    id: 'movie',
    nameTr: 'Film / Video',
    color: '#EC87C0',
    path: 'M18,4l2,4h-3l-2,-4h-2l2,4h-3l-2,-4H8l2,4H7L5,4H4C2.9,4 2.01,4.9 2.01,6L2,18c0,1.1 0.9,2 2,2h16c1.1,0 2,-0.9 2,-2V4H18z',
  },
  {
    id: 'food',
    nameTr: 'Yemek / Tarif',
    color: '#FFCE54',
    path: 'M8.1,13.34l2.83,-2.83L3.91,3.5c-1.56,1.56 -1.56,4.09 0,5.66L8.1,13.34zM14.88,11.53c1.53,0.71 3.68,0.21 5.27,-1.38c1.91,-1.91 2.28,-4.65 0.81,-6.12c-1.46,-1.46 -4.2,-1.1 -6.12,0.81c-1.59,1.59 -2.09,3.74 -1.38,5.27L3.7,19.87l1.41,1.41L12,14.41l6.88,6.88l1.41,-1.41L13.41,13L14.88,11.53z',
  },
  {
    id: 'pet',
    nameTr: 'Evcil Hayvan / Doğa',
    color: '#656D78',
    path: 'M4.5,12c1.38,0 2.5,-1.12 2.5,-2.5S5.88,7 4.5,7S2,8.12 2,9.5S3.12,12 4.5,12zM19.5,12c1.38,0 2.5,-1.12 2.5,-2.5S20.88,7 19.5,7S17,8.12 17,9.5S18.12,12 19.5,12zM12,2C9.24,2 7,4.24 7,7c0,2.85 3.62,5.85 5,8c1.38,-2.15 5,-5.15 5,-8C17,4.24 14.76,2 12,2zM12,21c-2.5,0 -4.5,1.5 -4.5,1.5s2,1.5 4.5,1.5s4.5,-1.5 4.5,-1.5S14.5,21 12,21z',
  },
];

export const Flaticon: React.FC<IconProps> = ({
  name = 'folder',
  pack = 'flaticon',
  className = '',
  size = 24,
  color,
}) => {
  const item = FLATICON_ITEMS.find((i) => i.id === name) || FLATICON_ITEMS[0];
  
  // Decide fill and stroke based on icon pack
  let fillColor = item.color;
  let strokeColor = 'none';
  let strokeWidth = 0;

  if (pack === 'outline') {
    fillColor = 'none';
    strokeColor = color || item.color;
    strokeWidth = 1.6;
  } else if (pack === 'filled') {
    fillColor = color || item.color;
  } else if (pack === 'minimal') {
    fillColor = color || '#5A5A5A';
  } else {
    // flaticon: default rich color, or custom override
    fillColor = color || item.color;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`inline-block flex-shrink-0 transition-transform ${className}`}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={item.path} />
    </svg>
  );
};
