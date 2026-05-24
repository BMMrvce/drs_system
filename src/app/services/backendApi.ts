import { Device } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchDevices(): Promise<Device[]> {
  return request<Device[]>('/devices');
}

export async function syncDevices(devices: Device[]): Promise<Device[]> {
  const payload = await request<{ devices: Device[] }>('/devices/bulk', {
    method: 'POST',
    body: JSON.stringify({ devices })
  });

  return payload.devices;
}

export async function uploadVideoBlob(params: {
  blob: Blob;
  matchId?: string;
  eventId?: string;
  fileName?: string;
}): Promise<{ secureUrl: string; publicId: string }> {
  const formData = new FormData();
  formData.append('video', params.blob, params.fileName || 'recording.webm');
  if (params.matchId) formData.append('matchId', params.matchId);
  if (params.eventId) formData.append('eventId', params.eventId);

  const response = await fetch(`${API_BASE_URL}/uploads/video`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `Upload failed with status ${response.status}`);
  }

  const payload = await response.json();
  return {
    secureUrl: payload.upload?.secure_url || payload.asset?.cloudinaryUrl,
    publicId: payload.upload?.public_id || payload.asset?.cloudinaryPublicId
  };
}

export { API_BASE_URL };