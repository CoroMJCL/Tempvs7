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
  brd: "rgba(0,180,255,0.18)",
  brdH:"rgba(0,180,255,0.5)",
  txt: "#EDF4FF",       // texto principal — más brillante
  mid: "#8BAEC8",       // texto secundario — mucho más legible
  lgt: "#5A7A9A",       // texto tenue
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
  const lnk = [{ l:"Servicios",h:"#servicios" },{ l:"Análisis IA",h:"#estimador" },{ l:"Proyectos",h:"#proyectos" },{ l:"Sobre mí",h:"#about" },{ l:"Contacto",h:"#contacto" }];
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

// ── ESTIMADOR IA ─────────────────────────────────────────────────
function Estimador() {
  const [desc, setDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const COLORS = { Baja:"#22C55E", Media:"#F59E0B", Alta:"#EF4444" };

  const analyze = async () => {
    if (desc.trim().length < 30) { setError("Describe tu proyecto con más detalle para un análisis preciso."); return; }
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:1000,
          system:`Eres el analizador de proyectos de Tempvs7, empresa de desarrollo de software de Maximo Henriquez Olivares en Santiago, Chile.
Analiza el proyecto del cliente y muéstrale el alcance técnico real. El objetivo es que comprenda la complejidad, vea que necesita un experto y quiera contactar a Maximo.
Responde SOLO en JSON válido, sin texto extra, con esta estructura:
{"tipo":"tipo en 4-6 palabras","complejidad":"Baja|Media|Alta","estimacion":"X a Y semanas","stack":["tech1","tech2","tech3","tech4"],"fases":[{"nombre":"nombre","semanas":"X sem.","desc":"qué incluye brevemente"}],"recomendacion":"2-3 oraciones que explican por qué este proyecto requiere experiencia técnica especializada, qué errores típicos ocurren sin ella y cómo Tempvs7 puede ejecutarlo correctamente y sin retrabajo."}`,
          messages:[{role:"user", content:desc}],
        }),
      });
      const d = await res.json();
      const text = d.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g,"").trim();
      setResult(JSON.parse(clean));
    } catch { setError("No se pudo analizar. Intenta de nuevo."); }
    setLoading(false);
  };

  return (
    <section id="estimador" style={{ padding:"96px 60px", background:C.bgC, borderTop:`1px solid ${C.brd}` }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ marginBottom:52 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Space Grotesk',sans-serif" }}>— Análisis IA</div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(28px,3.5vw,46px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1, marginBottom:16 }}>
            Describe tu proyecto.<br/><span style={{ color:C.ac }}>Te mostramos el alcance real.</span>
          </h2>
          <p style={{ fontSize:15, color:C.mid, maxWidth:560, lineHeight:1.72 }}>
            Muchos proyectos fracasan por una mala estimación inicial. Analiza el tuyo y descubre qué se necesita realmente para construirlo bien, a la primera.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:result?"1fr 1fr":"1fr 1fr", gap:40, alignItems:"start" }}>
          {/* Input */}
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:C.mid, display:"block", marginBottom:10 }}>Describe qué quieres construir</label>
            <textarea value={desc} onChange={e=>{setDesc(e.target.value);setError("");}} placeholder={"Ej: Necesito una plataforma donde mis clientes puedan reservar horas, pagar online y yo pueda ver el calendario con todas las citas. También quiero enviarles recordatorios automáticos..."}
              rows={9} style={{ width:"100%", background:C.bgS, border:`1.5px solid ${C.brd}`, borderRadius:14, padding:"18px 20px", color:C.txt, fontSize:14, fontFamily:"'Inter',sans-serif", resize:"vertical", lineHeight:1.75, boxSizing:"border-box" }}/>
            {error && <p style={{ color:"#F87171", fontSize:12.5, marginTop:8 }}>{error}</p>}
            <button onClick={analyze} disabled={loading||desc.trim().length<30} style={{
              marginTop:14, background:loading||desc.trim().length<30 ? C.bgH : C.ac,
              color:loading||desc.trim().length<30 ? C.lgt : C.bg,
              border:"none", padding:"15px 32px", borderRadius:10,
              fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15,
              cursor:loading||desc.trim().length<30 ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", gap:10, transition:"all .3s",
              boxShadow:loading||desc.trim().length<30 ? "none" : `0 0 24px ${C.acG}`,
            }}>
              {loading
                ? <><div style={{ width:18,height:18,border:"2px solid rgba(0,0,0,.3)",borderTopColor:C.bg,borderRadius:"50%",animation:"spn 1s linear infinite" }}/>Analizando tu proyecto...</>
                : <>✦ Analizar mi proyecto</>}
            </button>
            <p style={{ fontSize:12, color:C.lgt, marginTop:10 }}>Análisis gratuito · Sin registro · Sin compromiso</p>
          </div>

          {/* Resultado */}
          <div>
            {!result && !loading && (
              <div style={{ background:C.bgS, border:`1px dashed ${C.brd}`, borderRadius:14, padding:32, textAlign:"center", opacity:.5 }}>
                <div style={{ fontSize:36, marginBottom:12 }}>✦</div>
                <p style={{ color:C.mid, fontSize:14 }}>El análisis aparecerá aquí</p>
              </div>
            )}
            {loading && (
              <div style={{ background:C.bgS, border:`1px solid ${C.brd}`, borderRadius:14, padding:32, textAlign:"center" }}>
                <div style={{ width:40,height:40,border:`3px solid ${C.acT}`,borderTopColor:C.ac,borderRadius:"50%",animation:"spn 1s linear infinite",margin:"0 auto 16px" }}/>
                <p style={{ color:C.mid, fontSize:14 }}>Analizando complejidad técnica...</p>
              </div>
            )}
            {result && (
              <div style={{ animation:"fup .5s ease both" }}>
                {/* Tipo + Complejidad */}
                <div style={{ background:C.bgS, border:`1.5px solid ${C.brd}`, borderRadius:14, padding:22, marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:10 }}>
                    <div>
                      <div style={{ fontSize:10.5, color:C.mid, letterSpacing:".1em", textTransform:"uppercase", marginBottom:4 }}>Tipo de proyecto</div>
                      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:17, color:C.txt }}>{result.tipo}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:10.5, color:C.mid, letterSpacing:".1em", textTransform:"uppercase", marginBottom:4 }}>Complejidad</div>
                      <span style={{ background:`${COLORS[result.complejidad]}18`, color:COLORS[result.complejidad], border:`1px solid ${COLORS[result.complejidad]}40`, borderRadius:20, padding:"4px 14px", fontSize:13, fontWeight:600 }}>{result.complejidad}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, paddingTop:12, borderTop:`1px solid ${C.brd}` }}>
                    <span style={{ fontSize:10.5, color:C.mid, letterSpacing:".08em", textTransform:"uppercase" }}>Estimación:</span>
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16, color:C.ac }}>{result.estimacion}</span>
                  </div>
                </div>

                {/* Stack */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10.5, color:C.mid, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>Stack recomendado</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {result.stack.map(t => <span key={t} style={{ fontSize:12, fontWeight:500, padding:"4px 12px", borderRadius:6, background:C.acT, color:C.ac, border:`1px solid ${C.brd}` }}>{t}</span>)}
                  </div>
                </div>

                {/* Fases */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10.5, color:C.mid, letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>Fases del proyecto</div>
                  {result.fases?.map((f,i) => (
                    <div key={i} style={{ display:"flex", gap:12, marginBottom:10, alignItems:"flex-start" }}>
                      <div style={{ width:26,height:26,borderRadius:"50%",background:C.acT,border:`1px solid ${C.ac}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,fontWeight:700,color:C.ac }}>{i+1}</div>
                      <div>
                        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:600,color:C.txt,marginBottom:2 }}>{f.nombre} <span style={{ color:C.ac,fontWeight:400 }}>· {f.semanas}</span></div>
                        <div style={{ fontSize:12,color:C.mid,lineHeight:1.5 }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recomendación */}
                <div style={{ background:"rgba(0,180,255,0.06)",border:`1.5px solid rgba(0,180,255,0.22)`,borderRadius:12,padding:18,marginBottom:16 }}>
                  <div style={{ fontSize:10.5,color:C.ac,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8,fontWeight:600 }}>✦ Análisis técnico</div>
                  <p style={{ fontSize:13.5,color:C.txt,lineHeight:1.75 }}>{result.recomendacion}</p>
                </div>

                {/* CTA */}
                <button onClick={()=>document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})} style={{
                  width:"100%",background:C.ac,color:C.bg,border:"none",padding:"16px",borderRadius:10,
                  cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:15,
                  boxShadow:`0 0 28px ${C.acG}`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  transition:"all .3s",
                }} onMouseEnter={e=>e.currentTarget.style.background=C.acD} onMouseLeave={e=>e.currentTarget.style.background=C.ac}>
                  Quiero cotizar este proyecto <ArrowRight size={16}/>
                </button>
              </div>
            )}
          </div>
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


// ── CHATBOT IA DE VENTAS ────────────────────────────────────────
const CHAT_SYSTEM = `Eres el asistente de ventas de Tempvs7, empresa de desarrollo de software de Maximo Henriquez Olivares en Santiago, Chile.

Tu objetivo es entender qué necesita el cliente y calificarlo como prospecto. Sé cálido, profesional y conversacional.

Servicios: Desarrollo Web (React/Next.js), Cloud AWS/Azure, Modernización de sistemas, Integraciones API, Apps PWA, Consultoría tecnológica. Clientes: Pymes y particulares.

Flujo que debes seguir:
1. Pregunta qué tipo de negocio tiene o qué problema quiere resolver
2. Entiende el alcance y urgencia del proyecto
3. Cuando tengas suficiente información e interés del cliente, incluye la señal [CAPTURAR] al FINAL de tu respuesta para mostrar el formulario de contacto

Reglas:
- Haz solo UNA pregunta por mensaje, no abrumes
- Máximo 3 líneas por respuesta, sé directo
- Si preguntan precio, menciona que los proyectos parten desde $300.000 CLP según complejidad
- Cuando el cliente muestra interés claro, incluye [CAPTURAR] al final de tu mensaje
- Responde en español (inglés si el cliente escribe en inglés)
- Nunca inventes precios exactos, di que Maximo lo cotiza tras revisar el proyecto`;

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ r:"a", c:"¡Hola! 👋 Soy el asistente de Tempvs7.\n\n¿Tienes un proyecto en mente o estás buscando solucionar algo en tu negocio?" }]);
  const [inp, setInp] = useState("");
  const [load, setLoad] = useState(false);
  const [capture, setCapture] = useState(false);
  const [lead, setLead] = useState({ name:"", email:"" });
  const [leadSaved, setLeadSaved] = useState(false);
  const [unread, setUnread] = useState(true);
  const endRef = useRef(null);

  useEffect(() => { if(open){ endRef.current?.scrollIntoView({behavior:"smooth"}); setUnread(false); } }, [msgs, open]);

  const send = async () => {
    if (!inp.trim() || load) return;
    const txt = inp.trim(); setInp("");
    setMsgs(p => [...p, {r:"u", c:txt}]); setLoad(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:350,
          system: CHAT_SYSTEM,
          messages: msgs.concat({r:"u",c:txt}).map(m => ({
            role: m.r==="u" ? "user" : "assistant",
            content: m.c.replace("[CAPTURAR]","").trim(),
          })),
        }),
      });
      const d = await res.json();
      let reply = d.content?.[0]?.text || "Hubo un error. Escríbeme a maximo.henriquez@icloud.com";
      if (reply.includes("[CAPTURAR]")) {
        reply = reply.replace("[CAPTURAR]","").trim();
        const summary = msgs.filter(m=>m.r==="u").map(m=>m.c).join(" | ") + " | " + txt;
        setLead(l => ({...l, summary}));
        setTimeout(() => setCapture(true), 600);
      }
      setMsgs(p => [...p, {r:"a", c:reply}]);
    } catch {
      setMsgs(p => [...p, {r:"a", c:"Error de conexión. Contáctame en maximo.henriquez@icloud.com o al +56 9 4004 2905."}]);
    }
    setLoad(false);
  };

  const submitLead = async () => {
    if (!lead.email) return;
    try {
      await saveContact({
        name: lead.name || "Prospecto chatbot",
        email: lead.email,
        phone: "",
        service: "Consulta via chatbot",
        msg: lead.summary || "Contacto desde chatbot",
      });
    } catch(e) { console.error(e); }
    setLeadSaved(true); setCapture(false);
    setMsgs(p => [...p, {r:"a", c:`¡Perfecto${lead.name ? ", "+lead.name : ""}! 🎉 Maximo revisará tu consulta y te contactará dentro de 24 horas. ¡Gracias por tu interés!`}]);
  };

  return (
    <>
      {open && (
        <div style={{ position:"fixed", bottom:80, right:20, width:350, zIndex:200, borderRadius:18, overflow:"hidden", boxShadow:`0 24px 64px rgba(0,0,0,.55), 0 0 0 1px ${C.brd}`, background:C.bgC, animation:"sli .3s ease" }}>
          {/* Header */}
          <div style={{ padding:"14px 18px", background:`linear-gradient(135deg, ${C.bgS}, ${C.bgH})`, borderBottom:`1px solid ${C.brd}`, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:C.acT, border:`1px solid ${C.ac}`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13, color:C.ac }}>T7</span>
              <div style={{ position:"absolute", bottom:-2, right:-2, width:10, height:10, borderRadius:"50%", background:"#22C55E", border:`2px solid ${C.bgC}` }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:13.5, color:C.txt }}>Asistente Tempvs7</div>
              <div style={{ fontSize:11, color:"#22C55E" }}>● En línea · Responde en segundos</div>
            </div>
            <button onClick={()=>setOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:C.mid, padding:4 }}><X size={16}/></button>
          </div>

          {/* Mensajes */}
          <div style={{ height:320, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:10 }}>
            {msgs.map((m,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.r==="u"?"flex-end":"flex-start", gap:2 }}>
                {m.r==="a" && <div style={{ fontSize:10, color:C.lgt, marginLeft:4, marginBottom:2 }}>Tempvs7</div>}
                <div style={{
                  maxWidth:"85%", padding:"10px 14px",
                  borderRadius: m.r==="u" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                  background: m.r==="u" ? C.ac : C.bgS,
                  color: m.r==="u" ? C.bg : C.txt,
                  fontSize:13.5, lineHeight:1.6,
                  border: m.r==="u" ? "none" : `1px solid ${C.brd}`,
                  whiteSpace:"pre-wrap",
                }}>{m.c}</div>
              </div>
            ))}

            {/* Formulario de captura de lead */}
            {capture && !leadSaved && (
              <div style={{ background:C.bgS, border:`1.5px solid ${C.ac}`, borderRadius:14, padding:16, animation:"sli .4s ease" }}>
                <div style={{ fontSize:12, color:C.ac, fontWeight:600, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
                  ✦ Déjame tus datos y Maximo te contacta
                </div>
                <input value={lead.name} onChange={e=>setLead({...lead,name:e.target.value})} placeholder="Tu nombre" style={{ width:"100%", background:C.bgC, border:`1px solid ${C.brd}`, borderRadius:8, padding:"9px 12px", color:C.txt, fontSize:13, fontFamily:"'Inter',sans-serif", marginBottom:8, boxSizing:"border-box" }}/>
                <input type="email" value={lead.email} onChange={e=>setLead({...lead,email:e.target.value})} placeholder="Tu email *" style={{ width:"100%", background:C.bgC, border:`1px solid ${C.brd}`, borderRadius:8, padding:"9px 12px", color:C.txt, fontSize:13, fontFamily:"'Inter',sans-serif", marginBottom:12, boxSizing:"border-box" }}/>
                <button onClick={submitLead} disabled={!lead.email} style={{
                  width:"100%", background:lead.email ? C.ac : C.bgH, color:lead.email ? C.bg : C.mid,
                  border:"none", padding:"11px", borderRadius:8, cursor:lead.email?"pointer":"not-allowed",
                  fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13.5,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                }}>
                  <Send size={14}/> Quiero que me contacten
                </button>
              </div>
            )}

            {load && (
              <div style={{ display:"flex", gap:5, padding:"8px 12px", alignSelf:"flex-start" }}>
                {[0,1,2].map(i => <div key={i} style={{ width:7,height:7,borderRadius:"50%",background:C.ac,animation:`blk 1s ease ${i*.2}s infinite` }}/>)}
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.brd}`, display:"flex", gap:8, background:C.bgS }}>
            <input value={inp} onChange={e=>setInp(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder="Escribe tu consulta..."
              style={{ flex:1, background:C.bgC, border:`1px solid ${C.brd}`, borderRadius:9, padding:"10px 13px", color:C.txt, fontSize:13, fontFamily:"'Inter',sans-serif" }}/>
            <button onClick={send} disabled={load||!inp.trim()} style={{ width:38,height:38,borderRadius:9,border:"none",background:inp.trim()&&!load?C.ac:C.bgH,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}>
              <Send size={14} color={inp.trim()&&!load?C.bg:C.lgt}/>
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button onClick={()=>setOpen(p=>!p)} style={{
        position:"fixed", bottom:20, right:20, zIndex:200,
        width:54, height:54, borderRadius:14, border:"none",
        background:open?C.bgS:C.ac, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:open?"none":`0 0 28px ${C.acG}, 0 8px 20px rgba(0,0,0,.3)`,
        transition:"all .25s",
      }}
        onMouseEnter={e=>{ if(!open) e.currentTarget.style.transform="scale(1.08)"; }}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        {open ? <X size={20} color={C.ac}/> : <MessageCircle size={22} color={C.bg}/>}
        {!open && unread && (
          <div style={{ position:"absolute", top:-4, right:-4, width:14, height:14, borderRadius:"50%", background:"#EF4444", border:`2px solid ${C.bg}`, animation:"pulse 2s ease infinite" }}/>
        )}
      </button>
    </>
  );
}



// ── APP ROOT ─────────────────────────────────────────────────────
export default function App() {
  const [admin, setAdmin] = useState(false);
  const [data, setData] = useState({ projects:DEF_PROJECTS, sectors:DEF_SECTORS, social:DEF_SOCIAL });

  useEffect(() => {
    getProjects().then(p => setData(d => ({...d, projects:p}))).catch(() => {});
    getSectors().then(s => setData(d => ({...d, sectors:s}))).catch(() => {});
    getSocialLinks().then(s => setData(d => ({...d, social:s}))).catch(() => {});
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
      <Estimador/>
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
