
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import WaifuAvatar from './WaifuAvatar';

interface WaifuSelectorProps {
  currentWaifu: {
    name: string;
    personality: string;
    avatar: string;
  };
  onSelect: (waifu: any) => void;
  onClose: () => void;
}

const WaifuSelector: React.FC<WaifuSelectorProps> = ({ currentWaifu, onSelect, onClose }) => {
  const waifus = [
    {
      name: 'Sakura',
      personality: 'doce',
      avatar: '🌸',
      description: 'Uma garota gentil e carinhosa que adora cuidar de você 💕',
      traits: ['Romântica', 'Cuidadosa', 'Timida']
    },
    {
      name: 'Akira',
      personality: 'tsundere',
      avatar: '⚡',
      description: 'Um pouco teimosa, mas tem um coração doce quando você ganha sua confiança 😤💖',
      traits: ['Ciumenta', 'Orgulhosa', 'Fofa']
    },
    {
      name: 'Yuki',
      personality: 'kawaii',
      avatar: '❄️',
      description: 'Uma garota super fofa e energética que adora se divertir! 🥰✨',
      traits: ['Energética', 'Brincalhona', 'Alegre']
    },
    {
      name: 'Rei',
      personality: 'misteriosa',
      avatar: '🌙',
      description: 'Calma e elegante, mas esconde muitos segredos interessantes 🌟',
      traits: ['Inteligente', 'Elegante', 'Enigmática']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
            Escolha sua Waifu 💕
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {waifus.map((waifu) => (
            <Card
              key={waifu.name}
              className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                currentWaifu.name === waifu.name
                  ? 'border-waifu-pink bg-waifu-lightPink/30'
                  : 'border-waifu-pink/20 hover:border-waifu-pink/50'
              }`}
              onClick={() => {
                onSelect(waifu);
                onClose();
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <WaifuAvatar waifu={waifu} size="md" />
                <div>
                  <h3 className="font-bold text-waifu-purple">{waifu.name}</h3>
                  <Badge variant="outline" className="border-waifu-pink text-waifu-purple text-xs">
                    {waifu.personality}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-waifu-purple/80 mb-3">
                {waifu.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {waifu.traits.map((trait) => (
                  <Badge
                    key={trait}
                    variant="secondary"
                    className="text-xs bg-waifu-purple/10 text-waifu-purple"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-waifu-purple/70">
            Cada waifu tem sua personalidade única! 🌟
          </p>
        </div>
      </Card>
    </div>
  );
};

export default WaifuSelector;
