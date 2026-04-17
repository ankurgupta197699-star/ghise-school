import { motion } from "motion/react";
import { 
  BookOpen, 
  Microscope, 
  Palette, 
  Trophy, 
  Monitor, 
  Music 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const programs = [
  {
    title: "Primary Education",
    desc: "Foundational learning focusing on literacy, numeracy, and social skills for Grades 1-5.",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Science & Tech",
    desc: "Advanced laboratories and STEM curriculum to foster analytical thinking and innovation.",
    icon: Microscope,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Arts & Humanities",
    desc: "Encouraging creative expression through literature, history, and social sciences.",
    icon: Palette,
    color: "bg-pink-50 text-pink-600"
  },
  {
    title: "Sports Excellence",
    desc: "Comprehensive physical education and professional coaching for various sports.",
    icon: Trophy,
    color: "bg-orange-50 text-orange-600"
  },
  {
    title: "Digital Literacy",
    desc: "Modern computer labs and coding classes to prepare students for the digital age.",
    icon: Monitor,
    color: "bg-cyan-50 text-cyan-600"
  },
  {
    title: "Performing Arts",
    desc: "Dedicated spaces for music, dance, and drama to nurture artistic talents.",
    icon: Music,
    color: "bg-emerald-50 text-emerald-600"
  }
];

export default function AcademicsSection() {
  return (
    <section id="academics" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-school-green font-bold tracking-widest uppercase text-sm mb-4 block">
            Academic Excellence
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-school-navy mb-6">
            Our Diverse Educational Programs
          </h2>
          <p className="text-slate-600 text-lg">
            We offer a balanced curriculum that caters to the unique interests and strengths of every student, ensuring a well-rounded development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl ${program.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <program.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-school-navy mb-4">{program.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {program.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
