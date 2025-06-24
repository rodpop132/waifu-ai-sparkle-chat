
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Volume2, Repeat } from 'lucide-react';
import WaifuAvatar from './WaifuAvatar';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isFavorite?: boolean;
}

interface ChatMessageProps {
  message: Message;
  currentWaifu: {
    name: string;
    personality: string;
    avatar: string;
  };
  onToggleFavorite: (messageId: string) => void;
  onTextToSpeech: (text: string) => void;
  onRegenerate: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentWaifu,
  onToggleFavorite,
  onTextToSpeech,
  onRegenerate
}) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} gap-3`}>
      {!message.isUser && (
        <WaifuAvatar waifu={currentWaifu} size="sm" />
      )}
      
      <div className={`max-w-xs lg:max-w-md ${message.isUser ? 'order-1' : ''}`}>
        <div className={`${
          message.isUser 
            ? 'chat-bubble-user text-white' 
            : 'chat-bubble-waifu text-waifu-purple'
        } p-4 relative group`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
          
          {/* Message actions */}
          <div className={`mt-2 flex gap-1 ${message.isUser ? 'justify-start' : 'justify-end'}`}>
            {!message.isUser && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTextToSpeech(message.text)}
                  className="h-6 w-6 p-0 hover:bg-waifu-pink/20"
                >
                  <Volume2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className="h-6 w-6 p-0 hover:bg-waifu-pink/20"
                >
                  <Repeat className="w-3 h-3" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(message.id)}
              className={`h-6 w-6 p-0 hover:bg-waifu-pink/20 ${
                message.isFavorite ? 'text-waifu-accent' : ''
              }`}
            >
              <Heart className="w-3 h-3" fill={message.isFavorite ? 'currentColor' : 'none'} />
            </Button>
          </div>
        </div>
        
        <div className={`text-xs text-waifu-purple/60 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
