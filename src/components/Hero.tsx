import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="School Campus"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://picsum.photos/seed/school/1920/1080";
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-school-navy/80 via-school-navy/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
              Nurturing Minds, <br />
              <span className="text-school-gold">Shaping Futures.</span>
            </h1>
            <p className="text-lg text-slate-200 mb-10 leading-relaxed max-w-2xl">
              At Guru Hargobind Institute, we provide a holistic learning environment that combines traditional values with modern innovation to prepare students for global challenges.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Button 
                size="lg" 
                className="bg-school-green hover:bg-school-green/90 text-white font-bold h-14 px-8 text-lg"
                onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Admissions <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white/10 h-14 px-8 text-lg"
                onClick={() => document.getElementById('academics')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Our Curriculum
              </Button>
            </div>

            {/* QR Code Section */}
            <div className="flex items-center gap-6 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 w-fit">
              <div className="w-32 h-32 bg-white rounded-xl p-2 shadow-lg">
                <img 
                  src="/qr-code.png" 
                  alt="School QR Code" 
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-white">
                <p className="text-xl font-serif font-bold mb-1">Admission Video</p>
                <p className="text-sm text-slate-300">Scan to watch our story</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute -top-20 -right-20 hidden lg:block"
          >
            <div className="w-56 h-56 bg-white rounded-[2.5rem] p-6 shadow-2xl border-4 border-school-green/20 flex items-center justify-center animate-bounce-slow">
              <img 
                src="/logo.png" 
                alt="Guru Hargobind Institute Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=GH&backgroundColor=008751&fontFamily=serif";
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-school-gold/10 blur-3xl rounded-full -mr-20 -mb-20 animate-pulse" />
    </section>
  );
}
