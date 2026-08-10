"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { User, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function RequestSwap() {
  // Fix for Next.js 15+ where params is a Promise
  const params = useParams();
  const id = params?.id;
  
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [message, setMessage] = useState('');
  const [selectedOffered, setSelectedOffered] = useState([]);
  const [selectedWanted, setSelectedWanted] = useState([]);

  useEffect(() => {
    checkAuth();
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else if (id) {
      fetchTargetUser(id);
    }
  }, [id]);

  const fetchTargetUser = async (userId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTargetUser(data.data);
      } else {
        setError(data.message || 'User not found.');
      }
    } catch (err) {
      setError('Error fetching user.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (skill, list, setList) => {
    if (list.includes(skill)) {
      setList(list.filter(s => s !== skill));
    } else {
      setList([...list, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOffered.length === 0 || selectedWanted.length === 0) {
      setError('Please select at least one skill you offer and one skill you want.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/swaps/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiverId: targetUser._id,
          message,
          offeredSkills: selectedOffered,
          requestedSkills: selectedWanted
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/requests');
      } else {
        setError(data.message || 'Failed to send request');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-4rem)]"><div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div></div>;
  }

  if (!targetUser) {
    return <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-4rem)] text-xl">User not found</div>;
  }

  return (
    <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <Link href="/explore" className="inline-flex items-center text-secondary hover:text-primary mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 border border-black/10 shadow-sm relative z-10"
      >
        <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-black/5">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            {targetUser.profilePicture ? (
              <img src={targetUser.profilePicture} alt={targetUser.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="text-primary w-8 h-8" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Request Swap with {targetUser.name}</h1>
            <p className="text-secondary font-medium">Propose a skill exchange</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-3 text-primary">1. What skills do you want from them?</h3>
            <div className="flex flex-wrap gap-3">
              {targetUser.skillsOffered.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSelection(skill, selectedWanted, setSelectedWanted)}
                  className={`px-4 py-2.5 rounded-xl border transition-all font-medium text-sm ${selectedWanted.includes(skill) ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-black/10 text-secondary hover:border-primary/40 hover:bg-black/5'}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-primary">2. What skills can you offer them in return?</h3>
            <p className="text-sm text-secondary font-medium mb-3">These are the skills they are looking for, or you can offer your other skills.</p>
            <div className="flex flex-wrap gap-3">
              {user?.skillsOffered?.map(skill => {
                const isHighlyDesired = targetUser.skillsWanted.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSelection(skill, selectedOffered, setSelectedOffered)}
                    className={`px-4 py-2.5 rounded-xl border transition-all font-medium text-sm ${selectedOffered.includes(skill) ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-black/10 text-secondary hover:border-primary/40 hover:bg-black/5'}`}
                  >
                    {skill} {isHighlyDesired && '⭐'}
                  </button>
                )
              })}
            </div>
            {(!user?.skillsOffered || user.skillsOffered.length === 0) && (
              <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl flex flex-col items-start mt-4 shadow-sm">
                <p className="text-orange-700 font-bold text-sm mb-3">You haven't listed any skills on your profile yet!</p>
                <p className="text-orange-600/80 font-medium text-sm mb-4">You must add at least one skill to your profile before you can request a swap with {targetUser.name}.</p>
                <Link href="/dashboard" className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg">
                  Go to Dashboard to Add Skills
                </Link>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-primary">3. Send a message</h3>
            <textarea
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-primary font-medium transition-all h-32 placeholder:text-black/30 shadow-sm"
              placeholder="Hi! I'd love to learn React from you. In return, I can teach you Spanish..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <motion.button
            whileHover={(!user?.skillsOffered || user.skillsOffered.length === 0) ? {} : { scale: 1.01 }}
            whileTap={(!user?.skillsOffered || user.skillsOffered.length === 0) ? {} : { scale: 0.99 }}
            disabled={submitting || !user?.skillsOffered || user.skillsOffered.length === 0}
            type="submit"
            className="w-full py-4 bg-primary hover:bg-[#152843] text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:bg-primary disabled:cursor-not-allowed group"
          >
            <Send className="w-5 h-5 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" /> {submitting ? 'Sending Request...' : 'Send Swap Request'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
