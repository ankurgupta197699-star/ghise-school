import React, { useState, useEffect } from "react";
import { Download, Table, Trash2, ArrowLeft, Search, CheckCircle, XCircle, Clock, AlertCircle, Eye, User, Phone, FileText, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Self-contained UI Components to avoid missing shadcn files ---
const Button = ({ className, variant, size, children, ...props }: any) => {
  const variants: any = {
    outline: "border border-slate-200 bg-transparent hover:bg-slate-100",
    ghost: "bg-transparent hover:bg-slate-100",
    default: "bg-school-navy text-white hover:bg-school-navy/90 text-sm",
  };
  const sizes: any = {
    sm: "h-9 px-3 text-xs",
    lg: "h-12 px-6 text-lg",
    icon: "h-9 w-9 flex items-center justify-center",
    default: "h-10 px-4 py-2",
  };
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variants[variant || "default"]} ${sizes[size || "default"]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }: any) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
);

const Badge = ({ children, className }: any) => (
  <span className={`inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase ${className}`}>
    {children}
  </span>
);

export default function AdminPortal() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [filterGrade, setFilterGrade] = useState("all");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const fetchApplications = async (password: string) => {
    setLoading(true);
    setError(null);
    setAuthError("");
    
    const apiPath = `/api/secure-records?pwd=${encodeURIComponent(password.trim())}&_t=${Date.now()}`;
    
    // We remove AbortController to avoid a known bug in older Safari/iOS 
    // that causes fetch to silently hang indefinitely when a signal is attached.
    
    let isFinished = false;
    
    // Manual timeout fallback
    const fallbackTimeoutId = setTimeout(() => {
      if (!isFinished) {
        setLoading(false);
        setError(
          <div className="flex flex-col items-center text-center space-y-4">
            <span className="font-bold text-red-700 text-lg">Database Blocked by Browser Security!</span>
            <span className="text-slate-700">Because this preview is running inside a smaller "window", your browser's Tracking Prevention is killing the connection to the database.</span>
            
            <button 
              onClick={() => window.open(window.location.href, '_blank')}
              className="mt-4 px-6 py-3 bg-school-navy text-white font-bold rounded-xl shadow-lg hover:bg-school-navy/90 hover:-translate-y-1 transition-all flex items-center justify-center border-2 border-school-gold"
            >
              Open App in New Tab to Fix
            </button>
            <span className="text-xs text-slate-500 mt-2 font-medium">
              (This opens the secure standalone version of your app without the AI Studio frame)
            </span>
          </div>
        );
        isFinished = true;
      }
    }, 6000); // Trigger a bit faster so they don't wait 8 seconds

    try {
      const res = await fetch(apiPath, { method: 'GET' });
      
      if (isFinished) return; // Prevent state changes if timeout already fired
      isFinished = true;
      clearTimeout(fallbackTimeoutId);
      
      if (res.status === 401) {
        setAuthError("Incorrect password");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`Server returned code ${res.status}`);
      }
      
      const textResponse = await res.text();
      
      // Manually catch HTML proxy responses
      if (textResponse.trim().startsWith("<!doctype html>") || textResponse.trim().startsWith("<html")) {
        throw new Error("Proxy intercepted the request. Please enable cookies or open in a new window.");
      }
      
      let data = [];
      try {
        data = JSON.parse(textResponse);
      } catch (parseErr) {
        throw new Error("Database returned invalid format.");
      }
      
      setApplications(Array.isArray(data) ? data : []);
      setIsAuthenticated(true);
      setLoading(false);
      
    } catch (err: any) {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(fallbackTimeoutId);
      console.error("AdminPortal: Fetch error", err);
      setError(`Failed to connect: ${err.message || "Unknown error"}. Check your connection or extensions.`);
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications(passwordInput);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
           <div className="text-center mb-6">
             <div className="w-16 h-16 bg-school-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="w-8 h-8 text-white" />
             </div>
             <h2 className="text-2xl font-serif font-bold text-school-navy">Admin Login</h2>
             <p className="text-sm text-slate-500 mt-2">Enter the admin password to access the database</p>
           </div>
           <form onSubmit={handleLogin} className="space-y-6">
             <div>
               <input 
                 type="password" 
                 placeholder="Enter Admin Password..." 
                 value={passwordInput}
                 onChange={e => setPasswordInput(e.target.value)}
                 className={`w-full h-14 px-4 rounded-xl border-2 ${authError || error ? 'border-red-400 bg-red-50/50' : 'border-slate-200'} bg-white shadow-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-center tracking-[0.2em] font-medium text-lg`}
                 autoFocus
               />
               {(authError || error) && <div className="text-red-700 text-sm mt-3 text-center px-4 py-3 bg-red-50 border border-red-100 rounded-lg">{authError || error}</div>}
             </div>
             
             {/* Using a custom vibrant indigo/navy gradient for the button to reset any browser overrides */}
             <button 
               type="submit" 
               disabled={loading} 
               className="w-full relative flex items-center justify-center h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95 bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-indigo-950 text-white rounded-xl disabled:opacity-80 overflow-hidden"
               style={{ background: 'linear-gradient(to right, #4338ca, #312e81)', color: 'white' }}
             >
               {loading ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                   Decrypting Database...
                 </>
               ) : "Unlock Database"}
             </button>
             
             <button type="button" className="w-full flex items-center justify-center h-12 text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-100/50 rounded-xl transition-colors" onClick={() => window.location.href = "/"}>
               <ArrowLeft className="w-4 h-4 mr-2" /> Return to Website
             </button>
           </form>
        </Card>
      </div>
    );
  }

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.parentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm);
    const matchesGrade = filterGrade === "all" || app.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center animate-pulse">
          <div className="w-12 h-12 border-4 border-school-navy border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-serif text-school-navy">Fetching Database...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif font-bold text-school-navy">Admin Portal</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Database Live</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Website
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-900 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
            <Button size="sm" onClick={fetchApplications}>Retry Fetch</Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-school-navy to-school-navy/80 text-white border-none">
            <p className="text-xs uppercase font-bold text-white/60 tracking-widest mb-1">Total Admissions</p>
            <p className="text-4xl font-bold">{applications.length}</p>
          </Card>
          <div className="col-span-2 flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 w-full space-y-1.5">
               <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Search Records</label>
               <input 
                placeholder="Search by student or parent name..." 
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-school-navy"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
             </div>
             <div className="space-y-1.5 w-full md:w-auto">
               <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Grade Filter</label>
               <select 
                value={filterGrade} 
                onChange={(e) => setFilterGrade(e.target.value)}
                className="h-11 px-4 rounded-xl border border-slate-200 bg-white shadow-sm min-w-[150px] w-full"
              >
                <option value="all">Everywhere</option>
                <option value="pre-nursery">Pre Nursery</option>
                <option value="nursery">Nursery</option>
                <option value="lkg">LKG</option>
                <option value="ukg">UKG</option>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n.toString()}>Grade {n}</option>)}
              </select>
             </div>
          </div>
        </div>

        <Card className="rounded-3xl overflow-hidden border-none shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b">
                  <th className="text-left px-8 py-5 text-[11px] font-bold uppercase tracking-wider">Student Details</th>
                  <th className="text-left px-8 py-5 text-[11px] font-bold uppercase tracking-wider">Grade</th>
                  <th className="text-left px-8 py-5 text-[11px] font-bold uppercase tracking-wider">Parent Contact</th>
                  <th className="text-left px-8 py-5 text-[11px] font-bold uppercase tracking-wider">Submitted On</th>
                  <th className="text-right px-8 py-5 text-[11px] font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredApps.length === 0 ? (
                  <tr><td colSpan={5} className="py-32 text-center text-slate-300 italic">No application records found matching criteria.</td></tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-school-green/10 flex items-center justify-center text-school-green font-bold shadow-inner">
                            {app.studentName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{app.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">#{app.studentBankAcc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 uppercase">
                        <Badge className="bg-slate-100 text-slate-600 border-none px-3">{app.grade}</Badge>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-medium text-slate-700">{app.parentName}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {app.phone}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[11px] font-medium text-slate-500">{new Date(app.receivedAt).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-300 font-mono italic">{new Date(app.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-full h-9 w-24 hover:bg-school-navy hover:text-white"
                          onClick={() => setSelectedApp(app)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-school-navy/40 backdrop-blur-md"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-school-navy p-10 text-white relative">
                <div className="absolute top-6 right-6">
                  <XCircle className="w-8 h-8 opacity-20 cursor-pointer hover:opacity-100" onClick={() => setSelectedApp(null)} />
                </div>
                <Badge className="bg-school-green text-white border-none px-4 py-1 mb-4">Official Application</Badge>
                <h2 className="text-4xl font-serif font-bold">{selectedApp.studentName}</h2>
                <div className="flex gap-4 mt-4 text-white/60 text-xs">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> Parent: {selectedApp.parentName}</span>
                  <span className="flex items-center gap-1 font-mono">ID: {selectedApp.id}</span>
                </div>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applying For</p>
                    <p className="text-lg font-bold text-school-navy uppercase">Grade {selectedApp.grade}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Account</p>
                    <p className="text-lg font-bold text-slate-900 font-mono">{selectedApp.studentBankAcc}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-medium text-slate-700">{selectedApp.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-sm font-medium text-slate-700">{selectedApp.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanent Address</p>
                  <div className="bg-slate-50 p-4 rounded-2xl text-sm leading-relaxed text-slate-600 border border-slate-100">
                    {selectedApp.address}
                  </div>
                </div>

                {selectedApp.message && (
                   <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parent's Message</p>
                    <p className="text-sm italic text-slate-500 pl-4 border-l-4 border-school-green">"{selectedApp.message}"</p>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-amber-600">
                     <AlertCircle className="w-5 h-5 flex-shrink-0" />
                     <p className="text-[10px] font-bold uppercase leading-tight">View photos/docs in ghierajouri@gmail.com</p>
                   </div>
                   <Button variant="outline" size="sm" onClick={() => window.print()} className="font-bold border-slate-300">Print Form</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
