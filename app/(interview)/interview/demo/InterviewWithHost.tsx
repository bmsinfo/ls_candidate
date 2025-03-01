'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { Excalidraw } from '@excalidraw/excalidraw';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
import { WhiteWebSdk, Room, RoomPhase } from 'white-web-sdk';

import participants from '../../../../public/data/participants.json';

let client: any;
const APP_ID = '045efc71d1e24a85a465345f3f926c54';
const CHANNAL_NAME = 'test_channel';
const TEMP_TOKEN =
  '007eJxTYPBm/vWsU6Z3/eO8RwUf7/zp27Dt48pYfyZ+9Ykv5x1oMjyhwGBgYpqalmxumGKYamSSaGGaaGJmamximmacZmlklmxqYtV6KL0hkJGhbtcKJkYGCATxeRhKUotL4pMzEvPyUnMYGABLYiVc';
const ROOM_UUID = 'G1QoUMhKEe-n__HYKx8QBQ/UK9gLKnmPC744A';
const ROOM_TOKEN =
  'NETLESSSDK_YWs9cGVlVlE0XzJheFpoMmFuNCZub25jZT1kZWI0YWNiMC1mNWY1LTExZWYtYTU2MC1iYjc4YjY2OWY3MDcmcm9sZT0wJnNpZz0wYTY0OTIyYjdlNzQ1MGNkYjJjNDFjODUwNWYxMTA0ZDM4ZjM3OGZmYmYyYjBlZjdjZjgzZmU2MDk1M2QwNzBj';

export default function InterviewWithHost() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  useEffect(() => {
    if (excalidrawAPI) {
      console.log('Excalidraw API Loaded');
    }
  }, [excalidrawAPI]);
  const searchParams = useSearchParams();
  const userId = Number(searchParams.get('id'));

  const [remoteUsers, setRemoteUsers] = useState<AgoraRTC.RemoteUser[]>([]);
  const [mutedUsers, setMutedUsers] = useState<number[]>([]);
  const [selfMuted, setSelfMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  const localAudioTrack = useRef<AgoraRTC.IMicrophoneAudioTrack | null>(null);
  const localVideoTrack = useRef<AgoraRTC.ICameraVideoTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Get User Role from JSON
  const participant =
    participants.host.id === userId
      ? participants.host
      : participants.candidates.find((c) => c.id === userId);
  console.log(participant, 'participantparticipantparticipant');
  const isHost = participant?.id === participants.host.id;

  const joinedUsers = [participant, ...participants.candidates].filter(
    (user: any) =>
      user.id === participant?.id || remoteUsers.some((u) => u.uid === user.id),
  );
  useEffect(() => {
    let isMounted = true;

    const initAgora = async () => {
      try {
        if (!participant) {
          console.error('Invalid participant, exiting Agora setup.');
          return;
        }

        // Ensure client is created only once
        if (!client) {
          client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        }

        await client.join(APP_ID, CHANNAL_NAME, TEMP_TOKEN, participant.id);

        // Create and Publish Audio & Video Tracks
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        localAudioTrack.current = audioTrack;
        localVideoTrack.current = videoTrack;

        await client.publish([audioTrack, videoTrack]);

        // Play local video
        if (localVideoRef.current) {
          videoTrack.play(localVideoRef.current);
        }

        // Handle Remote User Publishing
        client.on('user-published', async (user: any, mediaType: any) => {
          if (!isMounted) return;
          await client.subscribe(user, mediaType);
          setRemoteUsers((prevUsers) => {
            const userExists = prevUsers.some((u) => u.uid === user.uid);
            return userExists ? prevUsers : [...prevUsers, user];
          });

          if (mediaType === 'video') {
            const remoteVideoContainer = document.getElementById(
              `video-${user.uid}`,
            );
            if (remoteVideoContainer) {
              user.videoTrack?.play(remoteVideoContainer);
            }
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        client.on('user-unpublished', (user: any) => {
          setRemoteUsers((prevUsers) =>
            prevUsers.filter((u) => u.uid !== user.uid),
          );
        });
      } catch (error) {
        console.error('Agora Initialization Error:', error);
      }
    };

    initAgora();

    return () => {
      isMounted = false;

      if (client) {
        client
          .leave()
          .then(() => {
            console.log('Agora client left successfully.');
          })
          .catch((err: any) => {
            console.error('Error leaving Agora:', err);
          });
      }

      localAudioTrack.current?.stop();
      localAudioTrack.current?.close();
      localVideoTrack.current?.stop();
      localVideoTrack.current?.close();
    };
  }, [participant, userId]);

  // 🔹 User Mutes/Unmutes Self
  const toggleSelfMute = () => {
    if (isHost) return;
    setSelfMuted(!selfMuted);
    localAudioTrack.current?.setVolume(0);
  };

  // Toggle Video
  const toggleVideo = async () => {
    if (!localVideoTrack.current) return;
    setVideoEnabled(!videoEnabled);
    await localVideoTrack.current.setMuted(!videoEnabled);
  };

  // Leave Call
  const handleLeave = () => {
    client?.leave();
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="text-center p-4 text-lg font-bold">
        Agora Interview
      </header>

      <main className="flex-1 flex flex-col gap-4 p-4">
        {/* Remote Users and Whiteboard */}
        <section
          className={`flex-1 flex ${showWhiteboard ? 'flex-row' : 'flex-col'} gap-4`}>
          {showWhiteboard && (
            <div className="w-1/2 rounded-lg p-4">
              {/* <h3 className="text-black text-center">Whiteboard</h3> */}
              <div id="agora-whiteboard" className="w-full h-full">
                <div style={{ height: '500px', border: '1px solid black' }}>
                  <Excalidraw
                    onCollabButtonClick={(api: any) => setExcalidrawAPI(api)}
                  />
                </div>
              </div>
            </div>
          )}
          <div
            className={`grid ${showWhiteboard ? 'w-1/2' : 'w-full'} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`}>
            {joinedUsers.map((user: any) => (
              <div
                key={user.id}
                className="relative flex flex-col items-center justify-center bg-black h-48 rounded-lg">
                <span className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded">
                  {user.name}
                </span>
                <div
                  id={`video-${user.id}`}
                  className="w-full h-full flex items-center justify-center">
                  {user.id === participant?.id ? (
                    <div ref={localVideoRef} className="w-full h-full"></div>
                  ) : (
                    remoteUsers.find((u) => u.uid === user.id)?.videoTrack && (
                      <div
                        id={`video-${user.id}`}
                        className="w-full h-full"></div>
                    )
                  )}
                </div>
                {isHost && user.id !== participant.id && (
                  <button
                    onClick={() => {
                      const isMuted = mutedUsers.includes(user.id);
                      if (isMuted) {
                        setMutedUsers(
                          mutedUsers.filter((id) => id !== user.id),
                        );
                        client.remoteUsers
                          .find((u: any) => u.uid === user.id)
                          ?.audioTrack?.setVolume(100);
                      } else {
                        setMutedUsers([...mutedUsers, user.id]);
                        client.remoteUsers
                          .find((u: any) => u.uid === user.id)
                          ?.audioTrack?.setVolume(0);
                      }
                    }}
                    className="mt-2 p-2 bg-gray-700 rounded-full">
                    {mutedUsers.includes(user.id) ? (
                      <MicOff className="w-6 h-6 text-red-500" />
                    ) : (
                      <Mic className="w-6 h-6 text-white" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Controls */}
      <footer className="flex justify-center gap-4 p-4 bg-gray-800">
        {isHost && (
          <>
            <button
              onClick={toggleSelfMute}
              className="p-2 bg-gray-700 rounded-full">
              {selfMuted ? (
                <MicOff className="w-6 h-6 text-red-500" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={toggleVideo}
              className="p-2 bg-gray-700 rounded-full">
              {videoEnabled ? (
                <Video className="w-6 h-6 text-white" />
              ) : (
                <VideoOff className="w-6 h-6 text-red-500" />
              )}
            </button>
          </>
        )}
        <button className="p-2 bg-red-600 rounded-full" onClick={handleLeave}>
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
        {isHost && (
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className="p-2 bg-gray-700 rounded-full">
            {showWhiteboard ? 'Hide Whiteboard' : 'Show Whiteboard'}
          </button>
        )}
      </footer>
    </div>
  );
}
