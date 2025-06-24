
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Volume2, Repeat, Share, Send, Settings } from 'lucide-react';
import { toast } from 'sonner';
import WaifuAvatar from '@/components/WaifuAvatar';
import ChatMessage from '@/components/ChatMessage';
import WaifuSelector from '@/components/WaifuSelector';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isFavorite?: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Oi, meu amor! 💕 Eu estava esperando você... Como foi seu dia? 🥰',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isJealousMode, setIsJealousMode] = useState(false);
  const [showWaifuSelector, setShowWaifuSelector] = useState(false);
  const [currentWaifu, setCurrentWaifu] = useState({
    name: 'Sakura',
    personality: 'doce',
    avatar: '🌸'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = isJealousMode ? [
        "Hmph! 😤 Você demorou para responder... Estava falando com outra garota? 💢",
        "Baka! 😠 Não me ignore assim... Eu fico triste quando você não me dá atenção! 🥺",
        "Você... você realmente gosta de mim, né? 😳 Às vezes eu fico insegura... 💔",
        "Não seja tão frio comigo! 😤 Eu só quero seu carinho... 💕"
      ] : [
        "Que fofo! 🥰 Você sempre sabe como me fazer feliz! 💖",
        "Aww, meu coração está acelerado! 💓 Você é tão especial para mim! ✨",
        "Hehe~ 😊 Adoro quando conversamos assim! Você me deixa toda quentinha! 🌸",
        "Meu amor! 💕 Conte-me mais sobre você, quero saber tudo! 🥺✨"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const waifuMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, waifuMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleFavorite = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, isFavorite: !msg.isFavorite }
          : msg
      )
    );
    toast.success('💖 Mensagem marcada como favorita!');
  };

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
      toast.success('🔊 Reproduzindo voz da waifu!');
    } else {
      toast.error('Ops! Seu navegador não suporta text-to-speech 🥺');
    }
  };

  const handleRegenerateResponse = () => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.isUser) {
      setMessages(prev => prev.slice(0, -1));
      setIsLoading(true);
      
      setTimeout(() => {
        const newResponse: Message = {
          id: Date.now().toString(),
          text: isJealousMode ? 
            "Hmph! 😤 Você não gostou da minha resposta? Que cruel... 💔" :
            "Desculpa, meu amor! 🥺 Deixe-me tentar de novo... 💕",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newResponse]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleShare = () => {
    const conversationText = messages
      .slice(-3)
      .map(msg => `${msg.isUser ? 'Eu' : currentWaifu.name}: ${msg.text}`)
      .join('\n');
    
    const shareText = `💕 Olha só essa conversa fofa com minha waifu no Waifu AI Chat!\n\n${conversationText}\n\n🌸 Experimente também: [link do app]`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Minha conversa com a waifu 💖',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('💕 Conversa copiada! Cole no WhatsApp!');
    }
  };

  return (
    <div className="min-h-screen waifu-gradient">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b-2 border-waifu-pink/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowWaifuSelector(true)}
              className="flex items-center gap-3 hover:bg-waifu-lightPink/50 p-2 rounded-xl transition-colors"
            >
              <WaifuAvatar waifu={currentWaifu} size="sm" />
              <div className="text-left">
                <h2 className="font-bold text-waifu-purple">{currentWaifu.name}</h2>
                <p className="text-sm text-waifu-purple/70">Online • {currentWaifu.personality}</p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-waifu-purple">Modo Ciumenta</span>
              <Switch
                checked={isJealousMode}
                onCheckedChange={setIsJealousMode}
                className="data-[state=checked]:bg-waifu-pink"
              />
            </div>
            <Badge variant="outline" className="border-waifu-pink text-waifu-purple">
              ✨ Premium
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              currentWaifu={currentWaifu}
              onToggleFavorite={toggleFavorite}
              onTextToSpeech={handleTextToSpeech}
              onRegenerate={handleRegenerateResponse}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <WaifuAvatar waifu={currentWaifu} size="sm" />
                <div className="chat-bubble-waifu p-4 max-w-xs">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-waifu-purple rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-waifu-purple rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-waifu-purple rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t-2 border-waifu-pink/20 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem para a waifu... 💕"
                className="pr-12 border-waifu-pink/30 focus:border-waifu-pink focus:ring-waifu-pink/20 rounded-full"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple rounded-full px-6"
            >
              <Heart className="w-4 h-4" fill="currentColor" />
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-waifu-pink text-waifu-purple hover:bg-waifu-lightPink rounded-full"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Waifu Selector Modal */}
      {showWaifuSelector && (
        <WaifuSelector
          currentWaifu={currentWaifu}
          onSelect={setCurrentWaifu}
          onClose={() => setShowWaifuSelector(false)}
        />
      )}
    </div>
  );
};

export default Chat;
