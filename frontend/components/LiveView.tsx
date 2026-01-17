
import React, { useEffect, useRef, useState } from 'react';
import { Profile } from '../types';
import { Badge } from './ui/Badge';
import { Mic, Video, Smile, PhoneOff, ShieldCheck, MapPin, Globe, Share2, Briefcase, QrCode } from 'lucide-react';
import { cn } from '../lib/utils';

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
        {/* HUD: Status Indicators */}
        <div className="absolute top-10 left-10 flex items-center gap-4">
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-2xl px-5 py-2.5 rounded-full border border-white/10">
            <div className="size-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
            <span className="text-white text-xs font-black tracking-widest uppercase">REC BROADCAST</span>
          </div>
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-2xl px-5 py-2.5 rounded-full border border-white/10">
            <span className="text-primary text-[10px] font-black uppercase tracking-tighter">LATENCY: 8ms</span>
          </div>
        </div>

        {/* HUD: Face Tracking Center Point */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="size-[60vh] border border-white/5 rounded-full animate-pulse flex items-center justify-center">
            <div className="size-1/2 border border-white/10 rounded-full animate-ping" />
            <div className="absolute size-4 border border-primary rotate-45" />
          </div>
        </div>

        {/* Unified Integrated Identity Card */}
        <div className="absolute inset-y-0 right-20 flex items-center">
           <div 
             className="w-[440px] ar-card-glass rounded-[3rem] p-10 pointer-events-auto border-white/30 bg-white/5 backdrop-blur-3xl shadow-[0_0_80px_rgba(234,42,51,0.15)] transform transition-transform duration-700 hover:scale-105 flex flex-col gap-8" 
             style={{ perspective: '1200px', transform: 'rotateY(-15deg)' }}
           >
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">Integrated Bio-ID</span>
                    <Badge variant={profile.isAvailable ? "success" : "secondary"} className="mt-1 bg-green-500 text-[9px] font-black py-0.5 tracking-wider">
                      {profile.isAvailable ? "ACTIVE" : "QUIET"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Main Branding */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-white text-5xl font-black tracking-tighter leading-none">{profile.fullName}</h1>
                  <ShieldCheck className="size-6 text-blue-400 fill-blue-400/20" />
                </div>
                <p className="text-primary text-base font-bold tracking-[0.2em] uppercase">@{profile.handle}</p>
              </div>

              {/* Quote & Bio Block */}
              <div className="space-y-6">
                <div className="bg-white/5 border-l-4 border-primary p-6 rounded-r-2xl">
                  <p className="text-white/90 text-lg italic font-medium leading-relaxed">"{profile.status}"</p>
                </div>
                <div className="px-1">
                  <p className="text-white/60 text-sm leading-relaxed font-medium">{profile.bio}</p>
                </div>
              </div>

              {/* Action/Data Footer */}
              <div className="mt-auto pt-10 border-t border-white/10 flex items-end justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 group">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MapPin className="size-4 text-primary" />
                    </div>
                    <span className="text-white/80 text-sm font-bold tracking-widest uppercase">{profile.location}</span>
                  </div>
                  <div className="flex gap-3">
                    {profile.nodes.map((node, i) => (
                      <div key={i} className="size-11 rounded-2xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center border border-white/10">
                        {node.type === 'website' ? <Globe className="size-5" /> : node.type === 'twitter' ? <Share2 className="size-5" /> : <Briefcase className="size-5" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] scale-110">
                  <QrCode className="size-16 text-black" />
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/40 p-3 rounded-full backdrop-blur-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-10">
        <button className="size-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95">
          <Mic className="size-6" />
        </button>
        <button className="size-16 rounded-full bg-primary hover:bg-primary/80 text-white flex items-center justify-center transition-all shadow-xl shadow-primary/30 scale-110 hover:scale-125 active:scale-90">
          <Video className="size-8" />
        </button>
        <button className="size-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95">
          <Smile className="size-6" />
        </button>
        <div className="w-px h-10 bg-white/10 mx-1" />
        <button 
          onClick={onExit}
          className="size-14 rounded-full bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white flex items-center justify-center transition-all group"
        >
          <PhoneOff className="size-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default LiveView;
