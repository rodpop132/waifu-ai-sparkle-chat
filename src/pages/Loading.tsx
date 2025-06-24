
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

const Loading = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const navigate = useNavigate();

  const loadingMessages = [
    "Esquentando o ramen virtual... 🍜",
    "Arrumando o travesseiro da waifu... 🛏️",
    "Atualizando sentimentos... 💖",
    "Aplicando tsundere mode... 😤",
    "Preparando abraços virtuais... 🤗",
    "Sincronizando corações... 💕",
    "Carregando kawaii mode... ✨",
    "Sua waifu está quase pronta! 🥰"
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    const loadingTimeout = setTimeout(() => {
      navigate('/chat');
    }, 8000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(loadingTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen waifu-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-20 left-20 text-waifu-pink animate-float">
        <Heart size={20} className="animate-pulse-heart" />
      </div>
      <div className="absolute top-40 right-40 text-waifu-purple animate-float delay-500">
        <Sparkles size={24} />
      </div>
      <div className="absolute bottom-40 left-40 text-waifu-accent animate-float delay-1000">
        <Heart size={16} />
      </div>
      <div className="absolute bottom-20 right-20 text-waifu-pink animate-float delay-700">
        <Sparkles size={18} />
      </div>

      <div className="text-center">
        {/* Main waifu avatar placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-waifu-lightPink to-waifu-pink rounded-full flex items-center justify-center border-4 border-white shadow-2xl animate-float">
              <div className="text-6xl animate-pulse-heart">
                🥰
              </div>
            </div>
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2 text-waifu-purple animate-pulse-heart">
              <Sparkles size={20} />
            </div>
            <div className="absolute -bottom-2 -left-2 text-waifu-accent animate-pulse-heart delay-500">
              <Heart size={16} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Loading title */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent mb-6">
          Waifu AI Chat
        </h1>

        {/* Loading message */}
        <div className="mb-8 h-16">
          <p className="text-xl text-waifu-purple font-semibold animate-fade-in">
            {loadingMessages[messageIndex]}
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full animate-pulse loading-bar"></div>
          </div>
        </div>

        {/* Cute loading hearts */}
        <div className="flex justify-center gap-2">
          <Heart size={20} className="text-waifu-pink animate-pulse-heart" fill="currentColor" />
          <Heart size={20} className="text-waifu-purple animate-pulse-heart delay-200" fill="currentColor" />
          <Heart size={20} className="text-waifu-accent animate-pulse-heart delay-400" fill="currentColor" />
        </div>

        <p className="text-waifu-purple/70 mt-6 text-sm">
          Criando a experiência perfeita para você... 💕
        </p>
      </div>

      <style jsx>{`
        .loading-bar {
          animation: loading-progress 8s ease-in-out forwards;
        }
        
        @keyframes loading-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Loading;
