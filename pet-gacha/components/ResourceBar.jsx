'use client'

import { useState, useEffect } from 'react'

export default function ResourceBar({ resources, onAdd }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-4 z-50 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-[#f0e6d8]">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#faf8f5] to-[#f5ebe0] rounded-full border border-[#e8d5c4]">
        <span className="text-xl">🎫</span>
        <span className="text-xs font-semibold text-[#8b7355]">召唤券</span>
        <span className="text-base font-bold text-[#5d4e37] min-w-[30px] text-center">{resources.ticket}</span>
        <button 
          onClick={() => onAdd('ticket', 1)}
          className="w-5 h-5 bg-gradient-to-r from-[#ffd93d] to-[#ff9f43] text-white rounded-full text-xs font-bold hover:scale-110 transition-transform"
        >
          +
        </button>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#faf8f5] to-[#f5ebe0] rounded-full border border-[#e8d5c4]">
        <span className="text-xl">💎</span>
        <span className="text-xs font-semibold text-[#8b7355]">钻石</span>
        <span className="text-base font-bold text-[#5d4e37] min-w-[30px] text-center">{resources.diamond}</span>
        <button 
          onClick={() => onAdd('diamond', 100)}
          className="w-5 h-5 bg-gradient-to-r from-[#ffd93d] to-[#ff9f43] text-white rounded-full text-xs font-bold hover:scale-110 transition-transform"
        >
          +
        </button>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#faf8f5] to-[#f5ebe0] rounded-full border border-[#e8d5c4]">
        <span className="text-xl">🪙</span>
        <span className="text-xs font-semibold text-[#8b7355]">金币</span>
        <span className="text-base font-bold text-[#5d4e37] min-w-[30px] text-center">{resources.coin}</span>
        <button 
          onClick={() => onAdd('coin', 1000)}
          className="w-5 h-5 bg-gradient-to-r from-[#ffd93d] to-[#ff9f43] text-white rounded-full text-xs font-bold hover:scale-110 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  )
}
