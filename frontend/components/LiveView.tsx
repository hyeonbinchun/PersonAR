
import React, { useEffect, useRef, useState } from 'react';
import { Profile } from '../types';
import { Badge } from './ui/Badge';
import { Mic, Video, Smile, PhoneOff, ShieldCheck, MapPin, Globe, ArrowBigLeft, Share2, Briefcase, QrCode } from 'lucide-react';
import { cn } from '../lib/utils';
import IDCard from './IDCard';

interface LiveViewProps {
  profile: Profile;
  onExit: () => void;
}

const LiveView: React.FC<LiveViewProps> = ({ profile, onExit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Failed to start camera for live view:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden animate-in fade-in duration-1000">
      {/* Background Feed - Live Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover brightness-[0.7] grayscale-[10%] scale-x-[-1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* AR Overlays */}
      <div className="absolute inset-0 pointer-events-none">

        {/* HUD: Face Tracking Center Point */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="size-[60vh] border border-white/5 rounded-full animate-pulse flex items-center justify-center">
            <div className="size-1/2 border border-white/10 rounded-full animate-ping" />
            <div className="absolute size-4 border border-primary rotate-45" />
          </div>
        </div>

        {/* Unified Integrated Identity Card */}
        <IDCard profile={profile} />
      </div>


      <div className="absolute top-10 left-10 flex items-center gap-4">
        <button
          onClick={onExit}
          className="size-14 rounded-full bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white flex items-center justify-center transition-all group"
        >
          <ArrowBigLeft className="size-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div >
  );
};

export default LiveView;
