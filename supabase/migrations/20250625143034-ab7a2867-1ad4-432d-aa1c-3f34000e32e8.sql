
-- Adicionar colunas para personalização da waifu na tabela conversations
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS waifu_avatar TEXT,
ADD COLUMN IF NOT EXISTS waifu_description TEXT;

-- Atualizar conversas existentes com avatars padrão se não tiverem
UPDATE public.conversations 
SET waifu_avatar = CASE 
  WHEN waifu_name = 'Sakura' THEN '🌸'
  WHEN waifu_name = 'Yuki' THEN '❄️'
  WHEN waifu_name = 'Akira' THEN '⚡'
  WHEN waifu_name = 'Rei' THEN '🌙'
  ELSE '💖'
END
WHERE waifu_avatar IS NULL;
