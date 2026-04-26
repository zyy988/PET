'use client'

import { useState, useCallback } from 'react'
import ResourceBar from '@/components/ResourceBar'
import PoolSelector from '@/components/PoolSelector'
import GachaButton from '@/components/GachaButton'
import FunctionButtons from '@/components/FunctionButtons'
import GachaAnimation from '@/components/GachaAnimation'
import ResultModal from '@/components/ResultModal'
import { drawCard } from '@/lib/gacha'

export default function Home() {
  const [resources, setResources] = useState({
    ticket: 10,
    diamond: 1000,
    coin: 50000
  })
  const [selectedPool, setSelectedPool] = useState('standard')
  const [isAnimating, setIsAnimating] = useState(false)
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  
  // 添加资源（测试用）
  const handleAddResource = useCallback((type, amount) => {
    setResources(prev => ({
      ...prev,
      [type]: prev[type] + amount
    }))
  }, [])
  
  // 消耗资源
  const consumeResource = useCallback((type, amount) => {
    setResources(prev => {
      if (prev[type] < amount) return prev
      return {
        ...prev,
        [type]: prev[type] - amount
      }
    })
  }, [])
  
  // 开始抽卡
  const handleDraw = useCallback(async (count, type) => {
    const cost = count === 10 ? (type === 'ticket' ? 10 : 900) : (type === 'ticket' ? 1 : 100)
    
    if (resources[type] < cost) {
      alert(`💰 ${type === 'ticket' ? '召唤券' : '钻石'}不足！`)
      return
    }
    
    // 消耗资源
    consumeResource(type, cost)
    
    // 显示动画
    setIsAnimating(true)
  }, [resources, consumeResource])
  
  // 动画完成
  const handleAnimationComplete = useCallback(async () => {
    try {
      const pet = await drawCard(selectedPool)
      setResult(pet)
      setIsAnimating(false)
      setShowResult(true)
    } catch (error) {
      console.error('抽卡失败:', error)
      alert('抽卡失败，请重试！')
      setIsAnimating(false)
    }
  }, [selectedPool])
  
  // 再抽一次
  const handleDrawAgain = useCallback(() => {
    setShowResult(false)
    setResult(null)
    handleDraw(1, 'ticket')
  }, [handleDraw])
  
  // 收入囊中
  const handleCollect = useCallback(() => {
    alert(`💖 ${result?.name} 已加入你的收藏！`)
    setShowResult(false)
    setResult(null)
  }, [result])
  
  // 关闭结果
  const handleCloseResult = useCallback(() => {
    setShowResult(false)
    setResult(null)
  }, [])
  
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 顶部资源栏 */}
      <ResourceBar resources={resources} onAdd={handleAddResource} />
      
      {/* 左侧UP卡池 */}
      <PoolSelector selectedPool={selectedPool} onSelect={setSelectedPool} />
      
      {/* 右侧功能按钮 */}
      <FunctionButtons />
      
      {/* 主内容区 */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* 背景墙装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-[65%] bg-gradient-to-b from-[#faf8f5] to-[#f5ebe0]" />
          <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-b from-[#e8d5c4] to-[#d4c4b0] border-t-2 border-[#d4c4b0]" />
        </div>
        
        {/* 装饰元素 */}
        <div className="absolute inset-0 pointer-events-none -z-5">
          <div className="absolute top-[45%] right-[8%] text-6xl filter drop-shadow-md animate-float">🪴</div>
          <div className="absolute top-[50%] right-[15%] text-4xl opacity-80 animate-float" style={{animationDelay: '0.5s'}}>🌿</div>
          <div className="absolute top-[35%] right-[5%] text-8xl filter drop-shadow-lg">🏠</div>
          <div className="absolute bottom-[15%] right-[12%] text-5xl filter drop-shadow-md">🟡</div>
          <div className="absolute bottom-[20%] right-[20%] text-3xl animate-bounce">🔵</div>
          <div className="absolute bottom-[12%] left-[8%] text-4xl -rotate-12">🦴</div>
        </div>
        
        {/* 标题 */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-4xl opacity-60 animate-float">🐾</span>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#8b7355] tracking-wider drop-shadow-sm">
              宠物习惯召唤
            </h1>
            <p className="text-base md:text-lg text-[#a08060] mt-2">
              每一次召唤，遇见特别的它
            </p>
          </div>
          <span className="text-4xl opacity-60 animate-float" style={{animationDelay: '0.5s'}}>🐾</span>
        </div>
        
        {/* 习惯预览 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-2 border-[#f0e6d8] w-full max-w-xs mb-8">
          <h3 className="text-sm font-bold text-[#8b7355] mb-3">🐾 可能获得的习惯</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: '👣', name: '跟随守护', desc: '喜欢跟在你身后' },
              { icon: '🎾', name: '捡球达人', desc: '看到球就兴奋' },
              { icon: '🍽️', name: '干饭小能手', desc: '吃饭积极不挑食' },
              { icon: '💕', name: '撒娇卖萌', desc: '用可爱征服你' },
              { icon: '😴', name: '安静陪伴', desc: '默默陪伴在身边' },
            ].map(habit => (
              <div key={habit.name} className="flex items-center gap-3 p-2 bg-[#faf8f5] rounded-xl hover:bg-[#f5ebe0] hover:translate-x-1 transition-all">
                <span className="text-2xl w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">{habit.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#5d4e37]">{habit.name}</span>
                  <span className="text-xs text-[#a08060]">{habit.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 抽卡区域 */}
        <div className="flex flex-col items-center gap-5">
          {/* 狗狗展示 */}
          <div className="w-48 h-48 bg-white/90 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-[#f0e6d8]">
            <span className="text-7xl opacity-30 animate-float">🐕</span>
            <span className="text-sm text-[#a08060] mt-2">等待召唤...</span>
          </div>
          
          {/* 抽卡按钮 */}
          <GachaButton 
            drawType="ticket" 
            onDraw={handleDraw}
            resources={resources}
          />
          
          <p className="text-sm text-[#a08060]">✨ 每10次召唤必得稀有以上 ✨</p>
        </div>
      </div>
      
      {/* 抽卡动画 */}
      {isAnimating && (
        <GachaAnimation onComplete={handleAnimationComplete} />
      )}
      
      {/* 结果展示 */}
      {showResult && result && (
        <ResultModal 
          pet={result}
          onClose={handleCloseResult}
          onDrawAgain={handleDrawAgain}
          onCollect={handleCollect}
        />
      )}
    </main>
  )
}
