
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Heart, Sparkles, Star, User, Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos! 🥺');
          } else {
            toast.error('Erro ao fazer login: ' + error.message);
          }
          return;
        }

        if (data.user) {
          localStorage.setItem('waifu_user', JSON.stringify({ email, isAuthenticated: true }));
          toast.success('Bem-vindo de volta! 💖');
          navigate('/loading');
        }
      } else {
        if (!name.trim()) {
          toast.error('Por favor, digite seu nome! 🥺');
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: name.trim(),
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error('Este email já está cadastrado! Tente fazer login. 😊');
          } else {
            toast.error('Erro ao criar conta: ' + error.message);
          }
          return;
        }

        if (data.user) {
          localStorage.setItem('waifu_user', JSON.stringify({ email, isAuthenticated: true }));
          toast.success('Conta criada com sucesso! Bem-vindo! ✨');
          navigate('/loading');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Algo deu errado! Tente novamente. 🥺');
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name" className="text-waifu-purple font-semibold flex items-center gap-2">
                <User size={16} />
                Nome Completo
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="border-waifu-pink/30 focus:border-waifu-pink focus:ring-waifu-pink/20"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-waifu-purple font-semibold flex items-center gap-2">
              <Mail size={16} />
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
            <Label htmlFor="password" className="text-waifu-purple font-semibold flex items-center gap-2">
              <Lock size={16} />
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
              minLength={6}
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

export default Auth;
