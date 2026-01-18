import React from 'react';
import { Profile } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Radio, Globe, Share2, Briefcase, AtSign } from 'lucide-react';
import { cn } from '../lib/utils';
import IDCard from '@/components/IDCard';

interface EditorProps {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
  onDeploy: () => void;
}

const Editor: React.FC<EditorProps> = ({ profile, onUpdate, onDeploy }) => {

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
              backgroundImage: `url(${'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1600'})`,
              filter: 'brightness(0.8) contrast(1.1)'
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />


          {/* HUD UI */}
          <IDCard profile={profile} x={10} y={15} />
        </div>
      </section>

      {/* Editor Controls - Fixed height section, scroll moved inside card */}
      <section className="flex-1 flex flex-col lg:max-h-[calc(100vh-160px)]">
        <Card className="flex-1 flex flex-col rounded-[2.5rem] border-0 shadow-2xl bg-card/80 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-8 shrink-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black tracking-tighter">Identity Hub</CardTitle>
                <CardDescription>Adjust your spatial presence and availability.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest px-1">Display Name</Label>
                <Input
                  className="rounded-2xl h-14 bg-background/50 border-border/50 focus:border-primary"
                  value={profile.fullName}
                  onChange={e => onUpdate({ ...profile, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest px-1">AR Handle</Label>
                <div className="relative">
                  <AtSign className="absolute left-5 top-5 size-4 text-primary" />
                  <Input
                    className="pl-11 rounded-2xl h-14 bg-background/50 border-border/50 focus:border-primary font-bold"
                    value={profile.handle}
                    onChange={e => onUpdate({ ...profile, handle: e.target.value })}
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
                  onChange={e => onUpdate({ ...profile, isAvailable: e.target.checked })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest px-1">Status Signature</Label>
              <Input
                className="rounded-2xl h-14 bg-background/50 italic font-medium border-border/50 focus:border-primary"
                value={profile.status}
                onChange={e => onUpdate({ ...profile, status: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest px-1">Full Bio</Label>
              <textarea
                className="w-full min-h-[100px] rounded-2xl border border-border/50 bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                value={profile.bio}
                onChange={e => onUpdate({ ...profile, bio: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest px-1">Connectivity Nodes</Label>
              <div className="space-y-3 pb-4">
                <div className="flex items-center gap-4 bg-background/50 p-2.5 rounded-2xl border border-border shadow-sm">
                  <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center text-white shadow-lg bg-primary"
                  )}>
                    <Globe className="size-4" />
                  </div>
                  <Input
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 font-medium"
                    value={profile.link}
                    onChange={e => onUpdate({ ...profile, link: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <div className="p-8 border-t border-border flex justify-end shrink-0">
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
