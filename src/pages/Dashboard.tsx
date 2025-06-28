
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Heart, Sparkles, Settings, LogOut, User, CreditCard, History, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import MobileSidebar from '@/components/MobileSidebar';
import StatsCard from '@/components/StatsCard';
import ConversationHistory from '@/components/ConversationHistory';
import UserProfileEditor from '@/components/UserProfileEditor';
import PricingPlans from '@/components/PricingPlans';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: "Houve um problema ao fazer logout.",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: User },
    { id: 'chat', label: 'Iniciar Chat', icon: MessageCircle },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'profile', label: 'Perfil', icon: Settings },
    { id: 'plans', label: 'Planos', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
                Dashboard
              </h1>
              <div className="hidden lg:flex items-center space-x-2">
                <Heart className="w-5 h-5 text-waifu-pink animate-pulse-heart" fill="currentColor" />
                <span className="text-waifu-purple font-medium">Bem-vindo de volta!</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatsCard
                title="Conversas Hoje"
                value="12"
                icon={MessageCircle}
                trend="+3 desde ontem"
                color="from-waifu-pink to-waifu-purple"
              />
              <StatsCard
                title="Mensagens Enviadas"
                value="456"
                icon={Heart}
                trend="+12% esta semana"
                color="from-waifu-purple to-waifu-accent"
              />
              <StatsCard
                title="Waifus Favoritas"
                value="8"
                icon={Sparkles}
                trend="2 novas este mês"
                color="from-waifu-accent to-waifu-pink"
              />
              <StatsCard
                title="Plano Atual"
                value="Grátis"
                icon={CreditCard}
                trend="Upgrade disponível"
                color="from-waifu-darkPurple to-waifu-purple"
              />
            </div>

            {/* Quick Actions */}
            <Card className="border-2 border-waifu-pink/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-waifu-purple">
                  <Sparkles className="w-5 h-5" />
                  Ações Rápidas
                </CardTitle>
                <CardDescription>
                  Comece a conversar ou explore novas funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    onClick={() => navigate('/chat')}
                    className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple h-16 text-lg font-semibold"
                  >
                    <div className="flex flex-col items-center">
                      <MessageCircle className="w-6 h-6 mb-1" />
                      <span>Novo Chat</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('history')}
                    className="border-2 border-waifu-purple/30 hover:bg-waifu-purple/10 h-16 text-lg font-semibold"
                  >
                    <div className="flex flex-col items-center">
                      <History className="w-6 h-6 mb-1" />
                      <span>Ver Histórico</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('plans')}
                    className="border-2 border-waifu-accent/30 hover:bg-waifu-accent/10 h-16 text-lg font-semibold"
                  >
                    <div className="flex flex-col items-center">
                      <CreditCard className="w-6 h-6 mb-1" />
                      <span>Ver Planos</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'chat':
        navigate('/chat');
        return null;
      
      case 'history':
        return <ConversationHistory />;
      
      case 'profile':
        return <UserProfileEditor />;
      
      case 'plans':
        return <PricingPlans />;
      
      default:
        return null;
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen waifu-gradient">
        {/* Mobile Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-waifu-pink/20 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-waifu-pink/10 transition-colors"
          >
            <Menu className="w-6 h-6 text-waifu-purple" />
          </button>
          
          <h1 className="text-xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
            Waifu AI
          </h1>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-waifu-purple hover:text-waifu-pink"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          menuItems={menuItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
        />

        {/* Mobile Content */}
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen waifu-gradient flex">
      {/* Desktop Sidebar */}
      <div className="w-80 bg-white/95 backdrop-blur-md border-r border-waifu-pink/20 shadow-xl">
        <div className="p-6 border-b border-waifu-pink/10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
            Waifu AI Dashboard
          </h2>
          <p className="text-waifu-purple/70 mt-1">Gerencie sua experiência</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => item.id === 'chat' ? navigate('/chat') : setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-waifu-pink/20 to-waifu-purple/20 border-2 border-waifu-pink/30 text-waifu-purple font-semibold'
                    : 'hover:bg-waifu-pink/10 text-waifu-purple/80 hover:text-waifu-purple'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-2 border-waifu-pink/30 hover:bg-waifu-pink/10 text-waifu-purple"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
