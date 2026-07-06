import { batteryHexColor } from "@/lib/utils/battery";

const PIN_WIDTH = 32;
const PIN_HEIGHT = 42;
const BADGE_HEIGHT = 24;
const BADGE_CANVAS_WIDTH = 40;

export function buildVehiclePinIcon(
  color: string,
  isSelected: boolean,
  batteryPercentage: number | null,
) {
  const hasBadge = batteryPercentage != null;
  const canvasWidth = hasBadge ? BADGE_CANVAS_WIDTH : PIN_WIDTH;
  const viewBoxHeight = PIN_HEIGHT + (hasBadge ? BADGE_HEIGHT : 0);
  const pinOffsetX = hasBadge ? (BADGE_CANVAS_WIDTH - PIN_WIDTH) / 2 : 0;
  const pinOffsetY = hasBadge ? BADGE_HEIGHT : 0;
  const badgeCenterX = canvasWidth / 2;

  const badge = hasBadge
    ? `<rect x="2" y="2" width="${canvasWidth - 4}" height="20" rx="10" fill="${batteryHexColor(batteryPercentage!)}" stroke="#ffffff" stroke-width="2"/>
       <text x="${badgeCenterX}" y="16" text-anchor="middle" font-size="9.5" font-weight="700" fill="#ffffff" font-family="Arial, sans-serif">${Math.round(batteryPercentage!)}%</text>`
    : "";

  const scale = isSelected ? 1.25 : 1;
  const width = Math.round(canvasWidth * scale);
  const height = Math.round(viewBoxHeight * scale);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${canvasWidth} ${viewBoxHeight}">
    ${badge}
    <g transform="translate(${pinOffsetX},${pinOffsetY})">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11.5 16 26 16 26s16-14.5 16-26C32 7.163 24.837 0 16 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="16" cy="15.5" r="10.5" fill="#ffffff" fill-opacity="0.18"/>
      <g transform="translate(7,7.2) scale(0.72)" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <circle cx="5" cy="19" r="2.3" fill="#ffffff" stroke="none"/>
        <circle cx="17" cy="19" r="2.3" fill="#ffffff" stroke="none"/>
        <path d="M5 19h9l3-8h4"/>
        <path d="M14 11l3 8"/>
        <path d="M11 4h4M13 4v6"/>
      </g>
    </g>
  </svg>`;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(width, height),
    anchor: new google.maps.Point(width / 2, height),
  };
}
