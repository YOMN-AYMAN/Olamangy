'use client'

<<<<<<< HEAD
import { useMediaQuery } from "@mui/material";
import { useEffect, useRef } from "react";

// ممرنا defaultColor كخاصية، ويمكنك تغييرها عند استدعاء المكون
const Wave = ({ 
  width = 1440, 
  height = 150, 
  speed = 0.02, 
  defaultColor = "#E91E63" // لون العلمونجي الافتراضي (الوردي)
}) => {
  const isXs = useMediaQuery("(max-width:966px)");
=======
import {useMediaQuery} from "@mui/material";
import {useEffect, useRef, useState} from "react";

// ممرنا defaultColor كخاصية، ويمكنك تغييرها عند استدعاء المكون
const Wave = ({
  width = 1440,
  height = 150,
  speed = 0.02,
  defaultColor = "#E91E63" // لون العلمونجي الافتراضي (الوردي)
}) => {
  const isXs = useMediaQuery("(max-width:966px)");
  const [mounted, setMounted] = useState(false);
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
  const svgRef = useRef(null);
  const requestRef = useRef();
  const offsetRef = useRef(0);

<<<<<<< HEAD
=======
  useEffect(() => {
    setMounted(true);
  }, []);

>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
  // دالة تحويل اللون لـ RGBA يدوياً لضمان الشفافية
  const hexToRgba = (hex, alpha) => {
    // إزالة # إذا كانت موجودة
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const waves = [
<<<<<<< HEAD
    { amplitude: 15, frequency: 0.01, speedMult: 1.0, alpha: 1 },
    { amplitude: 20, frequency: 0.008, speedMult: 0.8, alpha: 0.5 },
    { amplitude: 25, frequency: 0.006, speedMult: 0.6, alpha: 0.3 },
=======
    {amplitude: 15, frequency: 0.01, speedMult: 1.0, alpha: 1},
    {amplitude: 20, frequency: 0.008, speedMult: 0.8, alpha: 0.5},
    {amplitude: 25, frequency: 0.006, speedMult: 0.6, alpha: 0.3},
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
  ];

  const animate = () => {
    offsetRef.current += speed;
    const paths = svgRef.current?.querySelectorAll("path");

    if (paths) {
      waves.forEach((wave, index) => {
<<<<<<< HEAD
        let d = `M 0 ${height} `; 
=======
        let d = `M 0 ${height} `;
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
        for (let x = 0; x <= width; x += 20) {
          const y = (height / 2) + wave.amplitude * Math.sin((x * wave.frequency) + (offsetRef.current * wave.speedMult));
          d += `L ${x} ${y} `;
        }
        d += `L ${width} ${height} L 0 ${height} Z`;
        paths[index].setAttribute("d", d);
      });
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [speed]);

  return (
<<<<<<< HEAD
    <div style={{ 
      position: "fixed", 
      bottom: "0", 
      right: "0", 
      width: "100%", 
      zIndex: -1, 
=======
    <div style={{
      position: "fixed",
      bottom: "0",
      right: "0",
      width: "100%",
      zIndex: -1,
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
      pointerEvents: "none",
      overflow: "hidden"
    }}>
      {/* طبقة اللون الموحد تحت الأمواج */}
      <div style={{
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
<<<<<<< HEAD
        height: isXs ? "165vh" : "100vh",
        background: defaultColor,
        transform: "translateY(100%)", 
      }} />

      <svg 
=======
        height: (mounted && isXs) ? "165vh" : "100vh",
        background: defaultColor,
        transform: "translateY(100%)",
      }} />

      <svg
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: "100%",
          display: "block",
<<<<<<< HEAD
          transform: "scaleY(-1)", 
=======
          transform: "scaleY(-1)",
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
          filter: "drop-shadow(0px -5px 10px rgba(0,0,0,0.05))"
        }}
        preserveAspectRatio="none"
      >
        {waves.map((wave, index) => (
<<<<<<< HEAD
          <path 
            key={index} 
            fill={hexToRgba(defaultColor, wave.alpha)} 
=======
          <path
            key={index}
            fill={hexToRgba(defaultColor, wave.alpha)}
>>>>>>> b2e5d71450436003e1b10a8d7ad144413c22186f
          />
        ))}
      </svg>
    </div>
  );
};

export default Wave;