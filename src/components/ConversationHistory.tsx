
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  content: string;
  is_from_user: boolean;
  created_at: string;
}

interface ConversationHistoryProps {
  conversationId: string;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentWaifu, setCurrentWaifu] = useState({
    name: 'Sakura',
    personality: 'doce',
    avatar: '🌸'
  });

  useEffect(() => {
    loadMessages();
    loadConversationDetails();
    initializeSpeechRecognition();
  }, [conversationId]);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error('Erro no reconhecimento de voz');
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognition);
    }
  };

  const loadConversationDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('waifu_name, waifu_personality')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      if (data) {
        setCurrentWaifu({
          name: data.waifu_name,
          personality: data.waifu_personality,
          avatar: getWaifuAvatar(data.waifu_name)
        });
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes da conversa:', error);
    }
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

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageText = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Adicionar mensagem do usuário
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Salvar mensagem do usuário
      const { data: userMessage, error: userMsgError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          user_id: user.id,
          content: messageText,
          is_from_user: true
        }])
        .select()
        .single();

      if (userMsgError) throw userMsgError;

      // Atualizar mensagens localmente
      setMessages(prev => [...prev, userMessage]);

      // Enviar para API da Waifu
      const response = await fetch('https://waifuai-2uhc.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com a waifu');
      }

      const data = await response.json();
      const waifuReply = data.reply || 'Desculpa, amor... não consegui responder agora 🥺';

      // Salvar resposta da waifu
      const { data: waifuMessage, error: waifuMsgError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          user_id: user.id,
          content: waifuReply,
          is_from_user: false
        }])
        .select()
        .single();

      if (waifuMsgError) throw waifuMsgError;

      setMessages(prev => [...prev, waifuMessage]);

      // Falar a resposta se o usuário quiser
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(waifuReply);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      toast.error('Reconhecimento de voz não suportado neste navegador');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
      toast.info('Fale agora...');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center text-white text-lg">
              {currentWaifu.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{currentWaifu.name}</h3>
              <Badge variant="outline" className="border-waifu-pink text-waifu-purple text-xs">
                {currentWaifu.personality}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <Button
                onClick={stopSpeaking}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                <VolumeX className="w-4 h-4 mr-1" />
                Parar Voz
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-heart">
              <div className="text-4xl">{currentWaifu.avatar}</div>
            </div>
            <h3 className="text-lg font-semibold text-waifu-purple mb-2">
              Oi, senpai! 💕
            </h3>
            <p className="text-waifu-purple/70">
              Como foi seu dia? Vamos conversar? 🥰
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={{
                id: message.id,
                text: message.content,
                isUser: message.is_from_user,
                timestamp: new Date(message.created_at)
              }}
              currentWaifu={currentWaifu}
              onToggleFavorite={() => {}}
              onTextToSpeech={(text) => {
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(text);
                  utterance.lang = 'pt-BR';
                  utterance.rate = 0.9;
                  utterance.pitch = 1.2;
                  speechSynthesis.speak(utterance);
                }
              }}
              onRegenerate={() => {}}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full flex items-center justify-center text-white text-sm">
                {currentWaifu.avatar}
              </div>
              <div className="bg-gray-100 rounded-2xl p-4 max-w-xs">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-waifu-purple rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-waifu-purple rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-waifu-purple rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Digite sua mensagem para ${currentWaifu.name}...`}
              className="pr-12 resize-none border-waifu-pink/30 focus:border-waifu-pink"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleVoiceInput}
            variant="outline"
            className={`${isRecording ? 'bg-red-50 border-red-500 text-red-500' : 'border-waifu-pink text-waifu-purple hover:bg-waifu-lightPink'}`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationHistory;
