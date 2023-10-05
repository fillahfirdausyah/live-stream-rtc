'use client';

import { React, useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { socket } from '@utils/socket';
import Peer from 'peerjs';

const JoinPage = () => {
  const params = useParams();
  const [inRoom, setInRoom] = useState(false);
  const videoRef = useRef(null);
  const peer = new Peer();

  useEffect(() => {
    socket.connect();
    if (inRoom) {
      socket.on('connect', () => {
        console.log('Connected as Viewer');
      });

      peer.on('open', (streamId) => {
        socket.emit('join-as-viewer', params.roomId, streamId);
      });

      peer.on('call', (call) => {
        call.answer();
        call.on('stream', (stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadedmetadata', () => {
            videoRef.current.play();
          });
        });
      });

      peer.on('connection', (conn) => {
        conn.on('close', () => {
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
      });

      socket.on('disconnect', () => {
        console.log('Disconnected as Viewer');
      });

      socket.on('streamer-disconnected', () => {
        console.log('Streamer Disconnected');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });

      socket.on('streamer-joined', (streamerId) => {
        console.log('Streamer Joined');
        const conn = peer.connect(streamerId);
        conn.on('close', () => {
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
      });
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [inRoom, params.roomId]);

  const handleTojoinRoom = () => {
    setInRoom(true);
  };

  return (
    <div>
      {!inRoom ? (
        <div>
          <h2>Join the Stream</h2>
          <button onClick={handleTojoinRoom}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Watching Stream</h2>
          <video ref={videoRef} autoPlay playsInline></video>
        </div>
      )}
    </div>
  );
};

export default JoinPage;
