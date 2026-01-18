import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from './ui/Card';
import { 
  Eye, 
  Zap, 
  Shield, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Scan,
  Brain,
  Layers,
  Glasses
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center min-h-[100vh] overflow-hidden bg-black">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black/50 to-orange-500/10" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px] animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-12">
          {/* Badge */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 pt-5">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 text-sm font-bold tracking-widest backdrop-blur-xl">
              <Sparkles className="size-4 mr-2" />
              NEXT-GEN AR IDENTITY PLATFORM
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
              Person<span className="text-primary drop-shadow-2xl">AR</span>
            </h1>
            <h2 className="text-2xl lg:text-4xl font-bold text-white tracking-tight max-w-4xl mx-auto leading-tight drop-shadow-lg">
              <span className="text-primary font-black drop-shadow-lg">Express.</span> Create. Connect. <span className="text-primary font-black drop-shadow-lg">Refine.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl px-8 py-6 max-w-3xl mx-auto border border-white/10">
              <p className="text-xl text-white leading-relaxed">
                <span className="font-bold text-primary">Create</span> your authentic <span className="font-bold text-primary"></span> true self, and <span className="font-bold text-primary">tell</span> the world about you. 
                Your identity, expressed by AR.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/signup">
              <Button className="h-16 px-12 rounded-3xl text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 uppercase tracking-tighter">
                <Sparkles className="size-6" />
                <span>Create AR Identity</span>
                <ArrowRight className="size-6" />
              </Button>
            </Link>
          </div>

          {/* Demo Video Placeholder */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 pb-6">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-white/20 shadow-2xl bg-black backdrop-blur-xl">
                <div className="aspect-video bg-gradient-to-br from-black/90 via-primary/10 to-black/90 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="size-20 mx-auto rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center backdrop-blur-xl">
                      <Eye className="size-10 text-primary drop-shadow-lg" />
                    </div>
                    <p className="text-white text-lg font-medium drop-shadow-lg">AR Identity Recognition Demo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-black border-t border-white/20 ">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <Badge className="bg-primary/20 text-primary border-primary/40 px-6 py-2 text-sm font-bold tracking-widest backdrop-blur-xl">
              CORE FEATURES
            </Badge>
            <h2 className="text-5xl font-black tracking-tighter text-white drop-shadow-lg">
What is your Persona?
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-md">
              <span className="font-bold text-primary">Create</span> dynamic personas that <span className="font-bold text-primary">show</span> who you are, <span className="font-bold text-primary">protected</span> with cutting-edge AR technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Scan className="size-8" />,
                title: "Express Instantly",
                description: "Advanced recognition that lets you express your persona across any AR environment in real-time.",
                gradient: "from-blue-500/20 to-blue-600/20"
              },
              {
                icon: <Glasses className="size-8" />,
                title: "Refine your Identity",
                description: "Express who you are beyond first impressions — your interests, passions, and personality.",
                gradient: "from-green-500/20 to-green-600/20"
              },
              {
                icon: <Globe className="size-8" />,
                title: "Create Connections",
                description: "Universal compatibility lets you create meaningful connections across all AR platforms.",
                gradient: "from-purple-500/20 to-purple-600/20"
              },
              {
                icon: <Brain className="size-8" />,
                title: "Evolve with AI",
                description: "Gemini-powered persona evolution learns from community patterns to help your identity grow authentically.",
                gradient: "from-orange-500/20 to-orange-600/20"
              }
            ].map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-white/20 bg-black/80 backdrop-blur-xl hover:bg-black/60 hover:border-primary/30 transition-all duration-500 hover:scale-105">
                <CardContent className="p-8 space-y-6">
                  <div className={`size-16 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-white tracking-tight drop-shadow-md">{feature.title}</h3>
                    <p className="text-white/90 leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-black via-primary/5 to-black border-t border-white/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { number: "Multi", label: "Face Detection", icon: <Users className="size-6" /> },
              { number: "Real-time", label: "AR Overlay", icon: <Zap className="size-6" /> },
              { number: "Live", label: "Video Processing", icon: <Layers className="size-6" /> }
            ].map((stat, index) => (
              <div key={index} className="space-y-4">
                <div className="size-16 mx-auto rounded-full bg-primary/30 border-2 border-primary/50 flex items-center justify-center text-primary shadow-lg">
                  {stat.icon}
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">{stat.number}</div>
                  <div className="text-white font-medium tracking-wide">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black border-t border-white/20">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-white drop-shadow-lg">
              Ready to <span className="text-primary drop-shadow-lg">Create</span> Your Identity?
            </h2>
            <p className="text-xl text-white leading-relaxed drop-shadow-md">
              <span className="font-bold text-primary">Express</span> who you are. <span className="font-bold text-primary">Evolve</span> how you connect. Your story awaits.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/signup">
              <Button className="h-16 px-12 rounded-3xl text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 uppercase tracking-tighter">
                <Sparkles className="size-6" />
                <span>Create AR Identity</span>
                <ArrowRight className="size-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;