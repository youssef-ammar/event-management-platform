'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Check, X, Heart, Star } from 'lucide-react'
import Link from 'next/link'

/* ─── Custom keyframes ─────────────────────────────────── */
const ANIM_CSS = `
  @keyframes phoneFloat {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-11px); }
  }
  @keyframes phoneSway {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-8px)  rotate(0.6deg); }
  }
  @keyframes shimmerSweep {
    0%   { left:-80%;  opacity:0; }
    6%   { opacity:1; }
    94%  { opacity:1; }
    100% { left:220%; opacity:0; }
  }
  @keyframes petalFloat {
    0%   { transform:translateY(0)     rotate(0deg);   opacity:0;    }
    12%  { opacity:0.55; }
    86%  { opacity:0.3; }
    100% { transform:translateY(-200px) rotate(520deg); opacity:0; }
  }
  @keyframes pingRing {
    0%   { transform:scale(1);   opacity:0.7; }
    100% { transform:scale(2.8); opacity:0;   }
  }
  @keyframes labelPop {
    0%   { transform:scale(0.7) translateY(8px); opacity:0; }
    65%  { transform:scale(1.1); }
    100% { transform:scale(1)   translateY(0);  opacity:1; }
  }
  @keyframes btnShine {
    0%   { left:-80%; }
    100% { left:220%; }
  }
  @keyframes cardPulse {
    0%,100% { box-shadow:0 2px 8px rgba(201,116,143,0.10); }
    50%      { box-shadow:0 4px 16px rgba(201,116,143,0.22); }
  }
  @keyframes rsvpGlow {
    0%,100% { opacity:1; }
    50%      { opacity:0.82; }
  }
`

/* ─── Floating petal particles ─────────────────────────── */
const PETALS = [
  { left:'5%',  size:5, delay:0,   dur:9,  color:'rgba(201,116,143,0.5)' },
  { left:'18%', size:3, delay:2.2, dur:6.5,color:'rgba(212,175,122,0.45)'},
  { left:'35%', size:4, delay:1,   dur:8,  color:'rgba(201,116,143,0.4)' },
  { left:'52%', size:3, delay:3.5, dur:7,  color:'rgba(212,175,122,0.5)' },
  { left:'68%', size:5, delay:0.8, dur:10, color:'rgba(201,116,143,0.45)'},
  { left:'82%', size:4, delay:2.8, dur:8.5,color:'rgba(212,175,122,0.4)' },
  { left:'94%', size:3, delay:1.5, dur:7,  color:'rgba(201,116,143,0.5)' },
]

/* ─── Reveal + visibility ──────────────────────────────── */
function useRevealSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll<HTMLElement>('.reveal')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => {
            e.target.classList.add('is-visible')
            setVisible(true)
          }, i * 120)
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.08 })
    items.forEach(item => obs.observe(item))
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

/* ─── Count-up hook ────────────────────────────────────── */
function useCountUp(target: number, active: boolean, delay = 800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => {
      let n = 0
      const id = setInterval(() => {
        n = Math.min(n + Math.ceil(target / 28), target)
        setVal(n)
        if (n >= target) clearInterval(id)
      }, 38)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(t)
  }, [active, target, delay])
  return val
}

/* ─── Animated label with ping ring ───────────────────── */
function PingLabel({ text, color, visible }: { text: string; color: string; visible: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {visible && (
        <span className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${color}`, animation: 'pingRing 1.6s ease-out 0.4s infinite' }} />
      )}
      <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-0.5 rounded-full"
        style={{
          color,
          background: `${color}18`,
          border: `1px solid ${color}40`,
          animation: visible ? 'labelPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both' : 'none',
        }}>
        {text}
      </span>
    </div>
  )
}

/* ─── Phone frame ──────────────────────────────────────── */
function PhoneFrame({
  children, width = 200, height = 420, style, className = '',
}: {
  children: React.ReactNode; width?: number; height?: number
  style?: React.CSSProperties; className?: string
}) {
  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width, height, ...style }}>
      <div className="absolute inset-0 rounded-[2.4rem] border-[2.5px] border-[#2C2C2E]"
        style={{ background: 'linear-gradient(160deg,#2A2A2C 0%,#1A1A1C 100%)' }} />
      <div className="absolute right-[-3px] top-[88px] w-[3px] h-7 bg-[#3A3A3C] rounded-r-sm" />
      <div className="absolute left-[-3px] top-[72px] w-[3px] h-5 bg-[#3A3A3C] rounded-l-sm" />
      <div className="absolute left-[-3px] top-[100px] w-[3px] h-9 bg-[#3A3A3C] rounded-l-sm" />
      <div className="absolute inset-[3px] rounded-[2.15rem] overflow-hidden bg-white">
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 bg-[#111] rounded-full z-30"
          style={{ width: 58, height: 19 }}>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#1C1C1E]" />
        </div>
        {children}
      </div>
      <div className="absolute bottom-[7px] left-1/2 -translate-x-1/2 h-[4px] rounded-full z-30"
        style={{ width: 80, background: 'rgba(255,255,255,0.28)' }} />
    </div>
  )
}

/* ─── LEFT: Guest RSVP phone ───────────────────────────── */
function GuestPhone({ visible }: { visible: boolean }) {
  return (
    <div className="reveal hidden sm:flex flex-col items-center">
      {/* Float wrapper */}
      <div className="flex flex-col items-center gap-3"
        style={{ animation: visible ? 'phoneFloat 4.5s ease-in-out 0.5s infinite' : 'none' }}>

        <PingLabel text="Invités" color="#C9748F" visible={visible} />

        {/* Tilt + hover lift */}
        <div style={{ transform: 'rotate(-8deg) translateY(24px)', transformOrigin: 'bottom center',
          transition: 'filter 0.3s', filter: 'drop-shadow(0 18px 32px rgba(0,0,0,0.18))' }}
          className="hover:!drop-shadow-[0_28px_44px_rgba(201,116,143,0.35)] cursor-pointer">
          <PhoneFrame width={192} height={410}>
            <div className="absolute inset-0 pt-[38px] overflow-hidden" style={{ background: '#FDF8F4' }}>

              {/* Hero banner */}
              <div className="relative mx-2 mt-1 rounded-2xl overflow-hidden" style={{ height: 102 }}>
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg,#C9748F 0%,#CF8F7A 50%,#D4AF7A 100%)' }} />
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 188 102" preserveAspectRatio="xMidYMid slice">
                  <circle cx="0" cy="0" r="50" fill="white"/>
                  <circle cx="188" cy="102" r="60" fill="white"/>
                  <circle cx="180" cy="10" r="25" fill="white"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                  <p className="text-white/75 text-[7px] font-semibold tracking-[0.25em] uppercase">Mariage</p>
                  <p className="font-cormorant italic font-bold text-white" style={{ fontSize: 21, lineHeight: 1.1 }}>
                    Romain &amp; Candice
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-px w-6 bg-white/40" />
                    <p className="text-white/70 text-[7.5px] font-medium">26 Septembre 2025</p>
                    <div className="h-px w-6 bg-white/40" />
                  </div>
                </div>
              </div>

              {/* RSVP cards */}
              <div className="px-2 mt-2 space-y-1.5">
                {/* Cérémonie card */}
                <div className="bg-white rounded-2xl p-2.5"
                  style={{ border: '1px solid rgba(201,116,143,0.13)',
                    animation: visible ? 'cardPulse 3s ease-in-out 1s infinite' : 'none' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#C9748F25,#C9748F45)' }}>
                      <Heart className="w-3 h-3 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[7px] font-bold uppercase tracking-widest text-rose-400">Cérémonie</p>
                      <p className="text-[9px] font-bold text-gray-800">Dim. 26 Sept · 20h00</p>
                      <p className="text-[7.5px] text-gray-400">Domaine des Lys, Provence</p>
                    </div>
                  </div>
                  <button className="relative w-full py-1.5 rounded-xl text-white text-[8px] font-bold flex items-center justify-center gap-1 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#C9748F,#D4AF7A)' }}>
                    <div className="absolute top-0 bottom-0 w-8"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)',
                        animation: 'btnShine 2.8s ease-in-out 1.5s infinite' }} />
                    <Check className="w-2.5 h-2.5" /> Je confirme ma présence
                  </button>
                </div>

                {/* Réception card */}
                <div className="bg-white rounded-2xl p-2.5"
                  style={{ border: '1px solid rgba(212,175,122,0.18)',
                    animation: visible ? 'cardPulse 3s ease-in-out 2s infinite' : 'none' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#D4AF7A25,#D4AF7A45)' }}>
                      <Star className="w-3 h-3 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[7px] font-bold uppercase tracking-widest text-amber-600">Réception</p>
                      <p className="text-[9px] font-bold text-gray-800">Mar. 28 Sept · 20h00</p>
                      <p className="text-[7.5px] text-gray-400">Villa Fleurie, Nice</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="relative flex-1 py-1.5 rounded-xl text-white text-[8px] font-bold flex items-center justify-center gap-1 overflow-hidden"
                      style={{ background: 'linear-gradient(135deg,#C9748F,#D4AF7A)' }}>
                      <div className="absolute top-0 bottom-0 w-6"
                        style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)',
                          animation: 'btnShine 3s ease-in-out 2s infinite' }} />
                      <Check className="w-2 h-2" /> Oui
                    </button>
                    <button className="flex-1 py-1.5 rounded-xl text-[8px] font-semibold flex items-center justify-center gap-1 border"
                      style={{ borderColor: '#F2D5DC', color: '#C9748F', background: '#FFF8F9' }}>
                      <X className="w-2 h-2" /> Non
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </div>
  )
}

/* ─── CENTER: Wedding invitation illustration ───────────── */
function InvitationPhone({ visible }: { visible: boolean }) {
  const leaves: Array<[number,number,number,number,number,string]> = [
    [15,58,-38,15,6.5,'#3A6028'],[35,48,-25,17,7,'#4A7038'],[55,55,12,14,6,'#3A6028'],
    [75,46,-18,16,7,'#5A8048'],[95,58,28,13,5.5,'#3A6028'],[115,50,-12,15,6.5,'#4A7038'],
    [135,60,22,14,6,'#3A6028'],[155,48,-22,16,7,'#5A8048'],[175,55,18,13,6,'#3A6028'],
    [195,50,-15,15,6.5,'#4A7038'],[218,58,25,14,6,'#3A6028'],[238,46,-30,13,5.5,'#5A8048'],
    [10,76,-50,11,4.5,'#2A5020'],[42,72,38,12,5,'#4A7038'],[78,70,-25,11,4.5,'#3A6028'],
    [112,75,20,13,5.5,'#5A8048'],[148,72,-18,11,4.5,'#3A6028'],[182,70,35,12,5,'#4A7038'],
    [218,74,-22,11,4.5,'#3A6028'],
  ]
  const garland: Array<{cx:number;cy:number;rx:number;ry:number;angle:number;fill:string}> = [
    {cx:44,cy:240,rx:13,ry:7,angle:-35,fill:'#4A7038'},{cx:30,cy:257,rx:12,ry:6.5,angle:-58,fill:'#3A6028'},
    {cx:50,cy:274,rx:14,ry:7.5,angle:-22,fill:'#5A8048'},{cx:28,cy:292,rx:12,ry:6,angle:-62,fill:'#3A6028'},
    {cx:52,cy:310,rx:15,ry:7.5,angle:-18,fill:'#4A7038'},{cx:26,cy:330,rx:12,ry:6,angle:-65,fill:'#3A6028'},
    {cx:50,cy:348,rx:14,ry:7,angle:-25,fill:'#5A8048'},{cx:28,cy:366,rx:12,ry:6.5,angle:-58,fill:'#3A6028'},
    {cx:50,cy:384,rx:13,ry:7,angle:-28,fill:'#4A7038'},{cx:28,cy:402,rx:11,ry:6,angle:-60,fill:'#3A6028'},
    {cx:48,cy:420,rx:13,ry:6.5,angle:-32,fill:'#5A8048'},{cx:30,cy:438,rx:11,ry:5.5,angle:-55,fill:'#3A6028'},
    {cx:46,cy:455,rx:12,ry:6,angle:-38,fill:'#4A7038'},
  ]
  const hydrangeas: Array<[number,number]> = [[18,64],[55,54],[95,67],[145,57],[188,67],[235,57]]
  const pearls: Array<[number,number]>     = [[30,86],[65,83],[100,86],[135,81],[168,85],[202,83],[232,85]]
  const berries: Array<[number,number]>    = [[40,247],[32,278],[48,308],[28,341],[50,371],[30,412]]

  /* Arch circumference: 2π × 178 ≈ 1118 */
  const archCircum = 1118

  return (
    <div className="reveal flex flex-col items-center gap-3">
      {/* Float wrapper */}
      <div style={{ animation: visible ? 'phoneSway 5s ease-in-out 0.6s infinite' : 'none' }}>
        <PhoneFrame width={255} height={532}
          style={{ boxShadow: '0 36px 88px rgba(0,0,0,0.30), 0 12px 32px rgba(139,21,53,0.18)',
            transition: 'filter 0.3s', filter: 'drop-shadow(0 0 0px transparent)' }}
          className="hover:!drop-shadow-[0_0_40px_rgba(139,21,53,0.28)] cursor-pointer">
          <div className="absolute inset-0 overflow-hidden" style={{ background: '#F5E0DC' }}>

            {/* Shimmer overlay */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none" style={{ borderRadius: 'inherit' }}>
              <div style={{
                position: 'absolute', top: 0, bottom: 0, width: '45%',
                background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.18),transparent 70%)',
                animation: visible ? 'shimmerSweep 4s ease-in-out 2.5s infinite' : 'none',
              }}/>
            </div>

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 249 526" preserveAspectRatio="xMidYMid meet">
              <rect width="249" height="526" fill="#F5E0DC"/>

              {/* Leaves */}
              {leaves.map(([cx,cy,angle,rx,ry,fill],i) => (
                <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} opacity="0.88"
                  transform={`rotate(${angle} ${cx} ${cy})`}/>
              ))}

              {/* Stems */}
              <path d="M0,65 Q62,48 124,60 Q186,72 249,52" fill="none" stroke="#2A5020" strokeWidth="0.8" opacity="0.42"/>
              <path d="M0,40 Q45,26 90,38 Q140,52 185,34 Q218,20 249,36" fill="none" stroke="#1A4015" strokeWidth="0.7" opacity="0.32"/>

              {/* Roses */}
              <g transform="translate(22,32)">
                <ellipse rx="14" ry="10" fill="#9B1F30" opacity="0.9"/>
                <ellipse rx="14" ry="10" fill="#9B1F30" opacity="0.82" transform="rotate(50)"/>
                <ellipse rx="9" ry="7" fill="#7A1020"/>
                <ellipse rx="9" ry="7" fill="#7A1020" transform="rotate(65)"/>
                <circle r="5.5" fill="#580A15"/><circle r="2.5" fill="#400810"/>
              </g>
              <g transform="translate(72,21)">
                <ellipse rx="16" ry="12" fill="#F0CEB0" opacity="0.92"/>
                <ellipse rx="16" ry="12" fill="#F0CEB0" opacity="0.86" transform="rotate(45)"/>
                <ellipse rx="11" ry="8" fill="#E0B090"/>
                <ellipse rx="11" ry="8" fill="#E0B090" transform="rotate(55)"/>
                <circle r="6" fill="#C89060"/><circle r="3" fill="#A87040"/>
              </g>
              <g transform="translate(124,17)">
                <ellipse rx="18" ry="14" fill="#FAF2EA" opacity="0.93"/>
                <ellipse rx="18" ry="14" fill="#FAF2EA" opacity="0.86" transform="rotate(38)"/>
                <ellipse rx="12" ry="9" fill="#F0E5D5"/>
                <ellipse rx="12" ry="9" fill="#F0E5D5" transform="rotate(52)"/>
                <circle r="6.5" fill="#E5D0B5"/><circle r="3.2" fill="#C8B090"/>
              </g>
              <g transform="translate(172,23)">
                <ellipse rx="15" ry="11" fill="#D06080" opacity="0.9"/>
                <ellipse rx="15" ry="11" fill="#D06080" opacity="0.83" transform="rotate(48)"/>
                <ellipse rx="10" ry="7.5" fill="#B84060"/>
                <ellipse rx="10" ry="7.5" fill="#B84060" transform="rotate(58)"/>
                <circle r="5.5" fill="#902040"/><circle r="2.5" fill="#701030"/>
              </g>
              <g transform="translate(225,30)">
                <ellipse rx="14" ry="10" fill="#9B1F30" opacity="0.9"/>
                <ellipse rx="14" ry="10" fill="#9B1F30" opacity="0.82" transform="rotate(52)"/>
                <ellipse rx="9" ry="7" fill="#7A1020"/>
                <circle r="5" fill="#580A15"/><circle r="2.2" fill="#400810"/>
              </g>
              <g transform="translate(48,56)">
                <ellipse rx="10" ry="7.5" fill="#E8A8B8" opacity="0.88"/>
                <ellipse rx="10" ry="7.5" fill="#E8A8B8" opacity="0.80" transform="rotate(50)"/>
                <ellipse rx="6.5" ry="5" fill="#D08898"/>
                <circle r="3.5" fill="#B87080"/><circle r="1.5" fill="#986070"/>
              </g>
              <g transform="translate(200,61)">
                <ellipse rx="10" ry="7.5" fill="#E8A8B8" opacity="0.85"/>
                <ellipse rx="10" ry="7.5" fill="#E8A8B8" opacity="0.78" transform="rotate(48)"/>
                <ellipse rx="6.5" ry="5" fill="#D08898"/>
                <circle r="3.5" fill="#B87080"/><circle r="1.5" fill="#986070"/>
              </g>

              {/* Hydrangeas */}
              {hydrangeas.map(([x,y],i) => (
                <g key={`h${i}`} transform={`translate(${x},${y})`}>
                  <circle r="3.5" fill="white" opacity="0.92"/>
                  <circle cx="4.5" r="3.2" fill="white" opacity="0.88"/>
                  <circle cx="-4.5" r="3.2" fill="white" opacity="0.88"/>
                  <circle cy="4.5" r="3.2" fill="white" opacity="0.88"/>
                  <circle cy="-4.5" r="3.2" fill="white" opacity="0.88"/>
                  <circle r="1.5" fill="#F8E5EA"/>
                </g>
              ))}

              {/* Pearls — animated twinkle */}
              {pearls.map(([x,y],i) => (
                <circle key={`p${i}`} cx={x} cy={y} r="2.8" fill="white" opacity="0.9">
                  <animate attributeName="r" values="2.8;3.8;2.8"
                    dur={`${1.4 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.28}s`}/>
                  <animate attributeName="opacity" values="0.9;1;0.9"
                    dur={`${1.4 + i * 0.18}s`} repeatCount="indefinite" begin={`${i * 0.28}s`}/>
                </circle>
              ))}

              {/* Text */}
              <text x="124.5" y="112" textAnchor="middle"
                fontFamily="Georgia,'Times New Roman',serif"
                fontSize="11.5" fill="#C9748F" fontStyle="italic">
                The Wedding of
              </text>
              <line x1="72" y1="116" x2="177" y2="116" stroke="#C9748F" strokeWidth="0.9" opacity="0.5"/>
              <text x="124.5" y="150" textAnchor="middle"
                fontFamily="'Cormorant Garamond','Palatino Linotype',Georgia,serif"
                fontSize="30" fill="#8B1535" fontStyle="italic" fontWeight="700">
                Romain
              </text>
              <text x="124.5" y="175" textAnchor="middle"
                fontFamily="'Cormorant Garamond','Palatino Linotype',Georgia,serif"
                fontSize="24" fill="#8B1535" fontStyle="italic">
                &amp; Candice
              </text>
              <rect x="57" y="186" width="135" height="25" rx="2" fill="#8B1535"/>
              <text x="124.5" y="203" textAnchor="middle"
                fontFamily="Georgia,serif" fontSize="11.5" fill="white" fontWeight="bold">
                26 Septembre 2025
              </text>

              {/* Golden arch — draws in on reveal */}
              <circle cx="124" cy="570" r="178"
                fill="none" stroke="#D4AF7A" strokeWidth="2.4" opacity="0.88"
                style={{
                  strokeDasharray: archCircum,
                  strokeDashoffset: visible ? 0 : archCircum,
                  transition: 'stroke-dashoffset 2.2s ease-out 1.4s',
                }}/>

              {/* Garland */}
              <path d="M44,224 Q38,272 36,332 Q34,392 44,456"
                fill="none" stroke="#2A5020" strokeWidth="1.4" opacity="0.65"/>
              {garland.map((l,i) => (
                <ellipse key={`g${i}`} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry}
                  fill={l.fill} opacity="0.9"
                  transform={`rotate(${l.angle} ${l.cx} ${l.cy})`}/>
              ))}
              {berries.map(([x,y],i) => (
                <circle key={`b${i}`} cx={x} cy={y} r="2.5" fill="#6A9040" opacity="0.7"/>
              ))}

              {/* Bride */}
              <path d="M126,282 Q118,276 118,285 Q114,305 117,348 Q123,336 130,324 Q136,336 142,348 Q145,305 141,285 Q141,276 133,282 Z"
                fill="#1A0A05" opacity="0.95"/>
              <circle cx="129.5" cy="278" r="12.5" fill="#C8A075"/>
              <path d="M118,290 L141,290 L143,338 L116,338 Z" fill="#5A7828" opacity="0.95"/>
              <path d="M127,290 L129.5,299 L132,290" fill="#7A9840" opacity="0.65"/>
              <path d="M118,336 C112,366 90,420 66,462 L196,462 C170,420 148,366 142,336 Z"
                fill="#8B1535" opacity="0.95"/>
              <path d="M126,340 C120,376 102,422 84,462" fill="none" stroke="#6A1025" strokeWidth="1" opacity="0.35"/>
              <path d="M136,340 C134,376 128,422 122,462" fill="none" stroke="#6A1025" strokeWidth="1" opacity="0.35"/>
              <path d="M143,300 C154,314 164,344 168,392 L161,394 C158,350 149,322 141,306 Z"
                fill="#E8B8B0" opacity="0.75"/>
              <path d="M168,392 C170,412 168,440 164,462 L158,462 C162,440 164,412 161,394 Z"
                fill="#E8B8B0" opacity="0.62"/>

              {/* Groom */}
              <path d="M170,267 Q178,258 187,262 Q193,270 192,272 Q188,264 179,264 Q172,265 172,273 Z"
                fill="#1A0A05"/>
              <circle cx="181" cy="274" r="11.5" fill="#C8A075"/>
              <path d="M168,287 L196,287 L200,398 L164,398 Z" fill="#1A1A1A" opacity="0.95"/>
              <path d="M179,287 L181.5,307 L184,287 Z" fill="white" opacity="0.9"/>
              <path d="M177,292 L181.5,295.5 L186,292 L181.5,288.5 Z" fill="#080808"/>
              <rect x="180.5" y="289.5" width="2" height="5.5" rx="0.8" fill="#101010"/>
              <path d="M179,287 L172,302 L178,300 Z" fill="#2A2A2A" opacity="0.88"/>
              <path d="M184,287 L191,302 L185,300 Z" fill="#2A2A2A" opacity="0.88"/>
              <path d="M165,396 L179,396 L179,462 L165,462 Z" fill="#0F0F0F" opacity="0.95"/>
              <path d="M183,396 L198,396 L198,462 L183,462 Z" fill="#0F0F0F" opacity="0.95"/>
              <path d="M168,298 L161,344 L158,380 L164,382 L166,347 L173,302 Z" fill="#1A1A1A"/>
              <path d="M195,298 L200,342 L202,372 L196,374 L195,345 L192,302 Z" fill="#1A1A1A"/>
              <ellipse cx="159" cy="385" rx="4" ry="3" fill="#C8A075" opacity="0.88"/>
              <ellipse cx="116" cy="385" rx="3.5" ry="2.8" fill="#C8A075" opacity="0.82"/>

              {/* Side accents */}
              <g transform="translate(-2,312)">
                <ellipse cx="12" cy="0" rx="12" ry="9" fill="#9B1F30" opacity="0.62" transform="rotate(-15 12 0)"/>
                <ellipse cx="12" cy="0" rx="8" ry="6" fill="#7A1020" opacity="0.72" transform="rotate(-15 12 0)"/>
                <circle cx="12" cy="0" r="4" fill="#580A15" opacity="0.82"/>
              </g>
              <ellipse cx="8" cy="282" rx="11" ry="5" fill="#3A6028" opacity="0.58" transform="rotate(-65 8 282)"/>
              <ellipse cx="5" cy="342" rx="10" ry="4.5" fill="#4A7038" opacity="0.52" transform="rotate(-70 5 342)"/>
              <g transform="translate(240,318)">
                <ellipse cx="0" cy="0" rx="11" ry="8" fill="#D06080" opacity="0.62" transform="rotate(20 0 0)"/>
                <ellipse cx="0" cy="0" rx="7.5" ry="5.5" fill="#B04060" opacity="0.72" transform="rotate(20 0 0)"/>
                <circle cx="0" cy="0" r="3.5" fill="#902040" opacity="0.82"/>
              </g>
              <ellipse cx="244" cy="272" rx="11" ry="5" fill="#3A6028" opacity="0.55" transform="rotate(65 244 272)"/>
              <ellipse cx="247" cy="342" rx="10" ry="4.5" fill="#4A7038" opacity="0.5" transform="rotate(70 247 342)"/>
            </svg>

            {/* Button */}
            <div className="absolute left-5 right-5 z-20" style={{ bottom: 14 }}>
              <button className="relative w-full text-white text-[12px] font-bold rounded-full py-3 tracking-wide overflow-hidden"
                style={{ background:'linear-gradient(135deg,#8B1535,#C04560)', boxShadow:'0 6px 20px rgba(139,21,53,0.42)' }}>
                <div className="absolute top-0 bottom-0 w-12"
                  style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)',
                    animation: visible ? 'btnShine 3s ease-in-out 3s infinite' : 'none' }}/>
                Confirmer ma présence
              </button>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  )
}

/* ─── RIGHT: Organizer dashboard phone ──────────────────── */
function OrganizerPhone({ visible }: { visible: boolean }) {
  const accepted  = useCountUp(28, visible, 850)
  const pending   = useCountUp(12, visible, 1000)
  const declined  = useCountUp(3,  visible, 1150)

  const guests = [
    { initials:'SM', name:'Sophie Martin', tags:['Cérémonie','Réception'], dot:'#22C55E' },
    { initials:'LB', name:'Lucas Bernard', tags:['Soirée'],               dot:'#F59E0B' },
    { initials:'EP', name:'Emma Petit',    tags:['Cérémonie'],            dot:'#22C55E' },
  ]

  return (
    <div className="reveal hidden sm:flex flex-col items-center">
      <div className="flex flex-col items-center gap-3"
        style={{ animation: visible ? 'phoneFloat 4s ease-in-out 0.8s infinite' : 'none' }}>

        <PingLabel text="Organisateur" color="#D4AF7A" visible={visible} />

        <div style={{ transform:'rotate(8deg) translateY(24px)', transformOrigin:'bottom center',
          transition:'filter 0.3s', filter:'drop-shadow(0 18px 32px rgba(0,0,0,0.18))' }}
          className="hover:!drop-shadow-[0_28px_44px_rgba(212,175,122,0.4)] cursor-pointer">
          <PhoneFrame width={192} height={410}>
            <div className="absolute inset-0 pt-[38px] overflow-hidden" style={{ background:'#FDFAF6' }}>

              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2"
                style={{ background:'linear-gradient(135deg,rgba(201,116,143,0.05),rgba(212,175,122,0.07))' }}>
                <div>
                  <p className="text-[7.5px] text-gray-400">Tableau de bord</p>
                  <p className="text-[11px] font-bold text-gray-800 leading-tight">Mariage R &amp; C</p>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[7.5px] font-bold"
                  style={{ background:'linear-gradient(135deg,#C9748F,#D4AF7A)' }}>RC</div>
              </div>

              {/* Stats — animated count-up */}
              <div className="grid grid-cols-3 gap-1.5 px-2.5 pt-2 pb-1">
                {[
                  { n: accepted,  l:'Acceptés',   c:'#22C55E', bg:'#F0FDF4', border:'#BBF7D0' },
                  { n: pending,   l:'En attente', c:'#F59E0B', bg:'#FFFBEB', border:'#FDE68A' },
                  { n: declined,  l:'Refusés',    c:'#EF4444', bg:'#FFF5F5', border:'#FECACA' },
                ].map(s => (
                  <div key={s.l} className="rounded-xl py-2 text-center"
                    style={{ background:s.bg, border:`1px solid ${s.border}`,
                      animation: visible ? 'cardPulse 3.5s ease-in-out infinite' : 'none' }}>
                    <p className="text-[16px] font-bold leading-tight"
                      style={{ color:s.c, animation: visible ? 'statPop 0.4s ease-out both' : 'none' }}>
                      {s.n}
                    </p>
                    <p className="text-[6px] text-gray-400 font-medium leading-tight">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="px-2.5 mb-2">
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div style={{ width:'65%', background:'#22C55E',
                    transition: visible ? 'width 1.2s ease-out 1s' : 'none' }} />
                  <div style={{ width:'28%', background:'#FCD34D' }} />
                  <div style={{ width:'7%',  background:'#F87171', borderRadius:'0 9999px 9999px 0' }} />
                </div>
                <div className="flex justify-between mt-0.5">
                  <p className="text-[6.5px] text-gray-400">43 invités total</p>
                  <p className="text-[6.5px] font-bold" style={{ color:'#C9748F' }}>65% confirmés</p>
                </div>
              </div>

              {/* Guest list */}
              <div className="px-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[8.5px] font-bold text-gray-700">Invités récents</p>
                  <p className="text-[7px] font-semibold" style={{ color:'#C9748F' }}>Voir tous</p>
                </div>
                <div className="space-y-1.5">
                  {guests.map((g, gi) => (
                    <div key={g.name} className="flex items-center gap-2 bg-white rounded-xl px-2 py-1.5"
                      style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.04)',
                        animation: visible ? `cardPulse 3s ease-in-out ${gi * 0.5}s infinite` : 'none' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[6.5px] font-bold flex-shrink-0"
                        style={{ background:'linear-gradient(135deg,#C9748F,#D4AF7A)' }}>
                        {g.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[8.5px] font-semibold text-gray-800 leading-tight truncate">{g.name}</p>
                        <div className="flex gap-0.5 mt-0.5 flex-wrap">
                          {g.tags.map(t => (
                            <span key={t} className="text-[5.5px] px-1 py-px rounded-full font-semibold"
                              style={{ background:'rgba(201,116,143,0.08)', color:'#C9748F', border:'1px solid rgba(201,116,143,0.15)' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full" style={{ background:g.dot }} />
                        <div className="absolute inset-0 rounded-full"
                          style={{ background:g.dot, opacity:0.4,
                            animation: visible ? 'pingRing 2s ease-out infinite' : 'none' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </div>
  )
}

/* ─── Trust logos ──────────────────────────────────────── */
const LOGOS = [
  { name:'STATION F',           font:'font-inter font-black text-sm tracking-[0.15em]' },
  { name:'LE SALON DU MARIAGE', font:'font-playfair font-bold text-xs tracking-wider'  },
  { name:'marie claire',        font:'font-cormorant italic font-bold text-lg tracking-wide' },
]

/* ─── Section ──────────────────────────────────────────── */
export function FeaturesSection() {
  const { ref: sectionRef, visible } = useRevealSection()

  return (
    <>
      {/* Inject custom keyframes */}
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />

      <section
        ref={sectionRef}
        id="features"
        className="py-20 overflow-hidden relative"
        style={{ background:'linear-gradient(160deg,#FDFAF6 0%,#FFF5F8 50%,#FDFAF6 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.06] animate-blob"
            style={{ background:'radial-gradient(circle,#C9748F,transparent 70%)' }} />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05] animate-blob"
            style={{ background:'radial-gradient(circle,#D4AF7A,transparent 70%)', animationDelay:'4s' }} />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

          {/* Floating rose petals */}
          {PETALS.map((p, i) => (
            <div key={i} style={{
              position:'absolute', left:p.left, bottom:'5%',
              width:p.size, height:p.size, borderRadius:'50%',
              background:p.color,
              animation:`petalFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}/>
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Trust logos */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mb-14 reveal">
            {LOGOS.map(l => (
              <span key={l.name} className={`${l.font} opacity-40 text-gray-800 hover:opacity-70 transition-opacity duration-300 cursor-default`}>
                {l.name}
              </span>
            ))}
          </div>

          {/* Headline */}
          <div className="text-center mb-14 reveal">
            <span className="section-tag">✦ Fonctionnalités</span>
            <h2 className="font-playfair font-bold text-gray-900 leading-[1.1] mx-auto mt-2"
              style={{ fontSize:'clamp(28px,4vw,52px)', maxWidth:680 }}>
              Une invitation comme vous{' '}
              <span className="italic text-gradient">n'en avez jamais vu</span>
            </h2>
            <p className="section-subtitle mt-3">
              Deux expériences parfaites — pour l'organisateur et pour l'invité.
            </p>
          </div>

          {/* Three-phone showcase */}
          <div className="flex items-end justify-center gap-3 md:gap-6 mb-14">
            <GuestPhone visible={visible} />
            <InvitationPhone visible={visible} />
            <OrganizerPhone visible={visible} />
          </div>

          {/* Bottom CTAs */}
          <div className="text-center space-y-5 reveal">
            <Link href="#how-it-works"
              className="inline-block text-sm font-semibold text-rose-500 underline underline-offset-4 hover:text-rose-600 transition-colors">
              Découvrez toutes les fonctionnalités
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/auth/register">
                <button className="px-7 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-200 hover:shadow-md hover:scale-[1.03] bg-white/70"
                  style={{ borderColor:'#C9748F', color:'#C9748F' }}>
                  Démo organisateur
                </button>
              </Link>
              <Link href="/invite/demo-token">
                <button className="px-7 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-200 hover:shadow-md hover:scale-[1.03] bg-white/70"
                  style={{ borderColor:'#D4AF7A', color:'#C89A55' }}>
                  Démo invité
                </button>
              </Link>
            </div>

            <div>
              <Link href="/auth/register">
                <button className="relative inline-flex items-center gap-2 px-9 py-3.5 rounded-full text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.04] overflow-hidden"
                  style={{ background:'linear-gradient(135deg,#C9748F,#D4AF7A)', boxShadow:'0 8px 24px rgba(201,116,143,0.35)' }}>
                  <div className="absolute top-0 bottom-0 w-16"
                    style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)',
                      animation:'btnShine 3s ease-in-out 1s infinite' }}/>
                  En savoir plus
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
