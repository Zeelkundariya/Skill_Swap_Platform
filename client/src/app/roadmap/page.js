"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckCircle2, Lock, Sparkles, Map, BookOpen, Clock, BarChart, ArrowRight, Zap, Play, User, Star, Video, FileText, Award } from 'lucide-react';
import Link from 'next/link';

// Predefined roadmap structures
const roadmapsData = {
  "react": [
    { id: 'html', title: 'HTML Fundamentals', duration: '1 Week', difficulty: 'Beginner', resources: ['MDN Web Docs', 'freeCodeCamp'] },
    { id: 'css', title: 'CSS Styling', duration: '2 Weeks', difficulty: 'Beginner', resources: ['CSS Tricks', 'Kevin Powell YouTube'] },
    { id: 'js', title: 'JavaScript Basics', duration: '3 Weeks', difficulty: 'Intermediate', resources: ['JavaScript Info', 'Eloquent JavaScript'] },
    { id: 'react_basics', title: 'React Core Concepts', duration: '2 Weeks', difficulty: 'Intermediate', resources: ['React Dev Docs', 'Fireship'] },
    { id: 'hooks', title: 'React Hooks', duration: '1 Week', difficulty: 'Intermediate', resources: ['Dan Abramov Blog', 'Web Dev Simplified'] },
    { id: 'redux', title: 'State Management (Redux)', duration: '2 Weeks', difficulty: 'Advanced', resources: ['Redux Toolkit Docs', 'Stephen Grider Course'] },
    { id: 'nextjs', title: 'Next.js Framework', duration: '3 Weeks', difficulty: 'Advanced', resources: ['Next.js Learn', 'Vercel Guides'] },
    { id: 'deploy', title: 'Deployment & CI/CD', duration: '1 Week', difficulty: 'Advanced', resources: ['Vercel Docs', 'GitHub Actions'] }
  ],
  "python": [
    { id: 'py_basics', title: 'Python Syntax', duration: '1 Week', difficulty: 'Beginner', resources: ['Automate the Boring Stuff'] },
    { id: 'data_structures', title: 'Data Structures', duration: '2 Weeks', difficulty: 'Beginner', resources: ['Corey Schafer YouTube'] },
    { id: 'oop', title: 'Object Oriented Prog', duration: '2 Weeks', difficulty: 'Intermediate', resources: ['Real Python'] },
    { id: 'flask', title: 'Web APIs (Flask)', duration: '2 Weeks', difficulty: 'Intermediate', resources: ['Flask Mega-Tutorial'] },
    { id: 'pandas', title: 'Data Analysis (Pandas)', duration: '3 Weeks', difficulty: 'Advanced', resources: ['Kaggle Mini-Courses'] }
  ],
  "design": [
    { id: 'color', title: 'Color Theory', duration: '1 Week', difficulty: 'Beginner', resources: ['Refactoring UI'] },
    { id: 'typog', title: 'Typography', duration: '1 Week', difficulty: 'Beginner', resources: ['Google Fonts Guide'] },
    { id: 'figma', title: 'Figma Basics', duration: '2 Weeks', difficulty: 'Intermediate', resources: ['Figma Community Tutorials'] },
    { id: 'ux', title: 'UX Principles', duration: '3 Weeks', difficulty: 'Advanced', resources: ['Nielsen Norman Group'] },
    { id: 'proto', title: 'Prototyping', duration: '2 Weeks', difficulty: 'Advanced', resources: ['DesignCourse YouTube'] }
  ],
  "cooking": [
    { id: 'cook_intro', title: 'Introduction', duration: 'Week 1', difficulty: 'Beginner', subtopics: ['Kitchen Safety', 'Basic Tools', 'Ingredients'], practice: 'Cook Tea', resources: [], quiz: { question: 'What is the most important rule in the kitchen?', options: ['Safety first', 'Cook fast', 'Use a lot of salt'], answer: 'Safety first' } },
    { id: 'cook_knife', title: 'Knife Skills', duration: 'Week 2', difficulty: 'Beginner', practice: 'Cut Vegetables', resources: [] },
    { id: 'cook_indian', title: 'Indian Cooking', duration: 'Week 3', difficulty: 'Intermediate', practice: 'Dal & Rice', resources: [] },
    { id: 'cook_desserts', title: 'Desserts', duration: 'Week 4', difficulty: 'Advanced', practice: 'Cake', resources: [] }
  ]
};

// Generic fallback generator
const generateGenericRoadmap = (skill) => {
  return [
    { id: 'gen_1', title: `Introduction to ${skill}`, duration: '1 Week', difficulty: 'Beginner', resources: ['YouTube Basics', 'Official Docs'] },
    { id: 'gen_2', title: `Core Concepts of ${skill}`, duration: '2 Weeks', difficulty: 'Beginner', resources: ['Community Forums', 'Beginner Courses'] },
    { id: 'gen_3', title: `Intermediate ${skill} Tools`, duration: '2 Weeks', difficulty: 'Intermediate', resources: ['Advanced Tutorials', 'Project Builds'] },
    { id: 'gen_4', title: `Mastering ${skill} Ecosystem`, duration: '3 Weeks', difficulty: 'Advanced', resources: ['Expert Blogs', 'Case Studies'] },
    { id: 'gen_5', title: `${skill} Best Practices`, duration: '1 Week', difficulty: 'Advanced', resources: ['Industry Standards Guides'] },
  ];
};

export default function Roadmaps() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  
  const [skillInput, setSkillInput] = useState('');
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [roadmapTitle, setRoadmapTitle] = useState('');
  const [completedNodes, setCompletedNodes] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeQuizNode, setActiveQuizNode] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizError, setQuizError] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    checkAuth();
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/search`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const response = await res.json();
        setUsers(response.data || response);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadRoadmap = (skill) => {
    setGenerating(true);
    setSkillInput('');
    
    // Simulate AI generation time
    setTimeout(() => {
      const normalized = skill.toLowerCase();
      let path = [];
      
      if (normalized.includes('react') || normalized.includes('frontend')) {
        path = roadmapsData['react'];
      } else if (normalized.includes('python') || normalized.includes('backend')) {
        path = roadmapsData['python'];
      } else if (normalized.includes('design') || normalized.includes('ui')) {
        path = roadmapsData['design'];
      } else if (normalized.includes('cook') || normalized.includes('food')) {
        path = roadmapsData['cooking'];
      } else {
        path = generateGenericRoadmap(skill);
      }

      setActiveRoadmap(path);
      setRoadmapTitle(skill);
      
      // Load saved progress
      const saved = localStorage.getItem(`roadmap_progress_${normalized}`);
      if (saved) {
        setCompletedNodes(JSON.parse(saved));
      } else {
        setCompletedNodes([]);
      }
      
      const savedScore = localStorage.getItem('roadmap_score');
      if (savedScore) {
        setScore(parseInt(savedScore, 10));
      }
      
      setGenerating(false);
    }, 1500);
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    loadRoadmap(skillInput);
  };

  const toggleNode = (id) => {
    if (completedNodes.includes(id)) {
      const newCompleted = completedNodes.filter(n => n !== id);
      setCompletedNodes(newCompleted);
      localStorage.setItem(`roadmap_progress_${roadmapTitle.toLowerCase()}`, JSON.stringify(newCompleted));
    } else {
      setActiveQuizNode(id);
      setQuizAnswer('');
      setQuizError('');
    }
  };

  const submitQuiz = () => {
    if (!activeQuizNode) return;
    const node = activeRoadmap.find(n => n.id === activeQuizNode);
    if (!node) return;
    
    const defaultAnswer = 'To master the core concepts';
    const correctAnswer = node.quiz ? node.quiz.answer : defaultAnswer;
    
    if (quizAnswer === correctAnswer) {
      const newCompleted = [...completedNodes, activeQuizNode];
      setCompletedNodes(newCompleted);
      localStorage.setItem(`roadmap_progress_${roadmapTitle.toLowerCase()}`, JSON.stringify(newCompleted));
      
      const newScore = score + 25;
      setScore(newScore);
      localStorage.setItem('roadmap_score', newScore.toString());
      
      setActiveQuizNode(null);
    } else {
      setQuizError('Incorrect answer. Please review the topic and try again!');
    }
  };

  if (!user) return null;

  // Render initial selection screen
  if (!activeRoadmap && !generating) {
    return (
      <div className="flex-grow max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <Map className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 text-center tracking-tight">
          AI Learning <span className="text-blue-500">Roadmaps</span>
        </h1>
        <p className="text-secondary text-lg text-center max-w-2xl mb-12">
          Tell us what you want to learn. Our AI will generate a personalized, interactive, step-by-step roadmap to get you from beginner to expert.
        </p>
        
        <form onSubmit={handleStart} className="w-full max-w-xl relative flex items-center">
          <input 
            type="text" 
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g. React Developer, UI Design, Python..."
            className="w-full px-6 py-5 rounded-2xl border-2 border-black/10 focus:border-primary focus:ring-0 text-lg font-medium shadow-sm transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-white font-bold rounded-xl hover:bg-[#152843] transition-colors shadow-sm flex items-center"
          >
            Generate <Sparkles className="w-4 h-4 ml-2" />
          </button>
        </form>
        
        {user.skillsWanted?.length > 0 && (
          <div className="mt-12 w-full max-w-xl">
            <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-4 text-center">Or pick from your wanted skills</p>
            <div className="flex flex-wrap justify-center gap-3">
              {user.skillsWanted.map(skill => (
                <button 
                  key={skill}
                  onClick={() => loadRoadmap(skill)}
                  className="px-4 py-2 bg-blue-50 text-blue-700 font-bold border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full mb-8" />
        <h2 className="text-2xl font-bold text-primary mb-3">AI is mapping your journey...</h2>
        <p className="text-secondary font-medium text-lg">Curating the best topics and resources.</p>
      </div>
    );
  }

  // Render the roadmap
  const progressPercentage = Math.round((completedNodes.length / activeRoadmap.length) * 100);
  const firstIncomplete = activeRoadmap.find(node => !completedNodes.includes(node.id));

  return (
    <div className="flex-grow pb-32">
      {/* Sticky Progress Header */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-black/10 shadow-sm py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveRoadmap(null)} className="p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors text-primary">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="text-xl font-black text-primary capitalize">{roadmapTitle} Roadmap</h1>
          </div>
          
          <div className="flex-1 max-w-md w-full flex items-center gap-4">
            <div className="flex-1 h-3 bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                className="h-full bg-green-500 rounded-full"
              />
            </div>
            <span className="font-black text-primary min-w-[3rem] text-right">{progressPercentage}%</span>
          </div>

          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl text-yellow-700 shadow-sm">
            <Award className="w-5 h-5 fill-yellow-500 text-yellow-600" />
            <span className="font-black text-lg">{score} <span className="text-xs uppercase tracking-widest font-bold opacity-70">pts</span></span>
          </div>
        </div>
      </div>

      {/* The Timeline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative">
        {/* Center Line */}
        <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-1.5 bg-black/5 transform md:-translate-x-1/2 z-0 rounded-full"></div>
        
        <div className="space-y-12">
          {activeRoadmap.map((node, idx) => {
            const isCompleted = completedNodes.includes(node.id);
            const isNext = firstIncomplete && firstIncomplete.id === node.id;
            const isLeft = idx % 2 === 0;
            
            // Deterministically select a mentor for this node
            const mentor = users.length > 0 ? users[(node.id.length + idx) % users.length] : null;
            const mentorRating = mentor ? (4 + (mentor.name.length % 11) / 10).toFixed(1) : "4.9";

            return (
              <motion.div 
                key={node.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`relative z-10 flex flex-col md:flex-row items-start md:items-center ${isLeft ? 'md:flex-row-reverse' : ''}`}
              >
                
                {/* Node Dot */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center">
                  <button 
                    onClick={() => toggleNode(node.id)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 z-20 ${
                      isCompleted ? 'bg-green-500 hover:bg-green-600 scale-110' : 
                      isNext ? 'bg-blue-500 hover:bg-blue-600 ring-4 ring-blue-500/20 animate-pulse-slow' : 
                      'bg-gray-300 hover:bg-gray-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6 text-white" /> : 
                     isNext ? <Play className="w-5 h-5 text-white ml-1" /> : 
                     <Lock className="w-5 h-5 text-white" />}
                  </button>
                </div>

                {/* Node Card */}
                <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isLeft ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm relative overflow-hidden ${
                      isCompleted ? 'border-green-500 bg-green-50/30' : 
                      isNext ? 'border-blue-500 shadow-md' : 'border-black/10'
                    }`}
                  >
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${
                      isCompleted ? 'bg-green-100 text-green-700' : 
                      isNext ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isCompleted ? 'Completed' : isNext ? 'Up Next' : 'Locked'}
                    </div>

                    <h3 className="text-xl font-black text-primary mb-3 leading-tight">{node.title}</h3>
                    
                    {node.subtopics && (
                      <div className={`flex flex-col gap-2 mb-4 ${isLeft ? 'md:items-end' : 'items-start'}`}>
                        {node.subtopics.map((sub, i) => (
                          <div key={i} className="flex items-center text-sm font-medium text-secondary">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> {sub}
                          </div>
                        ))}
                      </div>
                    )}

                    {node.practice && (
                      <div className={`mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left`}>
                        <p className="text-[10px] font-black uppercase text-yellow-600 tracking-widest mb-1 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Practice Task
                        </p>
                        <p className="text-sm font-bold text-yellow-800">{node.practice}</p>
                      </div>
                    )}
                    
                    <div className={`flex flex-wrap gap-4 mb-4 ${isLeft ? 'md:justify-end' : 'justify-start'}`}>
                      <div className="flex items-center text-secondary text-xs font-bold bg-black/5 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3 mr-1.5" /> {node.duration}
                      </div>
                      <div className="flex items-center text-secondary text-xs font-bold bg-black/5 px-2 py-1 rounded-md">
                        <BarChart className="w-3 h-3 mr-1.5" /> {node.difficulty}
                      </div>
                    </div>

                    {/* Recommended Mentor & Resources */}
                    <div className={`mt-6 pt-5 border-t border-black/5 ${isLeft ? 'md:text-right' : 'text-left'}`}>
                      {mentor && (
                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mb-4 text-left">
                          <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-3 flex items-center">
                            <Sparkles className="w-3 h-3 mr-1.5 text-yellow-500" /> Recommended Mentor
                          </p>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-black/10 overflow-hidden flex-shrink-0">
                                <img 
                                  src={mentor.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=EBF4FF&color=2563EB&bold=true`} 
                                  alt={mentor.name} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-primary text-sm leading-none mb-1">{mentor.name}</h4>
                                <div className="flex items-center text-xs font-bold text-yellow-600">
                                  <Star className="w-3 h-3 fill-yellow-500 mr-1" /> {mentorRating}
                                </div>
                              </div>
                            </div>
                            <Link href={`/swap/${mentor._id}`}>
                              <button className="px-3 py-2 bg-white border border-black/10 text-primary font-bold text-xs rounded-lg hover:border-primary hover:bg-primary/5 transition-colors whitespace-nowrap shadow-sm">
                                Book Session
                              </button>
                            </Link>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <span className="text-xs font-bold text-secondary">Need self-study?</span>
                        <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : 'justify-start'}`}>
                          <a href={`https://www.google.com/search?q=${encodeURIComponent(node.title + ' documentation')}`} target="_blank" rel="noreferrer" className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                            <FileText className="w-3 h-3 mr-1.5" /> View Docs
                          </a>
                          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(node.title + ' tutorial')}`} target="_blank" rel="noreferrer" className="flex items-center text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                            <Video className="w-3 h-3 mr-1.5" /> View Videos
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Quick Complete Button (Mobile mainly, or for explicit action) */}
                    {!isCompleted && isNext && (
                      <button 
                        onClick={() => toggleNode(node.id)}
                        className="mt-5 w-full py-2 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#152843] transition-colors"
                      >
                        Mark Completed
                      </button>
                    )}
                  </motion.div>
                </div>

              </motion.div>
            );
          })}
        </div>
        
        {/* End of roadmap flair */}
        {progressPercentage === 100 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-16 text-center pb-20"
          >
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-yellow-400 shadow-xl">
              <Sparkles className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-black text-primary mb-2">Roadmap Complete!</h2>
            <p className="text-secondary font-medium">You are officially ready to swap this skill like a pro.</p>
          </motion.div>
        )}
      </div>

      {/* AI Sticky Recommendation Banner */}
      <AnimatePresence>
        {firstIncomplete && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 p-4"
          >
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-blue-200">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-secondary mb-1">AI Recommendation</h4>
                  <p className="text-primary font-bold text-sm sm:text-base leading-tight">
                    Your next logical step is to master <span className="text-blue-600">"{firstIncomplete.title}"</span>.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const element = document.getElementById(firstIncomplete.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 bg-black/5 hover:bg-black/10 text-primary font-black rounded-xl transition-colors"
              >
                Focus Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Verification Modal */}
      <AnimatePresence>
        {activeQuizNode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setActiveQuizNode(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-black/10"
            >
              <div className="h-2 bg-blue-500 w-full" />
              <div className="p-8">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6 border border-blue-100">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                
                {(() => {
                  const node = activeRoadmap.find(n => n.id === activeQuizNode);
                  const quizData = node?.quiz || {
                    question: `What is the main goal of ${node?.title}?`,
                    options: ['To master the core concepts', 'To skip ahead', 'To avoid learning'],
                    answer: 'To master the core concepts'
                  };

                  return (
                    <>
                      <h2 className="text-2xl font-black text-primary mb-2">Knowledge Check</h2>
                      <p className="text-secondary font-medium mb-6">Answer this quick question to prove you've mastered <strong>{node?.title}</strong> before marking it complete.</p>
                      
                      <div className="bg-black/5 rounded-xl p-5 mb-6">
                        <h3 className="font-bold text-primary mb-4">{quizData.question}</h3>
                        <div className="space-y-3">
                          {quizData.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => { setQuizAnswer(opt); setQuizError(''); }}
                              className={`w-full text-left px-4 py-3 rounded-lg border-2 font-bold text-sm transition-all ${
                                quizAnswer === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-black/10 hover:border-black/20 text-secondary'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {quizError && (
                        <p className="text-red-500 font-bold text-sm mb-4 text-center">{quizError}</p>
                      )}

                      <div className="flex gap-3">
                        <button 
                          onClick={() => setActiveQuizNode(null)}
                          className="flex-1 py-3 font-bold text-secondary hover:bg-black/5 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={submitQuiz}
                          disabled={!quizAnswer}
                          className={`flex-1 py-3 font-bold rounded-xl transition-colors text-white ${
                            quizAnswer ? 'bg-blue-600 hover:bg-blue-700 shadow-md' : 'bg-gray-300 cursor-not-allowed'
                          }`}
                        >
                          Verify & Complete
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
