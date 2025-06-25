
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Upload, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface WaifuCreatorProps {
  onClose: () => void;
  onSave: (waifuData: WaifuData) => void;
  initialData?: {
    name: string;
    personality: string;
    description: string;
    avatar: string;
  };
  isEditing?: boolean;
}

interface WaifuData {
  name: string;
  personality: string;
  description: string;
  avatar: string;
  traits: string[];
  voiceStyle: string;
}

const WaifuCreator: React.FC<WaifuCreatorProps> = ({ onClose, onSave, initialData, isEditing = false }) => {
  const [waifuData, setWaifuData] = useState<WaifuData>({
    name: initialData?.name || '',
    personality: initialData?.personality || 'doce',
    description: initialData?.description || '',
    avatar: initialData?.avatar || '',
    traits: [],
    voiceStyle: 'carinhosa'
  });

  const personalities = [
    { id: 'doce', name: 'Doce', description: 'Gentil e carinhosa 💕', color: 'bg-pink-100 text-pink-800' },
    { id: 'tsundere', name: 'Tsundere', description: 'Orgulhosa mas fofa 😤💖', color: 'bg-red-100 text-red-800' },
    { id: 'kawaii', name: 'Kawaii', description: 'Super fofa e energética 🥰✨', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'misteriosa', name: 'Misteriosa', description: 'Elegante e enigmática 🌙', color: 'bg-purple-100 text-purple-800' },
    { id: 'ciumenta', name: 'Ciumenta', description: 'Possessiva e apaixonada 😏💔', color: 'bg-green-100 text-green-800' },
    { id: 'timida', name: 'Tímida', description: 'Reservada e inocente 😊🌸', color: 'bg-blue-100 text-blue-800' }
  ];

  const commonTraits = [
    'Romântica', 'Cuidadosa', 'Brincalhona', 'Inteligente', 'Energética',
    'Elegante', 'Fofa', 'Orgulhosa', 'Alegre', 'Carinhosa', 'Protetora'
  ];

  const voiceStyles = [
    { id: 'carinhosa', name: 'Carinhosa', description: 'Voz doce e amorosa' },
    { id: 'energetica', name: 'Energética', description: 'Voz animada e vibrante' },
    { id: 'calma', name: 'Calma', description: 'Voz suave e tranquila' },
    { id: 'sedutora', name: 'Sedutora', description: 'Voz sensual e misteriosa' }
  ];

  const handleTraitToggle = (trait: string) => {
    setWaifuData(prev => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : prev.traits.length < 5 
          ? [...prev.traits, trait]
          : prev.traits
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem muito grande! Máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setWaifuData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!waifuData.name.trim()) {
      toast.error('Por favor, dê um nome para sua waifu! 💕');
      return;
    }

    onSave(waifuData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-waifu-pink" />
              {isEditing ? 'Editar Sua Waifu' : 'Criar Sua Waifu Personalizada'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-waifu-purple hover:bg-waifu-lightPink"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32 border-4 border-waifu-pink">
                    {waifuData.avatar ? (
                      <AvatarImage src={waifuData.avatar} alt="Waifu Avatar" className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-r from-waifu-pink to-waifu-purple text-white text-4xl">
                        {waifuData.name.charAt(0) || '💖'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-waifu-pink text-white p-2 rounded-full cursor-pointer hover:bg-waifu-accent transition-colors">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-waifu-purple/70">
                  Clique no ícone para adicionar uma foto da sua waifu
                </p>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-waifu-purple font-semibold">
                  Nome da Waifu *
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Sakura, Yuki, Akira..."
                  value={waifuData.name}
                  onChange={(e) => setWaifuData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2 border-waifu-pink/30 focus:border-waifu-pink"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-waifu-purple font-semibold">
                  Descrição Personalizada
                </Label>
                <textarea
                  id="description"
                  placeholder="Descreva sua waifu... seus gostos, personalidade, história..."
                  value={waifuData.description}
                  onChange={(e) => setWaifuData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 w-full p-3 border border-waifu-pink/30 rounded-md focus:border-waifu-pink focus:ring-waifu-pink/20 resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* Right Column - Personality & Traits */}
            <div className="space-y-6">
              {/* Personality */}
              <div>
                <Label className="text-waifu-purple font-semibold mb-3 block">
                  Personalidade Principal
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {personalities.map((personality) => (
                    <div
                      key={personality.id}
                      onClick={() => setWaifuData(prev => ({ ...prev, personality: personality.id }))}
                      className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                        waifuData.personality === personality.id
                          ? 'border-waifu-pink bg-waifu-lightPink/30'
                          : 'border-gray-200 hover:border-waifu-pink/50'
                      }`}
                    >
                      <Badge className={`${personality.color} mb-2`}>
                        {personality.name}
                      </Badge>
                      <p className="text-xs text-gray-600">{personality.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traits */}
              <div>
                <Label className="text-waifu-purple font-semibold mb-3 block">
                  Características Extras (máximo 5)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {commonTraits.map((trait) => (
                    <Badge
                      key={trait}
                      variant={waifuData.traits.includes(trait) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        waifuData.traits.includes(trait)
                          ? 'bg-waifu-pink text-white hover:bg-waifu-accent'
                          : 'border-waifu-pink text-waifu-purple hover:bg-waifu-lightPink'
                      } ${waifuData.traits.length >= 5 && !waifuData.traits.includes(trait) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleTraitToggle(trait)}
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-waifu-purple/60 mt-2">
                  Selecionadas: {waifuData.traits.length}/5
                </p>
              </div>

              {/* Voice Style */}
              <div>
                <Label className="text-waifu-purple font-semibold mb-3 block">
                  Estilo de Voz
                </Label>
                <div className="space-y-2">
                  {voiceStyles.map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() => setWaifuData(prev => ({ ...prev, voiceStyle: voice.id }))}
                      className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                        waifuData.voiceStyle === voice.id
                          ? 'border-waifu-pink bg-waifu-lightPink/30'
                          : 'border-gray-200 hover:border-waifu-pink/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-waifu-purple">{voice.name}</span>
                        <span className="text-xs text-gray-600">{voice.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-waifu-pink text-waifu-purple hover:bg-waifu-lightPink"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple text-white px-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isEditing ? 'Salvar Alterações' : 'Criar Waifu'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WaifuCreator;
