
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  messages: string;
  features: string[];
  icon: React.ReactNode;
  gradient: string;
  popular?: boolean;
  buttonText: string;
}

interface PricingPlansProps {
  onSelectPlan: (planId: string) => void;
}

const PricingPlans = ({ onSelectPlan }: PricingPlansProps) => {
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 'R$ 0',
      messages: '30 mensagens/mês',
      features: [
        'Chat básico com waifu',
        'Personalidades limitadas',
        'Sem anúncios',
        'Suporte por email'
      ],
      icon: <Star className="w-6 h-6" />,
      gradient: 'from-gray-400 to-gray-600',
      buttonText: 'Começar Grátis'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 9,90',
      messages: '10.000 mensagens/mês',
      features: [
        'Todas as personalidades',
        'Conversas ilimitadas',
        'Modo ciumento especial',
        'Avatares personalizados',
        'Suporte prioritário',
        'Exportar conversas'
      ],
      icon: <Crown className="w-6 h-6" />,
      gradient: 'from-waifu-pink to-waifu-purple',
      popular: true,
      buttonText: 'Escolher Pro'
    },
    {
      id: 'ultra',
      name: 'Ultra',
      price: 'R$ 19,90',
      messages: 'Mensagens ilimitadas',
      features: [
        'Tudo do Pro +',
        'Mensagens realmente ilimitadas',
        'IA mais avançada',
        'Criação de waifus customizadas',
        'Voz da waifu (TTS)',
        'Acesso antecipado a novidades',
        'Suporte VIP 24/7'
      ],
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      buttonText: 'Ir para Ultra'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent mb-4">
          Escolha seu Plano
        </h2>
        <p className="text-xl text-waifu-purple/80 mb-2">
          Desfrute de conversas únicas com sua waifu! 💕
        </p>
        <p className="text-sm text-waifu-purple/60">
          Todos os planos incluem acesso total às funcionalidades básicas
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={plan.id} 
            className={`relative p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
              plan.popular 
                ? 'border-waifu-pink shadow-xl ring-2 ring-waifu-pink/20' 
                : 'border-waifu-pink/20'
            } bg-white/95 backdrop-blur-sm animate-fade-in`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-waifu-pink to-waifu-purple text-white font-bold px-4 py-1">
                ⭐ Mais Popular ⭐
              </Badge>
            )}

            <div className="text-center mb-6">
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.gradient} text-white mb-4`}>
                {plan.icon}
              </div>
              <h3 className="text-2xl font-bold text-waifu-purple mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-waifu-purple">{plan.price}</span>
                {plan.id !== 'free' && <span className="text-waifu-purple/60">/mês</span>}
              </div>
              <p className="text-waifu-purple/80 font-medium">{plan.messages}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-waifu-purple/80 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => onSelectPlan(plan.id)}
              className={`w-full py-3 font-bold rounded-xl transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple text-white'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-waifu-lightPink hover:to-waifu-pink text-waifu-purple hover:text-white'
              }`}
            >
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
