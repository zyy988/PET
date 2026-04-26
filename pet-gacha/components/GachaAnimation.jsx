'use client'

import { useEffect, useState } from 'react'

export default function GachaAnimation({ onComplete }) {
  const [sparkles, setSparkles] = useState([])
  
  useEffect(() => {
    // 创建闪光效果
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * 360,
      distance: 100 + Math.random() * 50,
      delay: Math.random() * 0.5
    }))
    setSparkles(newSparkles)
    
    // 2.5秒后完成动画
    const timer = setTimeout(() => {
      onComplete()
    }, 2500)
    
    return () => clearTimeout(timer)
  }, [onComplete])
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#faf8f5] via-[#f5ebe0] to-[#e8d5c4] flex flex-col items-center justify-center z-50">
      {/* 返回按钮 */}
      <button 
        onClick={onComplete}
        className="absolute top-5 left-5 flex items-center gap-2 px-5 py-2.5 bg-white/90 border-2 border-[#e8d5b5] rounded-full text-[#8b7355] font-semibold hover:bg-white hover:-translate-x-1 transition-all shadow-md"
      >
        <span className="text-xl">←</span>
        <span>返回</span>
      </button>
      
      {/* 魔法阵 */}
      <div className="relative w-96 h-96 flex items-center justify-center">
        {/* 旋转光环 */}
        <div className="absolute w-52 h-52 border-2 border-dashed border-[#ff9f43]/40 rounded-full animate-[spin_8s_linear_infinite]" />
        <div className="absolute w-72 h-72 border-2 border-dashed border-[#ffd93d]/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
        <div className="absolute w-[360px] h-[360px] border-2 border-dashed border-[#ff9f43]/20 rounded-full animate-[spin_15s_linear_infinite]" />
        
        {/* 闪光 */}
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute w-2 h-2 bg-[#ffd93d] rounded-full animate-sparkle shadow-[0_0_10px_#ffd93d]"
            style={{
              left: `calc(50% + ${Math.cos(sparkle.angle * Math.PI / 180) * sparkle.distance}px)`,
              top: `calc(50% + ${Math.sin(sparkle.angle * Math.PI / 180) * sparkle.distance}px)`,
              animationDelay: `${sparkle.delay}s`
            }}
          />
        ))}
        
        {/* 狗狗发光效果 */}
        <div className="relative z-10 animate-[pulse_1.5s_ease-in-out_infinite]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-[#ffd93d]/40 rounded-full animate-pulse-glow" />
          <span className="text-8xl block relative z-10 drop-shadow-lg">🐕</span>
        </div>
      </div>
      
      <p className="mt-10 text-lg text-[#8b7355] font-semibold animate-pulse">
        正在召唤中...
      </p>
    </div>
  )
}
