'use client'

import { useRouter } from 'next/navigation'

const BUTTONS = [
  { id: 'collection', icon: '📚', text: '图鉴', path: '/collection' },
  { id: 'shop', icon: '🏪', text: '商店', path: '/shop' },
  { id: 'quest', icon: '📜', text: '任务', path: '/quest', hasBadge: true },
  { id: 'rank', icon: '🏆', text: '排行', path: '/rank' },
  { id: 'setting', icon: '⚙️', text: '设置', path: '/setting' },
]

export default function FunctionButtons() {
  const router = useRouter()
  
  return (
    <div className="fixed top-20 right-5 flex flex-col gap-3 z-40">
      {BUTTONS.map(btn => (
        <button
          key={btn.id}
          onClick={() => router.push(btn.path)}
          className="flex flex-col items-center gap-1 p-3 bg-white/95 backdrop-blur-sm border-2 border-[#f0e6d8] rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-16 relative"
        >
          <span className="text-2xl">{btn.icon}</span>
          <span className="text-[11px] font-semibold text-[#8b7355]">{btn.text}</span>
          {btn.hasBadge && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ff6b6b] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              !
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
