'use client'

import { useState } from 'react'

const POOLS = [
  { id: 'standard', name: '标准召唤', emoji: '🐕', rate: '全品种', color: 'from-[#e8d5c4] to-[#d4c4b0]' },
  { id: 'fluffy', name: '毛绒绒UP', emoji: '🦁', rate: '博美/萨摩耶', color: 'from-[#ffeaa7] to-[#fab1a0]', isUp: true },
  { id: 'smart', name: '学霸UP', emoji: '🎓', rate: '边牧/德牧', color: 'from-[#74b9ff] to-[#a29bfe]', isUp: true },
  { id: 'legend', name: '传说UP', emoji: '👑', rate: '传说概率×2', color: 'from-[#fd79a8] to-[#e17055]', isUp: true },
]

export default function PoolSelector({ selectedPool, onSelect }) {
  return (
    <div className="fixed top-20 left-5 w-44 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-[#f0e6d8] z-40">
      <h3 className="text-sm font-bold text-[#8b7355] mb-3 text-center">🎯 UP卡池</h3>
      <div className="flex flex-col gap-2.5">
        {POOLS.map(pool => (
          <div
            key={pool.id}
            onClick={() => onSelect(pool.id)}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all duration-300 border-2 relative ${
              selectedPool === pool.id 
                ? 'bg-gradient-to-r from-[#fff9e6] to-[#fff5d6] border-[#ffd93d] shadow-md' 
                : 'bg-[#faf8f5] border-transparent hover:bg-[#f5ebe0] hover:translate-x-1'
            }`}
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${pool.color} rounded-lg flex items-center justify-center text-xl`}>
              {pool.emoji}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#5d4e37]">{pool.name}</span>
              <span className="text-[10px] text-[#a08060]">{pool.rate}</span>
            </div>
            {pool.isUp && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                UP
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
