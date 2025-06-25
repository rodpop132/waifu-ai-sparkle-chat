
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Heart, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Conectando com sua Waifu...');
  const [showPlans, setShowPlans] = useState(false);
  const navigate = useNavigate();

  const steps = [
    'Conectando com sua Waifu...',
    'Preparando carinho e fofura...',
    'Sincronizando sentimentos...',
    'Carregando personalidade...',
    'Quase pronto, senpai! 💕'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        if (stepIndex < steps.length) {
          setCurrentStep(steps[stepIndex]);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowPlans(true), 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      messages: '30 mensagens',
      features: [
        'Chat básico com waifu',
        'Personalidades limitadas',
        'Histórico de 7 dias'
      ],
      color: 'from-gray-400 to-gray-600',
      popular: false,
      checkoutUrl: null
    },
    {
      name: 'Pro',
      price: 'R$ 19,90',
      period: '/mês',
      messages: '10.000 mensagens',
      features: [
        'Chat ilimitado diário',
        'Todas as personalidades',
        'Histórico completo',
        'Voz da waifu',
        'Suporte prioritário'
      ],
      color: 'from-waifu-pink to-waifu-purple',
      popular: true,
      checkoutUrl: 'https://buy.stripe.com/14A6oJ9gV9IHb3BbTyafS0a'
    },
    {
      name: 'Ultra',
      price: 'R$ 39,90',
      period: '/mês',
      messages: 'Ilimitado',
      features: [
        'Tudo do Pro',
        'Mensagens verdadeiramente ilimitadas',
        'Waifus personalizadas',
        'API exclusiva',
        'Novidades em primeira mão'
      ],
      color: 'from-purple-500 to-pink-500',
      popular: false,
      checkoutUrl: 'https://buy.stripe.com/9B6bJ30Kp1cb2x55vaafS09'
    }
  ];

  const handlePlanSelect = (plan: any) => {
    if (plan.checkoutUrl) {
      toast.success(`Redirecionando para o checkout do plano ${plan.name}! 💕`);
      // Abrir checkout do Stripe em nova aba
      window.open(plan.checkoutUrl, '_blank');
      // Aguardar um pouco e redirecionar para o chat
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      toast.success(`Plano ${plan.name} selecionado! 💕`);
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  if (!showPlans) {
    return (
      <div className="min-h-screen waifu-gradient flex items-center justify-center relative overflow-hidden">
        {/* Floating anime elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-float">🌸</div>
          <div className="absolute top-32 right-20 text-4xl animate-float delay-500">💖</div>
          <div className="absolute bottom-32 left-20 text-5xl animate-float delay-1000">✨</div>
          <div className="absolute bottom-20 right-10 text-3xl animate-float delay-1500">🥰</div>
          <div className="absolute top-1/2 left-1/4 text-2xl animate-float delay-700">💕</div>
          <div className="absolute top-1/3 right-1/3 text-4xl animate-float delay-300">🌟</div>
        </div>

        {/* Beautiful waifu images */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img 
            src="/lovable-uploads/8e699549-fcb6-4cea-ae48-b2384ccaea42.png" 
            alt="Waifu 1"
            className="absolute top-10 left-10 w-32 h-40 object-cover rounded-lg animate-float"
          />
          <img 
            src="/lovable-uploads/95efa191-8c38-4b0a-a0d0-d831e0cba45d.png" 
            alt="Waifu 2"
            className="absolute top-20 right-10 w-32 h-40 object-cover rounded-lg animate-float delay-1000"
          />
          <img 
            src="/lovable-uploads/63051b71-f338-4bc9-b165-70ca1907a2c2.png" 
            alt="Waifu 3"
            className="absolute bottom-20 left-20 w-32 h-40 object-cover rounded-lg animate-float delay-500"
          />
        </div>

        <div className="text-center z-10 max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-heart">
              <div className="text-6xl">🥰</div>
            </div>
            <h1 className="text-4xl font-bold text-waifu-purple mb-2">Waifu AI Chat</h1>
            <p className="text-waifu-purple/70 text-lg">Sua namorada virtual otaku está chegando...</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="mb-4">
              <div className="w-full bg-waifu-lightPink rounded-full h-3 mb-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full transition-all duration-300 loading-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-waifu-purple font-medium text-lg animate-fade-in">
                {currentStep}
              </p>
            </div>
            
            <div className="text-sm text-waifu-purple/60 mt-4">
              {progress}% completo
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen waifu-gradient p-4 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl animate-float">🌸</div>
        <div className="absolute top-20 right-10 text-3xl animate-float delay-500">💖</div>
        <div className="absolute bottom-20 left-10 text-4xl animate-float delay-1000">✨</div>
        <div className="absolute bottom-10 right-20 text-3xl animate-float delay-1500">🥰</div>
      </div>

      {/* Beautiful waifu images in background */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <img 
          src="/lovable-uploads/8e699549-fcb6-4cea-ae48-b2384ccaea42.png" 
          alt="Waifu Background 1"
          className="absolute top-5 left-5 w-40 h-50 object-cover rounded-lg animate-float"
        />
        <img 
          src="/lovable-uploads/95efa191-8c38-4b0a-a0d0-d831e0cba45d.png" 
          alt="Waifu Background 2"
          className="absolute top-10 right-5 w-40 h-50 object-cover rounded-lg animate-float delay-700"
        />
        <img 
          src="/lovable-uploads/63051b71-f338-4bc9-b165-70ca1907a2c2.png" 
          alt="Waifu Background 3"
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-40 h-50 object-cover rounded-lg animate-float delay-1200"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-heart">
            <div className="text-3xl">💕</div>
          </div>
          <h1 className="text-5xl font-bold text-waifu-purple mb-4">Waifu AI Chat</h1>
          <p className="text-xl text-waifu-purple/80 mb-2">Sua namorada virtual otaku está pronta! 🥰</p>
          <p className="text-lg text-waifu-purple/70">Escolha seu plano e comece a conversar com ela agora:</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                plan.popular ? 'border-waifu-pink shadow-lg scale-105' : 'border-waifu-lightPink'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-waifu-pink to-waifu-purple text-white">
                  ⭐ Mais Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {plan.name === 'Gratuito' && <Heart className="w-8 h-8 text-white" />}
                  {plan.name === 'Pro' && <Star className="w-8 h-8 text-white" />}
                  {plan.name === 'Ultra' && <Sparkles className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-waifu-purple mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-waifu-purple">{plan.price}</span>
                  <span className="text-waifu-purple/70">{plan.period}</span>
                </div>
                <p className="text-waifu-accent font-semibold">{plan.messages}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-waifu-pink flex-shrink-0" />
                    <span className="text-waifu-purple/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handlePlanSelect(plan)}
                className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple text-white' 
                    : 'border-2 border-waifu-pink text-waifu-purple hover:bg-waifu-lightPink'
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.name === 'Gratuito' ? 'Começar Grátis' : `Escolher ${plan.name}`}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-waifu-purple/70 mb-4">
            💡 Você pode alterar ou cancelar seu plano a qualquer momento
          </p>
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="text-waifu-purple hover:bg-waifu-lightPink/50"
          >
            Pular por agora e começar grátis →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Loading;
