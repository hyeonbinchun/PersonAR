
import React, { useEffect, useRef, useState } from 'react';
import { Profile } from '../types';
import { RotateCw, ArrowBigLeft, Camera } from 'lucide-react';
import { cn } from '../lib/utils';
import IDCard from './IDCard';

interface LiveViewProps {
  profile: Profile;
  onExit: () => void;
}

const LiveView: React.FC<LiveViewProps> = ({ profile, onExit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [showCameraSelector, setShowCameraSelector] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

  // Get available cameras
  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);

      // For live view: Prefer phone/external cameras (AR glasses experience)
      if (cameras.length > 0) {
        const phoneCamera = cameras.find(camera => {
          const label = camera.label.toLowerCase();
          return label.includes('droidcam') ||
            label.includes('epoccam') ||
            label.includes('ivcam') ||
            label.includes('ip webcam') ||
            label.includes('phone') ||
            label.includes('mobile') ||
            label.includes('wifi');
        });

        // If no phone camera, prefer back/environment camera
        const backCamera = cameras.find(camera =>
          camera.label.toLowerCase().includes('back') ||
          camera.label.toLowerCase().includes('rear') ||
          camera.label.toLowerCase().includes('environment')
        );

        setSelectedCameraId(phoneCamera ? phoneCamera.deviceId : (backCamera ? backCamera.deviceId : cameras[0].deviceId));
      }
    } catch (err) {
      console.error("Could not enumerate cameras", err);
    }
  };

  const startCamera = async (cameraId?: string) => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } as MediaTrackConstraints,
        audio: false
      };

      // Use selected camera if available, otherwise use default facing mode
      if (cameraId || selectedCameraId) {
        (constraints.video as MediaTrackConstraints).deviceId = { exact: cameraId || selectedCameraId };
      } else {
        (constraints.video as MediaTrackConstraints).facingMode = 'environment'; // Back camera for AR experience
      }

      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Failed to start camera for live view:", err);
    }
  };

  const switchCamera = async (cameraId: string) => {
    setSelectedCameraId(cameraId);

    // Stop current stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Start new stream with selected camera
    await startCamera(cameraId);
  };

  useEffect(() => {
    const initCamera = async () => {
      await getCameras();
      await startCamera();
    };

    initCamera();

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

      {/* Camera Selector */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setShowCameraSelector(!showCameraSelector)}
            className="flex items-center gap-2 bg-black/50 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/20 text-white hover:bg-black/70 transition-all"
          >
            <RotateCw className="size-4" />
            <span className="text-xs font-medium">Camera</span>
          </button>

          {showCameraSelector && availableCameras.length > 1 && (
            <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-xl p-2 min-w-[200px]">
              {availableCameras.map((camera, index) => (
                <button
                  key={camera.deviceId}
                  onClick={() => {
                    switchCamera(camera.deviceId);
                    setShowCameraSelector(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all text-sm",
                    selectedCameraId === camera.deviceId
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10"
                  )}
                >
                  <Camera className="size-4 flex-shrink-0" />
                  <span className="truncate">
                    {camera.label || `Camera ${index + 1}`}
                  </span>
                  {selectedCameraId === camera.deviceId && (
                    <div className="size-2 rounded-full bg-green-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
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
        <IDCard profile={profile} x={0} y={0} />
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
