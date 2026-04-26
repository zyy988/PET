-- 宠物抽卡游戏数据库初始化
-- 创建时间: 2026-04-25

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 宠物卡片表
CREATE TABLE pet_cards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  breed TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  personality TEXT NOT NULL,
  description TEXT NOT NULL,
  feature TEXT NOT NULL,
  stats JSONB NOT NULL DEFAULT '{"cute": 50, "active": 50, "loyal": 50, "smart": 50}',
  habit_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 习惯表
CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户资料表（扩展Supabase Auth）
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  coins INTEGER DEFAULT 50000,
  diamonds INTEGER DEFAULT 1000,
  tickets INTEGER DEFAULT 10,
  total_draws INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户收藏表
CREATE TABLE user_collections (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id INTEGER NOT NULL REFERENCES pet_cards(id),
  obtained_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

-- 抽卡记录表
CREATE TABLE draw_history (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id INTEGER NOT NULL REFERENCES pet_cards(id),
  pool_type TEXT NOT NULL DEFAULT 'standard',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 卡池配置表
CREATE TABLE pool_configs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  rates JSONB NOT NULL,
  up_pet_ids INTEGER[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 宠物卡片：所有人可读
CREATE POLICY "宠物卡片公开可读" ON pet_cards
  FOR SELECT USING (true);

-- 习惯：所有人可读
CREATE POLICY "习惯公开可读" ON habits
  FOR SELECT USING (true);

-- 用户资料：用户只能读写自己的资料
CREATE POLICY "用户只能访问自己的资料" ON profiles
  FOR ALL USING (auth.uid() = id);

-- 用户收藏：用户只能访问自己的收藏
CREATE POLICY "用户只能访问自己的收藏" ON user_collections
  FOR ALL USING (auth.uid() = user_id);

-- 抽卡记录：用户只能访问自己的记录
CREATE POLICY "用户只能访问自己的抽卡记录" ON draw_history
  FOR ALL USING (auth.uid() = user_id);

-- 卡池配置：所有人可读
CREATE POLICY "卡池配置公开可读" ON pool_configs
  FOR SELECT USING (true);

-- 创建触发器：自动更新updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建触发器：新用户注册时自动创建资料
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 插入初始习惯数据
INSERT INTO habits (name, emoji, description) VALUES
  ('跟随守护', '👣', '喜欢跟在你身后，做你的小跟班'),
  ('捡球达人', '🎾', '看到球就兴奋，百玩不厌'),
  ('干饭小能手', '🍽️', '吃饭积极不挑食，光盘行动践行者'),
  ('撒娇卖萌', '🥺', '用可爱征服你，讨抱抱高手'),
  ('安静陪伴', '😴', '默默陪伴在身边，不吵不闹'),
  ('看家护院', '🏠', '警惕性高，守护家园的小卫士'),
  ('社交达人', '🤝', '喜欢和其他狗狗玩耍，朋友遍天下'),
  ('聪明伶俐', '🧠', '学东西很快，指令一遍就会');

-- 插入初始宠物卡片数据
INSERT INTO pet_cards (id, name, image_url, breed, rarity, personality, description, feature, stats, habit_id) VALUES
  (1, '毛毛', '/images/pets/01_pomeranian.png', '博美犬', 'common', '活泼可爱', '一只毛茸茸的博美小狗，像个小毛球一样可爱', '金黄色的蓬松毛发，尾巴卷曲得像朵花', '{"cute": 85, "active": 75, "loyal": 70, "smart": 65}', 1),
  (2, '雪宝', '/images/pets/02_samoyed.png', '萨摩耶', 'common', '甜美温柔', '微笑天使萨摩耶，总是带着甜甜的笑容', '雪白蓬松的长毛，笑起来特别治愈', '{"cute": 90, "active": 70, "loyal": 80, "smart": 72}', 2),
  (3, '棉花糖', '/images/pets/03_bichon.png', '比熊犬', 'common', '粘人可爱', '像棉花糖一样软萌的比熊犬，人见人爱', '纯白色的卷毛，摸起来像云朵一样软', '{"cute": 88, "active": 60, "loyal": 75, "smart": 70}', 3),
  (4, '小短腿', '/images/pets/04_corgi.png', '柯基犬', 'common', '呆萌搞笑', '短腿小柯基，跑起来屁股一扭一扭的超可爱', '短短的小腿，长长的身体，走路摇摇摆摆', '{"cute": 82, "active": 65, "loyal": 80, "smart": 78}', 4),
  (5, '柴柴', '/images/pets/05_shiba.png', '柴犬', 'common', '独立傲娇', '来自日本的柴犬，表情丰富超有趣', '橘红色的毛发，三角形的耳朵竖立着', '{"cute": 80, "active": 75, "loyal": 70, "smart": 85}', 5),
  (6, '边牧博士', '/images/pets/06_bordercollie.png', '边境牧羊犬', 'rare', '聪明机警', '智商排名第一的边牧，学习能力超强', '黑白相间的毛色，眼神充满智慧', '{"cute": 75, "active": 95, "loyal": 85, "smart": 100}', 8),
  (7, '拉拉', '/images/pets/07_labrador.png', '拉布拉多', 'rare', '友善温和', '最受欢迎的导盲犬，对人超级友善', '金黄色的短毛，尾巴像水獭一样粗壮', '{"cute": 78, "active": 85, "loyal": 95, "smart": 88}', 1),
  (8, '金宝', '/images/pets/08_golden.png', '金毛寻回犬', 'rare', '温柔绅士', '大暖男金毛，对人非常温柔体贴', '金黄色的长毛，性格温顺友好', '{"cute": 82, "active": 80, "loyal": 98, "smart": 85}', 2),
  (9, '哈哈', '/images/pets/09_husky.png', '哈士奇', 'rare', '搞怪活泼', '拆迁办主任哈士奇，表情帝兼话痨', '蓝眼睛，黑白灰相间的毛发，喜欢狼嚎', '{"cute": 85, "active": 100, "loyal": 60, "smart": 75}', 3),
  (10, '阿拉', '/images/pets/10_alaskan.png', '阿拉斯加', 'epic', '憨厚稳重', '大型犬阿拉斯加，看起来威武其实很温柔', '厚实的毛发，体型庞大但性格温顺', '{"cute": 80, "active": 75, "loyal": 90, "smart": 82}', 4),
  (11, '牛牛', '/images/pets/11_frenchbulldog.png', '法国斗牛犬', 'epic', '呆萌倔强', '法斗牛牛，外表凶萌内心温柔的小胖子', '扁平的脸，大大的耳朵，身材结实', '{"cute": 88, "active": 50, "loyal": 85, "smart": 75}', 5),
  (12, '公主', '/images/pets/12_poodle.png', '贵宾犬', 'epic', '高贵优雅', '优雅的贵宾公主，聪明又漂亮', '卷曲的毛发，可以修剪成各种造型', '{"cute": 90, "active": 70, "loyal": 88, "smart": 98}', 6),
  (13, '警长', '/images/pets/13_germanshepherd.png', '德国牧羊犬', 'legendary', '勇敢正直', '威风凛凛的德牧警长，守护正义的化身', '黑棕相间的毛色，眼神坚定有力', '{"cute": 75, "active": 95, "loyal": 100, "smart": 96}', 7),
  (14, '小猎', '/images/pets/14_beagle.png', '比格犬', 'legendary', '好奇活泼', '大耳朵比格犬，嗅觉灵敏的猎兔犬', '大大的垂耳朵，三色毛发，叫声洪亮', '{"cute": 88, "active": 90, "loyal": 80, "smart": 85}', 8),
  (15, '喜乐', '/images/pets/15_sheltie.png', '喜乐蒂牧羊犬', 'legendary', '聪明温顺', '小型牧羊犬喜乐蒂，优雅又聪明', '长长的毛发，像小型的苏格兰牧羊犬', '{"cute": 92, "active": 80, "loyal": 95, "smart": 94}', 1);

-- 插入卡池配置
INSERT INTO pool_configs (name, slug, description, rates, up_pet_ids) VALUES
  ('标准召唤', 'standard', '所有狗狗均等概率', '{"common": 0.35, "rare": 0.30, "epic": 0.25, "legendary": 0.10}', '{}'),
  ('毛绒绒UP', 'fluffy', '博美和萨摩耶概率提升', '{"common": 0.30, "rare": 0.35, "epic": 0.25, "legendary": 0.10}', '{1, 2}'),
  ('学霸UP', 'smart', '边牧和德牧概率提升', '{"common": 0.30, "rare": 0.35, "epic": 0.25, "legendary": 0.10}', '{6, 13}'),
  ('传说UP', 'legend', '传说狗狗概率翻倍', '{"common": 0.30, "rare": 0.30, "epic": 0.25, "legendary": 0.15}', '{}');

-- 创建索引
CREATE INDEX idx_pet_cards_rarity ON pet_cards(rarity);
CREATE INDEX idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX idx_draw_history_user_id ON draw_history(user_id);
CREATE INDEX idx_pool_configs_slug ON pool_configs(slug);

-- 重置序列
SELECT setval('pet_cards_id_seq', 15, true);
SELECT setval('habits_id_seq', 8, true);
