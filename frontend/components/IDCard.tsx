import { Profile } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { ShieldCheck, MapPin, Globe, Share2, Briefcase } from 'lucide-react';
interface IDCardProps {
  profile: Profile
  x: number,
  y: number,
}

const IDCard: React.FC<IDCardProps> = ({ profile, x, y }) => {
  return (
    <div 
      className="absolute flex items-center justify-start pointer-events-none"
      style={{
        top: `${y}px`,
        left: `${x}px`
      }}
    >
      {/* Added shadow-none to remove the heavy shadow from the box */}
      <div
        className="ar-card-glass w-[380px] rounded-[2.5rem] p-8 text-white flex flex-col gap-6 border-white/30 bg-white/5 backdrop-blur-3xl transition-all duration-300 shadow-none"
        style={{ 
          transform: 'rotateY(12deg) translateZ(50px)', // Maintain 3D effect
          transition: 'all 0.3s ease-out' // Smooth movement
        }}
      >        {/* Card Header */}
        < div className="flex justify-between items-start" >
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
        </div >

        {/* Main Info */}
        < div className="space-y-1" >
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-black tracking-tighter leading-none">{profile.fullName}</h3>
            <ShieldCheck className="size-5 text-blue-400" />
          </div>
          <p className="text-primary text-sm font-bold tracking-widest uppercase">@{profile.handle}</p>
        </div >

        {/* Status Section */}
        < div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-xl" >
          <p className="text-[10px] font-black uppercase text-primary mb-2 tracking-widest opacity-80">Current Perspective</p>
          <p className="text-sm leading-relaxed opacity-95 italic font-medium line-clamp-2">"{profile.status}"</p>
        </div >

        {/* Bio Detail */}
        < div className="space-y-1.5" >
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Identity Brief</p>
          <p className="text-xs leading-relaxed opacity-80 line-clamp-3">{profile.bio}</p>
        </div >

        {/* Metadata Footer */}
        < div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between" >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 opacity-80">
              <MapPin className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider">{profile.location}</span>
            </div>
            <div className="flex gap-2.5 justify-center items-center text-[12px]">
              <div className="size-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center border border-white/10 shadow-lg">
                <Globe className="size-3.5" />
              </div>
              {profile.link}

            </div>
          </div>
        </div >
      </div >
    </div >
  )
}

export default IDCard
