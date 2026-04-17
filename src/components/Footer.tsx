import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-school-navy text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border-2 border-school-green flex items-center justify-center">
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
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-tight">GURU HARGOBIND</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-school-gold">Institute of School Education</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Providing a world-class education that empowers students to become compassionate leaders and lifelong learners.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-school-green">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#home" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> About Us</a></li>
              <li><a href="#academics" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Academics</a></li>
              <li><a href="#admissions" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Admissions</a></li>
              <li><a href="#support" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Support Center</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-school-green">Academics</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Primary School</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Middle School</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sports & Arts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">STEM Programs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-school-green">Contact Info</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-school-green shrink-0" />
                <span>ward no 7 gurudwara complex near main bazaar rajouri</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-school-green shrink-0" />
                <span>+91 914942337</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-school-green shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>guptaanita5646@gmail.com</span>
                  <span>ghierajouri@gmail.com</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <p>© 2024 Guru Hargobind Institute of School Education. All rights reserved.</p>
          <div className="flex gap-8 items-center">
            <a href="/admin" className="px-5 py-2 bg-school-green text-white rounded-xl hover:bg-school-navy transition-all font-bold shadow-lg text-sm">Admin Portal</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
