import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function ProfileView() {
  const { user, updateUser } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    setIsLoading(true);
    const result = await updateUser(name, email);
    setIsLoading(false);
    if (result?.success) {
      setIsEditing(false);
    } else {
      setError(result?.error || 'Failed to update');
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-10 bg-bg-1 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-slate-100 mb-8">My Profile</h1>
        
        <div className="bg-bg-2 border border-border-1 rounded-3xl p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg shadow-indigo-500/20 flex-shrink-0">
              {user?.name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4 w-full">
              {isEditing ? (
                <div className="space-y-3 w-full max-w-sm mx-auto md:mx-0">
                  {error && <div className="text-red-400 text-sm">{error}</div>}
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-bg-1 border border-border-1 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Name"
                    disabled={isLoading}
                  />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-bg-1 border border-border-1 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Email"
                    disabled={isLoading}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.name || 'User Name'}</h2>
                  <p className="text-slate-400 mt-1">{user?.email || 'user@example.com'}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">Pro Member</span>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">Admin</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-bg-3 hover:bg-border-1 text-slate-300 text-sm font-semibold rounded-xl transition-colors border border-border-1 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 bg-bg-3 hover:bg-border-1 text-white text-sm font-semibold rounded-xl transition-colors border border-border-1"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-bg-2 border border-border-1 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Activity Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-bg-1 p-4 rounded-2xl">
                <span className="text-slate-400 text-sm">Tasks Completed</span>
                <span className="text-white font-bold text-xl">142</span>
              </div>
              <div className="flex justify-between items-center bg-bg-1 p-4 rounded-2xl">
                <span className="text-slate-400 text-sm">Projects Contributed</span>
                <span className="text-white font-bold text-xl">12</span>
              </div>
              <div className="flex justify-between items-center bg-bg-1 p-4 rounded-2xl">
                <span className="text-slate-400 text-sm">Current Velocity</span>
                <span className="text-emerald-400 font-bold text-xl">High</span>
              </div>
            </div>
          </div>
          
          <div className="bg-bg-2 border border-border-1 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-slate-300">Completed <span className="text-white font-medium">Design System Update</span></p>
                  <p className="text-slate-500 text-xs mt-0.5">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-slate-300">Moved <span className="text-white font-medium">API Integration</span> to In Progress</p>
                  <p className="text-slate-500 text-xs mt-0.5">5 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-slate-300">Commented on <span className="text-white font-medium">Database Migration</span></p>
                  <p className="text-slate-500 text-xs mt-0.5">1 day ago</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View All Activity</button>
          </div>
        </div>
      </div>
    </div>
  );
}
