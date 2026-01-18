
import React, { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';
import { Profile } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Mail, AtSign, Camera, Trash2, Check, Globe, ShieldCheck, X } from 'lucide-react';
import { cn } from '../lib/utils';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  handle: z.string().min(3, 'Handle must be 3+ characters').regex(/^[a-z0-9_]+$/, 'Only letters, numbers and underscores'),
});

type OnboardingStep = 'basics' | 'scan' | 'identity';

const REQUIRED_PHOTOS = [
  { id: 0, label: 'Head-On Perspective', description: 'Look directly at the camera' },
  { id: 1, label: 'Head-On Perspective', description: 'Look directly at the camera' },
  { id: 2, label: 'Head-On Perspective', description: 'Look directly at the camera' },
];

interface SignUpProps {
  onComplete: (data: Partial<Profile>) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('basics');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    handle: '',
    status: 'Exploring the AR frontier.',
    bio: '',
    isAvailable: true,
    capturedImages: ['', '', ''] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async (slotIndex: number) => {
    setActiveSlot(slotIndex);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(s);
      // Wait for next tick to ensure video element is rendered if it was hidden
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access to create your AR identity. If camera fails, you can still upload photos.");
      setActiveSlot(null);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const allPhotosCaptured = formData.capturedImages.every(img => img !== '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSlot !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...formData.capturedImages];
        newImages[activeSlot] = reader.result as string;
        setFormData({ ...formData, capturedImages: newImages });
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && activeSlot !== null) {
      if (videoRef.current.readyState < 2) return;

      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        try {
          const dataUrl = canvasRef.current.toDataURL('image/png');
          const newImages = [...formData.capturedImages];
          newImages[activeSlot] = dataUrl;
          setFormData({ ...formData, capturedImages: newImages });
          stopCamera();
        } catch (err) {
          console.error("Capture failed", err);
        }
      }
    }
  };

  const nextStep = () => {
    if (step === 'basics') {
      const result = signUpSchema.safeParse({
        fullName: formData.fullName,
        email: formData.email,
        handle: formData.handle
      });
      if (!result.success) {
        const fieldErrors: any = {};
        result.error.issues.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
      setErrors({});
      setStep('scan');
    } else if (step === 'scan') {
      if (formData.capturedImages.every(img => img !== '')) {
        setStep('identity');
      }
    }
  };

  const removePhoto = (index: number) => {
    const newImages = [...formData.capturedImages];
    newImages[index] = '';
    setFormData({ ...formData, capturedImages: newImages });
  };

  const finalize = () => {
    onComplete({
      ...formData,
      avatarUrl: formData.capturedImages[0],
      isVerified: true,
      location: 'Local Grid',
      link: 'https://personar.me/' + formData.handle
    });
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full gap-8">
      {/* Step Indicator */}
      <div className="flex items-center gap-4 w-full max-w-md mb-4">
        {['basics', 'scan', 'identity'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={cn(
              "size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
              step === s ? "bg-primary border-primary text-white scale-110" :
                (i < ['basics', 'scan', 'identity'].indexOf(step) ? "bg-green-500 border-green-500 text-white" : "border-muted text-muted-foreground")
            )}>
              {i < ['basics', 'scan', 'identity'].indexOf(step) ? <Check className="size-4" /> : i + 1}
            </div>
            {i < 2 && <div className={cn("flex-1 h-0.5", i < ['basics', 'scan', 'identity'].indexOf(step) ? "bg-green-500" : "bg-muted")} />}
          </React.Fragment>
        ))}
      </div>

      <div className="w-full flex justify-center">
        {step === 'basics' && (
          <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle>The Basics</CardTitle>
              <CardDescription>First, tell us who you are in the physical world.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="E.g. Satoshi Nakamoto"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-destructive font-bold uppercase tracking-tighter">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    type="email"
                    className="pl-9"
                    placeholder="email@provider.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive font-bold uppercase tracking-tighter">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label>AR Handle</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="username"
                    value={formData.handle}
                    onChange={e => setFormData({ ...formData, handle: e.target.value })}
                  />
                </div>
                {errors.handle && <p className="text-xs text-destructive font-bold uppercase tracking-tighter">{errors.handle}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={nextStep} className="w-full h-12 text-base">Next: Facial Authentication</Button>
            </CardFooter>
          </Card>
        )}

        {step === 'scan' && (
          <div className="w-full space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight">Triple Biometric Link</h2>
              <p className="text-muted-foreground">Capture 3 perspectives to anchor your spatial identity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REQUIRED_PHOTOS.map((req, idx) => (
                <Card key={req.id} className={cn(
                  "relative overflow-hidden transition-all group border-2",
                  formData.capturedImages[idx] ? "border-green-500/50" : "border-muted hover:border-primary/50"
                )}>
                  <div className="aspect-[3/4] bg-muted flex flex-col items-center justify-center p-4">
                    {formData.capturedImages[idx] ? (
                      <div className="relative size-full">
                        <img src={formData.capturedImages[idx]} className="size-full object-cover rounded-xl" alt={req.label} />
                        <div className="absolute inset-0 bg-green-500/10 rounded-xl" />
                        <button
                          onClick={() => removePhoto(idx)}
                          className="absolute top-2 right-2 size-8 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="size-16 rounded-full bg-background border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mx-auto">
                          <Camera className="size-8 text-muted-foreground/50" />
                        </div>
                        <div>
                          <p className="font-bold text-sm uppercase tracking-wider">{req.label}</p>
                          <p className="text-xs text-muted-foreground">{req.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startCamera(idx)} className="rounded-full">
                            Camera
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setActiveSlot(idx); fileInputRef.current?.click(); }} className="rounded-full">
                            Upload
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {formData.capturedImages[idx] && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-green-500" />
                  )}
                </Card>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={nextStep}
                disabled={!allPhotosCaptured}
                className="h-14 px-12 rounded-full text-lg font-black bg-primary shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {allPhotosCaptured ? 'Finalize Identity Projection' : 'Complete All Scans'}
              </Button>
            </div>

            {/* Hidden Video Overlay for Capture */}
            {activeSlot !== null && stream && (
              <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-2xl relative aspect-video rounded-[2.5rem] overflow-hidden border-[6px] border-white/10 shadow-2xl">
                  <video ref={videoRef} autoPlay playsInline muted className="size-full object-cover scale-x-[-1]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-64 border-2 border-primary/40 rounded-full animate-pulse border-dashed" />
                  </div>
                  <div className="absolute bottom-10 inset-x-0 flex justify-center gap-6">
                    <Button
                      size="lg"
                      onClick={capturePhoto}
                      className="size-20 rounded-full bg-white text-primary hover:scale-110 p-0 shadow-2xl"
                    >
                      <Camera className="size-8" />
                    </Button>
                    <Button
                      size="lg"
                      variant="destructive"
                      onClick={stopCamera}
                      className="size-20 rounded-full p-0 shadow-2xl"
                    >
                      <X className="size-8" />
                    </Button>
                  </div>
                </div>
                <div className="mt-8 text-center text-white space-y-2">
                  <h3 className="text-2xl font-black">{REQUIRED_PHOTOS[activeSlot].label}</h3>
                  <p className="text-white/60">{REQUIRED_PHOTOS[activeSlot].description}</p>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>)}

        {step === 'identity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl animate-in slide-in-from-right-8 duration-500">
            {/* Left Column: Form */}
            <Card className="h-fit">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Identity</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setStep('scan')} className="rounded-full">
                    <X className="size-4" />
                  </Button>
                </div>
                <CardDescription>Express your authentic self and create how you appear to others.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Current Status</Label>
                    {/* <Button variant="link" size="sm" onClick={() => bioMutation.mutate(formData.fullName)} disabled={bioMutation.isPending} className="p-0 h-auto text-xs flex items-center gap-1">
                      <Sparkles className="size-3" /> Re-magic
                    </Button> */}
                  </div>
                  <Input
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="italic font-medium border-primary/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Identity Brief</Label>
                  <textarea
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Express who you are and how you want to evolve your connections..."
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-xl border border-border">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Anonymous Mode</p>
                    <p className="text-xs text-muted-foreground">Start invisible - hide your persona until you're ready</p>
                  </div>
                  <input
                    type="checkbox"
                    className="size-5 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={!formData.isAvailable}
                    onChange={e => setFormData({ ...formData, isAvailable: !e.target.checked })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={finalize} className="w-full h-12 text-base font-bold flex items-center gap-2">
                  <Globe className="size-5" /> Create Identity
                </Button>
              </CardFooter>
            </Card>

            {/** Triple View */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Spatial Projection Composite</h4>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[600px]">
                <div className="col-span-2 row-span-1 relative rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                  <img src={formData.capturedImages[0]} className="size-full object-cover" alt="Head On" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-white text-2xl font-black tracking-tight">{formData.fullName}</h3>
                    <p className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">@{formData.handle}</p>
                  </div>
                </div>
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-white/10">
                  <img src={formData.capturedImages[1]} className="size-full object-cover" alt="Left Profile" />
                </div>
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-white/10">
                  <img src={formData.capturedImages[2]} className="size-full object-cover" alt="Right Profile" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center font-medium italic">"Composite identity anchored to 3-point biometric grid."</p>
            </div>

          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an identity? <Link to="/login" className="text-primary font-semibold hover:underline">Sync existing profile</Link>
        </p>
      </div>
    </div>
  );
};
