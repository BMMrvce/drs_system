import { useEffect, useRef } from 'react';
import { SensorEvent, EventType } from '../types/index';

interface UseRealtimeEventsProps {
  matchId: string;
  isLive: boolean;
  onEvent: (event: SensorEvent) => void;
}

const eventTypes: EventType[] = ['wicket', 'bail_dislodged', 'stump_motion', 'motion_alert'];

const sensorIds = [
  'stump-left-001',
  'stump-middle-001',
  'stump-right-001',
  'bail-primary-001',
  'bail-secondary-001'
];

export function useRealtimeEvents({ matchId, isLive, onEvent }: UseRealtimeEventsProps) {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isLive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Simulate random events every 20-60 seconds
    const generateRandomEvent = () => {
      // 30% chance of generating an event each interval
      if (Math.random() > 0.7) {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const sensorId = sensorIds[Math.floor(Math.random() * sensorIds.length)];

        const newEvent: SensorEvent = {
          id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          matchId,
          timestamp: Date.now(),
          eventType,
          sensorId,
          confidence: 0.75 + Math.random() * 0.24, // 75-99% confidence
          replayOffset: Math.floor(Math.random() * 5) + 2, // 2-6 seconds offset
          metadata: generateEventMetadata(eventType)
        };

        onEvent(newEvent);
      }
    };

    // Check for events every 20 seconds
    intervalRef.current = setInterval(generateRandomEvent, 20000);

    // Generate initial event after 5 seconds
    const initialTimeout = setTimeout(generateRandomEvent, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(initialTimeout);
    };
  }, [matchId, isLive, onEvent]);
}

function generateEventMetadata(eventType: EventType): Record<string, any> {
  switch (eventType) {
    case 'wicket':
      return {
        impactForce: (Math.random() * 10 + 5).toFixed(1),
        bailDisplaced: Math.random() > 0.3,
        impactAngle: Math.floor(Math.random() * 90)
      };
    case 'bail_dislodged':
      return {
        separationTime: (Math.random() * 0.05 + 0.01).toFixed(3),
        bailId: Math.random() > 0.5 ? 'primary' : 'secondary',
        height: (Math.random() * 20 + 5).toFixed(1)
      };
    case 'stump_motion':
      return {
        tiltAngle: (Math.random() * 15 + 5).toFixed(1),
        duration: Math.floor(Math.random() * 200 + 50),
        direction: Math.random() > 0.5 ? 'left' : 'right'
      };
    case 'motion_alert':
      return {
        threshold: (Math.random() * 5 + 2).toFixed(1),
        duration: Math.floor(Math.random() * 100 + 50)
      };
    default:
      return {};
  }
}
