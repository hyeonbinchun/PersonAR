
import React, { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { Profile } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Mail, AtSign, Camera, Sparkles, Check, Globe, ShieldCheck, X } from 'lucide-react';
import { generateBio } from '../services/gemini';
import { cn } from '../lib/utils';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  handle: z.string().min(3, 'Handle must be 3+ characters').regex(/^[a-z0-9_]+$/, 'Only letters, numbers and underscores'),
});

type OnboardingStep = 'basics' | 'scan' | 'identity';

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
    capturedImage: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const bioMutation = useMutation({
    mutationFn: (name: string) => generateBio(name),
    onSuccess: (result) => {
      if (result) {
        setFormData(prev => ({ ...prev, status: result.status, bio: result.bio }));
      }
    }
  });

  const startCamera = async () => {
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
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access to create your AR identity. Ensure you are using a secure (HTTPS) connection.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      // Ensure the video is actually playing and has dimensions
      if (videoRef.current.readyState < 2) return;

      try {
        const context = canvasRef.current.getContext('2d', { willReadFrequently: true });
        if (context) {
          // Set canvas dimensions to match the video stream
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          
          // Clear canvas before drawing
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Mirror the capture to match the video preview if needed, 
          // but usually we just want the raw capture.
          context.drawImage(videoRef.current, 0, 0);
          
          // Use try-catch specifically for toDataURL which triggers SecurityError
          let dataUrl = '';
          try {
            dataUrl = canvasRef.current.toDataURL('image/png');
          } catch (secErr) {
            console.warn("Standard capture failed, trying blob fallback", secErr);
            // In some ultra-strict environments, toDataURL is blocked.
            // We'll alert specifically about security settings.
            throw secErr;
          }
          
          if (dataUrl) {
            setFormData({ ...formData, capturedImage: dataUrl });
            stopCamera();
            setStep('identity');
            bioMutation.mutate(formData.fullName);
          }
        }
      } catch (err) {
        console.error("Failed to capture photo:", err);
        alert("Capture Error: Your browser blocked the identity scan. This usually happens in private/incognito modes or due to high privacy settings (Fingerprinting Protection). Please try using a regular browser window or disable privacy extensions.");
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
      startCamera();
    }
  };

  const finalize = () => {
    onComplete({
      ...formData,
      avatarUrl: formData.capturedImage,
      isVerified: true,
      location: 'Local Grid',
      nodes: [
        { type: 'website', url: 'https://personar.me/' + formData.handle, label: 'Identity Node' }
      ]
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
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input 
                    className="pl-9" 
                    placeholder="E.g. Satoshi Nakamoto"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
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
                    onChange={e => setFormData({...formData, email: e.target.value})}
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
                    onChange={e => setFormData({...formData, handle: e.target.value})}
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
          <Card className="w-full max-w-2xl overflow-hidden border-0 bg-transparent shadow-none animate-in zoom-in duration-500">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border-[6px] border-white/10 shadow-2xl">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                <div className="absolute inset-0 border-[2px] border-primary/40 rounded-3xl pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-48 md:size-64 border-2 border-primary/20 rounded-full animate-pulse flex items-center justify-center">
                    <div className="size-full border border-primary animate-ping rounded-full opacity-20" />
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Face Detect</span>
                  </div>
                </div>
                <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-4">
                  <Button size="lg" onClick={capturePhoto} className="size-20 rounded-full bg-white text-primary hover:bg-white hover:scale-110 shadow-2xl transition-all p-0">
                    <div className="size-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                      <Camera className="size-8" />
                    </div>
                  </Button>
                  <Badge variant="outline" className="bg-black/60 text-white border-white/20 backdrop-blur-md">Center your face in the circle</Badge>
                </div>
              </div>
              <div className="mt-8 text-center max-w-md">
                <h3 className="text-xl font-bold mb-2">Biometric Identity Link</h3>
                <p className="text-muted-foreground text-sm">We use your likeness to anchor your spatial profile. This photo will be used as your digital avatar.</p>
              </div>
            </CardContent>
            <canvas ref={canvasRef} className="hidden" />
          </Card>
        )}

        {step === 'identity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl animate-in slide-in-from-right-8 duration-500">
            {/* Left Column: Form */}
            <Card className="h-fit">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Refine Identity</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setStep('scan')} className="rounded-full">
                    <X className="size-4" />
                  </Button>
                </div>
                <CardDescription>Customize how you appear in spatial views.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Status Quote</Label>
                    <Button variant="link" size="sm" onClick={() => bioMutation.mutate(formData.fullName)} disabled={bioMutation.isPending} className="p-0 h-auto text-xs flex items-center gap-1">
                      <Sparkles className="size-3" /> Re-magic
                    </Button>
                  </div>
                  <Input 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="italic font-medium border-primary/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Expanded Bio</Label>
                  <textarea 
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell the world about your AR perspective..."
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-xl border border-border">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Signal: Online</p>
                    <p className="text-xs text-muted-foreground">Show others when you're available for interaction.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="size-5 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={formData.isAvailable}
                    onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={finalize} className="w-full h-12 text-base font-bold flex items-center gap-2">
                  <Globe className="size-5" /> Activate AR Profile
                </Button>
              </CardFooter>
            </Card>

            {/* Right Column: Preview */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary">Spatial Projection Preview</h4>
              </div>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-2xl bg-black border-[4px] border-white/10">
                {formData.capturedImage && <img src={formData.capturedImage} className="absolute inset-0 size-full object-cover" alt="Identity Preview" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                {/* Float HUD */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <div className={cn("size-2 rounded-full animate-pulse", formData.isAvailable ? "bg-green-500" : "bg-red-500")} />
                    <span className="text-white text-[8px] font-black tracking-widest uppercase">
                      {formData.isAvailable ? "Open for Interaction" : "Signal: Busy"}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-8 inset-x-8 ar-card-glass rounded-2xl p-5 text-white animate-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <h3 className="text-xl font-black leading-none">{formData.fullName}</h3>
                      <p className="text-primary text-[10px] font-bold tracking-widest mt-1 uppercase">@{formData.handle}</p>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20">
                      <ShieldCheck className="size-3 mr-1" /> Verified
                    </Badge>
                  </div>
                  <p className="text-xs italic opacity-90 leading-relaxed line-clamp-2">"{formData.status}"</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center px-4 italic">"This is exactly how you will appear to other users in the spatial grid."</p>
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
