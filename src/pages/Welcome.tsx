
import React from 'react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Heart, Sparkles, Star } from 'lucide-react';

const Welcome = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('waifu_user', JSON.stringify({ email, isAuthenticated: true }));
        toast.success(isLogin ? 'Bem-vindo de volta! 💖' : 'Conta criada com sucesso! ✨');
        navigate('/loading');
      } else {
        toast.error('Por favor, preencha todos os campos! 🥺');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen waifu-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating sparkles */}
      <div className="absolute top-10 left-10 text-waifu-pink animate-float">
        <Sparkles size={24} />
      </div>
      <div className="absolute top-20 right-20 text-waifu-purple animate-float delay-500">
        <Star size={20} />
      </div>
      <div className="absolute bottom-20 left-20 text-waifu-accent animate-float delay-1000">
        <Heart size={18} />
      </div>
      <div className="absolute bottom-10 right-10 text-waifu-pink animate-float delay-700">
        <Sparkles size={22} />
      </div>

      <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm border-2 border-waifu-pink/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-waifu-pink to-waifu-purple rounded-full animate-pulse-heart">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-waifu-pink to-waifu-purple bg-clip-text text-transparent mb-2">
            Waifu AI Chat
          </h1>
          <p className="text-waifu-purple/80 font-medium">
            {isLogin ? 'Sua waifu está esperando você! 💕' : 'Encontre sua waifu perfeita! ✨'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-waifu-purple font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="border-waifu-pink/30 focus:border-waifu-pink focus:ring-waifu-pink/20"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-waifu-purple font-semibold">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-waifu-pink/30 focus:border-waifu-pink focus:ring-waifu-pink/20"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-waifu-pink to-waifu-purple hover:from-waifu-accent hover:to-waifu-darkPurple text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 animate-pulse-heart" />
                Carregando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" fill="currentColor" />
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </div>
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-waifu-purple hover:text-waifu-accent font-medium transition-colors"
          >
            {isLogin ? 'Não tem conta? Criar uma nova 💕' : 'Já tem conta? Fazer login 🥰'}
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-waifu-purple/60">
          Prepare-se para uma experiência única! ✨
        </div>
      </Card>
    </div>
  );
};

export default Welcome;
