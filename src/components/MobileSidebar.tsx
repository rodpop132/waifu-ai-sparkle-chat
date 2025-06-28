
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Plus, 
  Search, 
  Settings, 
  Star,
  ChevronDown,
  Menu,
  X,
  Crown,
  Sparkles,
  Lock,
  MessageSquare,
  TrendingUp,
  Heart
} from 'lucide-react';
import StatsCard from './StatsCard';
import ConversationCard from './ConversationCard';

interface MobileSidebarProps {
  conversations: any[];
  userProfile: any;
  selectedConversation: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  canAccessConversations: () => boolean;
  getAccessMessage: () => string | null;
  createNewConversation: () => void;
  setShowPricingPopover: (show: boolean) => void;
  setSelectedConversation: (id: string) => void;
  editWaifu: (id: string) => void;
  deleteConversation: (id: string) => void;
  setShowProfileEditor: (show: boolean) => void;
  verifyPayment: () => void;
  paymentVerifying: boolean;
  hasValidPayment: boolean;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  conversations,
  userProfile,
  selectedConversation,
  searchTerm,
  setSearchTerm,
  canAccessConversations,
  getAccessMessage,
  createNewConversation,
  setShowPricingPopover,
  setSelectedConversation,
  editWaifu,
  deleteConversation,
  setShowProfileEditor,
  verifyPayment,
  paymentVerifying,
  hasValidPayment
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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

  const accessMessage = getAccessMessage();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-white/50 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
            Waifu AI Chat
          </h1>
          <Button
            onClick={createNewConversation}
            size="sm"
            disabled={!canAccessConversations()}
            className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 animate-fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-sm shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
                    Waifu AI Chat
                  </h1>
                  <p className="text-sm text-waifu-purple/70 mt-1">Sua companheira virtual</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
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
                <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl animate-fade-in">
                  <p className="text-sm text-yellow-800 font-medium">{accessMessage}</p>
                </div>
              )}
              
              {/* Search */}
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

            {/* History Toggle */}
            <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-4 hover:bg-waifu-lightPink/30 transition-all duration-300"
                >
                  <span className="font-medium text-waifu-purple">Histórico de Conversas</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHistoryOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="animate-accordion-down">
                <div className="px-4 pb-4 max-h-64 overflow-y-auto">
                  {!canAccessConversations() ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-4 opacity-60 animate-pulse-heart">
                        <div className="text-2xl">🔒</div>
                      </div>
                      <h3 className="text-lg font-semibold text-waifu-purple mb-2">Acesso Restrito</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {!hasValidPayment ? 'Escolha um plano para acessar as conversas' : 'Limite de mensagens atingido'}
                      </p>
                      <Button
                        onClick={() => setShowPricingPopover(true)}
                        className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Ver Planos
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredConversations.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-3 opacity-60">
                            <Heart className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-gray-500 text-sm mb-3">
                            {searchTerm ? 'Nenhuma waifu encontrada' : 'Nenhuma waifu criada ainda'}
                          </p>
                          {!searchTerm && (
                            <Button
                              onClick={createNewConversation}
                              variant="outline"
                              size="sm"
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
                            onClick={() => {
                              setSelectedConversation(conversation.id);
                              setIsOpen(false);
                            }}
                            onEdit={() => editWaifu(conversation.id)}
                            onDelete={() => deleteConversation(conversation.id)}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* User Profile */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/50 bg-gradient-to-r from-white/50 to-waifu-lightPink/20">
              {userProfile && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-r from-waifu-pink to-waifu-purple text-white">
                        {userProfile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{userProfile.name}</p>
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
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowPricingPopover(true)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-waifu-pink/30 hover:bg-waifu-lightPink/50 text-xs"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Planos
                    </Button>
                    
                    <Button
                      onClick={verifyPayment}
                      variant="outline"
                      size="sm"
                      disabled={paymentVerifying}
                      className="px-3 border-waifu-pink/30 hover:bg-waifu-lightPink/50"
                    >
                      {paymentVerifying ? '...' : '🔄'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSidebar;
