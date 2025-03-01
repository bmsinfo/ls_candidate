import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = '045efc71d1e24a85a465345f3f926c54';
const TOKEN =
  '007eJxTYDgtcatwkYb/cxWlAM68Kc94mPZLttdmC8twqf5+9a47WkyBwcDENDUt2dwwxTDVyCTRwjTRxMzU2MQ0zTjN0sgs2dQkpnVfekMgI0Ok8UUWRgYIBPF5GEpSi0vikzMS8/JScxgYAHMbH/A=';
const CHANNEL_NAME = 'test_channel';

export const initAgoraClient = async () => {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
  return client;
};

export const createLocalTracks = async () => {
  try {
    const [localAudioTrack, localVideoTrack] =
      await AgoraRTC.createMicrophoneAndCameraTracks();
    return { localAudioTrack, localVideoTrack };
  } catch (error) {
    console.error('Failed to get local tracks:', error);
    throw error;
  }
};
