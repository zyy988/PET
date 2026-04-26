import { supabase } from './supabase'

// 稀有度配置
const RARITY_CONFIG = {
  common: { name: '普通', stars: '⭐', color: '#95a5a6' },
  rare: { name: '稀有', stars: '⭐⭐', color: '#3498db' },
  epic: { name: '史诗', stars: '⭐⭐⭐', color: '#9b59b6' },
  legendary: { name: '传说', stars: '⭐⭐⭐⭐⭐', color: '#f39c12' }
}

// 抽卡逻辑
export async function drawCard(poolType = 'standard', userId) {
  // 获取卡池配置
  const { data: poolConfig, error: poolError } = await supabase
    .from('pool_configs')
    .select('*')
    .eq('slug', poolType)
    .single()
  
  if (poolError) throw poolError
  
  // 获取所有宠物
  const { data: pets, error: petsError } = await supabase
    .from('pet_cards')
    .select('*')
  
  if (petsError) throw petsError
  
  // 根据卡池配置计算概率
  const rates = poolConfig.rates
  const upPetIds = poolConfig.up_pet_ids || []
  
  // 随机选择稀有度
  const random = Math.random()
  let cumulative = 0
  let selectedRarity = 'common'
  
  for (const [rarity, rate] of Object.entries(rates)) {
    cumulative += rate
    if (random <= cumulative) {
      selectedRarity = rarity
      break
    }
  }
  
  // 获取该稀有度的宠物
  let petsOfRarity = pets.filter(pet => pet.rarity === selectedRarity)
  
  // UP卡池：UP宠物概率提升
  if (upPetIds.length > 0) {
    const upPets = petsOfRarity.filter(pet => upPetIds.includes(pet.id))
    const normalPets = petsOfRarity.filter(pet => !upPetIds.includes(pet.id))
    
    // 70%概率抽到UP宠物
    if (upPets.length > 0 && Math.random() < 0.7) {
      petsOfRarity = upPets
    } else {
      petsOfRarity = normalPets
    }
  }
  
  // 随机选择宠物
  const selectedPet = petsOfRarity[Math.floor(Math.random() * petsOfRarity.length)]
  
  // 获取习惯
  const { data: habit, error: habitError } = await supabase
    .from('habits')
    .select('*')
    .eq('id', selectedPet.habit_id)
    .single()
  
  if (habitError) throw habitError
  
  // 记录抽卡历史
  if (userId) {
    await supabase
      .from('draw_history')
      .insert([{
        user_id: userId,
        pet_id: selectedPet.id,
        pool_type: poolType
      }])
  }
  
  return {
    ...selectedPet,
    habit,
    rarityConfig: RARITY_CONFIG[selectedPet.rarity]
  }
}

// 十连抽
export async function drawTenCards(poolType = 'standard', userId) {
  const results = []
  
  for (let i = 0; i < 10; i++) {
    // 第10次保底稀有以上
    if (i === 9) {
      const { data: pets, error } = await supabase
        .from('pet_cards')
        .select('*')
        .in('rarity', ['rare', 'epic', 'legendary'])
      
      if (error) throw error
      
      const guaranteedPet = pets[Math.floor(Math.random() * pets.length)]
      const { data: habit } = await supabase
        .from('habits')
        .select('*')
        .eq('id', guaranteedPet.habit_id)
        .single()
      
      results.push({
        ...guaranteedPet,
        habit,
        rarityConfig: RARITY_CONFIG[guaranteedPet.rarity],
        isGuaranteed: true
      })
    } else {
      const result = await drawCard(poolType, userId)
      results.push(result)
    }
  }
  
  return results
}

// 检查是否已收藏
export async function checkCollection(userId, petId) {
  const { data, error } = await supabase
    .from('user_collections')
    .select('*')
    .eq('user_id', userId)
    .eq('pet_id', petId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

// 添加到收藏
export async function addToCollection(userId, petId) {
  const { data, error } = await supabase
    .from('user_collections')
    .insert([{
      user_id: userId,
      pet_id: petId
    }])
    .select()
  
  if (error) throw error
  return data
}
