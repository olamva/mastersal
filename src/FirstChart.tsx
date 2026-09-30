import { useState } from "react";
import { monthName, series, type FirstMonth } from "../server/first";

const colors = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
];
const width = 640;
const height = 300;
const left = 32;
const right = 16;
const top = 12;
const bottom = 28;
const modes = { totals: "Totalt", counts: "Per måned" };

interface FirstChartProps {
  months: FirstMonth[];
  className: string;
}

export const FirstChart = ({ months, className }: FirstChartProps) => {
  const [hovered, setHovered] = useState<number>();
  const active = hovered ?? months.length - 1;
  const [mode, setMode] = useState<keyof typeof modes>("totals");
  const lines = series(months).map((line) => ({
    name: line.name,
    values: line[mode],
  }));
  const step = Math.ceil(
    Math.max(1, ...lines.flatMap(({ values }) => values)) / 4,
  );
  const band = (width - left - right) / months.length;
  const x = (index: number) => left + band * (index + 0.5);
  const y = (value: number) =>
    height - bottom - (value / (step * 4)) * (height - top - bottom);
  const labelEvery = Math.ceil(months.length / 8);

  return (
    <figure className={`bg-white p-3 font-meny ${className}`}>
      <figcaption className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold">
          Dager først {mode === "totals" ? "til og med" : "i"}{" "}
          {monthName(months[active].month)}
        </span>
        <span className="flex border border-current text-sm">
          {Object.entries(modes).map(([key, label]) => (
            <button
              key={key}
              aria-pressed={key === mode}
              className="cursor-pointer px-2 aria-pressed:bg-current"
              onClick={() => setMode(key as keyof typeof modes)}
            >
              <span className="in-aria-pressed:text-white">{label}</span>
            </button>
          ))}
        </span>
      </figcaption>
      <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {lines.map(({ name, values }, index) => (
          <li key={name} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ background: colors[index % colors.length] }}
            />
            {name}
            <span className="font-bold tabular-nums">{values[active]}</span>
          </li>
        ))}
      </ul>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-2 w-full font-sans text-[11px]"
        onPointerLeave={() => setHovered(undefined)}
      >
        {[0, 1, 2, 3, 4].map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={width - right}
              y1={y(tick * step)}
              y2={y(tick * step)}
              stroke={tick ? "#e1e0d9" : "#c3c2b7"}
            />
            <text
              x={left - 8}
              y={y(tick * step)}
              textAnchor="end"
              dominantBaseline="central"
              fill="#52514e"
            >
              {tick * step}
            </text>
          </g>
        ))}
        {hovered !== undefined && (
          <line
            x1={x(hovered)}
            x2={x(hovered)}
            y1={top}
            y2={height - bottom}
            stroke="#898781"
          />
        )}
        {lines.map(({ name, values }, index) => (
          <g key={name} fill={colors[index % colors.length]}>
            <polyline
              points={values
                .map((value, month) => `${x(month)},${y(value)}`)
                .join(" ")}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {values.map((value, month) => (
              <circle
                key={month}
                cx={x(month)}
                cy={y(value)}
                r={month === active ? 5 : 3}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </g>
        ))}
        {months.map(({ month }, index) => (
          <g key={month}>
            {index % labelEvery === 0 && (
              <text
                x={x(index)}
                y={height - 8}
                textAnchor="middle"
                fill="#52514e"
              >
                {new Date(`${month}-01`).toLocaleDateString("nb-NO", {
                  month: "short",
                  year: "2-digit",
                })}
              </text>
            )}
            <rect
              x={x(index) - band / 2}
              width={band}
              height={height}
              fill="transparent"
              onPointerEnter={() => setHovered(index)}
            />
          </g>
        ))}
      </svg>
    </figure>
  );
};
