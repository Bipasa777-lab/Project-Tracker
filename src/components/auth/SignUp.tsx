import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

interface SignUpProps {
  onGoHome: () => void;
  onGoToSignIn: () => void;
  onSuccess: () => void;
}

export default function SignUp({ onGoHome, onGoToSignIn, onSuccess }: SignUpProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const register = useAuthStore(s => s.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await register(name, email, password);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to sign up');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-1 text-slate-200 font-sans selection:bg-accent/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md bg-bg-2/80 backdrop-blur-xl border border-border-1 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-10 animate-fade-in-up">
        
        <div className="flex justify-center mb-6">
          <button onClick={onGoHome} className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="7" width="5" height="10" rx="1.5" fill="currentColor" opacity="0.9"/>
              <rect x="10" y="4" width="5" height="13" rx="1.5" fill="currentColor"/>
              <rect x="16" y="9" width="5" height="8" rx="1.5" fill="currentColor" opacity="0.7"/>
            </svg>
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
        <p className="text-center text-slate-400 mb-8">Join Project Tracker and ship faster</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-bg-1/50 border border-border-1 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-bg-1/50 border border-border-1 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-bg-1/50 border border-border-1 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full text-base font-bold bg-accent text-white px-8 py-3.5 rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-6 flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button onClick={onGoToSignIn} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
