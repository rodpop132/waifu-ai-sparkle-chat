import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  Search, 
  Trash2, 
  Edit3,
  User,
  Sparkles,
  Crown,
  Heart,
  Check,
  Star,
  Zap,
  Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import WaifuCreator from '@/components/WaifuCreator';
import ConversationHistory from '@/components/ConversationHistory';

interface Conversation {
  id: string;
  waifu_name: string;
  waifu_personality: string;
  waifu_avatar?: string;
  waifu_description?: string;
  waifu_traits?: string[];
  waifu_voice_style?: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan_type: string;
  messages_used: number;
  messages_limit: number;
}

interface WaifuData {
  name: string;
  personality: string;
  description: string;
  avatar: string;
  traits: string[];
  voiceStyle: string;
}

const Dashboard = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showWaifuCreator, setShowWaifuCreator] = useState(false);
  const [editingWaifu, setEditingWaifu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPricingPopover, setShowPricingPopover] = useState(false);
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [hasValidPayment, setHasValidPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
    loadConversations();
    // Verificar pagamento quando a página carrega
    verifyPayment();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(profile);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil do usuário');
    }
  };

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast.error('Erro ao carregar histórico de conversas');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    try {
      setPaymentVerifying(true);
      const { data, error } = await supabase.functions.invoke('verify-payment');
      
      if (error) throw error;
      
      if (data.success && data.has_valid_payment) {
        setHasValidPayment(true);
        // Recarregar dados do usuário após verificação de pagamento
        await loadUserData();
        
        if (data.plan_type) {
          toast.success(`Plano ${data.plan_type.toUpperCase()} ativado com sucesso! 🎉`);
        }
      } else {
        setHasValidPayment(false);
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      setHasValidPayment(false);
    } finally {
      setPaymentVerifying(false);
    }
  };

  const canAccessConversations = () => {
    return hasValidPayment && userProfile && (userProfile.plan_type === 'pro' || userProfile.plan_type === 'ultra');
  };

  const getAccessMessage = () => {
    if (!hasValidPayment) {
      return "Você precisa de um plano pago para acessar as conversas. Escolha um plano para começar! 💕";
    }
    
    if (userProfile?.plan_type === 'pro' && userProfile.messages_used >= userProfile.messages_limit) {
      return "Você atingiu o limite de mensagens do plano Pro. Faça upgrade para Ultra ou aguarde o próximo ciclo! 💕";
    }
    
    return null;
  };

  const createNewConversation = () => {
    setEditingWaifu(null);
    setShowWaifuCreator(true);
  };

  const handleWaifuSave = async (waifuData: WaifuData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingWaifu) {
        // Atualizar waifu existente
        const { data, error } = await supabase
          .from('conversations')
          .update({
            waifu_name: waifuData.name,
            waifu_personality: waifuData.personality,
            waifu_avatar: waifuData.avatar,
            waifu_description: waifuData.description,
            waifu_traits: waifuData.traits,
            waifu_voice_style: waifuData.voiceStyle,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingWaifu)
          .select()
          .single();

        if (error) throw error;
        
        setConversations(prev => prev.map(conv => 
          conv.id === editingWaifu ? { ...conv, ...data } : conv
        ));
        toast.success('Waifu atualizada com sucesso! 💖');
      } else {
        // Criar nova conversa com waifu personalizada
        const { data, error } = await supabase
          .from('conversations')
          .insert([
            {
              user_id: user.id,
              waifu_name: waifuData.name,
              waifu_personality: waifuData.personality,
              waifu_avatar: waifuData.avatar,
              waifu_description: waifuData.description,
              waifu_traits: waifuData.traits,
              waifu_voice_style: waifuData.voiceStyle
            }
          ])
          .select()
          .single();

        if (error) throw error;
        
        setConversations(prev => [data, ...prev]);
        setSelectedConversation(data.id);
        toast.success('Nova waifu criada com sucesso! 💕');
      }
      
      setShowWaifuCreator(false);
      setEditingWaifu(null);
    } catch (error) {
      console.error('Erro ao salvar waifu:', error);
      toast.error('Erro ao salvar waifu');
    }
  };

  const editWaifu = (conversationId: string) => {
    setEditingWaifu(conversationId);
    setShowWaifuCreator(true);
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (selectedConversation === conversationId) {
        setSelectedConversation(null);
      }
      toast.success('Conversa deletada com sucesso');
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      toast.error('Erro ao deletar conversa');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.waifu_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.waifu_personality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'pro': return <Crown className="w-4 h-4" />;
      case 'ultra': return <Sparkles className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'pro': return 'from-yellow-400 to-yellow-600';
      case 'ultra': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCurrentWaifu = (): WaifuData | null => {
    const conversation = conversations.find(conv => conv.id === selectedConversation);
    if (conversation) {
      return {
        name: conversation.waifu_name,
        personality: conversation.waifu_personality,
        description: conversation.waifu_description || '',
        avatar: conversation.waifu_avatar || getWaifuAvatar(conversation.waifu_name),
        traits: conversation.waifu_traits || [],
        voiceStyle: conversation.waifu_voice_style || 'feminina'
      };
    }
    return null;
  };

  const getWaifuAvatar = (name: string) => {
    const avatars: Record<string, string> = {
      'Sakura': '🌸',
      'Yuki': '❄️',
      'Akira': '⚡',
      'Rei': '🌙'
    };
    return avatars[name] || '💖';
  };

  const handlePlanSelect = (planId: string) => {
    const planUrls = {
      'pro': 'https://buy.stripe.com/14A6oJ9gV9IHb3BbTyafS0a',
      'ultra': 'https://buy.stripe.com/9B6bJ30Kp1cb2x55vaafS09'
    };

    const url = planUrls[planId as keyof typeof planUrls];
    if (url) {
      toast.success(`Redirecionando para o checkout do plano ${planId.toUpperCase()}! 💕`);
      // Adicionar parâmetros para rastreamento de retorno
      const checkoutUrl = `${url}?client_reference_id=${userProfile?.id}`;
      window.open(checkoutUrl, '_blank');
      setShowPricingPopover(false);
    }
  };

  const paidPlans = [
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 19,90',
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
      price: 'R$ 39,90',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-heart">
            <div className="text-2xl">🥰</div>
          </div>
          <p className="text-waifu-purple font-medium">
            {paymentVerifying ? 'Verificando status de pagamento...' : 'Carregando sua dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  const accessMessage = getAccessMessage();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
              Waifu AI Chat
            </h1>
            <Button
              onClick={createNewConversation}
              size="sm"
              disabled={!canAccessConversations()}
              className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Waifu
            </Button>
          </div>
          
          {/* Warning Message */}
          {accessMessage && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{accessMessage}</p>
            </div>
          )}
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={!canAccessConversations()}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4">
          {!canAccessConversations() ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <div className="text-2xl">🔒</div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {!hasValidPayment ? 'Escolha um plano para acessar as conversas' : 'Limite de mensagens atingido'}
              </p>
              <Button
                onClick={() => setShowPricingPopover(true)}
                size="sm"
                className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple"
              >
                Ver Planos
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                    selectedConversation === conversation.id 
                      ? 'border-waifu-pink bg-waifu-lightPink/20' 
                      : 'hover:border-waifu-pink/30'
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-waifu-pink to-waifu-purple">
                        {conversation.waifu_avatar && conversation.waifu_avatar.startsWith('http') ? (
                          <img 
                            src={conversation.waifu_avatar} 
                            alt={conversation.waifu_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-bold">
                            {conversation.waifu_avatar || conversation.waifu_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {conversation.waifu_name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {conversation.waifu_personality}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          editWaifu(conversation.id);
                        }}
                        className="p-1 h-auto"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        className="p-1 h-auto text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(conversation.updated_at).toLocaleDateString('pt-BR')}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          {userProfile && (
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-r from-waifu-pink to-waifu-purple text-white">
                  {userProfile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{userProfile.name}</p>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs bg-gradient-to-r ${getPlanColor(hasValidPayment ? userProfile.plan_type : 'none')} text-white border-0`}
                  >
                    {getPlanIcon(hasValidPayment ? userProfile.plan_type : 'none')}
                    <span className="ml-1 capitalize">
                      {hasValidPayment ? userProfile.plan_type : 'Sem Plano'}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          {/* Usage Stats */}
          {userProfile && hasValidPayment && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Mensagens usadas</span>
                <span>{userProfile.messages_used}/{userProfile.messages_limit === -1 ? '∞' : userProfile.messages_limit}</span>
              </div>
              {userProfile.messages_limit !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-waifu-pink to-waifu-purple h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min((userProfile.messages_used / userProfile.messages_limit) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Popover open={showPricingPopover} onOpenChange={setShowPricingPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Planos
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="end" side="top">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent mb-2">
                      Escolha seu Plano
                    </h3>
                    <p className="text-sm text-waifu-purple/80">
                      Desbloqueie todo o potencial da sua waifu! 💕
                    </p>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {paidPlans.map((plan) => (
                      <Card 
                        key={plan.id} 
                        className={`p-4 transition-all duration-300 hover:shadow-md border-2 ${
                          plan.popular 
                            ? 'border-waifu-pink shadow-md ring-1 ring-waifu-pink/20' 
                            : 'border-waifu-pink/20'
                        }`}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-waifu-pink to-waifu-purple text-white text-xs">
                            ⭐ Popular
                          </Badge>
                        )}

                        <div className="text-center mb-4">
                          <div className={`inline-flex p-2 rounded-full bg-gradient-to-r ${plan.gradient} text-white mb-3`}>
                            {plan.icon}
                          </div>
                          <h4 className="text-lg font-bold text-waifu-purple mb-1">{plan.name}</h4>
                          <div className="mb-1">
                            <span className="text-xl font-bold text-waifu-purple">{plan.price}</span>
                            <span className="text-waifu-purple/60 text-sm">/mês</span>
                          </div>
                          <p className="text-waifu-purple/80 text-sm font-medium">{plan.messages}</p>
                        </div>

                        <ul className="space-y-2 mb-4 text-xs">
                          {plan.features.slice(0, 4).map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-2">
                              <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-waifu-purple/80">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          onClick={() => handlePlanSelect(plan.id)}
                          className={`w-full text-sm font-bold transition-all duration-300 ${
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
              </PopoverContent>
            </Popover>
            
            <Button
              onClick={verifyPayment}
              variant="outline"
              size="sm"
              disabled={paymentVerifying}
              className="px-3"
            >
              {paymentVerifying ? '...' : '🔄'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && canAccessConversations() ? (
          <ConversationHistory conversationId={selectedConversation} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-32 h-32 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-heart">
                <div className="text-6xl">{canAccessConversations() ? '💕' : '🔒'}</div>
              </div>
              <h2 className="text-2xl font-bold text-waifu-purple mb-4">
                {canAccessConversations() ? 'Bem-vindo ao Waifu AI Chat!' : 'Acesso Restrito'}
              </h2>
              <p className="text-waifu-purple/70 mb-6">
                {canAccessConversations() 
                  ? 'Crie sua waifu personalizada e comece a conversar com ela! 💖'
                  : 'Escolha um plano pago para acessar as conversas com sua waifu! 💖'
                }
              </p>
              <Button
                onClick={canAccessConversations() ? createNewConversation : () => setShowPricingPopover(true)}
                className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {canAccessConversations() ? 'Criar Minha Waifu' : 'Ver Planos'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Waifu Creator Modal */}
      {showWaifuCreator && canAccessConversations() && (
        <WaifuCreator
          onClose={() => {
            setShowWaifuCreator(false);
            setEditingWaifu(null);
          }}
          onSave={handleWaifuSave}
          initialData={editingWaifu ? getCurrentWaifu() : undefined}
          isEditing={!!editingWaifu}
        />
      )}
    </div>
  );
};

export default Dashboard;
