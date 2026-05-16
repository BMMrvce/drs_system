import { useNavigate } from 'react-router-dom';
import { Plus, Radio, Settings, BarChart3, History } from 'lucide-react';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Plus,
      label: 'New Match',
      description: 'Start recording a new match',
      onClick: () => navigate('/add-match'),
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800'
    },
    {
      icon: Radio,
      label: 'Devices',
      description: 'Manage connected sensors',
      onClick: () => navigate('/devices'),
      color: 'from-green-600 to-green-700',
      hoverColor: 'hover:from-green-700 hover:to-green-800'
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Configure system preferences',
      onClick: () => navigate('/settings'),
      color: 'from-purple-600 to-purple-700',
      hoverColor: 'hover:from-purple-700 hover:to-purple-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`p-6 bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-xl transition-all transform hover:scale-105 text-left group`}
          >
            <Icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-1">{action.label}</h3>
            <p className="text-sm opacity-90">{action.description}</p>
          </button>
        );
      })}
    </div>
  );
}
