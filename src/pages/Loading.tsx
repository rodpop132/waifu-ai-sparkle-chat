
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Star, Crown, Zap } from 'lucide-react';
import PricingPlans from '@/components/PricingPlans';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Loading = () => {
  const [showPlans, setShowPlans] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const loadingMessages = [
    "Configurando sua waifu personalizada... 🌸",
    "Preparando conversas incríveis... 💬",
    "Ativando modo kawaii... ✨",
    "Sincronizando corações... 💕",
    "Quase pronto para conhecer sua waifu! 🥰"
  ];

  useEffect(() => {
    if (!showPlans) {
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
    }
  }, [navigate, showPlans]);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Usuário não encontrado! Redirecionando...');
        navigate('/auth');
        return;
      }

      // Atualizar o plano do usuário
      const planLimits = {
        free: 30,
        pro: 10000,
        ultra: -1 // -1 significa ilimitado
      };

      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan_type: planId,
          messages_limit: planLimits[planId as keyof typeof planLimits]
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating plan:', error);
        toast.error('Erro ao atualizar plano. Tente novamente.');
        setIsProcessing(false);
        return;
      }

      toast.success(`Plano ${planId.toUpperCase()} ativado com sucesso! 🎉`);
      
      // Delay para mostrar sucesso antes de ir para loading
      setTimeout(() => {
        setShowPlans(false);
      }, 1500);

    } catch (error) {
      console.error('Error selecting plan:', error);
      toast.error('Erro ao processar plano. Tente novamente.');
      setIsProcessing(false);
    }
  };

  if (showPlans) {
    return (
      <div className="min-h-screen waifu-gradient relative overflow-hidden">
        {/* Floating anime elements */}
        <div className="absolute top-10 left-10 text-waifu-pink animate-float">
          <Sparkles size={24} className="animate-pulse" />
        </div>
        <div className="absolute top-20 right-20 text-waifu-purple animate-float delay-500">
          <Star size={20} className="animate-pulse" />
        </div>
        <div className="absolute bottom-20 left-20 text-waifu-accent animate-float delay-1000">
          <Heart size={18} className="animate-pulse" />
        </div>
        <div className="absolute bottom-10 right-10 text-waifu-pink animate-float delay-700">
          <Crown size={22} className="animate-pulse" />
        </div>
        <div className="absolute top-1/2 left-10 text-waifu-purple animate-float delay-300">
          <Zap size={16} className="animate-pulse" />
        </div>
        <div className="absolute top-1/3 right-10 text-waifu-accent animate-float delay-800">
          <Sparkles size={20} className="animate-pulse" />
        </div>

        {/* Anime-style background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-waifu-pink/10 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-16 h-16 bg-waifu-purple/10 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-waifu-accent/10 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-waifu-lightPink to-waifu-pink rounded-full flex items-center justify-center border-4 border-white shadow-2xl animate-float">
                  <div className="text-4xl animate-pulse-heart">
                    🥰
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 text-waifu-purple animate-pulse-heart">
                  <Sparkles size={16} />
                </div>
                <div className="absolute -bottom-1 -left-2 text-waifu-accent animate-pulse-heart delay-500">
                  <Heart size={12} fill="currentColor" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent mb-4">
              Waifu AI Chat
            </h1>
            <p className="text-xl text-waifu-purple/80 mb-8">
              Escolha o plano perfeito para sua jornada com sua waifu! 💖
            </p>
          </div>

          {/* Pricing Plans */}
          <PricingPlans onSelectPlan={handleSelectPlan} />

          {/* Loading overlay when processing */}
          {isProcessing && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-heart">
                  <Heart className="w-8 h-8 text-white" fill="currentColor" />
                </div>
                <h3 className="text-xl font-bold text-waifu-purple mb-2">Ativando seu plano...</h3>
                <p className="text-waifu-purple/70">Preparando tudo para você! ✨</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
            <div className="h-full bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full animate-pulse loading-progress-bar"></div>
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
    </div>
  );
};

export default Loading;
