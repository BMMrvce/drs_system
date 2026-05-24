// Simple circular MediaRecorder buffer to keep recent video in memory
export class CircularRecorder {
  chunks: Array<{ ts: number; blob: Blob }> = [];
  recordedChunks: Blob[] = [];
  mediaRecorder: MediaRecorder | null = null;
  timeslice = 1000; // ms per chunk
  bufferDuration = 60; // seconds of buffer

  constructor(bufferDurationSeconds = 60, timesliceMs = 1000) {
    this.bufferDuration = bufferDurationSeconds;
    this.timeslice = timesliceMs;
  }

  start(stream: MediaStream, mimeType?: string) {
    if (this.mediaRecorder) return;
    const opts: MediaRecorderOptions = {};
    if (mimeType && MediaRecorder.isTypeSupported(mimeType)) opts.mimeType = mimeType;
    try {
      this.mediaRecorder = new MediaRecorder(stream, opts);
    } catch (e) {
      this.mediaRecorder = new MediaRecorder(stream);
    }

    this.mediaRecorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) {
        this.recordedChunks.push(ev.data);
        this.chunks.push({ ts: Date.now(), blob: ev.data });
        this.trimBuffer();
      }
    };

    this.mediaRecorder.start(this.timeslice);
  }

  stop() {
    if (!this.mediaRecorder) return;
    try {
      this.mediaRecorder.stop();
    } catch {}
    this.mediaRecorder = null;
  }

  trimBuffer() {
    const cutoff = Date.now() - this.bufferDuration * 1000;
    // keep only chunks newer than cutoff
    let i = 0;
    while (i < this.chunks.length && this.chunks[i].ts < cutoff) i++;
    if (i > 0) this.chunks.splice(0, i);
  }

  // secondsBefore: how many seconds before now the clip should end
  // duration: length of clip in seconds
  async getClip(secondsBefore = 2, duration = 6): Promise<Blob | null> {
    if (this.chunks.length === 0) return null;
    const now = Date.now();
    const clipEnd = now - secondsBefore * 1000;
    const clipStart = clipEnd - duration * 1000;

    // find chunks overlapping [clipStart, clipEnd]
    const parts: Blob[] = [];
    for (const c of this.chunks) {
      const chunkEnd = c.ts; // approximate end time
      const chunkStart = c.ts - this.timeslice;
      if (chunkEnd >= clipStart && chunkStart <= clipEnd) {
        parts.push(c.blob);
      }
    }

    if (parts.length === 0) return null;
    return new Blob(parts, { type: parts[0].type });
  }

  getRecording(): Blob | null {
    if (this.recordedChunks.length === 0) {
      return null;
    }

    return new Blob(this.recordedChunks, { type: this.recordedChunks[0].type });
  }
}

export default CircularRecorder;
