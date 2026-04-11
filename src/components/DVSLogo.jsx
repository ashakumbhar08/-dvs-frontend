import { Link } from "react-router-dom"
import { ROUTES } from "../utils/constants"

export default function DVSLogo() {
  return (
    <Link to={ROUTES.LANDING} className="flex items-center gap-2 shrink-0">
      {/* 3×3 node/grid icon */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Grid lines */}
        <line x1="4"  y1="4"  x2="14" y2="14" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="24" y1="4"  x2="14" y2="14" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="4"  y1="24" x2="14" y2="14" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="24" y1="24" x2="14" y2="14" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="4"  y1="4"  x2="24" y2="4"  stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="4"  y1="24" x2="24" y2="24" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="4"  y1="4"  x2="4"  y2="24" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="24" y1="4"  x2="24" y2="24" stroke="#185FA5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="14" y1="4"  x2="14" y2="24" stroke="#185FA5" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
        <line x1="4"  y1="14" x2="24" y2="14" stroke="#185FA5" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
        {/* Corner nodes */}
        <circle cx="4"  cy="4"  r="2"   fill="#185FA5" fillOpacity="0.5" />
        <circle cx="24" cy="4"  r="2"   fill="#185FA5" fillOpacity="0.5" />
        <circle cx="4"  cy="24" r="2"   fill="#185FA5" fillOpacity="0.5" />
        <circle cx="24" cy="24" r="2"   fill="#185FA5" fillOpacity="0.5" />
        {/* Edge midpoint nodes */}
        <circle cx="14" cy="4"  r="1.5" fill="#185FA5" fillOpacity="0.35" />
        <circle cx="14" cy="24" r="1.5" fill="#185FA5" fillOpacity="0.35" />
        <circle cx="4"  cy="14" r="1.5" fill="#185FA5" fillOpacity="0.35" />
        <circle cx="24" cy="14" r="1.5" fill="#185FA5" fillOpacity="0.35" />
        {/* Center node — larger, fully filled */}
        <circle cx="14" cy="14" r="3.5" fill="#185FA5" />
      </svg>
      <span className="font-bold tracking-widest text-base text-gray-900">DVS</span>
    </Link>
  )
}
