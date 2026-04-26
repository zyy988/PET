'use client'

import { useState } from 'react'

export default function GachaButton({ drawType, onDraw, resources }) {
  const [selectedType, setSelectedType] = useState('ticket')
  
  const singleCost = selectedType === 'ticket' ? 1 : 100
  const tenCost = selectedType === 'ticket' ? 10 : 900
  const icon = selectedType === 'ticket' ? '🎫' : '💎'
  
  const canDrawSingle = resources[selectedType] >= singleCost
  const canDrawTen = resources[selectedType] >= tenCost
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-5 flex-wrap justify-center">
        {/* 单抽按钮 */}
        <button
          onClick={() => canDrawSingle && onDraw(1, selectedType)}
          disabled={!canDrawSingle}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 min-w-[180px] relative ${
            canDrawSingle 
              ? 'bg-gradient-to-r from-[#74b9ff] to-[#0984e3] shadow-lg hover:-translate-y-1 hover:scale-105 hover:shadow-xl' 
              : 'bg-gray-400 cursor-not-allowed opacity-60'
          }`}
        >
          <span className="text-3xl">🎫</span>
          <div className="flex flex-col items-start">
            <span className="text-base">召唤 1 次</span>
            <span className="text-sm opacity-90 bg-white/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
              <span>{icon}</span>
              <span>{singleCost}</span>
            </span>
          </div>
        </button>
        
        {/* 十连抽按钮 */}
        <button
          onClick={() => canDrawTen && onDraw(10, selectedType)}
          disabled={!canDrawTen}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 min-w-[180px] relative ${
            canDrawTen 
              ? 'bg-gradient-to-r from-[#fd79a8] to-[#e84393] shadow-lg hover:-translate-y-1 hover:scale-105 hover:shadow-xl' 
              : 'bg-gray-400 cursor-not-allowed opacity-60'
          }`}
        >
          <span className="text-3xl">🎁</span>
          <div className="flex flex-col items-start">
            <span className="text-base">召唤 10 次</span>
            <span className="text-sm opacity-90 bg-white/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
              <span>{icon}</span>
              <span>{tenCost}</span>
            </span>
          </div>
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#ffd93d] to-[#ff9f43] text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-md animate-bounce">
            送1次
          </span>
        </button>
      </div>
      
      {/* 支付方式切换 */}
      <div className="flex gap-2.5 bg-white/80 p-2 rounded-full border-2 border-[#f0e6d8]">
        <button
          onClick={() => setSelectedType('ticket')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            selectedType === 'ticket'
              ? 'bg-gradient-to-r from-[#ffd93d] to-[#ff9f43] text-white shadow-md'
              : 'text-[#8b7355] hover:bg-[#ffd93d]/20'
          }`}
        >
          🎫 使用召唤券
        </button>
        <button
          onClick={() => setSelectedType('diamond')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            selectedType === 'diamond'
              ? 'bg-gradient-to-r from-[#ffd93d] to-[#ff9f43] text-white shadow-md'
              : 'text-[#8b7355] hover:bg-[#ffd93d]/20'
          }`}
        >
          💎 使用钻石
        </button>
      </div>
    </div>
  )
}
