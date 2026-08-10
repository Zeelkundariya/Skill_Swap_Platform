"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Check, Star, MapPin, Clock, Search } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  // Step 1: Account Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Multi-step state
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 2: Skills Offered
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillOfferedInput, setSkillOfferedInput] = useState('');
  const suggestedSkillsOffered = ['React', 'Figma', 'English', 'Guitar', 'Marketing', 'Python', 'SEO', 'Cooking'];

  // Step 3: Skills Wanted
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [skillWantedInput, setSkillWantedInput] = useState('');
  const suggestedSkillsWanted = ['Spanish', 'UI Design', 'Machine Learning', 'Piano', 'Copywriting', 'Public Speaking'];

  // Step 4: Location & Availability
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const suggestedAvailability = ['Weekends', 'Evenings', 'Weekdays', 'Flexible', 'Remote only'];
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleNextStep = () => {
    setError('');
    
    // Validations
    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        return setError('Please fill in all account details.');
      }
      if (!email.endsWith('@gmail.com')) {
        return setError('Only @gmail.com accounts are supported.');
      }
      if (password !== confirmPassword) {
        return setError('Passwords do not match.');
      }
    } else if (step === 2) {
      if (skillsOffered.length === 0) {
        return setError('Please add at least one skill you can offer.');
      }
    } else if (step === 3) {
      if (skillsWanted.length === 0) {
        return setError('Please add at least one skill you want to learn.');
      }
    }

    setStep(s => Math.min(s + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setError('');
    setStep(s => Math.max(s - 1, 1));
  };

  const addSkill = (type, skill) => {
    if (!skill.trim()) return;
    if (type === 'offered') {
      if (!skillsOffered.includes(skill.trim())) {
        setSkillsOffered([...skillsOffered, skill.trim()]);
      }
      setSkillOfferedInput('');
    } else {
      if (!skillsWanted.includes(skill.trim())) {
        setSkillsWanted([...skillsWanted, skill.trim()]);
      }
      setSkillWantedInput('');
    }
  };

  const removeSkill = (type, skillToRemove) => {
    if (type === 'offered') {
      setSkillsOffered(skillsOffered.filter(s => s !== skillToRemove));
    } else {
      setSkillsWanted(skillsWanted.filter(s => s !== skillToRemove));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== totalSteps) return;

    if (!location.trim() || !availability.trim()) {
      return setError('Please provide your location and availability.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          skillsOffered,
          skillsWanted,
          location,
          availability
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        login(data.data);
        router.push('/dashboard');
      } else {
        setError(data.message || (data.errors && data.errors[0]?.msg) || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex min-h-[calc(100vh-80px)]">
      {/* Left Side: Illustration / Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000"></div>
          
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse animation-delay-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Join the world's best <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">skill exchange</span> platform.
            </h1>
            <p className="text-lg text-white/80 mb-10 font-medium">
              Create an account, build your profile, and start learning from experts worldwide while teaching what you love.
            </p>

            <div className="space-y-6">
              {[
                "Connect with thousands of learners",
                "Advanced AI-powered matchmaking",
                "100% free peer-to-peer learning"
              ].map((text, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                  className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm"
                >
                  <div className="bg-white/10 p-2 rounded-full">
                    <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="font-semibold">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 xl:p-24 bg-white relative">
        <div className="w-full max-w-md">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500 ease-in-out"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>
              
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                    step >= num ? 'bg-primary text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}>
                    {step > num ? <Check className="w-4 h-4" /> : num}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span className={`text-xs font-semibold ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Account</span>
              <span className={`text-xs font-semibold ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Teach</span>
              <span className={`text-xs font-semibold ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>Learn</span>
              <span className={`text-xs font-semibold ${step >= 4 ? 'text-primary' : 'text-gray-400'}`}>Details</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">
              {step === 1 && "Create Account"}
              {step === 2 && "What can you teach?"}
              {step === 3 && "What do you want to learn?"}
              {step === 4 && "Final Details"}
            </h2>
            <p className="text-secondary font-medium">
              {step === 1 && "Start your skill-swapping journey today."}
              {step === 2 && "Add skills you are proficient in and can help others learn."}
              {step === 3 && "Add skills you are actively looking to acquire."}
              {step === 4 && "Help us match you with the right people."}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative min-h-[320px]">
            <AnimatePresence mode="wait">
              {/* STEP 1: ACCOUNT DETAILS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary block">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-primary transition-colors">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary transition-all placeholder:text-black/30 font-medium shadow-sm"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary block">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-primary transition-colors">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary transition-all placeholder:text-black/30 font-medium shadow-sm"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <p className="text-[11px] text-secondary/70 font-medium ml-1">* Only @gmail.com accounts are supported</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary block">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-primary transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type="password"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary transition-all placeholder:text-black/30 font-medium shadow-sm"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary block">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-primary transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type="password"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary transition-all placeholder:text-black/30 font-medium shadow-sm"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SKILLS OFFERED */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-primary block">Add skills</label>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <Search className="absolute inset-y-0 left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary font-medium"
                          placeholder="e.g. React, Spanish, Guitar..."
                          value={skillOfferedInput}
                          onChange={(e) => setSkillOfferedInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill('offered', skillOfferedInput);
                            }
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => addSkill('offered', skillOfferedInput)}
                        className="px-6 bg-primary text-white rounded-xl font-bold hover:bg-[#152843] transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-xl border border-gray-100">
                      {skillsOffered.length === 0 ? (
                        <span className="text-sm text-gray-400 py-1 px-2">No skills added yet.</span>
                      ) : (
                        skillsOffered.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-bold flex items-center">
                            {skill}
                            <button type="button" onClick={() => removeSkill('offered', skill)} className="ml-2 text-primary hover:text-red-500">&times;</button>
                          </span>
                        ))
                      )}
                    </div>
                    
                    {/* Suggestions */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Suggested</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedSkillsOffered.filter(s => !skillsOffered.includes(s)).map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkill('offered', skill)}
                            className="px-3 py-1 bg-white border border-gray-200 hover:border-primary/50 text-gray-600 hover:text-primary rounded-full text-xs font-medium transition-all"
                          >
                            + {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SKILLS WANTED */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-primary block">Add skills you want to learn</label>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <Search className="absolute inset-y-0 left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary font-medium"
                          placeholder="e.g. Machine Learning, Piano..."
                          value={skillWantedInput}
                          onChange={(e) => setSkillWantedInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill('wanted', skillWantedInput);
                            }
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => addSkill('wanted', skillWantedInput)}
                        className="px-6 bg-primary text-white rounded-xl font-bold hover:bg-[#152843] transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-xl border border-gray-100">
                      {skillsWanted.length === 0 ? (
                        <span className="text-sm text-gray-400 py-1 px-2">No skills added yet.</span>
                      ) : (
                        skillsWanted.map(skill => (
                          <span key={skill} className="px-3 py-1.5 bg-[#f6ad55]/20 text-[#dd6b20] rounded-lg text-sm font-bold flex items-center">
                            {skill}
                            <button type="button" onClick={() => removeSkill('wanted', skill)} className="ml-2 hover:text-red-500">&times;</button>
                          </span>
                        ))
                      )}
                    </div>
                    
                    {/* Suggestions */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Suggested</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedSkillsWanted.filter(s => !skillsWanted.includes(s)).map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkill('wanted', skill)}
                            className="px-3 py-1 bg-white border border-gray-200 hover:border-[#dd6b20]/50 text-gray-600 hover:text-[#dd6b20] rounded-full text-xs font-medium transition-all"
                          >
                            + {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: LOCATION & AVAILABILITY */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary block">Your Location</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-primary transition-colors">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary transition-all placeholder:text-black/30 font-medium shadow-sm"
                        placeholder="e.g. New York, USA or Remote"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary block">General Availability</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary group-focus-within:text-primary transition-colors">
                        <Clock className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary transition-all placeholder:text-black/30 font-medium shadow-sm"
                        placeholder="e.g. Weekends, Evenings"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {suggestedAvailability.map(avail => (
                        <button
                          key={avail}
                          type="button"
                          onClick={() => setAvailability(prev => prev ? prev + ', ' + avail : avail)}
                          className="px-3 py-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-xs font-medium transition-all"
                        >
                          {avail}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6 mt-auto">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/3 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              )}
              
              {step < totalSteps ? (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={handleNextStep}
                  className="flex-grow py-4 bg-primary hover:bg-[#152843] text-white rounded-xl font-bold text-lg shadow-md hover:shadow-xl transition-all flex justify-center items-center group"
                >
                  Next Step
                  <ArrowRight className="ml-2 w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  type="submit"
                  className="flex-grow py-4 bg-primary hover:bg-[#152843] text-white rounded-xl font-bold text-lg shadow-md hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center group"
                >
                  {loading ? 'Creating Account...' : 'Complete & Join'}
                </motion.button>
              )}
            </div>
          </form>

          {step === 1 && (
            <p className="text-center mt-10 text-secondary font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-[#152843] font-bold transition-colors underline decoration-primary/30 underline-offset-4">
                Log in instead
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
