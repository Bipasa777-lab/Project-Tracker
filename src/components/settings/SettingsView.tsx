import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function SettingsView() {
  const { user, deleteUser } = useAuthStore();
  
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [notifs, setNotifs] = useState({
    email: false,
    push: true,
    mentions: true
  });
  
  const handleExport = () => {
    if (!user) return;
    const dataStr = JSON.stringify(user, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'project-tracker-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you SURE you want to delete your account? This action cannot be undone.")) {
      await deleteUser();
    }
  };
  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-10 bg-bg-1 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-slate-100 mb-8">Settings</h1>
        
        <div className="bg-bg-2 border border-border-1 rounded-3xl overflow-hidden shadow-sm">
          {/* Section: Appearance */}
          <div className="p-6 md:p-8 border-b border-border-1">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Appearance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setTheme('dark')}
                className={`bg-bg-3 border-2 ${theme === 'dark' ? 'border-indigo-500' : 'border-border-1'} rounded-2xl p-4 flex items-center gap-4 cursor-pointer`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <div className={`w-5 h-5 rounded-full ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-600'}`}></div>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Dark Theme</h4>
                  <p className="text-slate-400 text-xs">Default system theme</p>
                </div>
              </div>
              <div 
                onClick={() => setTheme('light')}
                className={`bg-bg-1 border-2 ${theme === 'light' ? 'border-indigo-500' : 'border-border-1'} rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors`}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200">
                  <div className={`w-5 h-5 rounded-full ${theme === 'light' ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                </div>
                <div>
                  <h4 className="text-slate-300 font-semibold">Light Theme</h4>
                  <p className="text-slate-500 text-xs">Mock functionality</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section: Notifications */}
          <div className="p-6 md:p-8 border-b border-border-1">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifications
            </h2>
            
            <div className="space-y-4">
              {[
                { id: 'email', title: 'Email Notifications', desc: 'Receive daily summary emails' },
                { id: 'push', title: 'Push Notifications', desc: 'Get notified when assigned a task' },
                { id: 'mentions', title: 'Mention Alerts', desc: 'Notify when someone @mentions you' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-bg-3/50 transition-colors">
                  <div>
                    <h4 className="text-white font-medium">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifs[item.id as keyof typeof notifs]} 
                      onChange={() => setNotifs(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifs] }))}
                    />
                    <div className="w-11 h-6 bg-border-1 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Account */}
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Account Management
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-bg-1 p-4 rounded-2xl border border-border-1">
                <div>
                  <h4 className="text-white font-medium">Export Data</h4>
                  <p className="text-slate-400 text-sm">Download a copy of your personal data</p>
                </div>
                <button 
                  onClick={handleExport}
                  className="px-4 py-2 bg-bg-3 hover:bg-border-1 text-white text-sm font-medium rounded-lg transition-colors border border-border-1"
                >
                  Export JSON
                </button>
              </div>
              <div className="flex items-center justify-between bg-red-500/5 p-4 rounded-2xl border border-red-500/20">
                <div>
                  <h4 className="text-red-400 font-medium">Danger Zone</h4>
                  <p className="text-red-400/70 text-sm">Permanently delete your account</p>
                </div>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-lg transition-colors border border-red-500/30"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
