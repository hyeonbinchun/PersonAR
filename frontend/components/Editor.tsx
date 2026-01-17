
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Profile } from '../types';
import { generateBio } from '../services/gemini';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Badge } from './ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Sparkles, Radio, MapPin, Globe, Share2, Briefcase, AtSign, ShieldCheck, QrCode } from 'lucide-react';
import { cn } from '../lib/utils';

interface EditorProps {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
  onDeploy: () => void;
}

const Editor: React.FC<EditorProps> = ({ profile, onUpdate, onDeploy }) => {
  const bioMutation = useMutation({
    mutationFn: (name: string) => generateBio(name),
    onSuccess: (result) => {
      if (result) {
        onUpdate({
          ...profile,
          status: result.status,
          bio: result.bio
        });
      }
    }
  });

  const handleAiMagic = () => {
    bioMutation.mutate(profile.fullName);
  };

  const handleNodeChange = (index: number, value: string) => {
    const newNodes = [...profile.nodes];
    newNodes[index].url = value;
    onUpdate({ ...profile, nodes: newNodes });
  };

  return (
    <main className="flex-1 overflow-hidden flex flex-col lg:flex-row p-6 lg:p-10 gap-8 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Preview Section */}
      <section className="flex flex-col w-full lg:w-3/5 gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Spatial AR Environment</span>
          <h2 className="text-3xl font-black text-[#181111] dark:text-white leading-none text-balance">Perspective: Integrated Identity</h2>
        </div>

        <div className="relative flex-1 min-h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#0a0a0a] border-[6px] border-white/10 group">
          <div 
            className="absolute inset-0 bg-center bg-cover transition-transform duration-[20s] ease-linear group-hover:scale-110 opacity-70" 
            style={{ 
              backgroundImage: `url(${profile.capturedImage || 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1600'})`,
              filter: 'brightness(0.8) contrast(1.1)'
            }} 
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

          {/* Single Unified Long Card */}
          <div className="absolute inset-0 flex items-center justify-start pl-12 pointer-events-none">
            {/* Added shadow-none to remove the heavy shadow from the box */}
            <div 
              className="ar-card-glass w-[380px] rounded-[2.5rem] p-8 text-white flex flex-col gap-6 border-white/30 bg-white/5 backdrop-blur-3xl transition-all duration-700 hover:scale-105 shadow-none" 
              style={{ transform: 'rotateY(12deg) translateZ(50px)' }}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="size-5 text-primary">
                       <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                      </svg>
                    </div>
                    <span className="font-black text-[10px] tracking-[0.3em] uppercase opacity-70">PersonAR Identity</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("size-2 rounded-full animate-pulse", profile.isAvailable ? "bg-green-500" : "bg-red-500")} />
                  <Badge className="bg-white/10 text-white border-white/20 text-[9px] uppercase tracking-widest font-bold backdrop-blur-md">
                    {profile.isAvailable ? "Online" : "Quiet"}
                  </Badge>
                </div>
              </div>

              {/* Main Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-black tracking-tighter leading-none">{profile.fullName}</h3>
                  <ShieldCheck className="size-5 text-blue-400" />
                </div>
                <p className="text-primary text-sm font-bold tracking-widest uppercase">@{profile.handle}</p>
              </div>

              {/* Status Section */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase text-primary mb-2 tracking-widest opacity-80">Current Perspective</p>
                <p className="text-sm leading-relaxed opacity-95 italic font-medium line-clamp-2">"{profile.status}"</p>
              </div>

              {/* Bio Detail */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Identity Brief</p>
                <p className="text-xs leading-relaxed opacity-80 line-clamp-3">{profile.bio}</p>
              </div>

              {/* Metadata Footer */}
              <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 opacity-80">
                    <MapPin className="size-3.5 text-primary" />
                    <span className="text-[10px] font-bold tracking-wider">{profile.location}</span>
                  </div>
                  <div className="flex gap-2.5">
                    {profile.nodes.map((node, i) => (
                      <div key={i} className="size-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center border border-white/10 shadow-lg">
                        {node.type === 'website' ? <Globe className="size-3.5" /> : node.type === 'twitter' ? <Share2 className="size-3.5" /> : <Briefcase className="size-3.5" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-1.5 rounded-xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                  <QrCode className="size-12 text-black" />
                </div>
              </div>
            </div>
          </div>

          {/* HUD UI */}
          <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 pointer-events-none opacity-40">
            <div className="text-[8px] font-black text-white/50 tracking-[0.5em] uppercase">Spatial Engine v4.0</div>
            <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/5">
              <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white text-[8px] font-black tracking-[0.2em] uppercase">Active Link: {profile.handle}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editor Controls */}
      <section className="flex-1 overflow-y-auto pr-2 custom-scrollbar lg:max-h-[calc(100vh-160px)]">
        <Card className="rounded-[2.5rem] border-0 shadow-2xl bg-card/80 backdrop-blur-xl">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black tracking-tighter">Identity Hub</CardTitle>
                <CardDescription>Adjust your spatial presence and availability.</CardDescription>
              </div>
              <Button 
                onClick={handleAiMagic}
                disabled={bioMutation.isPending}
                size="sm"
                className="bg-gradient-to-tr from-indigo-600 to-primary text-white border-0 rounded-full font-bold h-10 px-6 hover:scale-105 transition-all shadow-xl shadow-primary/20"
              >
                <Sparkles className={cn("size-4 mr-2", bioMutation.isPending && "animate-spin")} />
                {bioMutation.isPending ? 'Re-Magic...' : 'AI Remix'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest px-1">Display Name</Label>
                <Input 
                  className="rounded-2xl h-14 bg-background/50 border-border/50 focus:border-primary" 
                  value={profile.fullName}
                  onChange={e => onUpdate({...profile, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest px-1">AR Handle</Label>
                <div className="relative">
                  <AtSign className="absolute left-5 top-5 size-4 text-primary" />
                  <Input 
                    className="pl-11 rounded-2xl h-14 bg-background/50 border-border/50 focus:border-primary font-bold" 
                    value={profile.handle}
                    onChange={e => onUpdate({...profile, handle: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5 bg-primary/5 rounded-3xl border border-primary/10">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Availability Signal</Label>
                  <p className="text-xs text-muted-foreground">Toggle your presence on the public grid.</p>
                </div>
                <input 
                  type="checkbox" 
                  className="size-6 rounded-lg border-primary/20 text-primary focus:ring-primary/40 cursor-pointer"
                  checked={profile.isAvailable}
                  onChange={e => onUpdate({...profile, isAvailable: e.target.checked})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest px-1">Status Signature</Label>
              <Input 
                className="rounded-2xl h-14 bg-background/50 italic font-medium border-border/50 focus:border-primary" 
                value={profile.status}
                onChange={e => onUpdate({...profile, status: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest px-1">Full Bio</Label>
              <textarea 
                className="w-full min-h-[100px] rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                value={profile.bio}
                onChange={e => onUpdate({...profile, bio: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest px-1">Connectivity Nodes</Label>
              <div className="space-y-3">
                {profile.nodes.map((node, i) => (
                  <div key={i} className="flex items-center gap-4 bg-background/50 p-2.5 rounded-2xl border border-border shadow-sm">
                    <div className={cn(
                      "size-10 rounded-xl flex items-center justify-center text-white shadow-lg",
                      node.type === 'website' ? 'bg-primary' : node.type === 'twitter' ? 'bg-[#1DA1F2]' : 'bg-[#0A66C2]'
                    )}>
                      {node.type === 'website' ? <Globe className="size-4" /> : node.type === 'twitter' ? <Share2 className="size-4" /> : <Briefcase className="size-4" />}
                    </div>
                    <Input 
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 font-medium" 
                      value={node.url}
                      onChange={e => handleNodeChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <div className="p-8 border-t border-border flex justify-end">
            <Button 
              onClick={onDeploy}
              className="h-16 px-12 rounded-3xl text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 uppercase tracking-tighter"
            >
              <span>Activate Identity</span>
              <Radio className="size-6" />
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
};

export default Editor;
