
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Star, Play } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen waifu-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating sparkles */}
      <div className="absolute top-10 left-10 text-waifu-pink animate-float">
        <Sparkles size={24} />
      </div>
      <div className="absolute top-20 right-20 text-waifu-purple animate-float delay-500">
        <Star size={20} />
      </div>
      <div className="absolute bottom-20 left-20 text-waifu-accent animate-float delay-1000">
        <Heart size={18} />
      </div>
      <div className="absolute bottom-10 right-10 text-waifu-pink animate-float delay-700">
        <Sparkles size={22} />
      </div>

      <div className="text-center max-w-4xl mx-auto">
        {/* Main avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-waifu-lightPink to-waifu-pink rounded-full flex items-center justify-center border-4 border-white shadow-2xl animate-float">
              <div className="text-6xl animate-pulse-heart">
                🌸
              </div>
            </div>
            <div className="absolute -top-2 -right-2 text-waifu-purple animate-pulse-heart">
              <Sparkles size={20} />
            </div>
            <div className="absolute -bottom-2 -left-2 text-waifu-accent animate-pulse-heart delay-500">
              <Heart size={16} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent mb-6">
          Waifu AI Chat
        </h1>

        {/* Subtitle */}
        <p className="text-2xl text-waifu-purple/80 mb-4 font-medium">
          Converse com sua waifu perfeita! 💕
        </p>
        
        <p className="text-lg text-waifu-purple/70 mb-12 max-w-2xl mx-auto">
          Experimente conversas únicas, personalizadas e cheias de carinho com nossa IA avançada. 
          Sua waifu ideal está esperando por você! ✨
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-waifu-purple mb-2">Conversas Personalizadas</h3>
            <p className="text-waifu-purple/70">Cada waifu tem sua personalidade única e especial</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-waifu-accent to-waifu-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-waifu-purple mb-2">IA Avançada</h3>
            <p className="text-waifu-purple/70">Respostas inteligentes e contextuais para uma experiência real</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-waifu-purple to-waifu-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-waifu-purple mb-2">Múltiplas Personalidades</h3>
            <p className="text-waifu-purple/70">Doce, tsundere, kawaii - encontre sua favorita!</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate('/auth')}
          className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6" fill="currentColor" />
            Começar Agora - É Grátis!
          </div>
        </Button>

        <p className="text-sm text-waifu-purple/60 mt-6">
          ✨ Comece com 30 mensagens gratuitas • Sem cartão de crédito necessário ✨
        </p>
      </div>
    </div>
  );
};

export default Welcome;
