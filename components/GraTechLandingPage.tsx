import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Power, Command, Key, Activity, Check, Sun, Moon, Loader2, ArrowRight, Globe, Share2, Mail, Send } from 'lucide-react';

// ==================== CONFIG ====================
const THEME = {
  dark: 'bg-[#030303] text-white',
  light: 'bg-[#F5F5F5] text-black',
};

// ==================== LOADING SCREEN ====================
const LoadingScreen = ({ lang }: { lang: 'en' | 'ar' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#030303] text-white z-[100] transition-opacity duration-500">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-[#32B8C6]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#32B8C6] border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-8 h-8 text-[#32B8C6] animate-pulse" />
        </div>
      </div>
      <p className="mt-8 text-lg font-bold animate-pulse font-mono tracking-widest text-[#32B8C6]">
        {lang === 'en' ? 'INITIALIZING SYSTEM...' : '...جاري تهيئة النظام'}
      </p>
      <div className="mt-4 w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-[#32B8C6] w-1/2 animate-[shimmer_1.5s_infinite_linear]"></div>
      </div>
    </div>
  );
};

// ==================== BACKGROUND ====================
const NeuralBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage:
          'linear-gradient(#32B8C6 1px, transparent 1px), linear-gradient(90deg, #32B8C6 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        transform: 'perspective(1500px) rotateX(70deg) translateY(100px) scale(3)',
        maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
      }}
    ></div>
    <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] bg-[#32B8C6]/5 blur-[120px] rounded-full animate-pulse-slow"></div>
  </div>
);

// ==================== SCROLL REVEAL HOOK ====================
const useScrollReveal = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
};

// ==================== HERO SECTION ====================
const HeroSection = ({ lang, onEnter, onDocs }: { lang: 'en' | 'ar'; onEnter: () => void; onDocs: () => void }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`relative pt-32 pb-20 text-center z-10 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#32B8C6]/20 bg-[#32B8C6]/5 backdrop-blur-md mb-8 animate-pulse-slow cursor-default">
        <div className="w-2 h-2 rounded-full bg-[#32B8C6] animate-pulse"></div>
        <span className="text-[#32B8C6] text-xs font-mono font-bold tracking-[0.2em] uppercase">
          {lang === 'en' ? 'System Status: Sovereign' : 'حالة النظام: سيادي'}
        </span>
      </div>

      <h1 className="text-6xl md:text-9xl font-black gradient-text mb-8 leading-[0.9] tracking-tighter">
        GraTech <span className="text-[#D4AF37]">X</span>
      </h1>
      <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed font-light">
        {lang === 'en'
          ? 'Enterprise-grade AI Platform. 15+ Advanced Models. Secure Infrastructure.'
          : 'منصة ذكاء اصطناعي احترافية. أكثر من 15 نموذج متقدم. بنية تحتية آمنة.'}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button onClick={onEnter} className="btn-primary hover-glow px-10 py-5 text-lg font-bold rounded-xl flex items-center justify-center gap-3">
          <Power size={20} />
          {lang === 'en' ? 'Launch Platform' : 'تشغيل المنصة'}
        </button>
        <button onClick={onDocs} className="btn-secondary hover-glow px-10 py-5 text-lg font-bold rounded-xl flex items-center justify-center gap-3">
          <Command size={20} />
          {lang === 'en' ? 'Documentation' : 'التوثيق'}
        </button>
      </div>
    </div>
  );
};

// ==================== SYSTEM MONITOR ====================
const SystemMonitor = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, visible } = useScrollReveal();

  useEffect(() => {
    let unmounted = false;
    const platform = navigator.platform;
    const cores = navigator.hardwareConcurrency || 'Unknown';
    const mem = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'Unknown';
    const res = `${window.screen.width}x${window.screen.height}`;
    const renderer = 'WebGL2';

    const sequence = [
      `Initializing GraTech Client Kernel v3.0...`,
      `[INFO] Platform: ${platform}`,
      `[INFO] CPU Threads: ${cores}`,
      `[INFO] Memory: ${mem}`,
      `[INFO] Resolution: ${res}`,
      `[NET] Secure Connection: TLS 1.3`,
      `[GPU] Graphics: ${renderer}`,
      `[SYS] Status: ONLINE`,
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (unmounted) return;
      if (i < sequence.length) {
        setLogs((prev) => [...prev, sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () => {
      unmounted = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div ref={ref} className={`max-w-5xl mx-auto px-6 py-12 relative z-20 glass rounded-xl shadow-glow transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-[#32B8C6]" />
          <h2 className="text-sm font-bold text-zinc-400 font-mono tracking-widest uppercase">
            {lang === 'en' ? 'System Telemetry' : 'قياسات النظام'}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[#32B8C6] text-xs font-mono">
          <Activity size={14} className="animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="bg-[#0c0c0c]/90 rounded-lg border border-white/10 p-1 font-mono text-xs md:text-sm shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#32B8C6]/20 border border-[#32B8C6]"></div>
          <div className="text-zinc-500">client@browser (local)</div>
        </div>

        <div ref={scrollRef} className="p-6 h-[200px] overflow-y-auto space-y-1.5 custom-scrollbar">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 text-zinc-400 animate-fade-in">
              <span className="text-zinc-700 select-none">{(i + 1).toString().padStart(2, '0')}</span>
              <span>{log}</span>
            </div>
          ))}
          <div className="animate-pulse text-[#32B8C6] mt-2">_</div>
        </div>
      </div>
    </div>
  );
};

// ==================== PRICING ====================
const PricingSection = ({ lang }: { lang: 'en' | 'ar' }) => {
  const { ref, visible } = useScrollReveal();
  const plans = [
    {
      name: lang === 'en' ? 'Starter' : 'البداية',
      price: '$0',
      features: [lang === 'en' ? 'Basic Models' : 'نماذج أساسية', lang === 'en' ? 'Community Support' : 'دعم المجتمع', lang === 'en' ? 'Standard Speed' : 'سرعة قياسية'],
      highlight: false,
    },
    {
      name: lang === 'en' ? 'Professional' : 'محترف',
      price: '$29',
      features: [lang === 'en' ? 'All Models' : 'جميع النماذج', lang === 'en' ? 'Priority Support' : 'دعم أولوية', lang === 'en' ? 'High Speed' : 'سرعة عالية'],
      highlight: true,
    },
    {
      name: lang === 'en' ? 'Enterprise' : 'شركات',
      price: 'Custom',
      features: [lang === 'en' ? 'Dedicated Support' : 'دعم مخصص', lang === 'en' ? 'SLA Guarantee' : 'ضمان SLA', lang === 'en' ? 'Custom Integrations' : 'تكامل مخصص'],
      highlight: false,
    },
  ];
  return (
    <div ref={ref} className={`py-24 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="text-4xl font-bold text-center mb-12 gradient-text">{lang === 'en' ? 'Simple, Transparent Pricing' : 'أسعار بسيطة وواضحة'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {plans.map((plan, i) => (
          <div key={i} className={`glass p-8 rounded-xl shadow-glow hover-glow transition-all relative overflow-hidden group ${plan.highlight ? 'border border-[#32B8C6]' : ''}`}>
            {plan.highlight && (
                <div className="absolute top-0 right-0 bg-[#32B8C6] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {lang === 'en' ? 'POPULAR' : 'شائع'}
                </div>
            )}
            <h3 className={`text-xl font-bold mb-4 ${plan.highlight ? 'text-[#32B8C6]' : 'text-white'}`}>{plan.name}</h3>
            <p className="text-4xl font-bold mb-6 text-white">{plan.price}<span className="text-lg font-normal text-zinc-500">{plan.price !== 'Custom' && (lang === 'en' ? '/mo' : '/شهر')}</span></p>
            <ul className="space-y-4 text-zinc-300 mb-8">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-[#32B8C6]/20 text-[#32B8C6]' : 'bg-white/10 text-zinc-400'}`}>
                        <Check size={12} />
                    </div>
                    {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                plan.highlight 
                  ? 'bg-[#32B8C6] text-black hover:bg-[#208d99] shadow-lg shadow-[#32B8C6]/20' 
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
              }`}>
                {lang === 'en' ? 'Select Plan' : 'اختر الباقة'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== TESTIMONIALS ====================
const Testimonials = ({ lang }: { lang: 'en' | 'ar' }) => {
  const { ref, visible } = useScrollReveal();
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO, TechCorp',
      text: lang === 'en'
        ? 'GraTech X transformed our AI workflows. Secure, fast, and elegant.'
        : 'GraTech X غيّرت طريقة عملنا مع الذكاء الاصطناعي. آمنة وسريعة وأنيقة.',
    },
    {
      name: 'Ahmed Al-Fahad',
      role: 'AI Lead, FutureVision',
      text: lang === 'en'
        ? 'The multi-model orchestration is a game-changer for enterprise AI.'
        : 'تنسيق النماذج المتعددة أحدث ثورة في الذكاء الاصطناعي المؤسسي.',
    },
  ];

  return (
    <div ref={ref} className={`py-24 max-w-6xl mx-auto px-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
        {lang === 'en' ? 'What Our Clients Say' : 'آراء عملائنا'}
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="p-8 glass rounded-xl hover-glow transition-all border border-white/5">
            <p className="text-xl mb-6 text-zinc-300 italic leading-relaxed">“{t.text}”</p>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#32B8C6] to-[#D4AF37] flex items-center justify-center text-black font-bold text-lg">
                    {t.name.charAt(0)}
                </div>
                <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-zinc-500">{t.role}</div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== FAQ ====================
const FAQ = ({ lang }: { lang: 'en' | 'ar' }) => {
  const { ref, visible } = useScrollReveal();
  const faqs = [
    {
      q: lang === 'en' ? 'Is GraTech X secure?' : 'هل GraTech X آمنة؟',
      a: lang === 'en'
        ? 'Yes, it uses TLS 1.3, AES-256 encryption, and Azure Key Vault.'
        : 'نعم، تستخدم TLS 1.3 وتشفير AES-256 وخزنة مفاتيح Azure.',
    },
    {
      q: lang === 'en' ? 'Can I integrate my own data?' : 'هل يمكنني دمج بياناتي؟',
      a: lang === 'en'
        ? 'Absolutely! Upload PDFs or connect your database for custom AI insights.'
        : 'بالتأكيد! يمكنك رفع ملفات PDF أو ربط قاعدة بياناتك للحصول على رؤى مخصصة.',
    },
    {
        q: lang === 'en' ? 'What models are supported?' : 'ما هي النماذج المدعومة؟',
        a: lang === 'en'
          ? 'We support GPT-4o, Llama 3.2, Gemini Pro, Claude 3.5, and more.'
          : 'ندعم GPT-4o و Llama 3.2 و Gemini Pro و Claude 3.5 والمزيد.',
    }
  ];

  return (
    <div ref={ref} className={`py-24 max-w-4xl mx-auto px-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
        {lang === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
      </h2>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <details key={i} className="glass rounded-xl p-6 hover-glow cursor-pointer group">
            <summary className="font-bold text-lg text-white flex justify-between items-center list-none">
                {f.q}
                <span className="text-[#32B8C6] transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-zinc-400 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

// ==================== BLOG SECTION ====================
const BlogSection = ({ lang }: { lang: 'en' | 'ar' }) => {
  const { ref, visible } = useScrollReveal();
  const blogs = [
    {
      title: lang === 'en' ? 'AI Trends in 2025' : 'اتجاهات الذكاء الاصطناعي في 2025',
      excerpt: lang === 'en'
        ? 'Discover the latest advancements in multi-model orchestration and sovereign AI.'
        : 'اكتشف أحدث التطورات في تنسيق النماذج المتعددة والذكاء الاصطناعي السيادي.',
      link: '#',
      date: 'Dec 10, 2025'
    },
    {
      title: lang === 'en' ? 'Securing Enterprise AI' : 'تأمين الذكاء الاصطناعي المؤسسي',
      excerpt: lang === 'en'
        ? 'Learn how GraTech X ensures compliance and security for critical workloads.'
        : 'تعرف كيف تضمن GraTech X الامتثال والأمان للمهام الحرجة.',
      link: '#',
      date: 'Dec 05, 2025'
    },
    {
      title: lang === 'en' ? 'Optimizing AI Costs' : 'تحسين تكاليف الذكاء الاصطناعي',
      excerpt: lang === 'en'
        ? 'Strategies to reduce AI operational costs without compromising performance.'
        : 'استراتيجيات لتقليل تكاليف التشغيل دون التضحية بالأداء.',
      link: '#',
      date: 'Nov 28, 2025'
    },
  ];

  return (
    <div ref={ref} className={`py-24 max-w-6xl mx-auto px-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
        {lang === 'en' ? 'Latest Insights' : 'أحدث المقالات'}
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {blogs.map((blog, i) => (
          <div key={i} className="glass p-6 rounded-xl hover-glow transition-all flex flex-col h-full border border-white/5">
            <span className="text-xs text-[#32B8C6] font-mono mb-2">{blog.date}</span>
            <h3 className="text-xl font-bold mb-4 text-white">{blog.title}</h3>
            <p className="text-zinc-400 mb-6 flex-1 text-sm leading-relaxed">{blog.excerpt}</p>
            <a href={blog.link} className="text-[#32B8C6] font-bold hover:text-white transition-colors flex items-center gap-2 group">
              {lang === 'en' ? 'Read More' : 'اقرأ المزيد'} 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== CALL TO ACTION ====================
const CallToAction = ({ lang, onEnter }: { lang: 'en' | 'ar', onEnter: () => void }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`py-24 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="glass rounded-3xl p-12 shadow-glow border border-[#32B8C6]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#32B8C6]/10 to-[#D4AF37]/10 pointer-events-none"></div>
            <h2 className="text-5xl font-bold gradient-text mb-6 relative z-10">
                {lang === 'en' ? 'Ready to Experience GraTech X?' : 'هل أنت مستعد لتجربة GraTech X؟'}
            </h2>
            <p className="text-lg text-zinc-300 mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
                {lang === 'en'
                ? 'Join thousands of professionals leveraging sovereign AI for secure, scalable solutions.'
                : 'انضم إلى آلاف المحترفين الذين يستخدمون الذكاء الاصطناعي السيادي لحلول آمنة وقابلة للتوسع.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                <button onClick={onEnter} className="btn-primary hover-glow px-10 py-5 text-xl font-bold rounded-xl shadow-lg">
                    {lang === 'en' ? 'Get Started Now' : 'ابدأ الآن'}
                </button>
                <button className="btn-secondary hover-glow px-10 py-5 text-xl font-bold rounded-xl">
                    {lang === 'en' ? 'Contact Sales' : 'تواصل مع المبيعات'}
                </button>
            </div>
        </div>
    </div>
  );
};

// ==================== CONTACT FORM ====================
const ContactForm = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { ref, visible } = useScrollReveal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(lang === 'en' ? 'Something went wrong. Please try again.' : 'حدث خطأ. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className={`py-24 max-w-4xl mx-auto px-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="glass rounded-xl shadow-glow p-8 md:p-12 border border-white/5">
        <h2 className="text-4xl font-bold text-center mb-8 gradient-text">
          {lang === 'en' ? 'Get in Touch' : 'تواصل معنا'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder={lang === 'en' ? 'Your Name' : 'اسمك'}
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#32B8C6] transition-colors"
            />
            <input
              type="email"
              name="email"
              placeholder={lang === 'en' ? 'Your Email' : 'بريدك الإلكتروني'}
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#32B8C6] transition-colors"
            />
          </div>
          <textarea
            name="message"
            placeholder={lang === 'en' ? 'Your Message' : 'رسالتك'}
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full p-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#32B8C6] transition-colors resize-none"
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary hover-glow w-full py-4 text-lg font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading
              ? (lang === 'en' ? 'Sending...' : 'جارٍ الإرسال...')
              : (lang === 'en' ? 'Send Message' : 'أرسل الرسالة')}
          </button>
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-center animate-fade-in">
              {lang === 'en' ? 'Message sent successfully! We will contact you soon.' : 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.'}
            </div>
          )}
          {error && <p className="text-red-400 font-bold mt-4 text-center animate-fade-in">{error}</p>}
        </form>
      </div>
    </div>
  );
};

// ==================== FOOTER ====================
const Footer = ({ lang }: { lang: 'en' | 'ar' }) => (
  <footer className="border-t border-white/5 py-12 text-center bg-[#050505]">
    <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-mono uppercase tracking-widest mb-4">
      <Shield size={12} className="text-[#32B8C6]" />
      {lang === 'en' ? 'Secured by GraTech Enterprise OS' : 'مؤمن بواسطة GraTech Enterprise OS'}
    </div>
    <p className="text-zinc-600 text-xs font-mono">&copy; 2025 GraTech X. All rights reserved.</p>
  </footer>
);

// ==================== MAIN PAGE ====================
export default function GraTechLandingPage({ onEnterApp, onNavigate }: { onEnterApp?: () => void, onNavigate?: (page: string) => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isLoading, setIsLoading] = useState(true);

  const handleEnter = () => {
    if (onEnterApp) onEnterApp();
  };

  const handleDocs = () => {
      if (onEnterApp) onEnterApp();
      if (onNavigate) onNavigate('files');
  }

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
      return <LoadingScreen lang={lang} />;
  }

  return (
    <div className={`${darkMode ? THEME.dark : THEME.light} min-h-screen font-sans transition-all selection:bg-[#32B8C6]/30`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <NeuralBackground />
      <nav className="fixed w-full z-50 glass backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 h-20 transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleEnter}>
            <div className="w-10 h-10 rounded-lg bg-[#32B8C6] flex items-center justify-center font-bold text-black shadow-glow transition-all group-hover:scale-105">
              X
            </div>
            <span className="font-bold text-xl tracking-tight gradient-text">GraTech</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="hover-glow px-4 py-2 rounded-lg border border-[#32B8C6]/30 text-sm font-bold text-[#32B8C6] hover:bg-[#32B8C6] hover:text-black transition-all uppercase tracking-widest">
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="hover-glow p-2 rounded-full border border-[#32B8C6]/30 text-[#32B8C6] transition-transform hover:scale-110">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={handleEnter} className="hidden md:flex btn-primary text-xs px-6 py-2.5 rounded-lg hover-glow items-center gap-2 uppercase tracking-widest">
              <Key size={14} />
              {lang === 'en' ? 'Console' : 'الكونسول'}
          </button>
        </div>
      </nav>

      <HeroSection lang={lang} onEnter={handleEnter} onDocs={handleDocs} />
      <SystemMonitor lang={lang} />
      <PricingSection lang={lang} />
      <Testimonials lang={lang} />
      <FAQ lang={lang} />
      <BlogSection lang={lang} />
      <CallToAction lang={lang} onEnter={handleEnter} />
      <ContactForm lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}