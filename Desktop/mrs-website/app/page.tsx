'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, LayoutTemplate, ShoppingCart, Search, 
  FileText, Cpu, Code, Video, ArrowRight, Menu, 
  X, CheckCircle2, Package, GitMerge, Send, Check
} from 'lucide-react';

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// ==========================================
// 1. NAVIGATION COMPONENT
// ==========================================
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Process', href: '#process' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#home" className="group flex flex-col items-start z-50">
          <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-neutral-300 transition-colors">M.R.S.</span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Mohamed Reda Services</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            {links.map((link) => (
              <a key={link.name} href={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
          </div>
          <a href="#contact" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors">
            Start a Project
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden text-neutral-300 z-50 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-[#050505] flex flex-col justify-center items-center space-y-8 z-40"
          >
            {links.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif text-white hover:text-neutral-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-8 py-3 rounded-full bg-white text-black text-lg font-medium"
            >
              Start a Project
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ==========================================
// 2. HERO SECTION
// ==========================================
const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-neutral-800/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neutral-900/20 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left: Copy */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="flex flex-col items-start space-y-8"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-panel">
            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse" />
            <span className="text-xs font-medium tracking-wide text-neutral-300">Modern Business Solutions</span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif leading-[1.1] text-white">
            Business Solutions.<br />
            <span className="text-neutral-500">Sourced Globally.</span><br />
            Built Digitally.
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg text-neutral-400 max-w-xl leading-relaxed">
            From sourcing products internationally to building dynamic digital experiences, M.R.S. brings practical business and digital services together under one unified approach.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <a href="#services" className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2">
              Explore Services <ArrowRight size={18} />
            </a>
            <a href="#contact" className="px-6 py-3 rounded-full glass-panel text-white hover:bg-white/10 transition-colors">
              Contact M.R.S.
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Premium Visual Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block relative"
        >
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
            {/* Fixed standard arbitrary opacity scale */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            
            <div className="relative z-10 space-y-12">
              {/* Import Flow */}
              <div>
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] mb-4">Import Network</div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg"><Search size={18} className="text-neutral-400" /></div>
                    <span className="text-xs text-neutral-500">Source</span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 mx-4 relative">
                    <motion.div 
                      animate={{ x: ["0%", "100%"] }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-[-1px] left-0 w-8 h-[3px] bg-neutral-400 blur-sm" 
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg"><GitMerge size={18} className="text-neutral-400" /></div>
                    <span className="text-xs text-neutral-500">Coordinate</span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 mx-4" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg"><Package size={18} className="text-neutral-400" /></div>
                    <span className="text-xs text-neutral-500">Deliver</span>
                  </div>
                </div>
              </div>

              {/* Digital Flow */}
              <div>
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] mb-4">Digital Pipeline</div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg"><LayoutTemplate size={18} className="text-neutral-400" /></div>
                    <span className="text-xs text-neutral-500">Design</span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 mx-4" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg"><Code size={18} className="text-neutral-400" /></div>
                    <span className="text-xs text-neutral-500">Build</span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 mx-4 relative">
                    <motion.div 
                      animate={{ x: ["100%", "0%"] }} 
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute top-[-1px] left-0 w-8 h-[3px] bg-neutral-400 blur-sm" 
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shadow-lg"><Video size={18} className="text-neutral-400" /></div>
                    <span className="text-xs text-neutral-500">Create</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// 3. TRUST STRIP
// ==========================================
const TrustStrip = () => {
  const values = [
    { icon: <Globe size={20} />, text: "Global Reach" },
    { icon: <CheckCircle2 size={20} />, text: "Practical Solutions" },
    { icon: <Cpu size={20} />, text: "Digital Expertise" },
    { icon: <FileText size={20} />, text: "Clear Communication" },
  ];

  return (
    <div className="border-y border-white/5 bg-[#050505]/50 backdrop-blur-sm relative z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {values.map((val, i) => (
            <div key={i} className="flex items-center space-x-3 text-neutral-400">
              <span className="text-neutral-600">{val.icon}</span>
              <span className="text-sm font-medium tracking-wide">{val.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. SERVICES SECTION
// ==========================================
const Services = () => {
  const importServices = [
    {
      id: "01",
      icon: <Search className="text-neutral-400" />,
      title: "Product Sourcing & Supplier Coordination",
      desc: "Identify suitable products and suppliers. Compare options and coordinate communication efficiently to secure what your business needs."
    },
    {
      id: "02",
      icon: <Package className="text-neutral-400" />,
      title: "Import & Logistics Assistance",
      desc: "Coordinate shipments and organize import documentation. Manage communication with freight providers to track progress reliably."
    },
    {
      id: "03",
      icon: <FileText className="text-neutral-400" />,
      title: "Customs & Documentation Assistance",
      desc: "Prepare information and paperwork for the import process. Administrative support to ensure clear, organized documentation.*",
      note: "*M.R.S. acts as an administrative coordinator, not a licensed customs broker."
    },
    {
      id: "04",
      icon: <Cpu className="text-neutral-400" />,
      title: "Technology & Hardware Import",
      desc: "Specialized assistance sourcing computers, components, and electronics. Compare technical products and oversee purchase coordination."
    }
  ];

  const digitalServices = [
    {
      id: "05",
      icon: <Code className="text-neutral-400" />,
      title: "Modern Web Development",
      desc: "Build highly responsive, professional business websites, landing pages, and e-commerce interfaces using modern front-end architectures."
    },
    {
      id: "06",
      icon: <Video className="text-neutral-400" />,
      title: "Content Creation & Video Editing",
      desc: "Produce branded visual content, short-form videos, and social media materials with meticulous post-production editing."
    }
  ];

  return (
    <section id="services" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="mb-20 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Services built around what your business needs.</h2>
          <p className="text-neutral-400 text-lg">Operating across two connected disciplines, M.R.S. streamlines both physical sourcing and digital execution.</p>
        </motion.div>

        {/* IMPORT CATEGORY */}
        <div className="mb-20">
          <div className="flex items-center space-x-4 mb-8">
            <h3 className="text-sm font-mono tracking-widest text-neutral-300 uppercase">Import Services</h3>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {importServices.map((srv, i) => (
              <ServiceCard key={i} {...srv} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* DIGITAL CATEGORY */}
        <div>
          <div className="flex items-center space-x-4 mb-8">
            <h3 className="text-sm font-mono tracking-widest text-neutral-300 uppercase">Digital Services</h3>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {digitalServices.map((srv, i) => (
              <ServiceCard key={i} {...srv} delay={i * 0.1} isDigital />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ id, icon, title, desc, note, isDigital, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-6 rounded-2xl flex flex-col h-full hover:bg-white/10 transition-colors group relative overflow-hidden"
  >
    {isDigital && (
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
    )}
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-neutral-900 rounded-xl border border-white/5">{icon}</div>
      <span className="text-xs font-mono text-neutral-600">{id}</span>
    </div>
    <h4 className="text-lg font-medium text-white mb-3 leading-snug">{title}</h4>
    <p className="text-sm text-neutral-400 mb-4 flex-1">{desc}</p>
    {note && <p className="text-[10px] text-neutral-600 italic mt-auto mb-4">{note}</p>}
    <div className="mt-auto flex items-center text-xs font-medium text-neutral-500 group-hover:text-white transition-colors">
      Learn more <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </div>
  </motion.div>
);

// ==========================================
// 5. PROCESS SECTION
// ==========================================
const Process = () => {
  const steps = [
    { num: "01", title: "Understand", desc: "Understand the precise requirements, technical specifications, and end goals of the client." },
    { num: "02", title: "Plan", desc: "Identify the right approach, map out the logistics, and select the optimal suppliers or tech stack." },
    { num: "03", title: "Coordinate", desc: "Handle communications, project management, and execution with absolute attention to detail." },
    { num: "04", title: "Deliver", desc: "Finalize logistics or deploy code, moving the project to a clear, practical, and successful result." },
  ];

  return (
    <section id="process" className="py-24 bg-neutral-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">From the first idea to the final result.</h2>
          <p className="text-neutral-400">A clear, systematic approach to solving complex operational and digital needs.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line Desktop */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[1px] bg-neutral-800" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="w-12 h-12 bg-[#050505] border border-neutral-700 rounded-full flex items-center justify-center font-mono text-sm text-white mb-6 shadow-xl">
                {step.num}
              </div>
              <h4 className="text-lg font-medium text-white mb-3">{step.title}</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 6 & 7. ABOUT & WHY M.R.S.
// ==========================================
const About = () => {
  return (
    <section id="about" className="py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            M.R.S. was built around a simple idea.
          </h2>
          <div className="space-y-6 text-neutral-400 text-lg leading-relaxed">
            <p>
              Useful services should be easier to access, easier to understand, and easier to execute. 
            </p>
            <p>
              By bringing together international import assistance and modern digital capabilities, M.R.S. acts as a single point of reliability. Whether sourcing critical hardware from overseas or engineering a high-performance web application, the underlying philosophy remains the same.
            </p>
          </div>
          
          <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">Clarity</h4>
              <p className="text-sm text-neutral-500">No unnecessary complexity in the process.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Practicality</h4>
              <p className="text-sm text-neutral-500">Solutions focused on moving the project forward.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Flexibility</h4>
              <p className="text-sm text-neutral-500">Adapting to unique business requirements.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Digital Mindset</h4>
              <p className="text-sm text-neutral-500">Leveraging modern tools for pure efficiency.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative aspect-square md:aspect-[4/3] rounded-3xl glass-panel flex flex-col items-center justify-center p-12 text-center overflow-hidden"
        >
          {/* Fixed standard arbitrary opacity scale */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
          
          <h3 className="font-serif text-6xl text-white mb-6 relative z-10">M.R.S.</h3>
          <div className="flex items-center space-x-6 text-neutral-500 font-mono tracking-widest text-sm relative z-10">
            <span>IMPORT</span>
            <X size={14} className="text-neutral-600" />
            <span>DIGITAL</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// 8. CONTACT SECTION
// ==========================================
const Contact = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API integration readiness
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <section id="contact" className="py-32 bg-neutral-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16">
        
        {/* Copy */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Have something in mind?</h2>
          <p className="text-lg text-neutral-400 mb-12 max-w-md">
            Tell M.R.S. what you're trying to source, build, create, or coordinate. Let's start with the details.
          </p>
          
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-neutral-600 uppercase tracking-wider mb-1">Email</span>
              <a href="mailto:mr4316841@gmail.com" className="text-white hover:text-neutral-300 transition-colors">mr4316841@gmail.com</a>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-neutral-600 uppercase tracking-wider mb-1">WhatsApp</span>
              <a href="tel:+201029864288" className="text-white hover:text-neutral-300 transition-colors">+20 1029864288</a>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-neutral-600 uppercase tracking-wider mb-1">Location</span>
              <span className="text-white">El Khanka,EG</span>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-neutral-300">Full Name</label>
                <input 
                  id="name" required type="text" 
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email Address</label>
                <input 
                  id="email" required type="email" 
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="service" className="text-sm font-medium text-neutral-300">Service Required</label>
              <div className="relative">
                <select 
                  id="service" required
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 transition-colors appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled className="bg-neutral-900">Select a service area...</option>
                  <option value="sourcing" className="bg-neutral-900">Product Sourcing</option>
                  <option value="logistics" className="bg-neutral-900">Import & Logistics Assistance</option>
                  <option value="customs" className="bg-neutral-900">Customs & Documentation Assistance</option>
                  <option value="hardware" className="bg-neutral-900">Technology & Hardware Import</option>
                  <option value="web" className="bg-neutral-900">Web Development</option>
                  <option value="content" className="bg-neutral-900">Content Creation / Video Editing</option>
                  <option value="other" className="bg-neutral-900">Other / Consultation</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                  <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 6h8l-4 5-4-5z" fill="currentColor"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-neutral-300">Project Details</label>
              <textarea 
                id="message" required rows={4}
                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                placeholder="Briefly describe what you're looking to achieve..."
              />
            </div>

            <button 
              type="submit" 
              disabled={formStatus !== 'idle'}
              className="w-full py-4 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formStatus === 'idle' && <><Send size={18} /> Send Inquiry</>}
              {formStatus === 'submitting' && <span className="animate-pulse">Preparing message...</span>}
              {formStatus === 'success' && <><Check size={18} /> Ready for Integration</>}
            </button>
            {formStatus === 'success' && (
               <p className="text-xs text-center text-neutral-500 pt-2">Note: Frontend interface complete. Awaiting backend integration.</p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// 9. FOOTER
// ==========================================
const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-12 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start">
          <span className="font-serif text-2xl font-bold text-white tracking-tight">M.R.S.</span>
          <span className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Mohamed Reda Services</span>
          <p className="text-sm text-neutral-400 mt-4 text-center md:text-left">
            Import assistance. Digital solutions. Practical execution.
          </p>
        </div>

        <div className="flex space-x-6 text-sm text-neutral-400">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>

      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
        <p>© 2026 M.R.S. — Mohamed Reda Services. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://www.facebook.com/profile.php?id=61592754163260" className="hover:text-neutral-400 transition-colors">Facebook</a>
          <a href="https://www.tiktok.com/@d3f4ulty" className="hover:text-neutral-400 transition-colors">Tiktok</a>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// MAIN PAGE EXPORT
// ==========================================
export default function MSRLandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-white/20 selection:text-white">
      <Navigation />
      <Hero />
      <TrustStrip />
      <Services />
      <Process />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}