import { useState, useEffect, useRef } from "react";
import {
  Globe, Cloud, RefreshCw, Zap, Smartphone, Lightbulb,
  ArrowRight, ExternalLink, X, Send, Plus, Trash2,
  MessageCircle, Settings, Check, Code2, ChevronRight
} from "lucide-react";
import {
  getProjects, getSectors, getSocialLinks,
  saveContact, saveProject, updateProject, deleteProject,
  updateSocial, uploadImage, adminLogin, adminLogout,
  addSector, removeSector
} from "./supabase.js";

// ═══════════════════════════════════════════════════════
//  TEMPVS7 — Dark Tech / Electric Blue
//  Deep Dark · Cyan Electric · Space Grotesk
// ═══════════════════════════════════════════════════════

const C = {
  bg:  "#04090F",       // base oscuro
  bgC: "#07101E",       // cards
  bgS: "#0A1628",       // superficies
  bgH: "#0D1E38",       // hover
  ac:  "#00B4FF",       // azul eléctrico
  acD: "#0088CC",       // azul más profundo
  acT: "rgba(0,180,255,0.08)",
  acG: "rgba(0,180,255,0.18)",
  brd: "rgba(0,180,255,0.14)",
  brdH:"rgba(0,180,255,0.4)",
  txt: "#D8E8F8",
  mid: "#4A6A88",
  lgt: "#2A4A68",
  wht: "#FFFFFF",
};

const DEF_PROJECTS = [
  { id:1, title:"Portal Coro Misioneros de Jesús", desc:"Plataforma digital integral para gestión coral: asistencia, finanzas, cancionero con transpositor de acordes y control de acceso por roles.", url:"https://portal-coro-mj.vercel.app", imgs:["https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=700&q=80","",""], tags:["React","Supabase","PWA"] },
  { id:2, title:"PropManager", desc:"SaaS para corredores de propiedades en Chile. Gestión de inventario, contratos y finanzas con precios escalonados en UF.", url:"https://prop-manager-rust.vercel.app", imgs:["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80","",""], tags:["React","Node.js","SaaS"] },
  { id:3, title:"Mármoles Licancura", desc:"Sitio web para empresa familiar chilena especializada en mármol, granito y piedra natural. Catálogo de materiales, galería de proyectos, cotizador online y formulario de contacto.", url:"#", imgs:["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80","",""], tags:["React","Vercel","Diseño Web"] },
];

const DEF_SECTORS = ["Fintech","Inmobiliarias","eCommerce","Startups","ONGs","Educación","Manufactura","Salud","Retail","Servicios"];
const DEF_SOCIAL  = { linkedin:"https://www.linkedin.com/in/maximohoingti", instagram:"https://www.instagram.com/maximo.ho07/" };

const SVCS = [
  { icon:Globe,      t:"Desarrollo Web",        d:"Sitios y apps de alto rendimiento con React y Next.js. Arquitectura moderna, velocidad extrema y diseño que convierte.", span:2 },
  { icon:Cloud,      t:"Arquitectura Cloud",    d:"AWS y Azure. Microservicios, contenedores y CI/CD para crecer sin fricciones.", span:1 },
  { icon:RefreshCw,  t:"Modernización Legacy",  d:"COBOL y AS400 hacia plataformas modernas. Migración sin riesgos, con continuidad total.", span:1 },
  { icon:Zap,        t:"Integraciones API",     d:"REST, GraphQL y webhooks. Conectamos sistemas y automatizamos procesos que hoy son manuales.", span:1 },
  { icon:Smartphone, t:"Apps Progresivas",      d:"PWAs con experiencia nativa en cualquier dispositivo. Sin pasar por el App Store.", span:1 },
  { icon:Lightbulb,  t:"Consultoría Tech",      d:"Roadmaps, auditorías y decisiones tecnológicas que realmente importan para tu negocio.", span:1 },
];

// ── ESTILOS ───────────────────────────────────────────────────────
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500&display=swap');
*,::before,::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#04090F;color:#D8E8F8;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#04090F}::-webkit-scrollbar-thumb{background:#00B4FF;border-radius:2px}
@keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes fup{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes sli{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes spn{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes blk{0%,100%{opacity:1}50%{opacity:0}}
@keyframes pulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.9;transform:scale(1.3)}}
@keyframes glow{0%,100%{box-shadow:0 0 8px rgba(0,180,255,.3)}50%{box-shadow:0 0 24px rgba(0,180,255,.7)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
input:focus,textarea:focus,select:focus{outline:1px solid rgba(0,180,255,.6);outline-offset:-1px}
::selection{background:rgba(0,180,255,.25);color:#fff}
@media(max-width:768px){.hero-g{grid-template-columns:1fr!important}.about-g{grid-template-columns:1fr!important}.contact-g{grid-template-columns:1fr!important}.bento{grid-template-columns:1fr!important}.bento>*{grid-column:1!important}.nav-lk{display:none!important}}
`;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ── IMAGEN HERO ───────────────────────────────────────────────────
// Coloca imagen3.jpg en la carpeta /public de tu proyecto
function HeroImage() {
  const tags = ["React","Node.js","AWS","Azure","Supabase","TypeScript","Docker","PostgreSQL"];
  return (
    <div style={{ position:"relative", borderRadius:20, overflow:"hidden", boxShadow:`0 0 80px rgba(0,140,255,.25), 0 0 0 1px ${C.brd}`, animation:"float 6s ease-in-out infinite" }}>
      {/* Imagen principal */}
      <img
        src="/imagen3.jpg"
        alt="Tecnología e Innovación — Tempvs7"
        style={{ width:"100%", display:"block", objectFit:"cover", minHeight:420 }}
        onError={e => { e.target.style.display="none"; }}
      />
      {/* Overlay degradado izquierdo: blend con el fondo oscuro */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(4,9,15,.75) 0%, transparent 45%, rgba(4,9,15,.2) 100%)" }} />
      {/* Tinte azul para unificar con la paleta */}
      <div style={{ position:"absolute", inset:0, background:"rgba(0,80,180,.12)" }} />

      {/* Badge "Disponible" arriba derecha */}
      <div style={{ position:"absolute", top:16, right:16, background:"rgba(4,9,15,.85)", border:`1px solid ${C.ac}`, borderRadius:20, padding:"6px 14px", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", gap:7, boxShadow:`0 0 16px rgba(0,180,255,.3)` }}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:"#22D3EE", display:"inline-block", animation:"pulse 2s ease infinite" }} />
        <span style={{ fontSize:11.5, fontWeight:600, color:C.ac, fontFamily:"'Space Grotesk',sans-serif" }}>Disponible</span>
      </div>

      {/* Tags de tecnologías flotantes abajo */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"40px 18px 18px", background:"linear-gradient(to top, rgba(4,9,15,.95) 40%, transparent 100%)" }}>
        <div style={{ fontSize:10, fontWeight:600, color:C.mid, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10, fontFamily:"'Space Grotesk',sans-serif" }}>Stack tecnológico</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
          {tags.map(t => (
            <span key={t} style={{ fontSize:11, fontWeight:500, padding:"4px 11px", borderRadius:6, background:"rgba(0,180,255,.1)", border:`1px solid rgba(0,180,255,.25)`, color:C.ac, fontFamily:"'Space Grotesk',sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Glow de borde */}
      <div style={{ position:"absolute", inset:0, borderRadius:20, boxShadow:`inset 0 0 0 1px rgba(0,180,255,.2)`, pointerEvents:"none" }} />
    </div>
  );
}

// ── MARK / LOGO PREMIUM ──────────────────────────────────────────
function Mark({ size = 36, text = false }) {
  const s = size;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0, filter:`drop-shadow(0 0 ${s*.18}px rgba(0,180,255,.55))` }}>
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#061828"/>
            <stop offset="100%" stopColor="#030D18"/>
          </linearGradient>
          <linearGradient id="borderGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00D4FF"/>
            <stop offset="55%" stopColor="#00B4FF"/>
            <stop offset="100%" stopColor="#0077CC"/>
          </linearGradient>
          <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60E8FF"/>
            <stop offset="100%" stopColor="#00B4FF"/>
          </linearGradient>
        </defs>
        {/* Hexágono fondo */}
        <polygon points="24,2 42,12 42,36 24,46 6,36 6,12" fill="url(#bgGrad)"/>
        {/* Borde exterior con gradiente */}
        <polygon points="24,2 42,12 42,36 24,46 6,36 6,12" fill="none" stroke="url(#borderGrad)" strokeWidth="1.6"/>
        {/* Borde interior sutil */}
        <polygon points="24,5.5 39,14 39,34 24,42.5 9,34 9,14" fill="none" stroke="rgba(0,180,255,0.14)" strokeWidth="0.8"/>
        {/* Línea decorativa superior */}
        <line x1="14" y1="18" x2="34" y2="18" stroke="rgba(0,180,255,0.25)" strokeWidth="0.7"/>
        {/* T — barra horizontal */}
        <rect x="13" y="20" width="22" height="3.5" rx="1.75" fill="url(#textGrad)"/>
        {/* T — barra vertical */}
        <rect x="20.5" y="20" width="7" height="14" rx="1.75" fill="url(#textGrad)"/>
        {/* 7 — superíndice */}
        <text x="34.5" y="22" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="8.5" fill="#00D4FF" textAnchor="middle" opacity="0.95">7</text>
        {/* Puntos de nodo en vértices */}
        <circle cx="24" cy="2" r="1.2" fill="#00B4FF" opacity="0.7"/>
        <circle cx="42" cy="12" r="1.2" fill="#00B4FF" opacity="0.5"/>
        <circle cx="42" cy="36" r="1.2" fill="#00B4FF" opacity="0.5"/>
        <circle cx="6" cy="12" r="1.2" fill="#00B4FF" opacity="0.5"/>
        <circle cx="6" cy="36" r="1.2" fill="#00B4FF" opacity="0.5"/>
      </svg>
      {text && (
        <div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15.5, letterSpacing:"-.02em", color:C.txt, lineHeight:1 }}>Tempvs7</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:400, fontSize:9, letterSpacing:".18em", color:C.mid, textTransform:"uppercase", marginTop:2 }}>Ingeniería de Software</div>
        </div>
      )}
    </div>
  );
}

// ── NAVBAR ───────────────────────────────────────────────────────
function Navbar({ onAdmin }) {
  const [sc, setSc] = useState(false);
  useEffect(() => { const f = () => setSc(window.scrollY > 40); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  const lnk = [{ l:"Servicios",h:"#servicios" },{ l:"Proyectos",h:"#proyectos" },{ l:"Sobre mí",h:"#about" },{ l:"Contacto",h:"#contacto" }];
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 48px", height:62, display:"flex", alignItems:"center", justifyContent:"space-between", background:sc ? "rgba(4,9,15,.92)" : "transparent", backdropFilter:sc ? "blur(20px)" : "none", borderBottom:sc ? `1px solid ${C.brd}` : "none", transition:"all .35s" }}>
      <Mark text />
      <div className="nav-lk" style={{ display:"flex", gap:32, alignItems:"center" }}>
        {lnk.map(n => (
          <a key={n.l} href={n.h} style={{ color:C.mid, textDecoration:"none", fontSize:14, fontWeight:500, transition:"color .2s" }}
            onMouseEnter={e => e.target.style.color = C.ac} onMouseLeave={e => e.target.style.color = C.mid}>{n.l}</a>
        ))}
        <a href="#contacto" style={{ background:C.ac, color:C.bg, textDecoration:"none", padding:"9px 20px", borderRadius:8, fontSize:13, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif", display:"flex", alignItems:"center", gap:6, transition:"all .2s", boxShadow:`0 0 20px ${C.acG}` }}
          onMouseEnter={e => { e.currentTarget.style.background=C.acD; e.currentTarget.style.boxShadow="none"; }}
          onMouseLeave={e => { e.currentTarget.style.background=C.ac; e.currentTarget.style.boxShadow=`0 0 20px ${C.acG}`; }}>
          Hablemos <ArrowRight size={14} />
        </a>
        <button onClick={onAdmin} style={{ background:"none", border:`1px solid ${C.brd}`, borderRadius:8, width:36, height:36, cursor:"pointer", color:C.mid, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor=C.ac; e.currentTarget.style.color=C.ac; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor=C.brd; e.currentTarget.style.color=C.mid; }}>
          <Settings size={15} />
        </button>
      </div>
    </nav>
  );
}

// ── HERO ────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", paddingTop:62, background:`radial-gradient(ellipse at 20% 10%, rgba(0,100,180,.12) 0%, ${C.bg} 60%)`, position:"relative", overflow:"hidden" }}>
      {/* Partículas de fondo */}
      {Array.from({length:16},(_,i) => (
        <div key={i} style={{ position:"absolute", width:2+Math.random()*3, height:2+Math.random()*3, borderRadius:"50%", background:C.ac, left:`${5+Math.random()*90}%`, top:`${5+Math.random()*90}%`, opacity:.2, animation:`pulse ${3+Math.random()*5}s ease-in-out ${Math.random()*4}s infinite` }} />
      ))}
      {/* Grid de fondo */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.lgt} 1px,transparent 1px),linear-gradient(90deg,${C.lgt} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:.04, pointerEvents:"none" }} />

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"60px 60px", width:"100%", position:"relative", zIndex:1 }}>
        <div className="hero-g" style={{ display:"grid", gridTemplateColumns:"1fr .85fr", gap:70, alignItems:"center" }}>
          <div style={{ animation:"fup .8s ease both" }}>
            {/* Pill status */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`rgba(0,180,255,.06)`, border:`1px solid ${C.brd}`, borderRadius:20, padding:"6px 14px", marginBottom:32 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#22D3EE", display:"inline-block", animation:"pulse 2s ease infinite" }} />
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, fontWeight:500, color:C.ac }}>Disponible para nuevos proyectos</span>
            </div>

            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(42px,5.5vw,76px)", fontWeight:700, lineHeight:1.06, letterSpacing:"-.04em", color:C.txt, marginBottom:24 }}>
              Software que<br />
              <span style={{ color:C.ac, textShadow:`0 0 40px rgba(0,180,255,.35)` }}>hace crecer</span><br />
              negocios.
            </h1>

            <p style={{ fontSize:"clamp(15px,1.4vw,18px)", color:C.mid, lineHeight:1.75, marginBottom:40, maxWidth:500 }}>
              Tech Lead y Cloud Architect con <strong style={{ color:C.txt, fontWeight:500 }}>10+ años</strong> transformando sistemas complejos. Soluciones de clase <strong style={{ color:C.txt, fontWeight:500 }}>enterprise</strong> al alcance de Pymes y emprendedores.
            </p>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:52 }}>
              <button onClick={() => document.getElementById("proyectos")?.scrollIntoView({behavior:"smooth"})} style={{ background:C.ac, color:C.bg, border:"none", padding:"14px 28px", borderRadius:9, fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:`0 0 24px ${C.acG}`, transition:"all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.background=C.acD; e.currentTarget.style.boxShadow="none"; }}
                onMouseLeave={e => { e.currentTarget.style.background=C.ac; e.currentTarget.style.boxShadow=`0 0 24px ${C.acG}`; }}>
                Ver Proyectos <ArrowRight size={16} />
              </button>
              <button onClick={() => document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})} style={{ background:"transparent", color:C.txt, border:`1.5px solid ${C.brd}`, padding:"13px 28px", borderRadius:9, fontFamily:"'Space Grotesk',sans-serif", fontWeight:500, fontSize:14, cursor:"pointer", transition:"all .25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.ac; e.currentTarget.style.color=C.ac; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.brd; e.currentTarget.style.color=C.txt; }}>
                Contactar
              </button>
            </div>

            {/* Stats rápidos */}
            <div style={{ display:"flex", gap:32, borderTop:`1px solid ${C.brd}`, paddingTop:28 }}>
              {[["10+","Años exp."],["15+","Proyectos"],["100%","Compromiso"]].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color:C.ac, letterSpacing:"-.03em" }}>{n}</div>
                  <div style={{ fontSize:12, color:C.mid, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen hero */}
          <div style={{ animation:"fup 1s ease .15s both" }}>
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SERVICIOS (BENTO) ────────────────────────────────────────────
function BentoCard({ svc }) {
  const [hov, setHov] = useState(false);
  const Icon = svc.icon;
  return (
    <div style={{ gridColumn:`span ${svc.span}`, background:hov ? C.bgS : C.bgC, border:`1px solid ${hov ? C.brdH : C.brd}`, borderRadius:16, padding:28, cursor:"default", transition:"all .3s", boxShadow:hov ? `0 0 30px ${C.acT}, inset 0 1px 0 rgba(0,180,255,.1)` : "none" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ width:44, height:44, borderRadius:11, background:hov ? C.acT : `rgba(255,255,255,.04)`, border:`1px solid ${hov ? C.ac : C.brd}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, transition:"all .3s" }}>
        <Icon size={20} color={hov ? C.ac : C.mid} />
      </div>
      <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:600, color:C.txt, marginBottom:10, letterSpacing:"-.02em" }}>{svc.t}</h3>
      <p style={{ fontSize:13.5, color:C.mid, lineHeight:1.72 }}>{svc.d}</p>
      <div style={{ marginTop:18, fontSize:12, fontWeight:500, color:hov ? C.ac : C.lgt, display:"flex", alignItems:"center", gap:5, transition:"color .3s" }}>Saber más <ChevronRight size={13} /></div>
    </div>
  );
}

function Services() {
  return (
    <section id="servicios" style={{ padding:"96px 60px", background:C.bg, borderTop:`1px solid ${C.brd}` }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:52, flexWrap:"wrap", gap:20 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Space Grotesk',sans-serif" }}>— Servicios</div>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(28px,3.5vw,46px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1 }}>
              Todo lo que tu<br />proyecto necesita.
            </h2>
          </div>
          <p style={{ fontSize:14.5, color:C.mid, maxWidth:360, lineHeight:1.72 }}>
            Soluciones completas de ingeniería para empresas que quieren crecer sin depender de equipos internos costosos.
          </p>
        </div>
        <div className="bento" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {SVCS.map((s,i) => <BentoCard key={i} svc={s} />)}
        </div>
      </div>
    </section>
  );
}

// ── SECTORES ─────────────────────────────────────────────────────
function Sectors({ sectors }) {
  const d = [...sectors, ...sectors];
  return (
    <section style={{ padding:"56px 0", background:C.bgC, borderTop:`1px solid ${C.brd}`, overflow:"hidden" }}>
      <div style={{ textAlign:"center", marginBottom:32, padding:"0 60px" }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", fontFamily:"'Space Grotesk',sans-serif" }}>— Sectores que atiendo</div>
      </div>
      <div style={{ position:"relative", overflow:"hidden", padding:"6px 0" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:100, zIndex:2, background:`linear-gradient(to right,${C.bgC},transparent)` }} />
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:100, zIndex:2, background:`linear-gradient(to left,${C.bgC},transparent)` }} />
        <div style={{ display:"flex", gap:14, width:"max-content", animation:"mq 22s linear infinite" }}>
          {d.map((s,i) => (
            <div key={i} style={{ padding:"10px 22px", background:C.acT, border:`1px solid ${C.brd}`, borderRadius:8, whiteSpace:"nowrap", fontFamily:"'Space Grotesk',sans-serif", fontWeight:500, fontSize:13.5, color:C.txt, transition:"all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.ac; e.currentTarget.style.color=C.ac; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.brd; e.currentTarget.style.color=C.txt; }}>
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PROJECT CARD ─────────────────────────────────────────────────
function ProjectCard({ p }) {
  const [hov, setHov] = useState(false);
  const [idx, setIdx] = useState(0);
  const imgs = p.imgs.filter(Boolean);
  return (
    <div style={{ background:C.bgC, border:`1px solid ${hov ? C.brdH : C.brd}`, borderRadius:16, overflow:"hidden", transition:"all .3s", boxShadow:hov ? `0 0 30px ${C.acT}` : "none", transform:hov ? "translateY(-4px)" : "none" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ height:210, overflow:"hidden", position:"relative", background:C.bgS }}>
        {imgs[0] ? (
          <>
            <img src={imgs[idx]} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s", transform:hov?"scale(1.05)":"scale(1)" }} />
            {imgs.length > 1 && (
              <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5 }}>
                {imgs.map((_,i) => <button key={i} onClick={() => setIdx(i)} style={{ width:i===idx?18:6, height:5, borderRadius:3, border:"none", cursor:"pointer", background:i===idx?C.ac:"rgba(255,255,255,.3)", transition:"all .3s", padding:0 }} />)}
              </div>
            )}
          </>
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><Code2 size={36} color={C.lgt} /></div>
        )}
      </div>
      <div style={{ padding:24 }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
          {p.tags.map(t => <span key={t} style={{ fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:5, background:C.acT, color:C.ac, border:`1px solid ${C.brd}` }}>{t}</span>)}
        </div>
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16.5, fontWeight:600, color:C.txt, marginBottom:8, letterSpacing:"-.02em", lineHeight:1.3 }}>{p.title}</h3>
        <p style={{ fontSize:13.5, color:C.mid, lineHeight:1.7, marginBottom:16 }}>{p.desc}</p>
        {p.url && p.url !== "#" && (
          <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:500, color:C.ac, textDecoration:"none" }}>
            Ver proyecto <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function Projects({ projects }) {
  return (
    <section id="proyectos" style={{ padding:"96px 60px", background:C.bg, borderTop:`1px solid ${C.brd}` }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ marginBottom:52 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Space Grotesk',sans-serif" }}>— Proyectos</div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(28px,3.5vw,46px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1 }}>
            Trabajo real.<br />Resultados reales.
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:20 }}>
          {projects.map(p => <ProjectCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}

// ── SOBRE MÍ ─────────────────────────────────────────────────────
function About({ social }) {
  const stack = ["React","Next.js","Node.js","AWS","Azure","Supabase","PostgreSQL","Docker","TypeScript","COBOL/AS400"];
  return (
    <section id="about" style={{ padding:"96px 60px", background:C.bgC, borderTop:`1px solid ${C.brd}` }}>
      <div className="about-g" style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:16, fontFamily:"'Space Grotesk',sans-serif" }}>— Sobre mí</div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(28px,3vw,42px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1, marginBottom:22 }}>
            Maximo Henriquez<br />
            <span style={{ color:C.ac }}>Olivares.</span>
          </h2>
          <p style={{ fontSize:14.5, color:C.mid, lineHeight:1.82, marginBottom:16 }}>
            Tech Lead y Cloud Architect con más de 10 años liderando proyectos de transformación digital en la industria financiera y tecnológica. Especializado en modernizar sistemas críticos y escalarlos hacia la nube.
          </p>
          <p style={{ fontSize:14.5, color:C.mid, lineHeight:1.82, marginBottom:28 }}>
            Con <strong style={{ color:C.txt, fontWeight:500 }}>Tempvs7</strong>, pongo ese nivel de expertise al servicio de Pymes y emprendedores que necesitan soluciones de clase enterprise, sin los costos corporativos.
          </p>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:30 }}>
            {stack.map(t => (
              <span key={t} style={{ padding:"5px 12px", borderRadius:6, fontSize:12, fontWeight:500, border:`1px solid ${C.brd}`, color:C.mid, background:C.acT, transition:"all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.ac; e.currentTarget.style.color=C.ac; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.brd; e.currentTarget.style.color=C.mid; }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding:"10px 20px", borderRadius:8, background:C.ac, color:C.bg, textDecoration:"none", fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:13.5, display:"flex", alignItems:"center", gap:6 }}>
              LinkedIn <ExternalLink size={13} />
            </a>
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" style={{ padding:"9px 20px", borderRadius:8, border:`1px solid ${C.brd}`, color:C.txt, textDecoration:"none", fontFamily:"'Space Grotesk',sans-serif", fontWeight:500, fontSize:13.5, transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.ac; e.currentTarget.style.color=C.ac; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.brd; e.currentTarget.style.color=C.txt; }}>
              Instagram
            </a>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {[["10+","Años de experiencia en la industria"],["15+","Proyectos entregados con éxito"],["100%","Compromiso con cada cliente"],["24h","Tiempo máximo de respuesta"]].map(([n,l]) => (
            <div key={l} style={{ background:C.bgS, border:`1px solid ${C.brd}`, borderRadius:16, padding:26, transition:"all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.ac; e.currentTarget.style.boxShadow=`0 0 20px ${C.acT}`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.brd; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:40, fontWeight:700, color:C.ac, letterSpacing:"-.04em", lineHeight:1, textShadow:`0 0 20px ${C.acG}` }}>{n}</div>
              <div style={{ fontSize:12.5, color:C.mid, marginTop:8, lineHeight:1.5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACTO ─────────────────────────────────────────────────────
function Contact() {
  const [f, setF] = useState({ name:"", email:"", phone:"", service:"", msg:"" });
  const [st, setSt] = useState("idle");
  const inp = { background:C.bgS, border:`1px solid ${C.brd}`, borderRadius:9, padding:"12px 15px", color:C.txt, fontSize:14, width:"100%", fontFamily:"'Inter',sans-serif", boxSizing:"border-box" };
  const sub = async () => {
    if (!f.name || !f.email || !f.msg) return;
    setSt("loading");
    try { await saveContact(f); } catch(e) { console.error(e); }
    await new Promise(r => setTimeout(r,600));
    setSt("ok"); setF({ name:"", email:"", phone:"", service:"", msg:"" });
    setTimeout(() => setSt("idle"), 5000);
  };
  return (
    <section id="contacto" style={{ padding:"96px 60px", background:C.bg, borderTop:`1px solid ${C.brd}` }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div className="contact-g" style={{ display:"grid", gridTemplateColumns:"1fr 1.1fr", gap:80, alignItems:"start" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:16, fontFamily:"'Space Grotesk',sans-serif" }}>— Contacto</div>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(28px,3.5vw,46px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1, marginBottom:20 }}>
              Cuéntame<br />tu proyecto.
            </h2>
            <p style={{ fontSize:14.5, color:C.mid, lineHeight:1.72, marginBottom:40 }}>
              Primera consulta sin costo. Cuéntame qué necesitas y definimos juntos cómo construirlo.
            </p>
            {[{ lbl:"Email", val:"maximo.henriquez@icloud.com", h:"mailto:maximo.henriquez@icloud.com" },{ lbl:"Teléfono", val:"+56 9 4004 2905", h:"tel:+56940042905" },{ lbl:"Ubicación", val:"Santiago de Chile", h:null }].map((item,i) => (
              <div key={i} style={{ marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${C.brd}` }}>
                <div style={{ fontSize:10.5, fontWeight:600, color:C.lgt, letterSpacing:".1em", textTransform:"uppercase", marginBottom:5, fontFamily:"'Space Grotesk',sans-serif" }}>{item.lbl}</div>
                {item.h ? <a href={item.h} style={{ fontSize:15, color:C.txt, textDecoration:"none", fontWeight:500, transition:"color .2s" }} onMouseEnter={e=>e.target.style.color=C.ac} onMouseLeave={e=>e.target.style.color=C.txt}>{item.val}</a>
                  : <span style={{ fontSize:15, color:C.txt, fontWeight:500 }}>{item.val}</span>}
              </div>
            ))}
          </div>
          <div style={{ background:C.bgC, border:`1px solid ${C.brd}`, borderRadius:18, padding:36 }}>
            {st === "ok" ? (
              <div style={{ textAlign:"center", padding:"44px 0" }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:C.acT, border:`1px solid ${C.ac}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", boxShadow:`0 0 24px ${C.acG}` }}>
                  <Check size={24} color={C.ac} />
                </div>
                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:C.txt, marginBottom:8 }}>¡Mensaje enviado!</h3>
                <p style={{ color:C.mid, fontSize:14 }}>Te contactaré en menos de 24 horas.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div><label style={{ fontSize:11.5, fontWeight:500, color:C.mid, display:"block", marginBottom:6 }}>Nombre *</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Tu nombre" style={inp}/></div>
                  <div><label style={{ fontSize:11.5, fontWeight:500, color:C.mid, display:"block", marginBottom:6 }}>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} placeholder="tu@email.com" style={inp}/></div>
                </div>
                <div><label style={{ fontSize:11.5, fontWeight:500, color:C.mid, display:"block", marginBottom:6 }}>Teléfono</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} placeholder="+56 9 XXXX XXXX" style={inp}/></div>
                <div>
                  <label style={{ fontSize:11.5, fontWeight:500, color:C.mid, display:"block", marginBottom:6 }}>Servicio</label>
                  <select value={f.service} onChange={e=>setF({...f,service:e.target.value})} style={{ ...inp, background:C.bgS }}>
                    <option value="">¿En qué te puedo ayudar?</option>
                    <option>Desarrollo Web</option><option>Arquitectura Cloud</option>
                    <option>Modernización Legacy</option><option>Integraciones API</option>
                    <option>App Progresiva (PWA)</option><option>Consultoría Tech</option>
                  </select>
                </div>
                <div><label style={{ fontSize:11.5, fontWeight:500, color:C.mid, display:"block", marginBottom:6 }}>Mensaje *</label><textarea value={f.msg} onChange={e=>setF({...f,msg:e.target.value})} placeholder="Cuéntame sobre tu proyecto..." rows={4} style={{ ...inp, resize:"vertical" }}/></div>
                <button onClick={sub} disabled={st==="loading"} style={{ background:C.ac, color:C.bg, border:"none", padding:"14px", borderRadius:9, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:14.5, display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 0 24px ${C.acG}`, transition:"all .25s" }}
                  onMouseEnter={e=>{ if(st!=="loading"){e.currentTarget.style.background=C.acD;e.currentTarget.style.boxShadow="none";}}}
                  onMouseLeave={e=>{ if(st!=="loading"){e.currentTarget.style.background=C.ac;e.currentTarget.style.boxShadow=`0 0 24px ${C.acG}`;}}}>
                  {st==="loading"?<><div style={{ width:16,height:16,border:"2px solid rgba(0,0,0,.3)",borderTopColor:C.bg,borderRadius:"50%",animation:"spn 1s linear infinite" }}/>Enviando...</>:<>Enviar Mensaje <Send size={15}/></>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ───────────────────────────────────────────────────────
function Footer({ social, onAdmin }) {
  return (
    <footer style={{ background:"#020508", padding:"52px 60px 36px", borderTop:`1px solid ${C.brd}` }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:36, flexWrap:"wrap", gap:20 }}>
          <Mark text />
          <div style={{ display:"flex", gap:10 }}>
            {[{l:"LinkedIn",h:social.linkedin},{l:"Instagram",h:social.instagram}].map(s => (
              <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer" style={{ padding:"8px 18px", borderRadius:7, fontSize:13, border:`1px solid ${C.brd}`, color:C.mid, textDecoration:"none", transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.ac;e.currentTarget.style.color=C.ac;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.brd;e.currentTarget.style.color=C.mid;}}>{s.l}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop:`1px solid ${C.brd}`, paddingTop:28, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ color:C.lgt, fontSize:13 }}>© 2025 Tempvs7 · Maximo Henriquez Olivares · Santiago, Chile</p>
          <span style={{ color:C.lgt, fontSize:11, cursor:"pointer", opacity:.4 }} onClick={onAdmin}>admin</span>
        </div>
      </div>
    </footer>
  );
}

// ── CHATBOT ──────────────────────────────────────────────────────
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ r:"a", c:"Hola 👋 Soy el asistente de Tempvs7. ¿En qué puedo ayudarte? Cuéntame sobre tu proyecto." }]);
  const [inp, setInp] = useState(""); const [load, setLoad] = useState(false);
  const end = useRef(null);
  useEffect(() => { if(open) end.current?.scrollIntoView({behavior:"smooth"}); }, [msgs, open]);
  const send = async () => {
    if (!inp.trim() || load) return;
    const txt = inp.trim(); setInp(""); setMsgs(p => [...p, {r:"u",c:txt}]); setLoad(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:500,
          system:`Eres el asistente virtual de Tempvs7, la marca de ingeniería de software de Maximo Henriquez Olivares, Tech Lead en Santiago, Chile. Servicios: Desarrollo Web, Cloud AWS/Azure, Modernización Legacy, APIs, PWA, Consultoría. Atendemos Pymes y particulares. Contacto: maximo.henriquez@icloud.com | +56 9 4004 2905. Responde en español (inglés si lo piden). Sé conciso, profesional y directo. Si hay interés concreto, invita a usar el formulario de contacto.`,
          messages: msgs.concat({r:"u",c:txt}).map(m => ({role:m.r==="u"?"user":"assistant",content:m.c})),
        })
      });
      const d = await res.json();
      setMsgs(p => [...p, {r:"a",c:d.content?.[0]?.text||"Hubo un error. Escríbeme a maximo.henriquez@icloud.com"}]);
    } catch { setMsgs(p => [...p, {r:"a",c:"Error de conexión. Escríbeme a maximo.henriquez@icloud.com"}]); }
    setLoad(false);
  };
  return (
    <>
      {open && (
        <div style={{ position:"fixed", bottom:80, right:20, width:340, zIndex:200, borderRadius:16, overflow:"hidden", boxShadow:`0 24px 64px rgba(0,0,0,.5), 0 0 0 1px ${C.brd}`, background:C.bgC, animation:"sli .3s ease" }}>
          <div style={{ padding:"14px 16px", background:C.bgS, borderBottom:`1px solid ${C.brd}`, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:C.acT, border:`1px solid ${C.ac}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12, color:C.ac }}>T7</span>
            </div>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:13, color:C.txt }}>Asistente Tempvs7</div>
              <div style={{ fontSize:10.5, color:C.mid, display:"flex", alignItems:"center", gap:4 }}><span style={{ width:5,height:5,borderRadius:"50%",background:"#22D3EE",display:"inline-block" }}/> En línea</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:C.mid }}><X size={16}/></button>
          </div>
          <div style={{ height:290, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:10 }}>
            {msgs.map((m,i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.r==="u"?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"82%", padding:"9px 13px", borderRadius:m.r==="u"?"12px 3px 12px 12px":"3px 12px 12px 12px", background:m.r==="u"?C.ac:C.bgS, color:m.r==="u"?C.bg:C.txt, fontSize:13, lineHeight:1.55, border:m.r==="u"?"none":`1px solid ${C.brd}` }}>{m.c}</div>
              </div>
            ))}
            {load && <div style={{ display:"flex", gap:4, padding:"6px 10px" }}>{[0,1,2].map(i => <div key={i} style={{ width:6,height:6,borderRadius:"50%",background:C.ac,animation:`blk 1s ease ${i*.18}s infinite` }}/>)}</div>}
            <div ref={end}/>
          </div>
          <div style={{ padding:"10px 12px", borderTop:`1px solid ${C.brd}`, display:"flex", gap:8, background:C.bgS }}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escribe tu consulta..." style={{ flex:1, background:C.bgC, border:`1px solid ${C.brd}`, borderRadius:8, padding:"9px 12px", color:C.txt, fontSize:13, fontFamily:"'Inter',sans-serif" }}/>
            <button onClick={send} disabled={load||!inp.trim()} style={{ width:36,height:36,borderRadius:8,border:"none",background:inp.trim()&&!load?C.ac:C.bgH,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}>
              <Send size={14} color={inp.trim()&&!load?C.bg:C.lgt}/>
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(p=>!p)} style={{ position:"fixed",bottom:20,right:20,zIndex:200,width:50,height:50,borderRadius:12,border:`1px solid ${C.brd}`,background:open?C.bgS:C.ac,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:open?"none":`0 0 24px ${C.acG}`,transition:"all .25s" }}
        onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.08)";}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}>
        {open?<X size={18} color={C.ac}/>:<MessageCircle size={18} color={C.bg}/>}
      </button>
    </>
  );
}

// ── IMAGE UPLOADER ────────────────────────────────────────────────
function ImageUploader({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch(e) {
      alert("Error al subir. Verifica que el bucket 'images' sea público en Supabase → Storage.");
    }
    setUploading(false);
  };

  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ fontSize:11, fontWeight:500, color:C.mid, display:"block", marginBottom:6 }}>{label}</label>
      {value && (
        <div style={{ position:"relative", marginBottom:8 }}>
          <img src={value} alt="" style={{ width:"100%", height:120, objectFit:"cover", borderRadius:9, display:"block", border:`1px solid ${C.brd}` }} />
          <button onClick={() => onChange("")} style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,.7)", border:"none", borderRadius:"50%", width:24, height:24, cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X size={12}/>
          </button>
        </div>
      )}
      <div style={{ display:"flex", gap:8 }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
          onChange={e => handleFile(e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
          background:uploading ? C.bgH : C.acT, border:`1px solid ${C.brd}`, borderRadius:8,
          padding:"9px 14px", cursor:uploading ? "not-allowed" : "pointer",
          color:uploading ? C.mid : C.ac, fontSize:12, fontWeight:600,
          fontFamily:"'Space Grotesk',sans-serif", display:"flex", alignItems:"center",
          gap:6, flexShrink:0, whiteSpace:"nowrap", transition:"all .2s",
        }}>
          {uploading
            ? <><div style={{ width:12,height:12,border:"2px solid rgba(0,180,255,.3)",borderTopColor:C.ac,borderRadius:"50%",animation:"spn 1s linear infinite" }}/>Subiendo...</>
            : "↑ Subir foto"}
        </button>
        <input value={value} onChange={e => onChange(e.target.value)}
          placeholder="O pega una URL..."
          style={{ flex:1, background:C.bgS, border:`1px solid ${C.brd}`, borderRadius:8,
            padding:"9px 12px", color:C.txt, fontSize:12, fontFamily:"'Inter',sans-serif" }} />
      </div>
    </div>
  );
}

// ── ADMIN ────────────────────────────────────────────────────────
function Admin({ data, onSave, onClose }) {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    if (!email || !pwd) return;
    setLoginLoading(true); setLoginError("");
    try {
      await adminLogin(email, pwd);
      setAuth(true);
    } catch(e) {
      setLoginError("Email o contraseña incorrectos");
    }
    setLoginLoading(false);
  };

  const handleClose = async () => {
    await adminLogout();
    onClose();
  };
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState(data.projects);
  const [sectors, setSectors] = useState(data.sectors);
  const [social, setSocial] = useState({...data.social});
  const [np, setNp] = useState({ title:"", desc:"", url:"", imgs:["","",""], tags:"" });
  const [editingId, setEditingId] = useState(null);

  const startEdit = (p) => {
    setEditingId(p.id);
    setNp({ title:p.title, desc:p.desc, url:p.url==="*"?"":p.url||"", imgs:[...p.imgs], tags:p.tags.join(", ") });
  };
  const cancelEdit = () => { setEditingId(null); setNp({ title:"", desc:"", url:"", imgs:["","",""], tags:"" }); };
  const [ns, setNs] = useState("");
  // Admin usa tema claro para mejor legibilidad
  const A = {
    bg:"#FFFFFF", surface:"#F4F6F9", border:"#DDE1E8",
    text:"#1A1D23", mid:"#6B7280", ac:C.ac,
  };
  const is = { background:A.surface, border:`1px solid ${A.border}`, borderRadius:8, padding:"10px 14px", color:A.text, fontSize:13, width:"100%", fontFamily:"'Inter',sans-serif", marginBottom:10, boxSizing:"border-box" };
  const tb = t => ({ padding:"10px 16px", border:"none", borderBottom:tab===t?`2px solid ${A.ac}`:"2px solid transparent", background:A.bg, cursor:"pointer", fontSize:13, fontWeight:500, color:tab===t?A.ac:A.mid, fontFamily:"'Space Grotesk',sans-serif", transition:"color .2s" });
  if (!auth) return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(2,5,10,.9)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.bgC, border:`1px solid ${C.brd}`, borderRadius:20, padding:44, textAlign:"center", maxWidth:380, width:"100%", margin:24, boxShadow:`0 0 60px ${C.acT}` }}>
        <Mark size={52}/><div style={{ height:20 }}/>
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:C.txt, marginBottom:6 }}>Panel Admin</h3>
        <p style={{ fontSize:13, color:C.mid, marginBottom:28 }}>Acceso con tu cuenta Supabase</p>
        <div style={{ textAlign:"left", marginBottom:12 }}>
          <label style={{ fontSize:11, fontWeight:500, color:C.mid, display:"block", marginBottom:5 }}>EMAIL</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="admin@tudominio.com"
            style={{ ...is, marginBottom:0 }}/>
        </div>
        <div style={{ textAlign:"left", marginBottom:20 }}>
          <label style={{ fontSize:11, fontWeight:500, color:C.mid, display:"block", marginBottom:5 }}>CONTRASEÑA</label>
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="••••••••"
            style={{ ...is, marginBottom:0 }}/>
        </div>
        {loginError && <p style={{ color:"#F87171", fontSize:12, marginBottom:14 }}>{loginError}</p>}
        <button onClick={handleLogin} disabled={loginLoading} style={{
          background:C.ac, color:C.bg, border:"none", padding:"13px", borderRadius:9,
          cursor:loginLoading?"not-allowed":"pointer", fontFamily:"'Space Grotesk',sans-serif",
          fontWeight:600, fontSize:14, width:"100%", marginBottom:12,
          opacity:loginLoading?.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8
        }}>
          {loginLoading
            ? <><div style={{ width:16,height:16,border:"2px solid rgba(0,0,0,.3)",borderTopColor:C.bg,borderRadius:"50%",animation:"spn 1s linear infinite" }}/>Verificando...</>
            : "Ingresar"}
        </button>
        <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:C.mid,fontSize:13 }}>Cancelar</button>
      </div>
    </div>
  );
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.55)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:A.bg, borderRadius:20, width:"100%", maxWidth:680, maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,.3)" }}>
        <div style={{ padding:"16px 24px", borderBottom:`1px solid ${A.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:A.bg }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}><Mark size={32} text/><span style={{ color:A.mid, fontSize:13 }}>/ Admin</span></div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={async () => {
              try { await updateSocial(social); } catch(e) { console.error(e); }
              onSave({ projects, sectors, social });
            }} style={{ background:A.ac,color:"#fff",border:"none",padding:"8px 18px",borderRadius:8,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:13 }}>Guardar</button>
            <button onClick={handleClose} style={{ background:A.surface,border:`1px solid ${A.border}`,borderRadius:8,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><X size={15} color={A.mid}/></button>
          </div>
        </div>
        <div style={{ display:"flex", borderBottom:`1px solid ${A.border}`, padding:"0 16px", background:A.bg }}>
          {["projects","sectors","social"].map(t => <button key={t} style={tb(t)} onClick={() => setTab(t)}>{{ projects:"Proyectos", sectors:"Sectores", social:"Redes" }[t]}</button>)}
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:24, background:A.bg }}>
          {tab==="projects" && (
            <div>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:600, color:C.txt, marginBottom:14 }}>
                {editingId ? "Editar Proyecto" : "Nuevo Proyecto"}
              </p>
              <input value={np.title} onChange={e=>setNp({...np,title:e.target.value})} placeholder="Título *" style={is}/>
              <textarea value={np.desc} onChange={e=>setNp({...np,desc:e.target.value})} placeholder="Descripción" rows={2} style={{...is,resize:"vertical"}}/>
              <input value={np.url} onChange={e=>setNp({...np,url:e.target.value})} placeholder="URL del proyecto (dejar vacío para no mostrar)" style={is}/>
              <input value={np.tags} onChange={e=>setNp({...np,tags:e.target.value})} placeholder="Tags: React, AWS, Node.js" style={is}/>
              <ImageUploader label="Imagen principal *" value={np.imgs[0]}
                onChange={v=>setNp({...np,imgs:[v,np.imgs[1],np.imgs[2]]})} />
              <ImageUploader label="Imagen 2 (opcional)" value={np.imgs[1]}
                onChange={v=>setNp({...np,imgs:[np.imgs[0],v,np.imgs[2]]})} />
              <ImageUploader label="Imagen 3 (opcional)" value={np.imgs[2]}
                onChange={v=>setNp({...np,imgs:[np.imgs[0],np.imgs[1],v]})} />
              <div style={{ display:"flex", gap:8, marginBottom:24 }}>
                <button onClick={async () => {
                  if(!np.title) return;
                  const tags = np.tags.split(",").map(t=>t.trim()).filter(Boolean);
                  if(editingId) {
                    const updated = {...np, id:editingId, tags};
                    try { await updateProject(updated); } catch(e) { console.error(e); }
                    setProjects(projects.map(x => x.id===editingId ? updated : x));
                    cancelEdit();
                  } else {
                    const p = {id:Date.now(),...np,tags};
                    try { await saveProject(p); } catch(e) { console.error(e); }
                    setProjects([...projects, p]);
                    setNp({title:"",desc:"",url:"",imgs:["","",""],tags:""});
                  }
                }} style={{ background:A.ac,color:"#fff",border:"none",padding:"9px 20px",borderRadius:8,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6 }}>
                  {editingId ? <><Check size={14}/> Guardar cambios</> : <><Plus size={14}/> Agregar</>}
                </button>
                {editingId && (
                  <button onClick={cancelEdit} style={{ background:"transparent",border:`1px solid ${A.border}`,color:A.mid,padding:"9px 16px",borderRadius:8,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontSize:13 }}>
                    Cancelar
                  </button>
                )}
              </div>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, fontWeight:600, color:A.mid, marginBottom:10, letterSpacing:".08em", textTransform:"uppercase" }}>Proyectos actuales</p>
              {projects.map(p => (
                <div key={p.id} style={{ background:A.surface, border:`1px solid ${editingId===p.id ? A.ac : A.border}`, borderRadius:10, padding:"12px 16px", marginBottom:8, transition:"border-color .2s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:13, color:A.text, marginBottom:2 }}>{p.title}</div>
                      <div style={{ color:p.url && p.url!=="*" ? C.ac : C.mid, fontSize:11.5 }}>{p.url && p.url!=="*" ? p.url : "Sin URL pública"}</div>
                    </div>
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      <button onClick={() => startEdit(p)} style={{ background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:7,padding:"5px 12px",cursor:"pointer",color:"#4338CA",fontSize:12,fontWeight:500 }}>Editar</button>
                      <button onClick={async () => { try { await deleteProject(p.id); } catch(e){} setProjects(projects.filter(x=>x.id!==p.id)); }} style={{ background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:7,padding:"5px 10px",cursor:"pointer",display:"flex",alignItems:"center" }}><Trash2 size={13} color="#F87171"/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab==="sectors" && (
            <div>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:600, color:A.text, marginBottom:6 }}>Sectores que atiendes</p>
              <p style={{ fontSize:12, color:A.mid, marginBottom:18 }}>Aparecen en el carrusel del sitio. Ej: Fintech, Inmobiliarias, Startups.</p>
              <div style={{ display:"flex", gap:8, marginBottom:24 }}>
                <input value={ns} onChange={e=>setNs(e.target.value)}
                  onKeyDown={async e=>{ if(e.key==="Enter"&&ns.trim()){ try{await addSector(ns.trim());}catch(err){console.error(err);} setSectors([...sectors,ns.trim()]); setNs(""); }}}
                  placeholder="Ej: Tecnología, Retail..." style={{...is,marginBottom:0,flex:1}}/>
                <button onClick={async()=>{ if(!ns.trim())return; try{await addSector(ns.trim());}catch(err){console.error(err);} setSectors([...sectors,ns.trim()]); setNs(""); }}
                  style={{ background:A.ac,color:"#fff",border:"none",padding:"0 18px",borderRadius:8,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:13,flexShrink:0,display:"flex",alignItems:"center",gap:5 }}>
                  <Plus size={14}/>Agregar
                </button>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {sectors.map((s,i) => (
                  <div key={i} style={{ background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:20,padding:"7px 15px",display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:500,color:"#3730A3" }}>
                    {s}
                    <button onClick={async()=>{ try{await removeSector(s);}catch(err){console.error(err);} setSectors(sectors.filter((_,x)=>x!==i)); }}
                      style={{ background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",opacity:.6 }}>
                      <X size={13} color="#6B7280"/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==="social" && (
            <div>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:600, color:A.text, marginBottom:20 }}>Redes Sociales</p>
              {[{k:"linkedin",lbl:"LinkedIn URL"},{k:"instagram",lbl:"Instagram URL"}].map(s => (
                <div key={s.k}><label style={{ fontSize:12,fontWeight:500,color:A.mid,display:"block",marginBottom:6 }}>{s.lbl}</label><input value={social[s.k]||""} onChange={e=>setSocial({...social,[s.k]:e.target.value})} placeholder={`URL de ${s.lbl}`} style={is}/></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ─────────────────────────────────────────────────────
export default function App() {
  const [admin, setAdmin] = useState(false);
  const [data, setData] = useState({ projects:DEF_PROJECTS, sectors:DEF_SECTORS, social:DEF_SOCIAL });

  useEffect(() => {
    // Cargar datos desde Supabase
    getProjects().then(p => setData(d => ({...d, projects:p}))).catch(() => {});
    getSectors().then(s => setData(d => ({...d, sectors:s}))).catch(() => {});
    getSocialLinks().then(s => setData(d => ({...d, social:s}))).catch(() => {});
    // Atajo teclado admin
    const fn = e => { if(e.ctrlKey&&e.shiftKey&&e.key==="A") setAdmin(true); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  return (
    <>
      <GlobalStyles/>
      <Navbar onAdmin={() => setAdmin(true)}/>
      <Hero/>
      <Services/>
      <Sectors sectors={data.sectors}/>
      <Projects projects={data.projects}/>
      <About social={data.social}/>
      <Contact/>
      <Footer social={data.social} onAdmin={() => setAdmin(true)}/>
      <ChatBot/>
      {admin && <Admin data={data} onSave={d=>{setData(d);setAdmin(false);}} onClose={() => setAdmin(false)}/>}
    </>
  );
}
