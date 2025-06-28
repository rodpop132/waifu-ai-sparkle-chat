
import React, { useState, useEffect } from 'react';
import { X, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
  planEmoji: string;
  planColor: string;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const names = [
    "Rafael", "Ana", "Carlos", "Beatriz", "Diego", "Camila", "Eduardo", "Fernanda",
    "Gabriel", "Helena", "Igor", "Juliana", "Lucas", "Mariana", "Nicolas", "Olivia",
    "Pedro", "Renata", "Samuel", "Tânia", "Victor", "Yasmin", "André", "Bruna",
    "Caio", "Daniela", "Fábio", "Giovanna", "Henrique", "Isabella", "João", "Larissa",
    "Matheus", "Natália", "Otávio", "Patrícia", "Ricardo", "Sabrina", "Thiago", "Vanessa",
    "William", "Ximena", "Yuri", "Zara", "Alessandro", "Bianca", "Cléber", "Débora",
    "Emerson", "Flávia", "Gustavo", "Heloísa", "Ícaro", "Jéssica", "Kaique", "Letícia",
    "Fernando", "Carolina", "Bruno", "Amanda", "Rodrigo", "Priscila", "Leonardo", "Raquel"
  ];

  const plans = [
    { name: 'Pro', emoji: '👑', color: 'from-yellow-400 via-yellow-500 to-orange-500' },
    { name: 'Ultra', emoji: '⚡', color: 'from-purple-500 via-pink-500 to-red-500' },
    { name: 'Premium', emoji: '💎', color: 'from-blue-500 via-cyan-500 to-teal-500' },
    { name: 'Elite', emoji: '🔥', color: 'from-red-500 via-pink-500 to-purple-500' }
  ];

  const actions = [
    "adquiriu o plano", "upgradeou para o plano", "ativou o plano", 
    "se juntou ao plano", "escolheu o plano", "migrou para o plano",
    "desbloqueou o plano", "conquistou o plano", "obteve o plano"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.4) { // 40% chance every interval
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomPlan = plans[Math.floor(Math.random() * plans.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        const notification: Notification = {
          id: Date.now().toString(),
          message: `${randomName} ${randomAction} ${randomPlan.name}`,
          type: 'success',
          duration: 5000,
          planEmoji: randomPlan.emoji,
          planColor: randomPlan.color
        };

        setNotifications(prev => [...prev, notification]);
      }
    }, 6000); // Check every 6 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications]);

  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id 
          ? { ...n, removing: true } 
          : n
      )
    );
    
    // Remove completely after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-xs sm:max-w-sm lg:top-20 lg:right-6">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            relative overflow-hidden
            bg-white/95 backdrop-blur-md
            border-2 border-white/50
            p-4 rounded-2xl shadow-2xl
            animate-slide-in-right
            hover:scale-105 transition-all duration-300
            ${(notification as any).removing ? 'animate-slide-out-right' : ''}
          `}
          style={{
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Gradient background overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-r ${notification.planColor} opacity-10 rounded-2xl`}
          />
          
          {/* Content */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3 pr-2">
              {/* Plan emoji with pulse animation */}
              <div className="text-2xl animate-pulse-heart">
                {notification.planEmoji}
              </div>
              
              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex items-center mt-1 space-x-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 font-medium">
                    agora mesmo
                  </span>
                </div>
              </div>
            </div>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="h-7 w-7 p-0 hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex-shrink-0 rounded-lg"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
