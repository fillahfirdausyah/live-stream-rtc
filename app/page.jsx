'use client';
import { React, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Peer from 'peerjs';
import { socket } from '@utils/socket';

const MainPage = () => {
  const [roomId, setRoomId] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const videoRef = useRef(null);
  const peer = new Peer();

  useEffect(() => {
    socket.connect();
    // import('peerjs').then((Peer) => {
    if (inRoom) {
      const peer = new Peer.default();
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadedmetadata', () => {
            videoRef.current.play();
          });

          socket.on('viewer-joined', (viewerId) => {
            peer.call(viewerId, stream);
          });
        });

      peer.on('open', (streamId) => {
        socket.emit('join-as-streamer', roomId, streamId);
      });

      peer.on('close', (streamId) => {
        socket.emit('disconnect-as-streamer', streamId);
      });

      socket.on('disconnect', (streamId) => {
        socket.emit('disconnect-as-streamer', streamId);
      });
    }
    // });

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [roomId, inRoom]);

  const handleTojoinRoom = () => {
    setInRoom(true);
  };

  return (
    <main className="text-threads-white">
      {!inRoom ? (
        <div className="relative mx-auto max-w-xl">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold">Live Stream</h1>
            <p className="text-2xl">
              Let’s share what is in your mind with text based Social Media
            </p>
          </div>
          <section>
            <h1 className="text-lg mt-5">Make your live room</h1>
            <input
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              type="text"
              className="outline-1 outline-red-400 bg-gray-500"
            />
            <button onClick={handleTojoinRoom}>Create Room</button>
            <p>OR</p>
            <Link href={`/join/${roomId}`}>
              <button>Join Room</button>
            </Link>
          </section>
        </div>
      ) : (
        <div className="relative mx-auto max-w-xl">
          <section>
            <h1 className="text-lg mt-5">Your Room: {roomId}</h1>
            <video ref={videoRef} autoPlay playsInline muted></video>
          </section>
        </div>
      )}
    </main>
  );
};

export default MainPage;
