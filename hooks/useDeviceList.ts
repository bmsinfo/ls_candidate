import { useState, useCallback } from 'react';

export type DeviceItems = MediaDeviceInfo[];

export type DeviceList = {
  video: DeviceItems;
  audio: DeviceItems;
};

export function useDeviceList() {
  const [deviceList, setDeviceList] = useState<DeviceList>({
    video: [],
    audio: [],
  });
  const [videoDeviceId, setVideoDeviceId] = useState('');
  const [audioDeviceId, setAudioDeviceId] = useState('');
  const [deviceLabels, setDeviceLabels] = useState({ audio: '', video: '' });

  const getDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return null;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const list: DeviceList = { video: [], audio: [] };

      devices.forEach((device) => {
        if (device.kind === 'videoinput') list.video.push(device);
        if (device.kind === 'audioinput') list.audio.push(device);
      });

      setDeviceList(list);

      // Set default devices if not already set
      if (!videoDeviceId && list.video[0]) {
        setVideoDeviceId(list.video[0].deviceId);
      }
      if (!audioDeviceId && list.audio[0]) {
        setAudioDeviceId(list.audio[0].deviceId);
      }

      return list;
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
      return null;
    }
  }, [videoDeviceId, audioDeviceId]);

  const selectVideo = useCallback((id: string) => {
    setVideoDeviceId(id);
  }, []);

  const selectAudio = useCallback((id: string) => {
    setAudioDeviceId(id);
  }, []);

  return {
    deviceList,
    deviceLabels,
    videoDeviceId,
    audioDeviceId,
    getDevices,
    selectVideo,
    selectAudio,
  };
}
