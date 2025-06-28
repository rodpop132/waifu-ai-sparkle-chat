
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
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
    "Emerson", "Flávia", "Gustavo", "Heloísa", "Ícaro", "Jéssica", "Kaique", "Letícia"
  ];

  const plans = [
    { name: 'Pro', emoji: '👑', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Ultra', emoji: '⚡', color: 'from-purple-500 to-pink-500' }
  ];

  const actions = [
    "adquiriu o plano", "upgradeou para o plano", "ativou o plano", 
    "se juntou ao plano", "escolheu o plano", "migrou para o plano"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomPlan = plans[Math.floor(Math.random() * plans.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        const notification: Notification = {
          id: Date.now().toString(),
          message: `${randomName} ${randomAction} ${randomPlan.name} ${randomPlan.emoji}`,
          type: 'success',
          duration: 4000
        };

        setNotifications(prev => [...prev, notification]);
      }
    }, 8000); // Check every 8 seconds

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
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getNotificationStyle(notification.type)}
            p-4 rounded-xl shadow-lg border-2 border-white/20
            animate-slide-in-right
            backdrop-blur-sm
            hover:scale-105 transition-transform duration-300
          `}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium pr-2">
              {notification.message}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="h-6 w-6 p-0 hover:bg-white/20 text-white/80 hover:text-white flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
