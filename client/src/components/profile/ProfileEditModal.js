import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Upload } from 'lucide-react';

export default function ProfileEditModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skillsOffered: '',
    skillsWanted: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        skillsOffered: user.skillsOffered?.join(', ') || '',
        skillsWanted: user.skillsWanted?.join(', ') || ''
      });
      setSelectedFile(null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Upload Profile Picture if selected
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('profilePhoto', selectedFile);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/users/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: fileData
        });

        const uploadResponse = await uploadRes.json();
        if (!uploadRes.ok || !uploadResponse.success) {
          throw new Error(uploadResponse.message || 'Failed to upload profile picture');
        }
      }

      // 2. Update the rest of the profile
      const processSkills = (str) => {
        return str.split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      };

      const payload = {
        name: formData.name,
        location: formData.location,
        skillsOffered: processSkills(formData.skillsOffered),
        skillsWanted: processSkills(formData.skillsWanted)
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const response = await res.json();

      if (!res.ok || !response.success) {
        throw new Error(response.message || 'Failed to update profile');
      }

      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Profile Picture Upload Section */}
              <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {selectedFile ? (
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Current" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">{formData.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <label className="cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:border-primary hover:text-primary transition-all shadow-sm flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900"
                  placeholder="e.g. New York, Remote"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Skills You Can Teach <span className="text-gray-400 font-normal">(Comma separated)</span></label>
                <input 
                  type="text" 
                  name="skillsOffered"
                  value={formData.skillsOffered}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900"
                  placeholder="e.g. React, Node.js, Python"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Skills You Want to Learn <span className="text-gray-400 font-normal">(Comma separated)</span></label>
                <input 
                  type="text" 
                  name="skillsWanted"
                  value={formData.skillsWanted}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-900"
                  placeholder="e.g. Machine Learning, UI Design"
                />
              </div>
            </form>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="edit-profile-form"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-[#152843] transition-colors shadow-sm flex items-center disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Changes</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
