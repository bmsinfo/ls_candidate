import StreamingAvatar from '@heygen/streaming-avatar';

declare global {
  interface Window {
    heygenAvatar: StreamingAvatar | null;
    // TODO: need to add sitepal variable as well
  }
}
