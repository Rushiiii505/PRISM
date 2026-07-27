"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import "./GradualBlur.css";

interface GradualBlurProps {
  position?: "top" | "bottom" | "left" | "right";
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
  responsive?: boolean;
  target?: "parent" | "page";
  className?: string;
  style?: React.CSSProperties;
  preset?: string;
  hoverIntensity?: number;
  onAnimationComplete?: () => void;
}

const DEFAULT_CONFIG: Partial<GradualBlurProps> = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  responsive: false,
  target: "parent",
  className: "",
  style: {},
};

const PRESETS: Record<string, Partial<GradualBlurProps>> = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
  header: { position: "top", height: "8rem", curve: "ease-out" },
  footer: { position: "bottom", height: "8rem", curve: "ease-out" },
};

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const getGradientDirection = (position: string = "bottom") =>
  ({
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  })[position] || "to bottom";

const GradualBlur: React.FC<GradualBlurProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {};
    return { ...DEFAULT_CONFIG, ...presetConfig, ...props };
  }, [props]);

  const blurDivs = useMemo(() => {
    const divs = [];
    const divCount = config.divCount || 5;
    const increment = 100 / divCount;
    const strength = config.strength || 2;
    const currentStrength =
      isHovered && config.hoverIntensity ? strength * config.hoverIntensity : strength;

    const curveFunc = CURVE_FUNCTIONS[config.curve || "linear"] || CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= divCount; i++) {
      let progress = i / divCount;
      progress = curveFunc(progress);

      let blurValue;
      if (config.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * divCount + 1) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position);

      const divStyle: React.CSSProperties = {
        position: "absolute",
        inset: "0",
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity ?? 1,
        transition:
          config.animated && config.animated !== "scroll"
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
      };

      divs.push(<div key={i} style={divStyle} />);
    }

    return divs;
  }, [config, isHovered]);

  const containerStyle = useMemo(() => {
    const isVertical = ["top", "bottom"].includes(config.position || "bottom");
    const isHorizontal = ["left", "right"].includes(config.position || "bottom");
    const isPageTarget = config.target === "page";

    const baseStyle: React.CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: 1,
      zIndex: isPageTarget ? (config.zIndex || 1000) + 100 : config.zIndex || 1000,
      ...config.style,
    };

    if (isVertical) {
      baseStyle.height = config.height || "6rem";
      baseStyle.width = config.width || "100%";
      if (config.position === "top") baseStyle.top = 0;
      if (config.position === "bottom") baseStyle.bottom = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = config.width || config.height || "6rem";
      baseStyle.height = "100%";
      if (config.position === "left") baseStyle.left = 0;
      if (config.position === "right") baseStyle.right = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent"} ${config.className || ""}`}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div
        className="gradual-blur-inner"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {blurDivs}
      </div>
    </div>
  );
};

export default React.memo(GradualBlur);
