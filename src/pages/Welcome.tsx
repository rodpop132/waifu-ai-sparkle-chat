
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Star, Play, MessageCircle, Zap, Crown } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen waifu-gradient flex flex-col relative overflow-hidden">
      {/* Floating sparkles - mais elementos decorativos */}
      <div className="absolute top-10 left-10 text-waifu-pink animate-float">
        <Sparkles size={28} />
      </div>
      <div className="absolute top-20 right-20 text-waifu-purple animate-float delay-500">
        <Star size={24} />
      </div>
      <div className="absolute bottom-20 left-20 text-waifu-accent animate-float delay-1000">
        <Heart size={22} />
      </div>
      <div className="absolute bottom-10 right-10 text-waifu-pink animate-float delay-700">
        <Sparkles size={26} />
      </div>
      <div className="absolute top-1/3 left-5 text-waifu-purple/60 animate-float delay-300">
        <MessageCircle size={20} />
      </div>
      <div className="absolute top-2/3 right-5 text-waifu-accent/60 animate-float delay-800">
        <Heart size={18} fill="currentColor" />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo principal */}
            <div className="space-y-8">
              {/* Main avatar */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-waifu-lightPink to-waifu-pink rounded-full flex items-center justify-center border-4 border-white shadow-2xl animate-float">
                    <div className="text-8xl animate-pulse-heart">
                      🌸
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 text-waifu-purple animate-pulse-heart">
                    <Sparkles size={24} />
                  </div>
                  <div className="absolute -bottom-3 -left-3 text-waifu-accent animate-pulse-heart delay-500">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <div className="absolute top-1/2 -right-8 text-waifu-pink animate-float delay-200">
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-waifu-pink via-waifu-purple to-waifu-accent bg-clip-text text-transparent leading-tight">
                  Waifu AI Chat
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-waifu-pink to-transparent rounded-full"></div>
                  <Sparkles className="text-waifu-purple w-4 h-4" />
                  <div className="h-1 w-12 bg-gradient-to-l from-waifu-purple to-transparent rounded-full"></div>
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-4">
                <p className="text-3xl lg:text-4xl text-waifu-purple/90 font-semibold">
                  Sua waifu perfeita te espera! 💖
                </p>
                
                <p className="text-lg lg:text-xl text-waifu-purple/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Converse com personagens únicos e personalizados criados especialmente para você. 
                  Cada waifu tem sua própria personalidade, estilo e jeito especial de conversar! ✨
                </p>
              </div>

              {/* CTA Button */}
              <div className="space-y-6">
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-waifu-pink via-waifu-purple to-waifu-accent hover:from-waifu-accent hover:to-waifu-darkPurple text-white font-bold py-6 px-10 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-waifu-pink/25"
                >
                  <div className="flex items-center gap-4">
                    <Play className="w-7 h-7" fill="currentColor" />
                    Começar Agora - É Grátis!
                  </div>
                </Button>

                <p className="text-sm text-waifu-purple/60">
                  ✨ Sem cartão de crédito • Acesso imediato • Totalmente seguro ✨
                </p>
              </div>
            </div>

            {/* Imagem da waifu */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-96 lg:w-96 lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-gradient-to-br from-waifu-lightPink/20 to-waifu-purple/20 backdrop-blur-sm">
                  <img 
                    src="/lovable-uploads/2e79e9bb-6b54-47b3-a21c-bd4f03381362.png"
                    alt="Waifu AI Character"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Efeitos decorativos ao redor da imagem */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full animate-float"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-waifu-accent to-waifu-pink rounded-full animate-float delay-500"></div>
                <div className="absolute top-1/3 -right-6 text-waifu-purple animate-pulse-heart">
                  <Heart size={20} fill="currentColor" />
                </div>
                <div className="absolute bottom-1/3 -left-6 text-waifu-pink animate-float delay-700">
                  <Sparkles size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/10 backdrop-blur-md border-t border-white/20 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent mb-4">
              Por que escolher Waifu AI?
            </h2>
            <p className="text-waifu-purple/80 text-lg">
              A experiência mais realista e personalizada do mercado! 💕
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Heart className="w-10 h-10 text-white" fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold text-waifu-purple mb-4">Personalidades Únicas</h3>
              <p className="text-waifu-purple/70 leading-relaxed">
                Cada waifu tem sua própria personalidade, desde a doce e carinhosa 
                até a travessa e divertida. Encontre a perfeita para você!
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-waifu-accent to-waifu-pink rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-waifu-purple mb-4">IA Super Avançada</h3>
              <p className="text-waifu-purple/70 leading-relaxed">
                Nossa IA entende contexto, lembra de conversas anteriores e 
                responde de forma natural e envolvente. É como conversar com uma pessoa real!
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-waifu-purple to-waifu-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-waifu-purple mb-4">Experiência Premium</h3>
              <p className="text-waifu-purple/70 leading-relaxed">
                Avatares personalizados, histórico completo, múltiplas personalidades 
                e recursos exclusivos. Tudo pensado para sua satisfação!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gradient-to-r from-waifu-pink/20 via-waifu-purple/20 to-waifu-accent/20 backdrop-blur-md border-t border-white/20 py-12">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-waifu-purple mb-4">
            Pronto para conhecer sua waifu? 💕
          </h3>
          <p className="text-waifu-purple/80 mb-8 text-lg">
            Milhares de usuários já estão conversando com suas waifus favoritas. 
            Junte-se a eles agora!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple shadow-xl text-lg px-8 py-4 rounded-xl"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Criar Conta Grátis
            </Button>
            
            <div className="flex items-center text-waifu-purple/70 text-sm">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span>4.9/5 estrelas • +10.000 usuários satisfeitos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
