'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ResultModal({ pet, onClose, onDrawAgain, onCollect }) {
  const [showConfetti, setShowConfetti] = useState(false)
  
  useEffect(() => {
    if (pet?.rarity === 'epic' || pet?.rarity === 'legendary') {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [pet])
  
  if (!pet) return null
  
  const rarityColors = {
    common: 'from-[#95a5a6] to-[#7f8c8d]',
    rare: 'from-[#3498db] to-[#2980b9]',
    epic: 'from-[#9b59b6] to-[#8e44ad]',
    legendary: 'from-[#f39c12] to-[#e67e22]'
  }
  
  const rarityNames = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#faf8f5] via-[#f5ebe0] to-[#e8d5c4] overflow-y-auto z-50">
      {/* 彩纸效果 */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 animate-[confetti-fall_3s_ease-out_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                background: ['#ffd93d', '#ff9f43', '#ff6b9d', '#a8edea', '#d299c2'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0'
              }}
            />
          ))}
        </div>
      )}
      
      {/* 返回按钮 */}
      <button 
        onClick={onClose}
        className="fixed top-5 left-5 flex items-center gap-2 px-5 py-2.5 bg-white/90 border-2 border-[#e8d5b5] rounded-full text-[#8b7355] font-semibold hover:bg-white hover:-translate-x-1 transition-all shadow-md z-50"
      >
        <span className="text-xl">←</span>
        <span>返回</span>
      </button>
      
      <div className="min-h-screen flex flex-col items-center pt-20 pb-10 px-4">
        <div className="flex flex-col lg:flex-row gap-10 max-w-5xl w-full">
          {/* 左侧：狗狗展示 */}
          <div className="flex-shrink-0">
            <div className="bg-white/95 rounded-3xl p-8 text-center shadow-xl border-3 border-[#f0e6d8] animate-card-appear w-full max-w-sm mx-auto">
              <div className="relative w-52 h-52 mx-auto mb-5 bg-gradient-to-br from-[#faf8f5] to-[#f5ebe0] rounded-full flex items-center justify-center border-4 border-[#e8d5c4]">
                <Image
                  src={pet.image_url}
                  alt={pet.name}
                  width={180}
                  height={180}
                  className="rounded-full object-contain p-2.5"
                />
                <span className={`absolute bottom-2.5 right-2.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rarityColors[pet.rarity]} shadow-md`}>
                  {rarityNames[pet.rarity]}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-[#5d4e37] mb-2">{pet.name}</h2>
              <div className="text-2xl tracking-widest">
                {'⭐'.repeat(pet.rarity === 'legendary' ? 5 : pet.rarity === 'epic' ? 3 : pet.rarity === 'rare' ? 2 : 1)}
              </div>
            </div>
          </div>
          
          {/* 右侧：详细信息 */}
          <div className="flex-1 flex flex-col gap-5">
            {/* 基本信息 */}
            <div className="bg-white/90 rounded-2xl p-5 shadow-md border-2 border-[#f0e6d8]">
              <h3 className="text-base font-semibold text-[#8b7355] mb-4 flex items-center gap-2">
                📋 基本信息
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 p-3 bg-[#faf8f5] rounded-xl text-center">
                  <span className="text-xs text-[#a08060]">品种</span>
                  <span className="text-sm font-semibold text-[#5d4e37]">{pet.breed}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-[#faf8f5] rounded-xl text-center">
                  <span className="text-xs text-[#a08060]">性格</span>
                  <span className="text-sm font-semibold text-[#5d4e37]">{pet.personality}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-[#faf8f5] rounded-xl text-center">
                  <span className="text-xs text-[#a08060]">稀有度</span>
                  <span className={`text-sm font-bold ${
                    pet.rarity === 'legendary' ? 'text-[#e67e22]' :
                    pet.rarity === 'epic' ? 'text-[#8e44ad]' :
                    pet.rarity === 'rare' ? 'text-[#2980b9]' : 'text-[#7f8c8d]'
                  }`}>
                    {rarityNames[pet.rarity]}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 特殊习惯 */}
            {pet.habit && (
              <div className="bg-white/90 rounded-2xl p-5 shadow-md border-2 border-[#f0e6d8]">
                <h3 className="text-base font-semibold text-[#8b7355] mb-4 flex items-center gap-2">
                  🎯 特殊习惯
                </h3>
                <div className="bg-gradient-to-r from-[#fff9e6] to-[#fff5d6] rounded-xl p-4 border-2 border-[#ffe4b5]">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-2xl">{pet.habit.emoji}</span>
                    <span className="text-base font-bold text-[#8b6914]">{pet.habit.name}</span>
                  </div>
                  <p className="text-sm text-[#a08060] leading-relaxed">{pet.habit.description}</p>
                </div>
              </div>
            )}
            
            {/* 特点介绍 */}
            <div className="bg-white/90 rounded-2xl p-5 shadow-md border-2 border-[#f0e6d8]">
              <h3 className="text-base font-semibold text-[#8b7355] mb-3 flex items-center gap-2">
                💡 特点介绍
              </h3>
              <p className="text-sm text-[#5d4e37] leading-7">
                {pet.description}。{pet.feature}。
              </p>
            </div>
            
            {/* 属性值 */}
            <div className="bg-white/90 rounded-2xl p-5 shadow-md border-2 border-[#f0e6d8]">
              <h3 className="text-base font-semibold text-[#8b7355] mb-4 flex items-center gap-2">
                📊 属性值
              </h3>
              <div className="flex flex-col gap-3">
                {Object.entries(pet.stats).map(([key, value]) => {
                  const labels = { cute: '可爱度', active: '活泼度', loyal: '忠诚度', smart: '聪明度' }
                  return (
                    <div key={key} className="flex items-center gap-2.5">
                      <span className="w-14 text-xs font-semibold text-[#8b7355]">{labels[key]}</span>
                      <div className="flex-1 h-3 bg-[#f0e6d8] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#ffd93d] to-[#ff9f43] rounded-full transition-all duration-1000"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="w-8 text-xs font-bold text-[#ff9f43] text-right">{value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-5 mt-8">
          <button
            onClick={onDrawAgain}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ffd93d] to-[#ff9f43] text-white rounded-full font-bold text-base shadow-lg hover:-translate-y-1 hover:scale-105 transition-all"
          >
            <span>🎲</span>
            <span>再抽一次</span>
          </button>
          <button
            onClick={onCollect}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ff6b9d] to-[#ff8e53] text-white rounded-full font-bold text-base shadow-lg hover:-translate-y-1 hover:scale-105 transition-all"
          >
            <span>💖</span>
            <span>收入囊中</span>
          </button>
        </div>
      </div>
    </div>
  )
}
