
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, MessageSquare, Heart } from 'lucide-react';

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

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onClick,
  onEdit,
  onDelete
}) => {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isSelected 
          ? 'border-waifu-pink bg-gradient-to-r from-waifu-lightPink/20 to-purple-50 shadow-md' 
          : 'hover:border-waifu-pink/50 bg-white'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-waifu-pink to-waifu-purple shadow-lg">
              {conversation.waifu_avatar && conversation.waifu_avatar.startsWith('http') ? (
                <img 
                  src={conversation.waifu_avatar} 
                  alt={conversation.waifu_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-lg font-bold">
                  {conversation.waifu_avatar || conversation.waifu_name.charAt(0)}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-lg">
                {conversation.waifu_name}
              </h3>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </div>
            
            <Badge 
              variant="outline" 
              className="border-waifu-pink/30 text-waifu-purple text-xs mb-2 capitalize"
            >
              {conversation.waifu_personality}
            </Badge>
            
            {conversation.waifu_description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {conversation.waifu_description}
              </p>
            )}
            
            {conversation.waifu_traits && conversation.waifu_traits.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {conversation.waifu_traits.slice(0, 3).map((trait, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-waifu-lightPink/30 text-waifu-purple px-2 py-1 rounded-full"
                  >
                    {trait}
                  </span>
                ))}
                {conversation.waifu_traits.length > 3 && (
                  <span className="text-xs text-gray-500">+{conversation.waifu_traits.length - 3}</span>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>Última conversa</span>
              </div>
              <span>{new Date(conversation.updated_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 h-auto hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 h-auto hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ConversationCard;
