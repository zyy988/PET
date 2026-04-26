import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 获取当前用户
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// 获取用户资料
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// 更新用户资源
export async function updateResources(userId, resources) {
  const { data, error } = await supabase
    .from('profiles')
    .update(resources)
    .eq('id', userId)
  
  if (error) throw error
  return data
}

// 获取所有宠物卡片
export async function getPetCards() {
  const { data, error } = await supabase
    .from('pet_cards')
    .select(`
      *,
      habit:habits(*)
    `)
    .order('id')
  
  if (error) throw error
  return data
}

// 获取用户收藏
export async function getUserCollection(userId) {
  const { data, error } = await supabase
    .from('user_collections')
    .select(`
      *,
      pet:pet_cards(*)
    `)
    .eq('user_id', userId)
    .order('obtained_at', { ascending: false })
  
  if (error) throw error
  return data
}

// 添加收藏
export async function addToCollection(userId, petId) {
  const { data, error } = await supabase
    .from('user_collections')
    .insert([{ user_id: userId, pet_id: petId }])
    .select()
  
  if (error) throw error
  return data
}

// 记录抽卡历史
export async function recordDraw(userId, petId, poolType) {
  const { data, error } = await supabase
    .from('draw_history')
    .insert([{ 
      user_id: userId, 
      pet_id: petId,
      pool_type: poolType 
    }])
  
  if (error) throw error
  return data
}

// 获取卡池配置
export async function getPoolConfigs() {
  const { data, error } = await supabase
    .from('pool_configs')
    .select('*')
    .eq('is_active', true)
  
  if (error) throw error
  return data
}
