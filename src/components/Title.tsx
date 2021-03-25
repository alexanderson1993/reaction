import React from "react";

export function Title() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="70">
      <text
        x="50%"
        y="50%"
        fill="url(#pattern)"
        dy=".4em"
        fontFamily="Teko"
        fontSize="80"
        textAnchor="middle"
      >
        Reaction
      </text>
      <defs>
        <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0">
          <stop offset="0%" stopColor="#33235b"></stop>
          <stop offset="25%" stopColor="#D62229"></stop>
          <stop offset="50%" stopColor="#E97639"></stop>
          <stop offset="75%" stopColor="#792042"></stop>
          <stop offset="100%" stopColor="#33235b"></stop>
        </linearGradient>
        <pattern
          id="pattern"
          width="300%"
          height="100%"
          x="0"
          y="0"
          patternUnits="userSpaceOnUse"
        >
          <rect width="150%" height="100%" fill="url(#gradient)">
            <animate
              attributeName="x"
              attributeType="XML"
              dur="7s"
              from="0"
              repeatCount="indefinite"
              to="150%"
            ></animate>
          </rect>
          <rect width="150%" height="100%" x="-150%" fill="url(#gradient)">
            <animate
              attributeName="x"
              attributeType="XML"
              dur="7s"
              from="-150%"
              repeatCount="indefinite"
              to="0"
            ></animate>
          </rect>
        </pattern>
      </defs>
    </svg>
  );
}
