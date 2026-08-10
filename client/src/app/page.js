"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star, Clock, Video, MessageCircle, CheckCircle2, Target, Sparkles } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="relative bg-background text-text-primary overflow-x-hidden selection:bg-accent selection:text-white editorial-grid font-sans min-h-screen">

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 w-full min-h-[90vh] flex items-center pt-24 pb-12">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Hero Left: Editorial Typography */}
          <motion.div 
            style={{ y, opacity }}
            className="z-20 w-full flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-bold text-primary leading-[0.95] tracking-tight mb-8">
                Master Skills.<br/>
                Share Knowledge.<br/>
                <span className="text-accent">Grow Together.</span>
              </h1>
              
              <p className="text-xl text-secondary max-w-lg mb-12 leading-relaxed font-light">
                A community built on the pure exchange of knowledge. Trade what you know for what you want to learn. No transactions, just human connection.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link href="/register" className="btn-primary w-full sm:w-auto">
                    Start Exchanging
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <div className="flex items-center gap-3 text-sm font-medium text-secondary">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-slate-200">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full rounded-full object-cover" />
                      </div>
                    ))}
                  </div>
                  Join 50,000+ Learners
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right: Live AI Match Demo */}
          <div className="relative w-full lg:h-[650px] hidden md:flex items-center justify-center">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/10 rounded-full blur-3xl pointer-events-none z-0"></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-[0_30px_60px_rgba(31,58,95,0.15)] flex flex-col relative z-10 w-full max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-8 border-b border-black/5 pb-4">
                <h3 className="text-lg font-black text-primary uppercase tracking-widest flex items-center">
                  <Star className="w-4 h-4 mr-2 text-accent" /> AI Engine
                </h3>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
              </div>

              <div className="space-y-5 flex-1">
                {/* Rani Box */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">R</div>
                  <div>
                    <h4 className="font-bold text-primary text-base">Rani</h4>
                    <p className="text-sm text-secondary font-medium">Wants to learn <span className="text-accent font-bold">UI Design</span></p>
                  </div>
                </motion.div>

                {/* Searching Pulse */}
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], height: ['0px', '40px', '40px', '0px'] }}
                  transition={{ delay: 2, duration: 3, times: [0, 0.1, 0.9, 1] }}
                  className="flex justify-center overflow-hidden"
                >
                  <div className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full flex items-center shadow-md animate-pulse">
                    <Star className="w-3 h-3 mr-2" /> Searching Global Mentors...
                  </div>
                </motion.div>

                {/* Sarah Box */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 4.5 }}
                  className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-l-green-500 flex items-center gap-4 relative"
                >
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase shadow-sm">Match Found</div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">S</div>
                  <div>
                    <h4 className="font-bold text-primary text-base">Sarah</h4>
                    <p className="text-sm text-secondary font-medium">Teaches UI Design • Wants React</p>
                  </div>
                </motion.div>

                {/* Result Block */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 5.5, type: "spring" }}
                  className="text-center pt-4"
                >
                  <div className="inline-block bg-green-50 text-green-700 font-black text-2xl px-6 py-3 rounded-2xl border border-green-200 shadow-sm">
                    95% Compatible
                  </div>
                  <div className="text-sm font-bold text-primary uppercase tracking-widest mt-4 flex items-center justify-center bg-black/5 py-2 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" /> Swap Created Automatically
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- LIVE COMMUNITY TICKER --- */}
      <div className="w-full bg-primary text-white py-3 overflow-hidden flex whitespace-nowrap border-y border-white/10 relative z-20 shadow-lg">
        <motion.div 
          className="flex gap-8 items-center font-medium text-sm"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-12 items-center px-4">
              <span className="flex items-center"><Star className="w-4 h-4 text-accent mr-2 fill-accent" /> Sarah completed a React Swap</span>
              <span className="flex items-center text-white/50">•</span>
              <span className="flex items-center"><Star className="w-4 h-4 text-accent mr-2" /> Alex became a Top Mentor</span>
              <span className="flex items-center text-white/50">•</span>
              <span className="flex items-center"><Star className="w-4 h-4 text-accent mr-2 fill-accent" /> James earned Expert Badge</span>
              <span className="flex items-center text-white/50">•</span>
              <span className="flex items-center"><Star className="w-4 h-4 text-accent mr-2" /> Maria joined today</span>
              <span className="flex items-center text-white/50">•</span>
              <span className="flex items-center"><Star className="w-4 h-4 text-accent mr-2 fill-accent" /> 2,450 active sessions right now</span>
              <span className="flex items-center text-white/50">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- HOW IT WORKS (AI Demo) --- */}
      <section className="py-32 bg-white border-y border-black/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 text-accent font-bold rounded-full text-sm uppercase tracking-widest mb-6">
              <Star className="w-4 h-4 mr-2" /> The Engine
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">How our AI connects you.</h2>
            <p className="text-xl text-secondary font-light">From search to successful swap in milliseconds. Our neural engine handles the heavy lifting so you can focus on learning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Phase 1: The Result / Dashboard (Moved from col 3) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F8F9FA] rounded-[2rem] p-8 border border-black/5 flex flex-col relative overflow-hidden"
            >
              <div className="mb-8">
                <span className="text-accent font-black text-4xl opacity-20 absolute top-6 right-8">01</span>
                <h3 className="text-xl font-bold text-primary mb-2">Actionable Dashboards</h3>
                <p className="text-secondary text-sm">Everything you need to execute on your goals immediately.</p>
              </div>

              <div className="space-y-3 flex-1 flex flex-col">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Today's Goal</span>
                  <div className="font-bold text-primary text-sm flex items-center">
                    <Target className="w-4 h-4 mr-2 text-accent" /> Complete your React lesson
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5 text-center">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Pending Swap</span>
                    <div className="font-black text-primary text-2xl">2</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5 text-center">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Streak</span>
                    <div className="font-black text-accent text-2xl">12 <span className="text-sm">Days</span></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Upcoming Session</span>
                    <div className="font-bold text-primary text-sm flex items-center">
                      <Video className="w-4 h-4 mr-2 text-blue-500" /> Today 6 PM
                    </div>
                  </div>
                  <button className="bg-black/5 hover:bg-black/10 transition-colors p-2 rounded-lg text-primary">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Phase 2: AI Analysis */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-primary rounded-[2rem] p-8 border border-primary-light flex flex-col relative overflow-hidden text-white"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="mb-8 relative z-10">
                <span className="text-white/20 font-black text-4xl absolute -top-2 right-0">02</span>
                <h3 className="text-xl font-bold text-white mb-2">Deep Analysis</h3>
                <p className="text-white/70 text-sm">6-dimensional compatibility scoring.</p>
              </div>

              <div className="space-y-4 relative z-10 flex-1">
                {[
                  { label: 'Skills Match', val: 95 },
                  { label: 'Availability', val: 88 },
                  { label: 'Experience', val: 90 },
                  { label: 'Trust Score', val: 96 },
                  { label: 'Learning Goals', val: 92 },
                  { label: 'Communication Style', val: 80 }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/80">{stat.label}</span>
                    <div className="flex items-center gap-3 w-1/2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stat.val}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                          className="h-full bg-accent rounded-full"
                        ></motion.div>
                      </div>
                      <span className="text-sm font-bold text-white min-w-[3ch]">{stat.val}%</span>
                    </div>
                  </div>
                ))}

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center text-xs font-bold text-accent uppercase tracking-widest mb-2">
                    <Sparkles className="w-3 h-3 mr-1" /> AI Recommendation
                  </div>
                  <p className="text-sm text-white/80 font-medium italic leading-relaxed">
                    "This mentor is perfect because your complementary skill gaps and scheduling patterns align perfectly for a rapid 4-week exchange."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Phase 3: Reputation & Growth */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-[#F8F9FA] rounded-[2rem] p-8 border border-black/5 flex flex-col relative overflow-hidden"
            >
              <div className="mb-8">
                <span className="text-accent font-black text-4xl opacity-20 absolute top-6 right-8">03</span>
                <h3 className="text-xl font-bold text-primary mb-2">Build Reputation</h3>
                <p className="text-secondary text-sm">Level up your profile through active knowledge exchange.</p>
              </div>

              <div className="space-y-4 flex-1 flex flex-col">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-black/5 text-center">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Current XP</span>
                  <div className="font-black text-primary text-4xl mb-1">4,250</div>
                  <div className="text-xs font-bold text-accent uppercase tracking-widest">Level 12 Scholar</div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Trust Score</span>
                    <span className="text-xs font-bold text-primary">98/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mb-1">
                    <div className="w-[98%] h-full bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Latest Achievement</span>
                    <span className="text-xs font-bold text-primary bg-yellow-100 px-3 py-1.5 rounded-lg flex items-center shadow-sm border border-yellow-200">
                      🏆 Top Mentor
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- EXPLORE SKILLS (3D Orbital Ecosystem) --- */}
      <section className="py-32 bg-[#F7F6F3] overflow-hidden border-b border-black/5 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#1F3A5F 1px, transparent 1px), linear-gradient(90deg, #1F3A5F 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-12 text-center relative z-20">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">Knowledge Orbit</h2>
            <p className="text-xl text-secondary font-light">A multi-dimensional network of global skills.</p>
          </div>
          
          <div 
            className="relative w-[350px] h-[350px] md:w-[700px] md:h-[700px] mx-auto flex items-center justify-center -my-20 md:-my-32"
            style={{ perspective: '1200px' }}
          >
            {/* The 3D Floor */}
            <div 
              className="absolute inset-0"
              style={{ transform: 'rotateX(65deg)', transformStyle: 'preserve-3d' }}
            >
              {/* Concentric 3D Orbit Rings */}
              <div className="absolute inset-0 rounded-full border-[1.5px] border-primary/10 border-dashed"></div>
              <div className="absolute inset-16 md:inset-32 rounded-full border border-primary/5"></div>
              <div className="absolute inset-24 md:inset-48 rounded-full border border-primary/15 border-dashed"></div>
              
              {/* Center Node (Stands up) */}
              <div 
                className="absolute top-1/2 left-1/2 z-40"
                style={{ transform: 'translate(-50%, -50%) rotateX(-65deg)', transformStyle: 'preserve-3d' }}
              >
                <motion.div 
                  className="w-24 h-24 md:w-36 md:h-36 bg-primary rounded-full flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(31,58,95,0.4)] border-4 border-white cursor-pointer relative"
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <div className="absolute -inset-4 rounded-full bg-primary/20 animate-ping"></div>
                  <span className="text-white/70 text-[10px] uppercase tracking-widest mb-1">Your</span>
                  <span className="text-white font-bold tracking-widest uppercase text-lg">Brain</span>
                </motion.div>
              </div>
              
              {/* Orbiting Nodes Wrapper */}
              <motion.div 
                className="absolute inset-0 z-30"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateZ: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                {[
                  { skill: 'React.js', color: '#1F3A5F', angle: 0, radius: '48%' },
                  { skill: 'Music Theory', color: '#C97C2B', angle: 45, radius: '28%' },
                  { skill: 'UI/UX Design', color: '#2E8B57', angle: 90, radius: '48%' },
                  { skill: 'Culinary Arts', color: '#7A8B99', angle: 135, radius: '28%' },
                  { skill: 'Python AI', color: '#1F3A5F', angle: 180, radius: '48%' },
                  { skill: 'Spanish', color: '#C97C2B', angle: 225, radius: '28%' },
                  { skill: 'Fitness', color: '#2E8B57', angle: 270, radius: '48%' },
                  { skill: 'Digital Marketing', color: '#7A8B99', angle: 315, radius: '28%' },
                ].map((item, i) => {
                  return (
                    <div
                      key={item.skill}
                      className="absolute inset-0 origin-center"
                      style={{ 
                        transform: `rotateZ(${item.angle}deg)`, 
                        transformStyle: 'preserve-3d' 
                      }}
                    >
                      {/* Connecting Line on the floor */}
                      <div 
                        className="absolute left-1/2 bottom-1/2 w-[1px] origin-bottom"
                        style={{ 
                          height: item.radius,
                          background: `linear-gradient(to top, transparent, ${item.color}40)` 
                        }}
                      ></div>

                      {/* Node Placement */}
                      <div 
                        className="absolute left-1/2"
                        style={{ 
                          top: `calc(50% - ${item.radius})`,
                          transform: `translate(-50%, -50%)`,
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {/* Dynamic Counter-Rotation for spin */}
                        <motion.div
                          style={{ transformStyle: 'preserve-3d' }}
                          animate={{ rotateZ: [-item.angle, -360 - item.angle] }}
                          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        >
                          {/* Tilt up to face camera */}
                          <div style={{ transform: 'rotateX(-65deg)', transformStyle: 'preserve-3d' }}>
                            <motion.div
                              className="bg-white shadow-[0_15px_30px_rgb(0,0,0,0.12)] border border-black/5 rounded-full px-5 py-3 flex items-center gap-3 cursor-pointer whitespace-nowrap"
                              whileHover={{ scale: 1.1, y: -5, boxShadow: `0 20px 40px ${item.color}30` }}
                            >
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="font-bold text-[11px] uppercase tracking-widest text-primary">{item.skill}</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </section>



      {/* --- STATISTICS (Oversized Typography) --- */}
      <section className="py-32 bg-primary text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 border-t border-white/20 pt-16">
            {[
              { label: 'People Connected', val: '50K+' },
              { label: 'Countries', val: '120+' },
              { label: 'Successful Matches', val: '98%' },
              { label: 'Sessions Completed', val: '100K+' }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col"
              >
                <span className="text-6xl md:text-7xl font-bold font-display text-accent mb-4 tracking-tighter">{stat.val}</span>
                <span className="text-lg font-medium text-white/70 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Chat Bubbles) --- */}
      <section className="py-32 bg-background overflow-hidden relative">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">Real Connections</h2>
          <p className="text-xl text-secondary font-light">See what happens when knowledge flows freely.</p>
        </div>

        <div className="max-w-[800px] mx-auto px-6 relative flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4 self-start max-w-[85%]"
          >
            <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full mt-auto" />
            <div className="bg-white p-5 rounded-2xl rounded-bl-none shadow-sm border border-black/5">
              <p className="text-primary font-medium leading-relaxed">"I traded my Spanish lessons for React tutoring. I just landed my first Junior Developer role today! 😭🚀"</p>
              <span className="text-xs text-secondary mt-2 block">Maria G. • 2 hours ago</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4 self-end max-w-[85%] flex-row-reverse"
          >
            <img src="https://i.pravatar.cc/100?img=68" className="w-10 h-10 rounded-full mt-auto" />
            <div className="bg-primary text-white p-5 rounded-2xl rounded-br-none shadow-md">
              <p className="font-medium leading-relaxed">"That's incredible Maria! The UX feedback you gave me on my portfolio was game-changing too. SkillSwap is the best."</p>
              <span className="text-xs text-white/70 mt-2 block">James T. • 1 hour ago</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER (Editorial) --- */}
      <footer className="bg-white border-t border-black/10 pt-32 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
            <div>
              <h2 className="text-5xl font-bold text-primary tracking-tight mb-8">Ready to grow?</h2>
              <Link href="/register">
                <button className="btn-primary text-lg px-10 py-5">
                  Join SkillSwap Free
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-primary mb-4 uppercase tracking-widest text-sm">Platform</h4>
                <Link href="/explore" className="text-secondary hover:text-accent transition-colors">Explore Experts</Link>
                <Link href="/how-it-works" className="text-secondary hover:text-accent transition-colors">How it Works</Link>
                <Link href="/pricing" className="text-secondary hover:text-accent transition-colors">Pricing (Free)</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-primary mb-4 uppercase tracking-widest text-sm">Company</h4>
                <Link href="/about" className="text-secondary hover:text-accent transition-colors">About Us</Link>
                <Link href="/guidelines" className="text-secondary hover:text-accent transition-colors">Community Guidelines</Link>
                <Link href="/contact" className="text-secondary hover:text-accent transition-colors">Contact</Link>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-black/10 pt-8 text-sm text-secondary font-medium">
            <p>© 2026 SkillSwap Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
