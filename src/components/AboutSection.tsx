import { motion } from "motion/react";
import { CheckCircle2, Target, Eye, User } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-slate-100 aspect-[4/5] flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
              <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-slate-400" />
              </div>
              <p className="text-slate-500 font-serif font-bold text-xl">Principal's Photo</p>
              <p className="text-slate-400 text-sm">Guruhargobind Institute</p>
            </div>
            {/* Decorative frames */}
            <div className="absolute -top-6 -left-6 w-64 h-64 border-8 border-school-gold/20 rounded-2xl -z-0" />
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-school-navy/10 rounded-2xl -z-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-school-green font-bold tracking-widest uppercase text-sm mb-4 block">
              About Our Institute
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-school-navy mb-8 leading-tight">
              Empowering Students to Reach Their Full Potential
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              Guru Hargobind Institute of School Education has been a beacon of knowledge for over two decades. We believe that education is not just about academic success, but about building character, fostering creativity, and instilling a sense of responsibility.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-school-gold/20 p-1 rounded">
                  <Target className="w-5 h-5 text-school-gold-dark" />
                </div>
                <div>
                  <h4 className="font-bold text-school-navy mb-1">Our Mission</h4>
                  <p className="text-sm text-slate-500">To provide quality education that integrates modern technology with ethical values.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-school-gold/20 p-1 rounded">
                  <Eye className="w-5 h-5 text-school-gold-dark" />
                </div>
                <div>
                  <h4 className="font-bold text-school-navy mb-1">Our Vision</h4>
                  <p className="text-sm text-slate-500">To be a global leader in education, producing compassionate and innovative leaders.</p>
                </div>
              </div>
            </div>

            <ul className="space-y-4">
              {[
                "Experienced & Dedicated Faculty",
                "State-of-the-art Infrastructure",
                "Focus on Co-curricular Activities",
                "Safe & Inclusive Environment"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
