import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Search, Trash2, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { Match } from '../types';
import { useApp } from '../context/AppContext';

export function HomeScreen() {
  const { matches } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.teamA.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.teamB.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(filteredMatches.length - 1, prev + 1));
  };

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

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10 text-blue-500" />
            DRS Control Center
          </h1>
          <p className="text-gray-400">Realtime Cricket Decision Review System</p>
        </div>

        {/* Actions Bar */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate('/add-match')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Start New Match
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Match Carousel */}
        <div className="relative">
          <h2 className="text-2xl font-semibold mb-6">Matches</h2>

          {filteredMatches.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-12 text-center">
              <p className="text-gray-400">No matches found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match, index) => (
                  <div
                    key={match.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all cursor-pointer"
                    onClick={() => handleMatchClick(match)}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-900/50 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-2">🏏</div>
                        {match.status === 'live' && (
                          <div className="absolute top-4 right-4">
                            <span className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-sm">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              LIVE
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{match.name}</h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">{match.teamA}</span>
                          <span className="text-sm text-gray-500">vs</span>
                          <span className="text-gray-400">{match.teamB}</span>
                        </div>

                        <div className="text-sm text-gray-500">
                          📍 {match.venue}
                        </div>

                        <div className="text-sm text-gray-500">
                          🕐 {formatDate(match.startTime)}
                        </div>

                        <div className="text-sm text-gray-500">
                          ⏱️ {formatDuration(match.duration)}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          match.status === 'live'
                            ? 'bg-red-600/20 text-red-400'
                            : 'bg-green-600/20 text-green-400'
                        }`}>
                          {match.status.toUpperCase()}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMatchClick(match);
                          }}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Navigation */}
              {filteredMatches.length > 3 && (
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex items-center gap-2">
                    {filteredMatches.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex ? 'bg-blue-500 w-8' : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentIndex === filteredMatches.length - 1}
                    className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
