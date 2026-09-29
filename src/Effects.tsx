import type { CSSProperties } from "react";

const random = (min: number, max: number) => min + Math.random() * (max - min);

const twinkles = Array.from({ length: 70 }, () => ({
  left: `${random(0, 100)}%`,
  top: `${random(0, 100)}%`,
  width: random(10, 34),
  animationDelay: `${random(-4, 0)}s`,
  animationDuration: `${random(1.8, 4)}s`,
}));

const burst = Array.from({ length: 36 }, (_, index) => {
  const angle = (index / 36) * 2 * Math.PI + random(-0.2, 0.2);
  const distance = random(20, 60);
  return {
    "--x": `${Math.cos(angle) * distance}vmax`,
    "--y": `${Math.sin(angle) * distance}vmax`,
    width: random(14, 48),
    animationDelay: `${random(0.2, 0.7)}s`,
  } as CSSProperties;
});

const mold = Array.from({ length: 18 }, () => ({
  left: `${random(-20, 90)}%`,
  top: `${random(-20, 90)}%`,
  width: `${random(25, 60)}vmin`,
  animationDelay: `${random(0, 0.4)}s`,
}));

const flies = Array.from({ length: 8 }, () => ({
  left: `${random(5, 90)}%`,
  top: `${random(5, 90)}%`,
  animationDuration: `${random(0.3, 0.8)}s`,
  animationDelay: `${random(-1, 0)}s`,
}));

const drips =
  "M0 0H100V5C96 5 95 12 93 12S90 5 86 5 82 16 79 16 76 5 70 5 64 9 61 9 58 5 52 5 47 18 44 18 41 5 35 5 30 11 27 11 24 5 18 5 13 14 10 14 7 5 0 5Z";

export const Sparkles = () => (
  <div className="fx pointer-events-none fixed inset-0 overflow-hidden drop-shadow-[0_0_3px_#ff4fa8]">
    {twinkles.map((style, index) => (
      <span key={index} className="sparkle twinkle" style={style} />
    ))}
  </div>
);

export const NinaIntro = () => (
  <div className="fx nina-intro pointer-events-none fixed inset-0 z-50 grid place-items-center overflow-hidden">
    <div className="sunburst absolute -inset-1/2" />
    <div className="absolute inset-0 drop-shadow-[0_0_6px_#fff]">
      {burst.map((style, index) => (
        <span key={index} className="sparkle burst" style={style} />
      ))}
    </div>
    <div className="relative text-center">
      <p className="barbie-logo nina-logo">Nina</p>
      <p className="nina-tagline font-meny text-2xl font-bold text-white italic sm:text-4xl">
        Denne Barbien er skyldig.
      </p>
    </div>
  </div>
);

export const GonkeRot = () => (
  <div className="fx pointer-events-none fixed inset-0 z-50 overflow-hidden">
    <svg className="absolute size-0">
      <filter id="rot-fuzz">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" />
        <feDisplacementMap in="SourceGraphic" scale="60" />
      </filter>
    </svg>
    <div className="decay absolute inset-0">
      <div className="absolute inset-0 mix-blend-multiply [filter:url(#rot-fuzz)]">
        {mold.map((style, index) => (
          <span key={index} className="mold" style={style} />
        ))}
      </div>
    </div>
    <div className="sludge absolute inset-x-0 top-0 h-[130vh]">
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="absolute bottom-full h-[10vh] w-full -scale-y-100 fill-[#6b7a1f]"
      >
        <path d={drips} />
      </svg>
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="absolute top-full h-[18vh] w-full fill-[#3a2c10]"
      >
        <path d={drips} />
      </svg>
    </div>
    <p className="gonke-text absolute inset-x-0 top-1/3 text-center">GONKE</p>
    <div className="flies absolute inset-0">
      {flies.map((style, index) => (
        <span key={index} className="fly" style={style}>
          🪰
        </span>
      ))}
    </div>
  </div>
);
