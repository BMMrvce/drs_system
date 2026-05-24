import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { HomeScreen } from './screens/HomeScreen';
import { AddMatchScreen } from './screens/AddMatchScreen';
import { LiveMatchScreen } from './screens/LiveMatchScreen';
import { MatchViewScreen } from './screens/MatchViewScreen';
import { DeviceManagementScreen } from './screens/DeviceManagementScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { MqttDebugScreen } from './screens/MqttDebugScreen';
import { Settings, Radio } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  if (!isHome) {
    return null;
  }

  return (
    <div className="fixed top-8 right-8 flex gap-3 z-50">
      <button
        onClick={() => navigate('/devices')}
        className="p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-green-500/50 rounded-lg transition-all group"
        title="Device Management"
      >
        <Radio className="w-5 h-5 group-hover:text-green-500 transition-colors" />
      </button>
      <button
        onClick={() => navigate('/settings')}
        className="p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-purple-500/50 rounded-lg transition-all group"
        title="Settings"
      >
        <Settings className="w-5 h-5 group-hover:text-purple-500 transition-colors" />
      </button>
    </div>
  );
}

function AppContent() {
  return (
    <div className="size-full bg-gray-950">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/add-match" element={<AddMatchScreen />} />
        <Route path="/live/:id" element={<LiveMatchScreen />} />
        <Route path="/match/:id" element={<MatchViewScreen />} />
        <Route path="/devices" element={<DeviceManagementScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/mqtt-debug" element={<MqttDebugScreen />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}