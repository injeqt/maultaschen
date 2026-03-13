import type { CSSProperties } from "react";

type Decoration = {
  id: number;
  style: CSSProperties;
};

const decorationCount = 10;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function buildDecorations(): Decoration[] {
  const laneWidth = 100 / decorationCount;

  return Array.from({ length: decorationCount }, (_, index) => {
    const width = Math.round(randomBetween(76, 158));
    const left = index * laneWidth + randomBetween(1, Math.max(2, laneWidth - 4));
    const duration = randomBetween(14, 24);
    const delay = -randomBetween(1, 15);

    return {
      id: index + 1,
      style: {
        left: `${left.toFixed(1)}%`,
        animationDuration: `${duration.toFixed(1)}s`,
        animationDelay: `${delay.toFixed(1)}s`,
        ["--maultasche-width" as string]: `${width}px`,
      },
    };
  });
}

const decorations = buildDecorations();

export function BackgroundScene() {
  return (
    <div className="background-scene" aria-hidden="true">
      {decorations.map((item) => (
        <img
          key={item.id}
          className="background-maultasche"
          src={`${import.meta.env.BASE_URL}image.png`}
          alt=""
          style={item.style}
        />
      ))}
    </div>
  );
}
