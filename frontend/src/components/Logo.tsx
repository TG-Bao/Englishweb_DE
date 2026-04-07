import React from "react";
import logo from "../assets/logo.png";

interface LogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 40, 
  showText = true, 
  textColor = "var(--text)", 
  className = "",
  style = {}
}) => {
  return (
    <div 
      className={`flex items-center gap-3 ${className}`} 
      style={{ display: "flex", alignItems: "center", gap: "12px", ...style }}
    >
      <div 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          flexShrink: 0
        }}
      >
        <img 
          src={logo} 
          alt="DoneEnglish Logo" 
          style={{ width: "100%", height: "100%", objectFit: "contain" }} 
        />
      </div>
      
      {showText && (
        <span style={{ 
          fontSize: `${size * 0.45}px`, 
          fontWeight: 900, 
          color: textColor,
          letterSpacing: "-0.02em",
          lineHeight: 1
        }}>
          DoneEnglish
        </span>
      )}
    </div>
  );
};

export default Logo;
