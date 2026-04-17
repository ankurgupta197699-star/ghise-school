import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-school-green font-bold tracking-widest uppercase text-sm mb-4 block">
            Contact Us
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-school-navy mb-8">
            Get in Touch with Us
          </h2>
          <p className="text-slate-600 text-lg">
            Have questions about admissions, curriculum, or campus life? We're here to help. Reach out to us through any of the following channels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-school-navy/5 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-school-navy" />
            </div>
            <h4 className="font-bold text-school-navy mb-3 text-xl">Our Location</h4>
            <p className="text-slate-600 text-sm leading-relaxed">ward no 7 gurudwara complex near main bazaar rajouri</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-school-navy/5 rounded-2xl flex items-center justify-center mb-6">
              <Phone className="w-7 h-7 text-school-navy" />
            </div>
            <h4 className="font-bold text-school-navy mb-3 text-xl">Phone Number</h4>
            <p className="text-slate-600 text-sm">+91 914942337</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-school-navy/5 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-school-navy" />
            </div>
            <h4 className="font-bold text-school-navy mb-3 text-xl">Email Address</h4>
            <p className="text-slate-600 text-sm">guptaanita5646@gmail.com</p>
            <p className="text-slate-600 text-sm">ghierajouri@gmail.com</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-school-navy/5 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-school-navy" />
            </div>
            <h4 className="font-bold text-school-navy mb-3 text-xl">Office Hours</h4>
            <p className="text-slate-600 text-sm">Mon - Sat: 8:00 AM - 2:00 PM</p>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-20">
          {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
            <a 
              key={i} 
              href="#" 
              className="w-12 h-12 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:bg-school-navy hover:text-white hover:border-school-navy transition-all shadow-sm"
            >
              <Icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Google Maps Section */}
        <div className="mt-20 rounded-3xl overflow-hidden shadow-xl border-4 border-white h-[450px] relative">
          <iframe
            src="https://maps.google.com/maps?q=BANGLA%20SAHIB%20CHAHTHI%20PATASHEE%20GURUDWARA%20Rajouri&t=&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="School Location"
          ></iframe>
          <div className="absolute top-6 left-6 bg-white p-4 rounded-xl shadow-lg hidden md:block">
            <h4 className="font-bold text-school-navy mb-1">Visit Our Campus</h4>
            <p className="text-xs text-slate-500">ward no 7 gurudwara complex near main bazaar rajouri</p>
          </div>
        </div>
      </div>
    </section>
  );
}
