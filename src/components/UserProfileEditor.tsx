
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Save, Edit, Crown, Sparkles, Lock, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan_type: string;
  messages_used: number;
  messages_limit: number;
}

interface UserProfileEditorProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

const UserProfileEditor: React.FC<UserProfileEditorProps> = ({ profile, onClose, onSave }) => {
  const [editedProfile, setEditedProfile] = useState({
    name: profile.name,
    email: profile.email
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: editedProfile.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      const updatedProfile = { ...profile, name: editedProfile.name };
      onSave(updatedProfile);
      toast.success('Perfil atualizado com sucesso! 💖');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

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

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'pro': return 'Pro';
      case 'ultra': return 'Ultra';
      default: return 'Sem Plano';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent">
            Editar Perfil
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-r from-waifu-pink to-waifu-purple text-white text-2xl">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Badge 
              variant="outline" 
              className={`bg-gradient-to-r ${getPlanColor(profile.plan_type)} text-white border-0`}
            >
              {getPlanIcon(profile.plan_type)}
              <span className="ml-1">{getPlanName(profile.plan_type)}</span>
            </Badge>
          </div>

          {/* Plan Stats */}
          <div className="bg-gradient-to-r from-waifu-lightPink to-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-waifu-purple" />
              <span className="text-sm font-medium text-waifu-purple">Uso de Mensagens</span>
            </div>
            <div className="flex justify-between text-sm text-waifu-purple/80 mb-2">
              <span>Usadas: {profile.messages_used}</span>
              <span>Limite: {profile.messages_limit === -1 ? '∞' : profile.messages_limit}</span>
            </div>
            {profile.messages_limit !== -1 && (
              <div className="w-full bg-white rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-waifu-pink to-waifu-purple h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min((profile.messages_used / profile.messages_limit) * 100, 100)}%` 
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nome
              </Label>
              <Input
                id="name"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 border-waifu-pink/30 focus:border-waifu-pink"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                value={editedProfile.email}
                disabled
                className="mt-1 bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserProfileEditor;
