import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Search, Trash2, Activity, Clock, MapPin, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Match } from '../types/index';
import { QuickActions } from '../components/QuickActions';

export function HomeScreen() {
  const navigate = useNavigate();
  const { matches, deleteMatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.teamA.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.teamB.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (match.tournament?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMatchClick = (match: Match) => {
    if (match.status === 'live') {
      navigate(`/live/${match.id}`);
    } else {
      navigate(`/match/${match.id}`);
    }
  };

  const handleDelete = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this match?')) {
      deleteMatch(matchId);
    }
  };

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'live':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'completed':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'interrupted':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'paused':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">DRS Control Center</h1>
              <p className="text-gray-400 mt-1">Realtime Cricket Decision Review System Platform</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search matches by name, team, or tournament..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Match Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Matches</h2>
            <div className="text-sm text-gray-400">
              {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
            </div>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
              <div className="text-6xl mb-4">🏏</div>
              <p className="text-gray-400 text-lg">No matches found</p>
              <p className="text-gray-500 text-sm mt-2">
                {searchQuery ? 'Try a different search term' : 'Start a new match to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => handleMatchClick(match)}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-900/30 via-gray-900 to-purple-900/30 flex items-center justify-center overflow-hidden">
                    <div className="text-center z-10">
                      <div className="text-7xl mb-2">🏏</div>
                    </div>

                    {/* Live Indicator */}
                    {match.status === 'live' && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          LIVE
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                        {match.name}
                      </h3>
                      {match.tournament && (
                        <p className="text-sm text-gray-500">{match.tournament}</p>
                      )}
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-950 rounded-lg">
                      <span className="font-medium text-sm">{match.teamA}</span>
                      <span className="text-gray-500 text-xs">vs</span>
                      <span className="font-medium text-sm">{match.teamB}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{match.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(match.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{formatDuration(match.duration)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(match.status)}`}>
                        {match.status.toUpperCase()}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMatchClick(match);
                          }}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                          title={match.status === 'live' ? 'View Live' : 'View Replay'}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, match.id)}
                          className="p-2 hover:bg-red-900/20 text-red-400 rounded-lg transition-colors"
                          title="Delete Match"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
