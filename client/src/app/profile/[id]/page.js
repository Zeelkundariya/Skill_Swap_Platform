"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { User, MapPin, ArrowLeft, Star, ShieldCheck, Zap, Settings } from 'lucide-react';
import Link from 'next/link';
import ProfileEditModal from '@/components/profile/ProfileEditModal';

export default function ProfileView() {
  const params = useParams();
  const id = params?.id;
  
  const router = useRouter();
  const { user: currentUser, checkAuth } = useAuthStore();
  
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      const token = localStorage.getItem('token');
      
      // First check if it's the current user
      const meRes = await fetch(`http://localhost:5000/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (meRes.ok) {
        const me = await meRes.json();
        if (me._id === userId) {
          setTargetUser(me);
          setLoading(false);
          return;
        }
      }

      // If not current user, search other public users
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
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

  if (loading) {
    return <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-4rem)]"><div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div></div>;
  }

  if (error || !targetUser) {
    return (
      <div className="flex-grow max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
        <p className="text-secondary mb-8">{error || 'User not found'}</p>
        <Link href="/matches">
          <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:bg-[#152843]">
            Go Back
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/matches" className="inline-flex items-center text-secondary hover:text-primary font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Matches
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-black/10 shadow-lg overflow-hidden"
      >
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="px-8 pb-10 relative">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-end relative -mt-16 z-10 mb-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl shrink-0 flex items-center justify-center overflow-hidden">
              {targetUser.profilePicture ? (
                <img src={targetUser.profilePicture} alt={targetUser.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center text-white text-4xl font-bold">
                  {targetUser.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-grow flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-2">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{targetUser.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium mt-3">
                  <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"><MapPin className="w-4 h-4 mr-1 text-primary" /> {targetUser.location || 'Remote'}</span>
                  <span className="flex items-center bg-yellow-50 px-3 py-1 rounded-full text-yellow-700 text-sm"><Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" /> {targetUser.reviews?.length > 0 ? (targetUser.reviews.reduce((a, b) => a + b.rating, 0) / targetUser.reviews.length).toFixed(1) : 'New'} ({targetUser.reviews?.length || 0} Reviews)</span>
                  <span className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-blue-700 text-sm font-bold"><Zap className="w-4 h-4 mr-1 text-blue-500" /> Lvl {targetUser.level || 1} • {targetUser.xp || 0} XP</span>
                </div>
              </div>
              
              <div className="flex shrink-0">
                {currentUser && currentUser._id === targetUser._id ? (
                  <button onClick={() => setIsEditModalOpen(true)} className="px-8 py-3 bg-gray-100 text-gray-900 hover:bg-gray-200 font-black rounded-xl transition-colors shadow-sm flex items-center group">
                    <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Edit Profile
                  </button>
                ) : (
                  <Link href={`/swap/${targetUser._id}`}>
                    <button className="px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-[#152843] transition-colors shadow-md flex items-center group">
                      <Zap className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Request Swap
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Badges Section */}
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm rounded-full shadow-sm">
              <ShieldCheck className="w-4 h-4 mr-2" /> Verified Member
            </span>
            {targetUser.badges?.map(badge => (
              <span key={badge} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm rounded-full shadow-sm">
                <Star className="w-4 h-4 mr-2" /> {badge}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-lg font-black text-blue-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center mr-3">🎓</span>
                Can Teach
              </h3>
              <div className="flex flex-wrap gap-2">
                {targetUser.skillsOffered.length > 0 ? targetUser.skillsOffered.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-white text-blue-700 font-bold text-sm rounded-xl border border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
                    {skill}
                  </span>
                )) : <span className="text-gray-500 italic">No skills listed yet.</span>}
              </div>
            </div>
            
            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
              <h3 className="text-lg font-black text-purple-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-200 text-purple-700 rounded-lg flex items-center justify-center mr-3">🚀</span>
                Wants to Learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {targetUser.skillsWanted.length > 0 ? targetUser.skillsWanted.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-white text-purple-700 font-bold text-sm rounded-xl border border-purple-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
                    {skill}
                  </span>
                )) : <span className="text-gray-500 italic">No skills listed yet.</span>}
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-black/5">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">Community Trust</h3>
            <div className="flex gap-4">
              <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 font-bold text-sm rounded-full border border-green-200">
                <ShieldCheck className="w-4 h-4 mr-1" /> Verified Member
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 font-bold text-sm rounded-full border border-green-200">
                <ShieldCheck className="w-4 h-4 mr-1" /> Fast Responder
              </span>
            </div>
          </div>
          
          {/* Portfolio Section */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center mr-3">🎨</span>
              Portfolio Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <motion.div key={item} whileHover={{ y: -5 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer">
                  <div className="h-40 bg-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">Project Preview {item}</div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-gray-900 mb-1">Awesome Project {item}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">A demonstration of skills and practical application in real-world scenarios.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mr-3">⭐</span>
              Reviews & Testimonials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((item) => (
                <div key={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"Absolutely fantastic session! I learned so much about React and the explanation was super clear. Highly recommended!"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                      U{item}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">User {item}</h4>
                      <p className="text-xs text-gray-400">1 week ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full py-4 border-2 border-dashed border-gray-200 text-gray-500 font-bold rounded-2xl hover:border-primary hover:text-primary transition-colors flex items-center justify-center">
              Leave a Review
            </button>
          </div>
          
        </div>
      </motion.div>

      <ProfileEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={targetUser} 
        onSave={(updated) => setTargetUser(updated)} 
      />
    </div>
  );
}
