import { useState } from 'react';
import { X, Download, Film, CheckCircle } from 'lucide-react';
import { SensorEvent } from '../types/index';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  matchName: string;
  events: SensorEvent[];
}

export function ExportDialog({ isOpen, onClose, matchId, matchName, events }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState('mp4');
  const [exportQuality, setExportQuality] = useState('1080p');
  const [includeEvents, setIncludeEvents] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setExporting(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));

    setExporting(false);
    setExportComplete(true);

    setTimeout(() => {
      setExportComplete(false);
      onClose();
    }, 2000);
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Download className="w-6 h-6 text-blue-500" />
              Export Match Replay
            </h2>
            <p className="text-gray-400 mt-1">{matchName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {exportComplete ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Export Complete!</h3>
              <p className="text-gray-400">Your match replay has been exported successfully</p>
            </div>
          ) : (
            <>
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {['mp4', 'mov', 'avi'].map(format => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        exportFormat === format
                          ? 'border-blue-500 bg-blue-600/20'
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <Film className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold uppercase">{format}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Quality</label>
                <select
                  value={exportQuality}
                  onChange={(e) => setExportQuality(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="4k">4K Ultra HD (3840×2160)</option>
                  <option value="1080p">Full HD (1920×1080)</option>
                  <option value="720p">HD (1280×720)</option>
                  <option value="480p">SD (854×480)</option>
                </select>
              </div>

              {/* Include Events */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEvents}
                    onChange={(e) => setIncludeEvents(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Include Event Markers</span>
                </label>
              </div>

              {/* Event Selection */}
              {includeEvents && events.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Select Events to Include ({selectedEvents.length}/{events.length})
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-800 rounded-lg p-3">
                    {events.map(event => (
                      <label
                        key={event.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => toggleEvent(event.id)}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600"
                        />
                        <span className="text-sm capitalize flex-1">
                          {event.eventType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Info */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2">Export Details</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>Format: {exportFormat.toUpperCase()}</div>
                  <div>Quality: {exportQuality}</div>
                  <div>Events: {includeEvents ? `${selectedEvents.length} included` : 'None'}</div>
                  <div className="pt-2 border-t border-gray-800 mt-2">
                    Estimated size: ~{Math.floor(Math.random() * 500 + 200)} MB
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!exportComplete && (
          <div className="flex gap-3 p-6 border-t border-gray-800">
            <button
              onClick={onClose}
              disabled={exporting}
              className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {exporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export Replay
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
