import { writeFile } from "node:fs/promises";

const map = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  ((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
const round = (v: number, places: number) => Math.round(v * 10 ** places) / 10 ** places;

let path = "";
let lastX = -Infinity;
let lastY = -Infinity;
for (let x = Math.PI * -0.5; x < Math.PI * 1.5; x += Math.PI / 64) {
  const pointX = round(map(x, Math.PI * -0.5, Math.PI * 1.5, 0, 24), 4);
  const pointY = round(map(1 / Math.cos(x), 4, -4, 0, 24), 4);
  if (pointY < 0 || pointY > 24) continue;

  const movement = Math.hypot(pointX - lastX, pointY - lastY);
  path += movement > 3 ? `M ${pointX} ${pointY} ` : `L ${pointX} ${pointY} `;
  lastX = pointX;
  lastY = pointY;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<style> @media (prefers-color-scheme: dark) { svg { color: white; } } </style>
<path d="${path.trim()}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

await writeFile("src/icon.svg", svg);
