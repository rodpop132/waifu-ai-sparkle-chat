
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Sparkles, Heart, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface WaifuCreatorProps {
  onClose: () => void;
  onSave: (waifuData: WaifuData) => void;
  initialData?: WaifuData;
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

const WaifuCreator: React.FC<WaifuCreatorProps> = ({
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [waifuData, setWaifuData] = useState<WaifuData>(
    initialData || {
      name: '',
      personality: 'doce',
      description: '',
      avatar: '',
      traits: [],
      voiceStyle: 'feminina'
    }
  );
  const [avatarPreview, setAvatarPreview] = useState<string>(initialData?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const personalities = [
    { id: 'doce', label: 'Doce', icon: Heart, color: 'from-pink-400 to-pink-600' },
    { id: 'timida', label: 'Tímida', icon: Heart, color: 'from-purple-400 to-purple-600' },
    { id: 'energetica', label: 'Energética', icon: Zap, color: 'from-yellow-400 to-orange-500' },
    { id: 'misteriosa', label: 'Misteriosa', icon: Star, color: 'from-indigo-400 to-purple-600' },
    { id: 'carinhosa', label: 'Carinhosa', icon: Heart, color: 'from-red-400 to-pink-500' },
    { id: 'brincalhona', label: 'Brincalhona', icon: Sparkles, color: 'from-green-400 to-blue-500' }
  ];

  const availableTraits = [
    'Inteligente', 'Engraçada', 'Romântica', 'Aventureira', 'Criativa',
    'Gentil', 'Determinada', 'Otimista', 'Leal', 'Curiosa'
  ];

  const voiceStyles = [
    { id: 'feminina', label: 'Feminina Suave' },
    { id: 'jovem', label: 'Jovem Alegre' },
    { id: 'madura', label: 'Madura Carinhosa' },
    { id: 'anime', label: 'Estilo Anime' }
  ];

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem muito grande! Máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setWaifuData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTrait = (trait: string) => {
    setWaifuData(prev => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : [...prev.traits, trait]
    }));
  };

  const handleSave = () => {
    if (!waifuData.name.trim()) {
      toast.error('Por favor, digite um nome para sua waifu');
      return;
    }

    if (!waifuData.description.trim()) {
      toast.error('Por favor, adicione uma descrição para sua waifu');
      return;
    }

    onSave(waifuData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
              {isEditing ? 'Editar Waifu' : 'Criar Nova Waifu'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Modifique sua waifu como desejar' : 'Personalize sua companheira virtual perfeita'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Avatar Upload */}
            <Card className="p-6">
              <Label className="text-base font-semibold text-waifu-purple mb-4 block">
                Foto de Perfil
              </Label>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-waifu-pink to-waifu-purple flex items-center justify-center">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl text-white">🥰</div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-waifu-pink text-waifu-purple hover:bg-waifu-lightPink"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Escolher Foto
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 text-center">
                  JPG, PNG até 5MB
                </p>
              </div>
            </Card>

            {/* Basic Info */}
            <Card className="p-6 space-y-4">
              <Label className="text-base font-semibold text-waifu-purple">
                Informações Básicas
              </Label>
              
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome da Waifu
                </Label>
                <Input
                  id="name"
                  value={waifuData.name}
                  onChange={(e) => setWaifuData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Sakura, Yuki, Akira..."
                  className="mt-1 border-waifu-pink/30 focus:border-waifu-pink"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={waifuData.description}
                  onChange={(e) => setWaifuData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva como ela é, o que gosta de fazer, seus hobbies..."
                  rows={4}
                  className="mt-1 border-waifu-pink/30 focus:border-waifu-pink resize-none"
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Personality & Traits */}
          <div className="space-y-6">
            {/* Personality */}
            <Card className="p-6">
              <Label className="text-base font-semibold text-waifu-purple mb-4 block">
                Personalidade Principal
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {personalities.map((personality) => {
                  const IconComponent = personality.icon;
                  const isSelected = waifuData.personality === personality.id;
                  
                  return (
                    <Button
                      key={personality.id}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => setWaifuData(prev => ({ ...prev, personality: personality.id }))}
                      className={`p-4 h-auto flex flex-col gap-2 ${
                        isSelected 
                          ? `bg-gradient-to-r ${personality.color} text-white border-0` 
                          : 'border-waifu-pink/30 hover:bg-waifu-lightPink/50'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm font-medium">{personality.label}</span>
                    </Button>
                  );
                })}
              </div>
            </Card>

            {/* Traits */}
            <Card className="p-6">
              <Label className="text-base font-semibold text-waifu-purple mb-4 block">
                Características (máx. 5)
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableTraits.map((trait) => {
                  const isSelected = waifuData.traits.includes(trait);
                  const canSelect = waifuData.traits.length < 5 || isSelected;
                  
                  return (
                    <Badge
                      key={trait}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-gradient-to-r from-waifu-pink to-waifu-purple text-white' 
                          : canSelect 
                            ? 'border-waifu-pink/30 hover:bg-waifu-lightPink/50' 
                            : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => canSelect && toggleTrait(trait)}
                    >
                      {trait}
                    </Badge>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selecionadas: {waifuData.traits.length}/5
              </p>
            </Card>

            {/* Voice Style */}
            <Card className="p-6">
              <Label className="text-base font-semibold text-waifu-purple mb-4 block">
                Estilo de Voz
              </Label>
              <div className="space-y-2">
                {voiceStyles.map((voice) => (
                  <label
                    key={voice.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="voiceStyle"
                      value={voice.id}
                      checked={waifuData.voiceStyle === voice.id}
                      onChange={(e) => setWaifuData(prev => ({ ...prev, voiceStyle: e.target.value }))}
                      className="text-waifu-pink focus:ring-waifu-pink"
                    />
                    <span className="text-sm font-medium">{voice.label}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isEditing ? 'Salvar Alterações' : 'Criar Waifu'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaifuCreator;
