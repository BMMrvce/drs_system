import { SensorEvent } from '../types/index';
import { BarChart3, TrendingUp, Zap, Activity } from 'lucide-react';

interface MatchStatisticsProps {
  events: SensorEvent[];
  duration: number;
}

export function MatchStatistics({ events, duration }: MatchStatisticsProps) {
  const eventCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEvents = events.length;
  const avgConfidence = events.length > 0
    ? events.reduce((sum, e) => sum + e.confidence, 0) / events.length
    : 0;

  const eventsPerHour = duration > 0 ? (totalEvents / (duration / 3600)).toFixed(1) : '0';

  const getEventColor = (type: string) => {
    switch (type) {
      case 'wicket':
        return 'text-red-400';
      case 'bail_dislodged':
        return 'text-orange-400';
      case 'stump_motion':
        return 'text-yellow-400';
      case 'motion_alert':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-500" />
        Match Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Total Events</span>
          </div>
          <div className="text-3xl font-bold">{totalEvents}</div>
        </div>

        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Avg Confidence</span>
          </div>
          <div className="text-3xl font-bold">{(avgConfidence * 100).toFixed(0)}%</div>
        </div>

        <div className="bg-gray-950 rounded-lg p-4 border border-gray-800 col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Events Per Hour</span>
          </div>
          <div className="text-3xl font-bold">{eventsPerHour}</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Event Breakdown</h3>
        {Object.entries(eventCounts).map(([type, count]) => (
          <div key={type} className="flex items-center justify-between">
            <span className={`text-sm capitalize ${getEventColor(type)}`}>
              {type.replace(/_/g, ' ')}
            </span>
            <div className="flex items-center gap-3 flex-1 ml-4">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    type === 'wicket' ? 'from-red-600 to-red-500' :
                    type === 'bail_dislodged' ? 'from-orange-600 to-orange-500' :
                    type === 'stump_motion' ? 'from-yellow-600 to-yellow-500' :
                    'from-blue-600 to-blue-500'
                  }`}
                  style={{ width: `${(count / totalEvents) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold w-8 text-right">{count}</span>
            </div>
          </div>
        ))}

        {totalEvents === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            No events recorded yet
          </div>
        )}
      </div>
    </div>
  );
}
