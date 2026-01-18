
import React, { useEffect, useRef, useState } from 'react';
import { Match, Profile } from '@/types';
import { RotateCw, ArrowBigLeft, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import IDCard from '@/components/IDCard';
import {
  loadFaceModels,
  loadKnownFaces,
  createFaceMatcher,
  recognizeFaces,
} from "@/lib";

interface LiveViewProps {
  profile: Profile;
  onExit: () => void;
}

const MATCH_THRESHOLD = 0.5
const INITIAL_PROFILE: Profile = {
  fullName: 'Alex Rivera',
  handle: 'alex_spatial',
  email: 'alex@personar.me',
  status: 'Exploring the intersection of human consciousness and augmented reality.',
  bio: 'Product Designer & AR Ethicist based in Neo Tokyo. I build systems that bridge the gap between physical and digital presence.',
  location: 'Neo Tokyo, JP',
  isVerified: true,
  isAvailable: true,
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
  link: 'https://arivera.io',
};

const LiveView: React.FC<LiveViewProps> = ({ profile, onExit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [showCameraSelector, setShowCameraSelector] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

  const [faceMatcher, setFaceMatcher] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [isDetectionRunning, setIsDetectionRunning] = useState(false)

  useEffect(() => {
    async function init() {
      await loadFaceModels();
      console.log("Face models loaded");
      const knownFaces = await loadKnownFaces(["Jun", "Khoi", "Owen"]);
      console.log("Known faces loaded:", knownFaces);

      const matcher = createFaceMatcher(knownFaces);
      setFaceMatcher(matcher);
    }

    init()
  }, [])

  // Start detection when both faceMatcher and video are ready
  useEffect(() => {
    if (faceMatcher && videoRef.current && !isDetectionRunning) {
      startFaceDetection();
    }
  }, [faceMatcher, stream])

  const startFaceDetection = () => {
    const video = videoRef.current;

    if (!faceMatcher || !video || isDetectionRunning) return;
    
    console.log("Starting face detection...");
    setIsDetectionRunning(true);

    let lastDetectionTime = 0;
    const detectionInterval = 100; // Limit to ~10 FPS for face detection

    const detect = async () => {
      if (!video || video.paused || video.ended || !faceMatcher) {
        setIsDetectionRunning(false);
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastDetectionTime < detectionInterval) {
        requestAnimationFrame(detect);
        return;
      }

      lastDetectionTime = currentTime;

      try {
        const results = await recognizeFaces(video, faceMatcher);

        var profs = []
        results.forEach(face => {
          const { box, name, distance } = face;
          console.log("name:", name, "distance:", distance);
          // Only label if below threshold
          const displayName = distance < MATCH_THRESHOLD ? name : "Unknown";
          console.log(`Detected: ${displayName} (Distance: ${distance.toFixed(2)})`);
          
          // Position ID card to the right of the detected face
          // Add some padding and account for the mirrored video
          const videoElement = video.getBoundingClientRect();
          const scaleX = videoElement.width / video.videoWidth;
          const scaleY = videoElement.height / video.videoHeight;
          
          // Since video is mirrored (scale-x-[-1]), we need to flip the x-coordinate
          const mirroredX = videoElement.width - (box.x * scaleX + box.width * scaleX);
          
          profs.push({
            x: Math.round(mirroredX - 400), // Position to the left of face (appears right in mirrored view) with padding
            y: Math.round(box.y * scaleY), // Align with top of face
            profile: INITIAL_PROFILE
          } satisfies Match)
        });
        setProfiles(profs)
      } catch (err) {
        console.error("Face detection error:", err);
      }

      requestAnimationFrame(detect);
    };

    detect();
  };

  const handleVideoPlay = () => {
    console.log("Video play event triggered");
    if (!isDetectionRunning) {
      startFaceDetection();
    }
  };

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
      setIsDetectionRunning(false); // Stop detection when component unmounts
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
          onPlay={handleVideoPlay}
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

        {/* Unified Integrated Identity Card */}
        {profiles.map((matchedProfile, i) => (
          <IDCard key={i} profile={matchedProfile.profile} x={matchedProfile.x} y={matchedProfile.y} />
        ))}
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
