import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import AcademicsSection from "./components/AcademicsSection";
import AdmissionForm from "./components/AdmissionForm";
import SupportSection from "./components/SupportSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AdminPortal from "./components/AdminPortal";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isFetchingCode, setIsFetchingCode] = useState(false);
  const [codeFiles, setCodeFiles] = useState<{name: string, content: string}[]>([]);

  useEffect(() => {
    if (window.location.pathname === "/admin") {
      setIsAdmin(true);
    }
  }, []);

  const loadCode = async () => {
    setShowCode(true);
    setIsFetchingCode(true);
    const filesToFetch = [
      // Root Files
      "package.json", "server.ts", "vite.config.ts", "index.html", 
      "tsconfig.json", "components.json",
      
      // Source Files
      "src/main.tsx", "src/App.tsx", "src/index.css",
      "src/components/AboutSection.tsx",
      "src/components/AcademicsSection.tsx",
      "src/components/AdminPortal.tsx",
      "src/components/AdmissionForm.tsx",
      "src/components/ContactSection.tsx",
      "src/components/Footer.tsx",
      "src/components/Hero.tsx",
      "src/components/Navbar.tsx",
      "src/components/SupportSection.tsx",
      
      // UI Lib Files
      "lib/utils.ts",
      "components/ui/accordion.tsx",
      "components/ui/button.tsx",
      "components/ui/card.tsx",
      "components/ui/checkbox.tsx",
      "components/ui/input.tsx",
      "components/ui/label.tsx",
      "components/ui/navigation-menu.tsx",
      "components/ui/select.tsx",
      "components/ui/separator.tsx",
      "components/ui/sheet.tsx",
      "components/ui/tabs.tsx",
      "components/ui/textarea.tsx"
    ];

    const results = [];
    for (const file of filesToFetch) {
      try {
        const res = await fetch(`/api/view-file?path=${file}`);
        if (res.ok) {
          const text = await res.text();
          results.push({ name: file, content: text });
        } else {
          console.error("404 missing:", file);
        }
      } catch (e) {
        console.error("Could not load", file);
      }
    }
    setCodeFiles(results);
    setIsFetchingCode(false);
  };

  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  if (showCode) {
    return (
      <div className="h-screen flex flex-col bg-slate-900 border-8 border-slate-900 text-white overflow-hidden p-4">
        <div className="flex justify-between items-center mb-4 shrink-0 px-2">
          <div>
            <h1 className="text-3xl font-bold">Manual Code Exporter</h1>
            <p className="text-slate-300 mt-1">1. Select a file on the left. 2. Copy the code. 3. Save it to your laptop exactly as named.</p>
          </div>
          <button 
            onClick={() => setShowCode(false)}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded text-lg font-bold shadow-lg"
          >
            Go Back to Website
          </button>
        </div>

        {isFetchingCode ? (
          <p className="animate-pulse text-yellow-400 font-bold text-xl px-2">Loading your code inside the app...</p>
        ) : codeFiles.length === 0 ? (
          <p className="text-red-400 font-bold border border-red-500 p-4 bg-red-900/20 rounded mx-2">Failed to load the files. Please try refreshing.</p>
        ) : (
          <div className="flex flex-1 overflow-hidden bg-slate-800 rounded-xl border border-slate-700 shadow-2xl">
            {/* Left Sidebar (File Explorer) */}
            <div className="w-[30%] bg-slate-900 border-r border-slate-700 flex flex-col">
              <div className="p-4 bg-slate-950 border-b border-slate-800 shrink-0">
                <span className="font-bold text-slate-400 text-sm uppercase tracking-wider">Source Files ({codeFiles.length})</span>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {codeFiles.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFileIndex(i)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                      selectedFileIndex === i 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    📄 {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content (Code Editor View) */}
            <div className="w-[70%] flex flex-col">
              <div className="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700 shrink-0">
                <h2 className="text-xl font-bold text-green-400 font-mono">
                  {codeFiles[selectedFileIndex]?.name}
                </h2>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(codeFiles[selectedFileIndex]?.content);
                    alert("Code copied! Now paste it into a file named exactly: " + codeFiles[selectedFileIndex]?.name);
                  }}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold shadow-md active:scale-95 transition-transform flex gap-2 items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  Copy to Clipboard
                </button>
              </div>
              <textarea 
                className="flex-1 w-full bg-[#0d1117] text-slate-300 p-6 font-mono text-sm border-none focus:outline-none resize-none"
                readOnly
                value={codeFiles[selectedFileIndex]?.content}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isAdmin) {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* MASSIVE EMERGENCY EXPORT BUTTON */}
      <button 
        onClick={loadCode}
        className="fixed top-0 left-0 w-full z-[99999] bg-red-600 text-white font-bold text-xl text-center py-6 shadow-2xl animate-pulse block hover:bg-red-700 underline"
      >
        ⚠️ CLICK HERE TO VIEW AND COPY THE FULL WEBSITE CODE ⚠️
      </button>
      
      {/* Push content down so the banner doesn't hide the navbar */}
      <div className="pt-20">
        <Navbar />
        <main>
          <Hero />
          <AboutSection />
          <AcademicsSection />
          <AdmissionForm />
          <SupportSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
