'use client';

import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, animate as fmAnimate } from "framer-motion";

/* Context that carries the cv-entries-wrap ref so child metric
   components can use it as the IntersectionObserver root —
   required for whileInView to fire inside a horizontal scroll container */
const CvScrollRootCtx = createContext(null);
import gsap from "gsap";
import Lenis from "lenis";
import { ArrowRight, Download, Mail, Globe, Smartphone, Layers, Cpu, Zap, TrendingUp, GraduationCap, Code, Rocket, Server, Database, Search, Palette, ChevronDown } from "lucide-react";
import Hero from "./Hero";

/* ── Inline brand icons (not in this build of lucide-react) ── */
const InstagramIcon = ({ size = 16, strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const LinkedinIcon = ({ size = 16, strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const GithubIcon = ({ size = 16, strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ── Scroll-visibility hook — works with Lenis (uses getBoundingClientRect) ── */
function useVisible(enterFrac = 0.1, exitFrac = 0.05) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const { top, bottom } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setVis(top < vh * (1 - enterFrac) && bottom > vh * exitFrac);
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, [enterFrac, exitFrac]);
  return [ref, vis];
}

/* ── Shared animation presets ── */
const ease = [0.22, 1, 0.36, 1];
const fadeUp    = { hidden: { opacity: 0, y: 40  }, show: { opacity: 1, y: 0,   transition: { duration: 0.8,  ease } } };
const fadeDown  = { hidden: { opacity: 0, y: -30 }, show: { opacity: 1, y: 0,   transition: { duration: 0.75, ease } } };
const fadeLeft  = { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0,   transition: { duration: 0.85, ease } } };
const fadeRight = { hidden: { opacity: 0, x:  60 }, show: { opacity: 1, x: 0,   transition: { duration: 0.85, ease } } };
const scaleUp   = { hidden: { opacity: 0, scale: 0.92, y: 32 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.85, ease } } };
const stagger     = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const staggerFast = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ── Data ── */
/* Microlink — free tier, high-quality screenshots, no key needed */
const SHOT = "https://api.microlink.io?screenshot=true&meta=false&embed=screenshot.url&url=";

/* ── Tech stack for marquee (Simple Icons CDN) ── */
const STACK_1 = [
  { name: 'React',         icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'Next.js',       icon: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
  { name: 'TypeScript',    icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
  { name: 'Node.js',       icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  { name: 'PostgreSQL',    icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
  { name: 'Tailwind CSS',  icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
  { name: 'Framer Motion', icon: 'https://cdn.simpleicons.org/framer/ffffff' },
  { name: 'Prisma',        icon: 'https://cdn.simpleicons.org/prisma/ffffff' },
  { name: 'MongoDB',       icon: 'https://cdn.simpleicons.org/mongodb/47A248' },
  { name: 'Redis',         icon: 'https://cdn.simpleicons.org/redis/DC382D' },
];
const STACK_2 = [
  { name: 'Python',        icon: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'OpenAI',        icon: 'https://cdn.simpleicons.org/openai/ffffff' },
  { name: 'Firebase',      icon: 'https://cdn.simpleicons.org/firebase/FFCA28' },
  { name: 'Vercel',        icon: 'https://cdn.simpleicons.org/vercel/ffffff' },
  { name: 'Docker',        icon: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'React Native',  icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'Figma',         icon: 'https://cdn.simpleicons.org/figma/F24E1E' },
  { name: 'GraphQL',       icon: 'https://cdn.simpleicons.org/graphql/E10098' },
  { name: 'Supabase',      icon: 'https://cdn.simpleicons.org/supabase/3ECF8E' },
  { name: 'Expo',          icon: 'https://cdn.simpleicons.org/expo/ffffff' },
];

/* ── Services data ── */
const SERVICES = [
  {
    Icon: Globe,
    title: 'Web Development',
    short: 'Cinematic websites & web apps',
    desc: 'Full-stack web applications built with Next.js, React, and modern APIs. From cinematic landing pages to complex SaaS platforms — fast, accessible, and production-ready.',
  },
  {
    Icon: Smartphone,
    title: 'Mobile Applications',
    short: 'iOS & Android solutions',
    desc: 'Native and cross-platform mobile apps using React Native and Expo. Smooth performance, native feel, and seamless deployment to both app stores.',
  },
  {
    Icon: Palette,
    title: 'Brand & Logo Design',
    short: 'Identity design that resonates',
    desc: 'Logo creation, brand systems, and visual identity design. From concept to final assets — every touchpoint crafted to communicate who you are and why it matters.',
  },
  {
    Icon: Layers,
    title: 'UI/UX Design',
    short: 'Beautiful, intuitive interfaces',
    desc: 'User-centered design that converts. Wireframes, prototypes, and high-fidelity designs crafted for clarity, delight, and measurable business outcomes.',
  },
  {
    Icon: Cpu,
    title: 'AI Systems Engineering',
    short: 'AI-powered operations & automation',
    desc: 'LLM integrations, RAG pipelines, AI video production, and AI-powered healthcare and operations infrastructure. Practical AI that solves real operational problems at scale.',
  },
  {
    Icon: Zap,
    title: 'Intelligent Automation',
    short: 'Workflows & API integrations',
    desc: 'End-to-end automation of business processes — CRM pipelines, WhatsApp API integrations, email flows, and internal tools that save hours every single week.',
  },
  {
    Icon: Code,
    title: 'Enterprise Software',
    short: 'Custom production-grade systems',
    desc: 'Bespoke enterprise software — billing systems, multi-tenant SaaS platforms, internal dashboards, and production-ready digital products built to scale from day one.',
  },
  {
    Icon: Server,
    title: 'Cloud Infrastructure',
    short: 'Scalable server & cloud setup',
    desc: 'Cloud architecture, server provisioning, CI/CD pipelines, and deployment infrastructure. Reliable, secure, and cost-efficient setups on AWS, GCP, and Vercel.',
  },
  {
    Icon: Rocket,
    title: 'Platform Architecture',
    short: 'Scalable system design',
    desc: 'End-to-end platform design for high-growth products — microservices, API gateways, database schemas, and architecture that scales without rewrites.',
  },
  {
    Icon: Database,
    title: 'Data Intelligence',
    short: 'Data solutions & analytics',
    desc: 'Data pipelines, analytics dashboards, reporting systems, and business intelligence tooling that turn raw data into decisions that move the business forward.',
  },
  {
    Icon: Search,
    title: 'SEO & Growth',
    short: 'Search visibility & organic growth',
    desc: 'Technical SEO audits, on-page optimisation, structured data, and performance tuning that push rankings higher and bring qualified traffic consistently.',
  },
  {
    Icon: TrendingUp,
    title: 'Digital Consulting',
    short: 'Strategy for your digital presence',
    desc: 'Technical strategy, product roadmaps, and hands-on consulting to help founders and teams make the right decisions faster and ship with confidence.',
  },
];

const projects = [
  {
    num: "01",
    name: "Talent Axiss",
    desc: "AI-powered CRM built for recruitment agencies — structured pipelines, intelligent workflows, and conversion-focused design.",
    tags: ["CRM", "AI", "SaaS"],
    href: "https://talent-axiss.vercel.app/",
    img: `${SHOT}https://talent-axiss.vercel.app/`,
    year: "2024",
    role: "Full Stack Developer & Designer",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI API", "Prisma", "Tailwind CSS"],
    highlights: [
      "AI-powered candidate scoring and job-matching engine",
      "Drag-and-drop recruitment pipeline with custom stages",
      "Automated email sequences and follow-up scheduling",
      "Real-time analytics dashboard for agency KPIs",
      "Role-based access for recruiters, managers, and clients",
    ],
  },
  {
    num: "02",
    name: "Plenora",
    desc: "Digital platform for a premium cleaning service — clean booking flow, tiered packages, and a professional brand presence.",
    tags: ["Service", "Booking", "Web"],
    href: "https://plenora-service.vercel.app/",
    img: `${SHOT}https://plenora-service.vercel.app/`,
    year: "2024",
    role: "Frontend Developer & Brand Designer",
    tech: ["Next.js", "Framer Motion", "Tailwind CSS", "Vercel"],
    highlights: [
      "Multi-step booking flow with service customization",
      "Tiered service package comparison and upsell UI",
      "Mobile-first responsive design with smooth animations",
      "Integrated contact and instant quote request system",
    ],
  },
  {
    num: "03",
    name: "Khoj Cafe",
    desc: "Hospitality system connecting customer ordering, browsing, and cafe management in one polished interface.",
    tags: ["F&B", "Operations", "UI"],
    href: "https://khoj-cafe.vercel.app/",
    img: `${SHOT}https://khoj-cafe.vercel.app/`,
    year: "2024",
    role: "Full Stack Developer",
    tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    highlights: [
      "Digital menu with category browsing and search",
      "Customer-facing cart and ordering interface",
      "Admin dashboard for menu and order management",
      "Table QR code integration for in-cafe ordering",
    ],
  },
  {
    num: "04",
    name: "Event Kitchen",
    desc: "Wedding and events platform — portfolio-first presentation, inquiry flows, and a brand presence built for high-trust clients.",
    tags: ["Events", "Wedding", "UI"],
    href: "https://event-kitchen.vercel.app/",
    img: `${SHOT}https://event-kitchen.vercel.app/`,
    year: "2024",
    role: "Frontend Developer & Designer",
    tech: ["Next.js", "Framer Motion", "Tailwind CSS", "EmailJS"],
    highlights: [
      "Portfolio gallery with event category filtering",
      "Multi-step inquiry form with package selection",
      "Brand-focused design with high-trust visual language",
      "Testimonials and social proof integration",
    ],
  },
  {
    num: "05",
    name: "London Holidays",
    desc: "Premium travel booking experience built around destination discovery and high-intent tourism buyers.",
    tags: ["Travel", "Booking", "UI"],
    href: "https://london-holidays.vercel.app/",
    img: `${SHOT}https://london-holidays.vercel.app/`,
    year: "2024",
    role: "Frontend Developer",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
    highlights: [
      "Destination discovery with curated tour packages",
      "Date-based availability and dynamic pricing display",
      "Inquiry and booking request flow with confirmation",
      "Immersive visual design with full-screen hero imagery",
    ],
  },
];

const timeline = [
  {
    year: "2023",
    role: "BCA — Computer Applications",
    org: "Bachelor's Degree",
    desc: "Built programming foundations in software engineering, interface design, data structures, and product thinking across three years of applied study.",
    tags: ["Algorithms", "Data Structures", "OOP", "UI Design", "Networking"],
    current: false,
  },
  {
    year: "2023–24",
    role: "Fullstack Developer",
    org: "Independent & Client Work",
    desc: "Shipped production web applications, SaaS tools, and client-ready digital products — handling everything from architecture to deployment.",
    tags: ["React", "Next.js", "Node.js", "PostgreSQL", "Figma", "Vercel"],
    current: false,
  },
  {
    year: "2025",
    role: "Founder & COO",
    org: "Narrs Technologies",
    desc: "Founded and lead Narrs — a technology company building software, AI solutions, and digital transformation systems for businesses.",
    tags: ["Leadership", "Product Strategy", "AI Integration", "Operations", "Team Building"],
    current: true,
  },
  {
    year: "2026",
    role: "Scaling AI & Products",
    org: "Narrs Technologies",
    desc: "Expanding Narrs into intelligent systems, business automation, and scalable growth platforms that bridge strategy and technology.",
    tags: ["AI / ML", "SaaS", "Business Automation", "Growth Systems"],
    current: true,
  },
];


/* ── MagneticButton ── */
function MagneticButton({ href, children, variant = "primary", external = false, isDownload = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.15, y: y * 0.2, duration: 0.35, ease: "power3.out" });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.35)" });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={`magnetic-btn magnetic-btn--${variant}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...(isDownload ? { download: true } : {})}
    >
      {children}
    </a>
  );
}



/* ── SkillBar ── */
function SkillBar({ label, pct, color = '#2547FF', delay = 0 }) {
  const root = useContext(CvScrollRootCtx);
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
        <span style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: '0.6rem', fontWeight: 800, color, letterSpacing: '0.02em' }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.5, root }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
      </div>
    </div>
  );
}

/* ── SkillRing ── */
function SkillRing({ label, pct, color, size = 64, delay = 0 }) {
  const root = useContext(CvScrollRootCtx);
  const r = (size - 8) / 2;
  const circ = parseFloat((2 * Math.PI * r).toFixed(2));
  const dash = parseFloat((circ * pct / 100).toFixed(2));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={4} />
          <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            whileInView={{ strokeDasharray: `${dash} ${circ}` }}
            viewport={{ once: true, amount: 0.5, root }}
            transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '0.68rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{pct}%</span>
      </div>
      <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

/* ── GrowthChart (entry 3) ── */
function GrowthChart({ ML }) {
  const root = useContext(CvScrollRootCtx);
  const circ = 2 * Math.PI * 10;
  return (
    <div>
      <p style={ML}>Company growth</p>
      <svg viewBox="0 0 140 72" style={{ width: '100%', height: 72, display: 'block', marginBottom: 8 }}>
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1="0" y1={f * 72} x2="140" y2={f * 72} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        <motion.polygon points="0,70 28,58 56,46 84,30 112,14 140,4 140,72 0,72"
          fill="rgba(184,224,0,0.13)"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4, root }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.polyline points="0,70 28,58 56,46 84,30 112,14 140,4"
          fill="none" stroke="#b8e000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4, root }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {[[0,70],[28,58],[56,46],[84,30],[112,14],[140,4]].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r={3.5} fill="#b8e000"
            initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4, root }}
            transition={{ delay: 0.5 + i * 0.12, type: 'spring', stiffness: 300, damping: 20 }}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.49rem', color: 'rgba(255,255,255,0.26)', fontWeight: 700, letterSpacing: '0.06em' }}>2025</span>
        <span style={{ fontSize: '0.49rem', color: 'rgba(255,255,255,0.26)', fontWeight: 700, letterSpacing: '0.06em' }}>2026 →</span>
      </div>
    </div>
  );
}

/* ── ScaleChart (entry 4) ── */
function ScaleChart({ ML }) {
  const root = useContext(CvScrollRootCtx);
  return (
    <div>
      <p style={ML}>Scale metrics</p>
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60, marginBottom: 8 }}>
        {[30, 46, 42, 65, 80, 96].map((h, i) => (
          <motion.div key={i}
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.4, root }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: 1, height: `${h}%`, background: `linear-gradient(to top, rgba(34,211,238,${0.4 + i * 0.1}), rgba(34,211,238,${0.15 + i * 0.05}))`, borderRadius: '3px 3px 0 0', transformOrigin: 'bottom' }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['AI','ML','LLM','SaaS','Sys','Auto'].map(t => (
          <span key={t} style={{ flex: 1, fontSize: '0.42rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── ExperienceSection ── */
function ExperienceSection() {
  const ML = { margin: '0 0 14px', fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.26)' };
  const scrollRootRef = useRef(null);

  const entries = [
    {
      ...timeline[0],
      IconEl: GraduationCap,
      accent: '#4e6ef2',
      metric: (
        <div>
          <p style={ML}>Skills acquired</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <SkillRing label="Algorithms" pct={88} color="#4e6ef2" delay={0} />
            <SkillRing label="Design" pct={74} color="#818cf8" delay={0.12} />
            <SkillRing label="Systems" pct={82} color="#6366f1" delay={0.24} />
          </div>
        </div>
      ),
    },
    {
      ...timeline[1],
      IconEl: Code,
      accent: '#a78bfa',
      metric: (
        <div>
          <p style={ML}>Tech proficiency</p>
          <SkillBar label="React / Next.js" pct={93} color="#a78bfa" delay={0} />
          <SkillBar label="Node.js / APIs" pct={88} color="#a78bfa" delay={0.1} />
          <SkillBar label="PostgreSQL" pct={80} color="#a78bfa" delay={0.2} />
          <SkillBar label="UI / Figma" pct={85} color="#a78bfa" delay={0.3} />
        </div>
      ),
    },
    {
      ...timeline[2],
      IconEl: Layers,
      accent: '#b8e000',
      metric: (
        <GrowthChart ML={ML} />
      ),
    },
    {
      ...timeline[3],
      IconEl: Cpu,
      accent: '#22d3ee',
      metric: (
        <ScaleChart ML={ML} />
      ),
    },
  ];

  return (
    <section id="cv" aria-label="Experience" style={{ background: '#05050a', padding: 'clamp(72px,9vw,120px) clamp(24px,6vw,80px)' }}>
      <style>{`
        @keyframes cv-blink { 0%,100%{opacity:1} 50%{opacity:0.28} }
        .cv-row { display:grid; grid-template-columns:120px 1fr 260px; gap:0 48px; padding:clamp(32px,4vw,52px) 0; }
        @media(max-width:960px){ .cv-row{ grid-template-columns:100px 1fr 220px; gap:0 28px; } }
        @media(max-width:720px){ .cv-row{ grid-template-columns:80px 1fr; gap:0 20px; } }
        @media(max-width:460px){ .cv-row{ grid-template-columns:1fr; gap:14px 0; } }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 'clamp(36px,5vw,60px)' }}>
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.28)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>Experience</span>
        </motion.div>
        <div style={{ overflow: 'hidden', marginBottom: 12 }}>
          <motion.h2 initial={{ y: '106%' }} whileInView={{ y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: 'clamp(2.4rem,5vw,5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, margin: 0 }}>
            The journey so far.
          </motion.h2>
        </div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
          3 years · From first line of code to founding a company.
        </motion.p>
      </div>

      {/* ── Timeline entries ── */}
      <CvScrollRootCtx.Provider value={scrollRootRef}>
      <div className="cv-entries-wrap" ref={scrollRootRef}>
      {entries.map((item, i) => (
        <div key={item.year} className="cv-entry-snap">
          {/* Divider line draws in from left on scroll */}
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 1, background: 'rgba(255,255,255,0.08)', originX: 0 }}
          />

          <div className="cv-row">
            {/* ── Left: index + year + icon ── */}
            <div style={{ paddingTop: 4 }}>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.04 }}
                style={{ display: 'block', fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: 'clamp(2rem,2.8vw,3rem)', fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 1, letterSpacing: '-0.05em', marginBottom: 16, userSelect: 'none' }}>
                0{i + 1}
              </motion.span>
              <motion.span initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.07 }}
                style={{ display: 'inline-block', fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: item.accent, background: `${item.accent}16`, border: `1px solid ${item.accent}33`, borderRadius: 999, padding: '4px 11px', marginBottom: 14 }}>
                {item.year}
              </motion.span>
              <motion.div initial={{ opacity: 0, scale: 0.65 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 260, damping: 22 }}
                style={{ width: 34, height: 34, borderRadius: 9, background: `${item.accent}14`, border: `1px solid ${item.accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <item.IconEl size={16} style={{ color: item.accent }} strokeWidth={1.5} />
              </motion.div>
              {item.current && (
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.15 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', animation: 'cv-blink 2.2s ease-in-out infinite', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.49rem', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active</span>
                </motion.div>
              )}
            </div>

            {/* ── Center: role + desc + tags ── */}
            <div>
              <div style={{ overflow: 'hidden', marginBottom: 10 }}>
                <motion.h3 initial={{ y: '108%' }} whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.72, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: 'clamp(1.25rem,2.2vw,2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, margin: 0 }}>
                  {item.role}
                </motion.h3>
              </div>
              <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.48, delay: 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 3, height: 12, borderRadius: 2, background: item.accent, flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.36)' }}>{item.org}</span>
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.14 }}
                style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.46)', lineHeight: 1.84, margin: '0 0 18px', maxWidth: 500 }}>
                {item.desc}
              </motion.p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {item.tags.map((tag, j) => (
                  <motion.span key={tag}
                    initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.38, delay: 0.16 + j * 0.05 }}
                    style={{ fontSize: '0.58rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 11px', letterSpacing: '0.04em' }}>
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* ── Right: metric visualization ── */}
            <motion.div className="cv-metric-col"
              initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.18 }}
              style={{ paddingTop: 4 }}>
              {item.metric}
            </motion.div>
          </div>
        </div>
      ))}
      </div>
      </CvScrollRootCtx.Provider>

      {/* Final divider */}
      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: 1, background: 'rgba(255,255,255,0.08)', originX: 0, marginBottom: 'clamp(40px,5vw,64px)' }}
      />

      {/* ── Bottom stats + download ── */}
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div style={{ display: 'flex', gap: 'clamp(24px,5vw,56px)', flexWrap: 'wrap' }}>
          {[{ num: '3+', label: 'Years' },{ num: 'BCA', label: 'CS Graduate' },{ num: '12+', label: 'Projects' },{ num: '1', label: 'Company' }].map(({ num, label }) => (
            <div key={label}>
              <p style={{ margin: 0, fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: 'clamp(1.5rem,2.6vw,2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{num}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.57rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</p>
            </div>
          ))}
        </div>
        <a href="/cv.pdf" download style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 52, padding: '0 28px', borderRadius: 999, background: '#fff', color: '#0B0B0C', fontSize: '0.86rem', fontWeight: 800, textDecoration: 'none', flexShrink: 0 }}>
          <Download size={14} strokeWidth={2.5} />
          Download CV
        </a>
      </motion.div>
    </section>
  );
}


/* ── ScrambleText — cycles random chars then settles ── */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234!@#$&';
function ScrambleText({ text, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [output, setOutput] = useState(text);
  useEffect(() => {
    if (!inView) return;
    const t0 = setTimeout(() => {
      let frame = 0;
      const id = setInterval(() => {
        setOutput(
          text.split('').map((ch, i) => {
            if (ch === ' ' || ch === '·' || ch === '.' || ch === ',') return ch;
            return i <= frame / 1.6
              ? ch
              : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }).join('')
        );
        frame++;
        if (frame > text.length * 1.7) { setOutput(text); clearInterval(id); }
      }, 30);
    }, delay);
    return () => clearTimeout(t0);
  }, [inView, text, delay]);
  return <span ref={ref} style={style}>{output}</span>;
}

/* ── WavyUnderline — SVG path that draws in on scroll ── */
function WavyUnderline({ color = '#2547FF', delay = 0, wavy = true }) {
  return (
    <svg viewBox="0 0 100 6" preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: -3, left: 0, width: '100%', height: 6, overflow: 'visible', pointerEvents: 'none' }}>
      <motion.path
        d={wavy ? 'M0,3 Q25,0.5 50,3.5 Q75,6 100,3' : 'M0,3 L100,3'}
        fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      />
    </svg>
  );
}

/* ── HomePage ── */
export default function HomePage() {
  const heroRef = useRef(null);
  const lenisRef = useRef(null);
  const [pastHero, setPastHero] = useState(false);

  const [activeSvc, setActiveSvc] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navY = useMotionValue(-100);
  const navOpacity = useMotionValue(0);
  const solidOnce = useRef(false);

  /* per-section scroll visibility */
  const [stmtRef,    stmtVis]    = useVisible(0.3,  0.05);
  const [aboutRef,   aboutVis]   = useVisible(0.08, 0.04);
  const [svcRef,     svcVis]     = useVisible(0.08, 0.04);

  /* Auto-cycle services while section is visible */
  useEffect(() => {
    if (!svcVis) return;
    const id = setInterval(() => {
      setActiveSvc(prev => (prev + 1) % SERVICES.length);
    }, 3000);
    return () => clearInterval(id);
  }, [svcVis]);
  const [narrsRef,   narrsVis]   = useVisible(0.1,  0.04);
  const [visionRef,  visionVis]  = useVisible(0.08, 0.04);
  const [workHdrRef, workHdrVis] = useVisible(0.2,  0.05);
  const [cvRef,      cvVis]      = useVisible(0.08, 0.04);
  const [ctaRef,     ctaVis]     = useVisible(0.15, 0.05);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    let rafId = 0;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); lenisRef.current = null; };
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Page-load entrance */
  useEffect(() => {
    fmAnimate(navY, 0, { duration: 0.75, ease: [0.22, 1, 0.36, 1] });
    fmAnimate(navOpacity, 1, { duration: 0.6, ease: 'easeOut' });
  }, []);

  /* Mark once pastHero fires */
  useEffect(() => {
    if (pastHero) solidOnce.current = true;
  }, [pastHero]);

  /* Mobile only: hide on scroll-down, show on scroll-up */
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (window.innerWidth > 900) return;
      const y = window.scrollY;
      if (y < 80) {
        fmAnimate(navY, 0, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
        fmAnimate(navOpacity, 1, { duration: 0.25 });
      } else if (y > lastY + 6) {
        fmAnimate(navY, -110, { duration: 0.38, ease: [0.22, 1, 0.36, 1] });
        fmAnimate(navOpacity, 0, { duration: 0.25 });
      } else if (y < lastY - 6) {
        fmAnimate(navY, 0, { duration: 0.38, ease: [0.22, 1, 0.36, 1] });
        fmAnimate(navOpacity, 1, { duration: 0.25 });
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="founder-site">

      {/* ── Floating pill navbar ── */}
      <motion.header
        className={`site-header${pastHero ? ' site-header--solid' : ''}`}
        role="banner"
        style={{ y: navY, opacity: navOpacity }}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        {/* Logo */}
        <a className="brand-mark" href="#home" aria-label="Mohammed Raees — home">
          <span className="brand-monogram" aria-hidden="true">MR</span>
          <span className="brand-name">Mohammed Raees</span>
        </a>

        {/* Center nav */}
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>

          {/* Services with dropdown */}
          <div className="nav-dropdown-wrap" onMouseEnter={() => setOpenDropdown('services')} onMouseLeave={() => setOpenDropdown(null)}>
            <a href="#services" className="nav-has-dropdown">
              Services <ChevronDown size={12} strokeWidth={2.5} className={`nav-chevron${openDropdown === 'services' ? ' nav-chevron--open' : ''}`} />
            </a>
            {openDropdown === 'services' && (
              <div className="nav-dropdown">
                <div className="nav-dropdown-grid">
                  {SERVICES.slice(0, 8).map(svc => (
                    <a key={svc.title} href="#services" className="nav-dropdown-item">
                      <span className="nav-dropdown-icon"><svc.Icon size={14} strokeWidth={1.6} /></span>
                      <span>{svc.title}</span>
                    </a>
                  ))}
                </div>
                <a href="#services" className="nav-dropdown-footer">View all services <ArrowRight size={11} strokeWidth={2.5} /></a>
              </div>
            )}
          </div>

          <a href="#narrs">Narrs</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* CTA */}
        <div className="nav-cta-wrap">
          {/* Hamburger — mobile only */}
          <button className="nav-hamburger" aria-label="Menu" onClick={() => setMenuOpen(o => !o)}>
            <span className={`ham-line${menuOpen ? ' ham-open' : ''}`} />
            <span className={`ham-line${menuOpen ? ' ham-open' : ''}`} />
            <span className={`ham-line${menuOpen ? ' ham-open' : ''}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="mobile-nav" onClick={e => e.stopPropagation()}>
            {[['#home','Home'],['#work','Work'],['#about','About'],['#services','Services'],['#narrs','Narrs'],['#contact','Contact']].map(([href, label]) => (
              <a key={href} href={href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <a href="/cv.pdf" download className="mobile-nav-cv">Download CV</a>
          </nav>
        </div>
      )}

      <main>
        {/* ── 1. Hero ── */}
        <Hero sectionRef={heroRef} />

        {/* Wave: hero dark → about white */}
        <div style={{ lineHeight: 0, background: '#fff', marginTop: -1 }}>
          <svg viewBox="0 0 1440 36" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 36 }}>
            <path d="M0,0 C480,36 960,0 1440,0 L1440,36 L0,36 Z" fill="#05050a" />
          </svg>
        </div>

        {/* ── 2. About ── */}
        <section id="about" aria-label="About Mohammed Raees" style={{ background: '#fff', overflow: 'hidden', padding: 'clamp(56px,8vw,104px) clamp(24px,6vw,80px)' }}>
          <style>{`
            .about-v2-grid { display: grid; grid-template-columns: 0.82fr 1.18fr; gap: clamp(40px,6vw,88px); align-items: start; }
            @media (max-width: 820px) { .about-v2-grid { grid-template-columns: 1fr; } }
          `}</style>

          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(24px,3.5vw,40px)' }}
          >
            <span style={{ width: 28, height: 1.5, background: '#0B0B0C', display: 'inline-block' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0B0B0C' }}>About</span>
          </motion.div>

          {/* ── Two-column grid ── */}
          <div className="about-v2-grid">

            {/* LEFT — portrait with decorations */}
            <div style={{ position: 'relative' }}>
              {/* Inner image block */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', aspectRatio: '3/4', background: '#0B0B0C' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/mohammed%20raees%20img.png" alt="Mohammed Raees"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(10%) contrast(1.06) brightness(0.95)' }} />

                {/* Subtle scan-line texture on top half */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', backgroundImage: 'repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(255,255,255,0.018) 3px,rgba(255,255,255,0.018) 4px)', pointerEvents: 'none' }} />

                {/* Bottom gradient for legibility */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.58) 0%, transparent 48%)', pointerEvents: 'none' }} />

                {/* Corner brackets — TL */}
                <div style={{ position: 'absolute', top: 16, left: 16, width: 30, height: 30, borderTop: '2px solid rgba(255,255,255,0.7)', borderLeft: '2px solid rgba(255,255,255,0.7)', pointerEvents: 'none' }} />
                {/* TR */}
                <div style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderTop: '2px solid rgba(255,255,255,0.7)', borderRight: '2px solid rgba(255,255,255,0.7)', pointerEvents: 'none' }} />
                {/* BL — above caption */}
                <div style={{ position: 'absolute', bottom: 68, left: 16, width: 30, height: 30, borderBottom: '2px solid rgba(255,255,255,0.5)', borderLeft: '2px solid rgba(255,255,255,0.5)', pointerEvents: 'none' }} />
                {/* BR */}
                <div style={{ position: 'absolute', bottom: 68, right: 16, width: 30, height: 30, borderBottom: '2px solid rgba(255,255,255,0.5)', borderRight: '2px solid rgba(255,255,255,0.5)', pointerEvents: 'none' }} />

                {/* Diagonal accent line — top-right */}
                <svg style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, pointerEvents: 'none' }} viewBox="0 0 80 80" fill="none">
                  <line x1="80" y1="0" x2="0" y2="80" stroke="rgba(37,71,255,0.35)" strokeWidth="1" />
                  <line x1="80" y1="20" x2="20" y2="80" stroke="rgba(37,71,255,0.18)" strokeWidth="1" />
                </svg>

                {/* Caption */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 20px' }}>
                  <p style={{ margin: 0, fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Kerala, India</p>
                  <p style={{ margin: '3px 0 0', fontSize: '0.85rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Founder · Developer · Operator</p>
                </div>
              </motion.div>

              {/* Floating — available badge (outside overflow:hidden) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', top: 22, right: -16, background: '#fff', borderRadius: 999, padding: '8px 16px', boxShadow: '0 6px 24px rgba(0,0,0,0.13)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(0,0,0,0.06)', zIndex: 2 }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.22)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0B0B0C', whiteSpace: 'nowrap' }}>Available for projects</span>
              </motion.div>

              {/* Floating — year badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', bottom: -18, left: -18, background: '#0B0B0C', borderRadius: 10, padding: '14px 18px', boxShadow: '0 10px 28px rgba(0,0,0,0.22)', zIndex: 2 }}
              >
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.04em' }}>3+</p>
                <p style={{ margin: '3px 0 0', fontSize: '0.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Years building</p>
              </motion.div>
            </div>

            {/* RIGHT — text */}
            <div style={{ paddingTop: 'clamp(32px,3vw,48px)' }}>

              {/* Scramble role line */}
              <div style={{ overflow: 'hidden', marginBottom: 22 }}>
                <motion.div
                  initial={{ y: '115%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ScrambleText
                    text="FULL STACK DEVELOPER · FOUNDER · COO"
                    delay={300}
                    style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.14em', color: '#2547FF', display: 'block' }}
                  />
                </motion.div>
              </div>

              {/* Heading with animated underline on "founder" */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: 'clamp(1.7rem,3vw,2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0B0B0C', lineHeight: 1.1, margin: '0 0 24px' }}
              >
                From software builder to{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  founder
                  <WavyUnderline color="#2547FF" delay={0.7} wavy />
                </span>{' '}
                and operator.
              </motion.h3>

              {/* Bio 1 */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.18 }}
                style={{ fontSize: '0.97rem', color: '#6B6A66', lineHeight: 1.84, margin: '0 0 16px' }}
              >
                I&rsquo;m a fullstack developer and BCA graduate who builds{' '}
                <span style={{ position: 'relative', display: 'inline' }}>
                  SaaS products
                  <WavyUnderline color="#2547FF" delay={0.5} wavy={false} />
                </span>
                , web apps, and immersive digital experiences. As Founder &amp; COO of{' '}
                <strong style={{ color: '#0B0B0C', fontWeight: 700 }}>Narrs Technologies</strong>,
                I connect engineering decisions to business outcomes.
              </motion.p>

              {/* Bio 2 */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.26 }}
                style={{ fontSize: '0.97rem', color: '#6B6A66', lineHeight: 1.84, margin: '0 0 32px' }}
              >
                My work started with writing code and evolved into a broader mission: helping
                businesses use technology with more{' '}
                <span style={{ position: 'relative', display: 'inline' }}>
                  clarity, speed, and intelligence
                  <WavyUnderline color="rgba(11,11,12,0.4)" delay={0.4} wavy={false} />
                </span>
                . Three years in — still building things that matter.
              </motion.p>

              {/* Stats grid */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.32 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 32 }}
              >
                {[
                  { Icon: Layers,     stat: '12+', label: 'Projects'  },
                  { Icon: Zap,        stat: '3+',  label: 'Years'     },
                  { Icon: Cpu,        stat: '2',   label: 'Products'  },
                  { Icon: TrendingUp, stat: '∞',   label: 'Growth'    },
                ].map(({ Icon, stat, label }) => (
                  <div key={label} style={{ textAlign: 'center', padding: '14px 8px', borderRadius: 12, background: '#F7F6F2', border: '1px solid rgba(11,11,12,0.06)' }}>
                    <Icon size={15} strokeWidth={1.6} style={{ color: '#2547FF', margin: '0 auto 7px', display: 'block' }} />
                    <p style={{ margin: 0, fontSize: '1.12rem', fontWeight: 900, color: '#0B0B0C', letterSpacing: '-0.03em', lineHeight: 1 }}>{stat}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '0.55rem', fontWeight: 700, color: '#6B6A66', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Pull quote — border draws in */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.4 }}
                style={{ position: 'relative', paddingLeft: 22 }}
              >
                {/* Animated left border */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#2547FF', transformOrigin: 'top', borderRadius: 2 }}
                />
                <p style={{ margin: 0, fontSize: '1.02rem', fontStyle: 'italic', color: '#0B0B0C', lineHeight: 1.72, fontFamily: 'var(--font-playfair),Georgia,serif', fontWeight: 500 }}>
                  &ldquo;The strongest products aren&rsquo;t built for attention. They remove friction,
                  improve decisions, and create measurable value.&rdquo;
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Wave: about white → services white (subtle dip) */}
        <div style={{ lineHeight: 0, background: '#fff', marginTop: -1 }}>
          <svg viewBox="0 0 1440 28" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 28 }}>
            <path d="M0,14 C480,28 960,0 1440,14 L1440,28 L0,28 Z" fill="#F7F6F2" />
          </svg>
        </div>

        {/* ── Services ── */}
        <section id="services" aria-label="Services" style={{ padding: 'clamp(52px,7vw,96px) clamp(24px,6vw,80px)', background: '#fff' }}>
          <motion.div ref={svcRef} style={{ maxWidth: 1300, margin: '0 auto' }} initial="hidden" animate={svcVis ? 'show' : 'hidden'} variants={stagger}>

            <div style={{ overflow: 'hidden', marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
              <motion.p
                className="section-kicker"
                initial={{ y: '120%' }}
                animate={svcVis ? { y: 0 } : { y: '120%' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ margin: 0 }}
              >
                What I Offer
              </motion.p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 40, textAlign: 'center' }}>
              <div style={{ overflow: 'hidden' }}>
                <motion.h2
                  initial={{ y: '110%' }}
                  animate={svcVis ? { y: 0 } : { y: '110%' }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: 'clamp(1.8rem,3.5vw,3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#0B0B0C', lineHeight: 1.05, margin: 0 }}
                >
                  Premium Services
                </motion.h2>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <motion.p
                  initial={{ y: '110%' }}
                  animate={svcVis ? { y: 0 } : { y: '110%' }}
                  transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{ maxWidth: 480, fontSize: '0.92rem', color: '#6B6A66', lineHeight: 1.65, margin: 0 }}
                >
                  Comprehensive digital solutions tailored to elevate your business
                </motion.p>
              </div>
            </div>

            {/* Cards */}
            <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }} className="svc-cards-grid">
              {SERVICES.map((svc, i) => {
                const isActive = activeSvc === i;
                return (
                  <motion.button
                    key={i}
                    variants={fadeUp}
                    onClick={() => setActiveSvc(i)}
                    aria-expanded={isActive}
                    style={{
                      position: 'relative',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 14, padding: '32px 16px', borderRadius: 16, cursor: 'pointer',
                      border: isActive ? '1.5px solid #0B0B0C' : '1px solid #e8e7e3',
                      background: isActive ? '#0B0B0C' : '#ffffff',
                      color: isActive ? '#fff' : '#4a4947',
                      boxShadow: isActive ? '0 16px 48px rgba(11,11,12,0.18)' : '0 1px 4px rgba(11,11,12,0.06)',
                      transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                      minHeight: 130, overflow: 'hidden',
                    }}
                  >
                    {/* Top accent line */}
                    <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: isActive ? '#fff' : '#0B0B0C', opacity: isActive ? 0.5 : 0.12, borderRadius: 999, transition: 'all 0.25s' }} />
                    {/* Bottom-left small block */}
                    <div style={{ position: 'absolute', bottom: 10, left: 12, width: 5, height: 5, background: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(11,11,12,0.12)', transition: 'all 0.25s' }} />
                    {/* Bottom-right small block */}
                    <div style={{ position: 'absolute', bottom: 10, right: 12, width: 5, height: 5, background: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(11,11,12,0.12)', transition: 'all 0.25s' }} />
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 44, height: 44, borderRadius: 12,
                      background: isActive ? 'rgba(255,255,255,0.14)' : '#f4f3f0',
                      color: isActive ? '#fff' : '#0B0B0C',
                      transition: 'all 0.25s',
                    }}>
                      <svc.Icon size={20} strokeWidth={1.6} />
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '-0.01em', textAlign: 'center', lineHeight: 1.3 }}>{svc.title}</span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSvc}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginTop: 14 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28, padding: '32px 36px', background: '#ffffff', borderRadius: 16, border: '1px solid #e8e7e3', boxShadow: '0 2px 12px rgba(11,11,12,0.06)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 14, background: '#fff', border: '1px solid rgba(11,11,12,0.08)', boxShadow: '0 4px 14px rgba(11,11,12,0.06)', color: '#0B0B0C', flexShrink: 0 }}>
                    {(() => { const S = SERVICES[activeSvc]; return <S.Icon size={26} strokeWidth={1.5} />; })()}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0B0B0C', marginBottom: 4 }}>{SERVICES[activeSvc].title}</h3>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6A66', marginBottom: 14 }}>{SERVICES[activeSvc].short}</p>
                    <p style={{ fontSize: '0.95rem', color: '#6B6A66', lineHeight: 1.75, maxWidth: 680 }}>{SERVICES[activeSvc].desc}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
                      {SERVICES.map((_, i) => (
                        <button key={i} onClick={() => setActiveSvc(i)} style={{ width: i === activeSvc ? 20 : 6, height: 6, borderRadius: 999, background: i === activeSvc ? '#0B0B0C' : 'rgba(11,11,12,0.15)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Wave: services white → narrs dark */}
        <div style={{ lineHeight: 0, background: '#0d0d0f', marginTop: -1 }}>
          <svg viewBox="0 0 1440 36" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 36 }}>
            <path d="M0,0 C480,36 960,0 1440,0 L1440,36 L0,36 Z" fill="#fff" />
          </svg>
        </div>

        {/* ── 3. Narrs ── */}
        <section id="narrs" aria-label="Narrs Technologies" style={{ background: '#0d0d0f', position: 'relative', overflow: 'hidden', padding: 'clamp(80px,10vw,130px) clamp(24px,6vw,80px)' }}>
          {/* Glow blobs */}
          <div style={{ position: 'absolute', top: '5%', left: '-5%', width: 560, height: 560, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(90px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 420, height: 420, background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>

            {/* Two-column top */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,96px)', alignItems: 'start' }} className="narrs-grid">

              {/* Left — text */}
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
                <motion.div variants={fadeDown} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                  <span style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>The Company</span>
                </motion.div>

                <motion.h2 variants={scaleUp} style={{ fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: 'clamp(2.2rem,4vw,4.4rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.035em', color: '#fff', marginBottom: 28 }}>
                  Narrs builds the software layer for modern businesses.
                </motion.h2>

                <motion.p variants={fadeUp} style={{ fontSize: 'clamp(0.88rem,1vw,1rem)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, marginBottom: 32, maxWidth: 480 }}>
                  Narrs is an IT and software company from India. We build SaaS products, web applications, and AI-powered systems that help businesses operate with more speed, clarity, and intelligence.
                </motion.p>

                {/* Tags */}
                <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
                  {['SaaS Products', 'Web Apps', 'AI Systems', 'Mobile', 'UI/UX Design', 'Automation'].map(tag => (
                    <span key={tag} style={{ fontSize: '0.72rem', fontWeight: 600, padding: '7px 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em', background: 'rgba(255,255,255,0.04)' }}>{tag}</span>
                  ))}
                </motion.div>

                <motion.a href="https://narrs.in" target="_blank" rel="noreferrer" variants={scaleUp}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 999, background: '#fff', color: '#0d0d0f', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '-0.01em', textDecoration: 'none' }}>
                  Visit narrs.in
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%', background: '#0d0d0f', color: '#fff' }}>
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </span>
                </motion.a>
              </motion.div>

              {/* Right — stat bento + screenshot */}
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                  {[
                    { num: '10+', label: 'Projects Delivered', sub: 'and counting', r: '14px 0 0 0' },
                    { num: '5+',  label: 'Happy Clients',       sub: 'across industries', r: '0 14px 0 0' },
                    { num: '2026', label: 'Founded',            sub: 'Narrs Technologies', r: '0 0 0 14px' },
                    { num: '∞',   label: 'Ambition',            sub: 'no ceiling', r: '0 0 14px 0' },
                  ].map((s, i) => (
                    <motion.div key={s.num} variants={fadeUp} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: s.r, padding: '28px 24px' }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: 'clamp(2rem,3vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8 }}>{s.num}</span>
                      <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 3 }}>{s.label}</span>
                      <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.04em' }}>{s.sub}</span>
                    </motion.div>
                  ))}
                </div>

                {/* narrs.in screenshot preview */}
                <motion.a href="https://narrs.in" target="_blank" rel="noreferrer" variants={fadeUp}
                  style={{ display: 'block', borderRadius: '0 0 14px 14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', borderTop: 'none', textDecoration: 'none', position: 'relative' }}>
                  <div style={{ height: 190, background: '#111', overflow: 'hidden', position: 'relative' }}>
                    <img src={`${SHOT}https://narrs.in`} alt="narrs.in preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', filter: 'brightness(0.82)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,15,0.65) 0%, transparent 55%)' }} />
                  </div>
                  <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', margin: 0 }}>narrs.in</p>
                      <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.32)', margin: 0, marginTop: 2 }}>Software · AI · Digital Transformation</p>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>
                      <ArrowRight size={14} strokeWidth={1.8} />
                    </span>
                  </div>
                </motion.a>
              </motion.div>
            </div>

            {/* Tech stack marquee */}
            <style>{`
              @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            `}</style>
            <div style={{ marginTop: 72, paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: 24, textAlign: 'center' }}>Tech Stack</p>

              {/* Row 1 → left */}
              <div style={{ overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 10, width: 'max-content', animation: 'marquee 32s linear infinite' }}>
                  {[...STACK_1, ...STACK_1].map((item, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 18px 9px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.04)' }}>
                      <img src={item.icon} alt={item.name} width={18} height={18} style={{ flexShrink: 0, objectFit: 'contain' }} />
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 2 → right (reverse) */}
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: 10, width: 'max-content', animation: 'marquee 28s linear infinite reverse' }}>
                  {[...STACK_2, ...STACK_2].map((item, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 18px 9px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.04)' }}>
                      <img src={item.icon} alt={item.name} width={18} height={18} style={{ flexShrink: 0, objectFit: 'contain' }} />
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3b. Vision ── */}
        <section id="vision" aria-label="Vision and journey" style={{ background: '#05050a', position: 'relative', overflow: 'hidden', padding: 'clamp(88px,11vw,150px) clamp(24px,6vw,80px) clamp(72px,9vw,120px)' }}>
          {/* Wave divider at top */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, lineHeight: 0, pointerEvents: 'none' }}>
            <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ width: '100%', height: 56, display: 'block' }}>
              <path d="M0,32 C480,64 960,0 1440,32 L1440,0 L0,0 Z" fill="#0d0d0f" />
            </svg>
          </div>

          {/* Center glow */}
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)', filter: 'blur(100px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>

            {/* Two-column: left = text, right = orbital */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'clamp(48px,8vw,120px)', alignItems: 'center', marginBottom: 96 }} className="vision-grid">

              {/* Left — text */}
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
                {/* Portrait */}
                <motion.div variants={fadeUp} style={{ marginBottom: 36 }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.18)' }}>
                      <img src="/mohammed%20raees%20img%2C3.PNG" alt="Mohammed Raees" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%', filter: 'brightness(0.88) saturate(0.85)' }} />
                    </div>
                    {/* Online dot */}
                    <span style={{ position: 'absolute', bottom: 4, right: -4, width: 20, height: 20, borderRadius: '50%', background: '#22c55e', border: '2.5px solid #05050a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />
                    </span>
                  </div>
                </motion.div>

                {/* Kicker */}
                <motion.div variants={fadeDown} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <span style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Vision</span>
                </motion.div>

                <motion.h2 variants={scaleUp} style={{ fontFamily: 'var(--font-playfair),Georgia,serif', fontSize: 'clamp(2rem,3.8vw,4rem)', fontWeight: 900, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#fff', marginBottom: 24 }}>
                  Leading Through Vision &amp; Innovation
                </motion.h2>

                <motion.p variants={fadeUp} style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.44)', lineHeight: 1.85, marginBottom: 14, maxWidth: 520 }}>
                  Mohammed Raees is the Founder and Chief Operating Officer of NARRS, focused on creating impactful digital solutions that combine strategy, design, and technology.
                </motion.p>
                <motion.p variants={fadeUp} style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.44)', lineHeight: 1.85, marginBottom: 32, maxWidth: 520 }}>
                  His mission is to help businesses establish powerful digital identities while building innovative products that drive long-term growth. Mohammed bridges the gap between vision and execution.
                </motion.p>

                {/* Expertise pills */}
                <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Full Stack Dev', 'AI Integration', 'Product Strategy', 'UI/UX Design', 'Team Leadership'].map(skill => (
                    <span key={skill} style={{ fontSize: '0.72rem', fontWeight: 600, padding: '7px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>{skill}</span>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right — rotating glass cards orbit */}
              <div className="vision-orbital-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 520, height: 520, flexShrink: 0 }}>

                  {/* Soft ambient glow */}
                  <div style={{ position: 'absolute', inset: '15%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

                  {/* Orbit track */}
                  <div style={{ position: 'absolute', inset: 60, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

                  {/* Rotating ring — dashboard stat cards */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 54, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    {[
                      {
                        label: 'PROJECTS', stat: '12+', accent: '#b8e000',
                        chart: (
                          <svg width="100%" height="26" viewBox="0 0 120 26" preserveAspectRatio="none">
                            {[6, 9, 13, 17, 21, 26].map((h, idx) => (
                              <rect key={idx} x={idx * 20} y={26 - h} width={14} height={h} rx={2.5}
                                fill="#b8e000" fillOpacity={0.18 + idx * 0.14} />
                            ))}
                          </svg>
                        ),
                      },
                      {
                        label: 'AI MODELS', stat: '8', accent: '#a78bfa',
                        chart: (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <svg width="30" height="30" viewBox="0 0 30 30" style={{ flexShrink: 0 }}>
                              <circle cx="15" cy="15" r="11" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="3" />
                              <circle cx="15" cy="15" r="11" fill="none" stroke="#a78bfa" strokeWidth="3"
                                strokeDasharray="55.3 69.1" strokeLinecap="round" transform="rotate(-90 15 15)" />
                              <text x="15" y="19.5" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="white">80%</text>
                            </svg>
                            <div>
                              <p style={{ margin: 0, fontSize: '0.52rem', fontWeight: 700, color: 'rgba(167,139,250,0.85)', lineHeight: 1 }}>Active</p>
                              <p style={{ margin: '2px 0 0', fontSize: '0.46rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1, letterSpacing: '0.04em' }}>Integrations</p>
                            </div>
                          </div>
                        ),
                      },
                      {
                        label: 'MOBILE APPS', stat: '4', accent: '#22d3ee',
                        chart: (
                          <svg width="100%" height="26" viewBox="0 0 120 26" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="oc-cg1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <polygon points="0,26 24,22 48,20 72,12 96,8 120,2 120,26" fill="url(#oc-cg1)" />
                            <polyline points="0,26 24,22 48,20 72,12 96,8 120,2" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                            <circle cx="120" cy="2" r="3" fill="#22d3ee" />
                          </svg>
                        ),
                      },
                      {
                        label: 'SATISFACTION', stat: '98%', accent: '#fb7185',
                        chart: (
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 26 }}>
                            {[38, 50, 44, 60, 55, 74, 98].map((v, idx) => (
                              <div key={idx} style={{ flex: 1, height: (v / 100) * 26, borderRadius: 2.5, background: idx === 6 ? '#fb7185' : `rgba(251,113,133,${0.1 + idx * 0.055})` }} />
                            ))}
                          </div>
                        ),
                      },
                      {
                        label: 'UPTIME', stat: '99.9%', accent: '#b8e000',
                        chart: (
                          <div>
                            <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 5 }}>
                              <div style={{ height: '100%', width: '99.9%', background: 'linear-gradient(90deg, rgba(184,224,0,0.45), #b8e000)', borderRadius: 99 }} />
                            </div>
                            <div style={{ display: 'flex', gap: 2 }}>
                              {Array.from({ length: 15 }).map((_, idx) => (
                                <div key={idx} style={{ flex: 1, height: 5, borderRadius: 1.5, background: idx < 14 ? 'rgba(184,224,0,0.48)' : 'rgba(255,255,255,0.07)' }} />
                              ))}
                            </div>
                          </div>
                        ),
                      },
                      {
                        label: 'GROWTH', stat: '3×', accent: '#a78bfa',
                        chart: (
                          <svg width="100%" height="26" viewBox="0 0 120 26" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="oc-cg2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.32" />
                                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <polygon points="0,26 30,22 60,17 90,10 120,1 120,26" fill="url(#oc-cg2)" />
                            <polyline points="0,26 30,22 60,17 90,10 120,1" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                            <circle cx="120" cy="1" r="3" fill="#a78bfa" />
                          </svg>
                        ),
                      },
                    ].map((card, i) => {
                      const angle = ((i / 6) * 360 - 90) * (Math.PI / 180);
                      const cx = 260 + 200 * Math.cos(angle);
                      const cy = 260 + 200 * Math.sin(angle);
                      return (
                        <div key={card.label} style={{ position: 'absolute', left: cx, top: cy, transform: 'translate(-50%,-50%)' }}>
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 54, repeat: Infinity, ease: 'linear' }}
                            style={{
                              width: 142, height: 90,
                              borderRadius: 12,
                              background: 'rgba(12,12,18,0.94)',
                              border: '1px solid rgba(255,255,255,0.07)',
                              backdropFilter: 'blur(24px)',
                              WebkitBackdropFilter: 'blur(24px)',
                              boxShadow: '0 12px 40px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
                              padding: '10px 12px 10px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            {/* Top accent gradient line */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${card.accent}cc 0%, transparent 65%)` }} />
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <p style={{ margin: 0, fontSize: '0.44rem', fontWeight: 700, color: 'rgba(255,255,255,0.26)', letterSpacing: '0.1em', lineHeight: 1, textTransform: 'uppercase' }}>{card.label}</p>
                                <p style={{ margin: '3px 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{card.stat}</p>
                              </div>
                              <div style={{ width: 5, height: 5, borderRadius: '50%', background: card.accent, boxShadow: `0 0 8px ${card.accent}99`, marginTop: 2, flexShrink: 0 }} />
                            </div>
                            {/* Chart */}
                            <div style={{ width: '100%' }}>{card.chart}</div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </motion.div>

                  {/* Center — Narrs logo */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                    <motion.div
                      animate={{ boxShadow: ['0 0 28px rgba(180,220,40,0.18)', '0 0 56px rgba(180,220,40,0.38)', '0 0 28px rgba(180,220,40,0.18)'] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: 120, height: 120, borderRadius: '50%',
                        background: '#000',
                        border: '1.5px solid rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/narrs-logo.png"
                        alt="Narrs Technologies"
                        style={{ width: '72%', height: '72%', objectFit: 'contain' }}
                      />
                    </motion.div>
                  </div>

                </div>
              </div>
            </div>

            {/* Timeline — connected dots */}
            <div style={{ position: 'relative' }}>
              {/* Connecting line */}
              <div style={{ position: 'absolute', top: 20, left: '12.5%', right: '12.5%', height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.18) 80%, transparent)' }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }} className="vision-timeline-grid">
                {[
                  { year: '2024',   title: 'Started Technology Journey', desc: 'Began exploring full-stack development and modern technologies',  dot: 'rgba(255,255,255,0.4)' },
                  { year: '2025',   title: 'Expanded Solutions',          desc: 'Web & mobile development, AI integration expertise',              dot: 'rgba(255,255,255,0.6)' },
                  { year: '2026',   title: 'Founded NARRS',               desc: 'Building the future of digital innovation',                       dot: '#fff' },
                  { year: 'Future', title: 'Global Vision',               desc: 'Scaling impact across industries worldwide',                      dot: '#a78bfa' },
                ].map((item, i) => (
                  <motion.div
                    key={item.year}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.1 * i }}
                    style={{ padding: '48px 28px 28px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', position: 'relative', textAlign: 'center' }}
                  >
                    {/* Dot */}
                    <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 16, height: 16, borderRadius: '50%', background: item.dot, border: '2.5px solid #05050a', boxShadow: `0 0 16px ${item.dot}` }} />
                    <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 14 }}>{item.year}</span>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: 10, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Wave: vision dark → work beige */}
        <div style={{ lineHeight: 0, background: '#F0EFE9', marginTop: -1 }}>
          <svg viewBox="0 0 1440 36" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 36 }}>
            <path d="M0,0 C480,36 960,0 1440,0 L1440,36 L0,36 Z" fill="#05050a" />
          </svg>
        </div>

        {/* ── 4. Work ── */}
        <section id="work" className="work-section" aria-label="Selected work">
          <div style={{ padding: '0 0 clamp(32px,4vw,56px)' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2547FF', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2547FF', display: 'inline-block' }} />
              Selected Work
            </p>
            <h2 style={{ fontFamily: 'var(--font-croissant),Georgia,serif', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 400, letterSpacing: '-0.03em', color: '#0B0B0C', margin: 0, lineHeight: 1 }}>What I&rsquo;ve shipped.</h2>
          </div>
          <div className="work-grid">
            {projects.map((project, i) => (
              <motion.article
                key={project.name}
                className="project-card"
                initial={{ opacity: 0, y: 48, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.75, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.1 }}
                onClick={() => window.open(project.href, '_blank', 'noreferrer')}
                style={{ cursor: 'pointer' }}
              >
                {/* Screenshot */}
                <div className="project-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.img} alt="" className="project-img" loading="lazy" decoding="async" width={1200} height={630} />
                  <div className="project-img-overlay">
                    <a href={project.href} target="_blank" rel="noreferrer" className="project-visit-btn">Visit site <ArrowRight size={12} strokeWidth={2.4} aria-hidden="true" /></a>
                  </div>
                </div>
                {/* Info */}
                <div className="project-info">
                  <div>
                    <p className="project-num">{project.num}</p>
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-desc">{project.desc}</p>
                  </div>
                  <div className="project-footer">
                    <div className="project-tags">
                      {project.tags.map(tag => <span key={tag} className="project-tag">{tag}</span>)}
                    </div>
                    <a href={project.href} target="_blank" rel="noreferrer" className="project-link">Visit <ArrowRight size={12} strokeWidth={2.4} aria-hidden="true" /></a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Wave: work beige → experience dark */}
        <div style={{ lineHeight: 0, background: '#05050a', marginTop: -1 }}>
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 40 }}>
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,0 L0,0 Z" fill="#F0EFE9" />
          </svg>
        </div>

        {/* ── 5. Experience ── */}
        <ExperienceSection />

        {/* ── Footer ── */}
        <footer className="ft" role="contentinfo" id="contact">

            {/* Top grid */}
            <div className="ft-top">
              {/* Col 1 — tagline + socials */}
              <div className="ft-col ft-col--brand">
                <p className="ft-tagline">We believe great solutions should be accessible to everyone.</p>
                <p className="ft-tagline-sub">For enterprise · For community</p>
                <div className="ft-socials">
                  {[
                    { href: 'https://www.instagram.com/raeeess___?igsh=d3ZrYWJsOWNvbmV3&utm_source=qr', label: 'Instagram', Icon: InstagramIcon },
                    { href: 'https://x.com/raeeeesss?s=11', label: 'X / Twitter', Icon: XIcon },
                    { href: 'https://www.linkedin.com/in/mohammed-raees-9937b634a/', label: 'LinkedIn', Icon: LinkedinIcon },
                    { href: 'https://github.com/raeeeesss', label: 'GitHub', Icon: GithubIcon },
                  ].map(({ href, label, Icon }) => (
                    <a key={label} className="ft-social-btn" href={href} target="_blank" rel="noreferrer" aria-label={label}>
                      <Icon size={14} strokeWidth={1.8} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Col 2 — Explore */}
              <div className="ft-col">
                <p className="ft-col-head">Explore</p>
                <a className="ft-link" href="#about">Featured</a>
                <a className="ft-link" href="#about">About</a>
                <a className="ft-link" href="#services">AI &amp; Systems</a>
                <a className="ft-link" href="#cv">Expertise</a>
              </div>

              {/* Col 3 — Core Expertise */}
              <div className="ft-col">
                <p className="ft-col-head">Core Expertise</p>
                <span className="ft-link">AI Systems Engineering</span>
                <span className="ft-link">Product Engineering</span>
                <span className="ft-link">Intelligent Automation</span>
                <span className="ft-link">Platform Architecture</span>
                <span className="ft-link">Data Intelligence</span>
                <span className="ft-link">Cloud-Native Solutions</span>
              </div>

              {/* Col 4 — Company */}
              <div className="ft-col">
                <p className="ft-col-head">Company</p>
                <a className="ft-link" href="mailto:raeeeesss0@gmail.com">Work with us</a>
                <a className="ft-link" href="https://narrs.in" target="_blank" rel="noreferrer">Company Profile</a>
                <a className="ft-link" href="mailto:raeeeesss0@gmail.com">Contact</a>
                <a className="ft-link" href="https://narrs.in" target="_blank" rel="noreferrer">Official Links</a>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="ft-bottom">
              <p className="ft-copy">&copy; 2026 Mohammed Raees</p>
              <div className="ft-legal">
                <a href="mailto:raeeeesss0@gmail.com" className="ft-legal-link">Contact</a>
                <a href="/cv.pdf" download className="ft-legal-link">Resume</a>
                <a href="https://narrs.in" target="_blank" rel="noreferrer" className="ft-legal-link">Narrs Technologies</a>
              </div>
            </div>

        </footer>


      </main>
    </div>
  );
}
