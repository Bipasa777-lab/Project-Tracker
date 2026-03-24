interface LandingPageProps {
  onEnterApp: () => void;
  onGoToSignIn?: () => void;
  onGoToSignUp?: () => void;
}

export default function LandingPage({ onEnterApp, onGoToSignIn, onGoToSignUp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-bg-1 text-slate-200 font-sans selection:bg-accent/30 flex flex-col overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-6 sm:px-12 lg:px-24 border-b border-border-1/50 bg-bg-1/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={onEnterApp} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 w-8 h-8 rounded-lg shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="7" width="5" height="10" rx="1.5" fill="currentColor" opacity="0.9"/>
              <rect x="10" y="4" width="5" height="13" rx="1.5" fill="currentColor"/>
              <rect x="16" y="9" width="5" height="8" rx="1.5" fill="currentColor" opacity="0.7"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Project Tracker</span>
        </button>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={onGoToSignIn || onEnterApp}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
          >
            Sign In
          </button>
          <button 
            onClick={onEnterApp}
            className="text-sm font-bold bg-white text-bg-1 px-5 py-2.5 rounded-full hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 text-center relative pt-20 pb-24 lg:pt-32 lg:pb-32 z-10">
        
        {/* Background Gradients (Darklight feel) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none animate-glow" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          v2.0 is now live
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Manage software projects at <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">high velocity.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Stop letting tasks fall through the cracks. Project Tracker brings your Kanban boards, team workload, and real-time velocity metrics into one beautiful workspace.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <button 
            onClick={onGoToSignUp || onEnterApp}
            className="w-full sm:w-auto text-base font-bold bg-accent text-white px-8 py-4 rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Started 
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
          
          <button 
            onClick={onGoToSignUp || onEnterApp}
            className="w-full sm:w-auto text-base font-bold bg-bg-2/50 backdrop-blur-md border border-border-1 text-slate-200 px-8 py-4 rounded-full hover:bg-bg-3 hover:border-border-2 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center justify-center gap-2 hover:-translate-y-1"
          >
            Sign Up with GitHub
          </button>
        </div>

      </main>

      {/* Features Grid */}
      <section className="px-6 sm:px-12 lg:px-24 py-24 bg-bg-2/50 border-t border-border-1/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to ship faster.</h2>
            <p className="text-slate-400">Designed for developers, product managers, and design teams who hate clutter.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <FeatureCard 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                title="Velocity Analytics"
                desc="Simulate and visualize your team's completion rates over time directly from the dashboard."
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <FeatureCard 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
                title="Drag & Drop Kanban"
                desc="Organize tasks into customizable columns with a silky-smooth drag and drop interface."
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <FeatureCard 
                icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                title="Team Workload"
                desc="See exactly who is overloaded and who has capacity with real-time pending task metrics."
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-border-1 bg-bg-1">
        © 2026 Project Tracker. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center bg-bg-3/80 backdrop-blur-sm border border-border-1 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] group hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icon}
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
