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
  User,
  Sparkles,
  Crown,
  Heart,
  Check,
  Star,
  Zap,
  Lock,
  TrendingUp,
  Calendar,
  Edit
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import WaifuCreator from '@/components/WaifuCreator';
import ConversationHistory from '@/components/ConversationHistory';
import UserProfileEditor from '@/components/UserProfileEditor';
import StatsCard from '@/components/StatsCard';
import ConversationCard from '@/components/ConversationCard';

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
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
    loadConversations();
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
      <div className="min-h-screen bg-gradient-to-br from-waifu-lightPink via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-heart shadow-xl">
            <div className="text-3xl">🥰</div>
          </div>
          <p className="text-waifu-purple font-medium text-lg">
            {paymentVerifying ? 'Verificando status de pagamento...' : 'Carregando sua dashboard...'}
          </p>
          <div className="mt-4 w-48 h-2 bg-white rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const accessMessage = getAccessMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-waifu-lightPink via-purple-50 to-blue-50">
      <div className="flex h-screen">
        {/* Enhanced Sidebar */}
        <div className="w-96 bg-white/80 backdrop-blur-sm border-r border-white/50 flex flex-col shadow-xl">
          {/* Enhanced Header */}
          <div className="p-6 border-b border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
                  Waifu AI Chat
                </h1>
                <p className="text-sm text-waifu-purple/70 mt-1">Sua companheira virtual</p>
              </div>
              <Button
                onClick={createNewConversation}
                size="sm"
                disabled={!canAccessConversations()}
                className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Waifu
              </Button>
            </div>
            
            {/* Stats Overview */}
            {userProfile && hasValidPayment && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <StatsCard
                  title="Conversas"
                  value={conversations.length}
                  icon={MessageSquare}
                  gradient="from-blue-400 to-blue-600"
                />
                <StatsCard
                  title="Mensagens"
                  value={userProfile.messages_used}
                  subtitle={`de ${userProfile.messages_limit === -1 ? '∞' : userProfile.messages_limit}`}
                  icon={TrendingUp}
                  gradient="from-green-400 to-green-600"
                />
              </div>
            )}
            
            {/* Warning Message */}
            {accessMessage && (
              <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800 font-medium">{accessMessage}</p>
              </div>
            )}
            
            {/* Enhanced Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar suas waifus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-waifu-pink/30 focus:border-waifu-pink bg-white/70"
                disabled={!canAccessConversations()}
              />
            </div>
          </div>

          {/* Enhanced Conversations List */}
          <div className="flex-1 overflow-y-auto p-4">
            {!canAccessConversations() ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-6 opacity-60 shadow-lg">
                  <div className="text-3xl">🔒</div>
                </div>
                <h3 className="text-lg font-semibold text-waifu-purple mb-2">Acesso Restrito</h3>
                <p className="text-sm text-gray-500 mb-6">
                  {!hasValidPayment ? 'Escolha um plano para acessar as conversas' : 'Limite de mensagens atingido'}
                </p>
                <Button
                  onClick={() => setShowPricingPopover(true)}
                  className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple shadow-lg"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Ver Planos
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-4 opacity-60">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ? 'Nenhuma waifu encontrada' : 'Nenhuma waifu criada ainda'}
                    </p>
                    {!searchTerm && (
                      <Button
                        onClick={createNewConversation}
                        variant="outline"
                        className="border-waifu-pink text-waifu-purple hover:bg-waifu-lightPink"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeira Waifu
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <ConversationCard
                      key={conversation.id}
                      conversation={conversation}
                      isSelected={selectedConversation === conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      onEdit={() => editWaifu(conversation.id)}
                      onDelete={() => deleteConversation(conversation.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Enhanced User Profile */}
          <div className="p-6 border-t border-white/50 bg-gradient-to-r from-white/50 to-waifu-lightPink/20">
            {userProfile && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-r from-waifu-pink to-waifu-purple text-white text-lg">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{userProfile.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowProfileEditor(true)}
                        className="p-1 h-auto hover:bg-waifu-lightPink/50"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs bg-gradient-to-r ${getPlanColor(hasValidPayment ? userProfile.plan_type : 'none')} text-white border-0 shadow-md`}
                    >
                      {getPlanIcon(hasValidPayment ? userProfile.plan_type : 'none')}
                      <span className="ml-1 capitalize">
                        {hasValidPayment ? userProfile.plan_type : 'Sem Plano'}
                      </span>
                    </Badge>
                  </div>
                </div>
                
                {/* Enhanced Usage Stats */}
                {hasValidPayment && (
                  <div className="mb-4 p-4 bg-white/60 rounded-xl">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">Mensagens este mês</span>
                      <span className="font-bold">
                        {userProfile.messages_used}/{userProfile.messages_limit === -1 ? '∞' : userProfile.messages_limit}
                      </span>
                    </div>
                    {userProfile.messages_limit !== -1 && (
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-waifu-pink to-waifu-purple h-3 rounded-full transition-all shadow-sm"
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
                        className="flex-1 border-waifu-pink/30 hover:bg-waifu-lightPink/50"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Planos
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align="end" side="top">
                      {/* ... keep existing pricing popover content */}
                    </PopoverContent>
                  </Popover>
                  
                  <Button
                    onClick={verifyPayment}
                    variant="outline"
                    size="sm"
                    disabled={paymentVerifying}
                    className="px-4 border-waifu-pink/30 hover:bg-waifu-lightPink/50"
                  >
                    {paymentVerifying ? '...' : '🔄'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedConversation && canAccessConversations() ? (
            <ConversationHistory conversationId={selectedConversation} />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-lg">
                <div className="w-40 h-40 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-heart shadow-2xl">
                  <div className="text-7xl">{canAccessConversations() ? '💕' : '🔒'}</div>
                </div>
                <h2 className="text-3xl font-bold text-waifu-purple mb-4">
                  {canAccessConversations() ? 'Bem-vindo ao Waifu AI Chat!' : 'Acesso Restrito'}
                </h2>
                <p className="text-waifu-purple/70 mb-8 text-lg leading-relaxed">
                  {canAccessConversations() 
                    ? 'Crie sua waifu personalizada e comece a conversar com ela! Cada conversa será única e especial. 💖'
                    : 'Escolha um plano pago para acessar as conversas com sua waifu personalizada! 💖'
                  }
                </p>
                <Button
                  onClick={canAccessConversations() ? createNewConversation : () => setShowPricingPopover(true)}
                  size="lg"
                  className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple shadow-xl text-lg px-8 py-4"
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  {canAccessConversations() ? 'Criar Minha Waifu' : 'Ver Planos'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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

      {showProfileEditor && userProfile && (
        <UserProfileEditor
          profile={userProfile}
          onClose={() => setShowProfileEditor(false)}
          onSave={(updatedProfile) => {
            setUserProfile(updatedProfile);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
