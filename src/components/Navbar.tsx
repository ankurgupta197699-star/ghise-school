import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Academics", href: "#academics" },
  { name: "Admissions", href: "#admissions" },
  { name: "Support", href: "#support" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border-2 border-school-green shadow-sm flex items-center justify-center">
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
            <span className={cn(
              "font-serif font-bold text-lg leading-tight",
              isScrolled ? "text-school-navy" : "text-white drop-shadow-md"
            )}>
              GURU HARGOBIND
            </span>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-bold",
              isScrolled ? "text-school-green" : "text-school-gold"
            )}>
              Institute of School Education
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-school-gold",
                isScrolled ? "text-slate-700" : "text-white drop-shadow-sm"
              )}
            >
              {item.name}
            </a>
          ))}
          <Button 
            className="bg-school-gold hover:bg-school-gold-dark text-school-navy font-bold border-none"
            render={<a href="#admissions" />}
            nativeButton={false}
          >
            Apply Now
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              nativeButton={true}
              render={
                <Button variant="ghost" size="icon" className={isScrolled ? "text-school-navy" : "text-white"} />
              }
            >
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-10">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-lg font-serif font-semibold text-school-navy hover:text-school-gold transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
                <Button 
                  className="bg-school-navy text-white mt-4" 
                  render={<a href="#admissions" />}
                  nativeButton={false}
                >
                  Apply Now
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
