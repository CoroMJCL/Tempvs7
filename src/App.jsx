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
  addSector, removeSector, getContacts
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

// ── MARK / LOGO ──────────────────────────────────────────────────
function Mark({ size = 36, text = false }) {
  return (
    <div style={{ display:"flex", alignItems:"center", cursor:"pointer" }}>
      <span style={{
        fontFamily:"'Space Grotesk',sans-serif",
        fontWeight:800,
        fontSize: size * 0.42,
        letterSpacing:"0.06em",
        color: C.ac,
        lineHeight:1,
      }}>TEMPVS7</span>
    </div>
  );
}

// ── NAVBAR ───────────────────────────────────────────────────────
function Navbar({ onAdmin }) {
  const [sc, setSc] = useState(false);
  useEffect(() => { const f = () => setSc(window.scrollY > 40); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  const lnk = [{ l:"Servicios",h:"#servicios" },{ l:"Diagnóstico",h:"#diagnostico" },{ l:"ROI",h:"#roi" },{ l:"Proyectos",h:"#proyectos" },{ l:"FAQ",h:"#faq" },{ l:"Contacto",h:"#contacto" }];
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

          {/* Logo grande — panel derecho hero */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", animation:"fup 1s ease .15s both" }}>
            <img
              src="/logo-mark.png"
              alt="Tempvs7"
              style={{
                width:"100%",
                maxWidth:440,
                height:"auto",
                borderRadius:20,
                filter:"drop-shadow(0 0 60px rgba(0,180,255,.3)) drop-shadow(0 24px 48px rgba(0,0,0,.5))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SERVICES + TECH STACK ───────────────────────────────────────
const SVCS = [
  { icon:"🌐", t:"Desarrollo Web",       d:"React, Next.js y PWA de alto rendimiento" },
  { icon:"☁️", t:"Arquitectura Cloud",   d:"AWS, Azure, microservicios y CI/CD" },
  { icon:"🔄", t:"Modernización Legacy", d:"COBOL y AS400 hacia plataformas modernas" },
  { icon:"⚡", t:"Integraciones API",    d:"REST, GraphQL y automatización de procesos" },
  { icon:"📱", t:"Apps Progresivas",     d:"PWA con experiencia nativa, sin App Store" },
  { icon:"💡", t:"Consultoría Tech",     d:"Roadmaps, auditorías y decisiones críticas" },
];

const STACK = [
  { cat:"Frontend",       color:"#3B82F6", bg:"rgba(59,130,246,.1)",  items:["React","Next.js","JavaScript","TypeScript","HTML / CSS","PWA","Vite"] },
  { cat:"Backend",        color:"#10B981", bg:"rgba(16,185,129,.1)",  items:["C# / .NET","Node.js","REST APIs","GraphQL","Webhooks"] },
  { cat:"Cloud & DevOps", color:"#8B5CF6", bg:"rgba(139,92,246,.1)",  items:["AWS Lambda","S3","Step Functions","SQS","Azure","Vercel","CI/CD"] },
  { cat:"Bases de datos", color:"#F59E0B", bg:"rgba(245,158,11,.1)",  items:["PostgreSQL","SQL Server","Oracle","Supabase","Aurora"] },
  { cat:"Arquitectura",   color:"#EF4444", bg:"rgba(239,68,68,.1)",   items:["Microservicios","Sistemas distribuidos","Event-driven","COBOL / AS400","Banca crítica"] },
  { cat:"Liderazgo",      color:"#EC4899", bg:"rgba(236,72,153,.1)",  items:["Tech Lead 20+ años","Equipos hasta 10+","Scrum / Agile","Fintech / Banca","Code Review"] },
];

function Services() {
  return (
    <section id="servicios" style={{ padding:"96px 60px", background:C.bg }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>

        <div style={{ marginBottom:52 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Space Grotesk',sans-serif" }}>— Servicios</div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(26px,3.5vw,44px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1, marginBottom:14 }}>
            ¿En qué puedo<br/><span style={{ color:C.ac }}>ayudarte?</span>
          </h2>
        </div>

        {/* Cards de servicios compactas */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:14, marginBottom:80 }}>
          {SVCS.map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, background:C.bgC, border:`1px solid ${C.brd}`, borderRadius:14, padding:"18px 20px", transition:"border-color .25s", cursor:"default" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.ac}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.brd}>
              <span style={{ fontSize:24, flexShrink:0, marginTop:2 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:14.5, color:C.txt, marginBottom:4 }}>{s.t}</div>
                <div style={{ fontSize:12.5, color:C.mid, lineHeight:1.55 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stack tecnológico */}
        <div style={{ marginBottom:36 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Space Grotesk',sans-serif" }}>— Stack tecnológico</div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(22px,2.8vw,36px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1, marginBottom:8 }}>
            20 años cubriendo<br/><span style={{ color:C.ac }}>todas las capas del stack.</span>
          </h2>
          <p style={{ fontSize:14.5, color:C.mid, lineHeight:1.7 }}>Desde sistemas bancarios críticos hasta apps web modernas. Fintech, banca y Pymes.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(310px, 1fr))", gap:16, marginBottom:48 }}>
          {STACK.map((cat,i) => (
            <div key={i} style={{ background:C.bgC, border:`1.5px solid ${C.brd}`, borderRadius:16, padding:22, transition:"border-color .25s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=cat.color}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.brd}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:cat.color, flexShrink:0, boxShadow:`0 0 10px ${cat.color}` }}/>
                <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:12.5, color:cat.color, letterSpacing:".08em", textTransform:"uppercase" }}>{cat.cat}</span>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {cat.items.map((tech,j) => (
                  <span key={j} style={{ padding:"5px 12px", borderRadius:7, background:cat.bg, border:`1px solid ${cat.color}35`, fontSize:13, color:C.txt, fontWeight:500 }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.brd, borderRadius:16, overflow:"hidden" }}>
          {[
            { n:"20+", l:"Años de experiencia" },
            { n:"5",   l:"Empresas del sector financiero" },
            { n:"10+", l:"Ingenieros liderados" },
            { n:"100%", l:"Proyectos entregados" },
          ].map((s,i) => (
            <div key={i} style={{ background:C.bgC, padding:"28px 20px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:34, color:C.ac, marginBottom:6 }}>{s.n}</div>
              <div style={{ fontSize:12, color:C.mid, lineHeight:1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── DIAGNÓSTICO DIGITAL ──────────────────────────────────────────
const DIAG_Q = [
  { q:"¿Cómo gestionas hoy tus ventas o pedidos?", opts:["Papel o de memoria","Excel o planillas","WhatsApp / email","Sistema digital propio"] },
  { q:"¿Cuántos clientes o ventas manejas al mes?", opts:["Menos de 20","20 a 100","100 a 500","Más de 500"] },
  { q:"¿Cuánta presencia digital tiene tu negocio?", opts:["Sin web ni redes","Solo redes sociales","Tengo web básica","Web + tienda online"] },
  { q:"¿Cuánto tiempo dedicas a tareas administrativas?", opts:["Menos de 2 hrs/día","2 a 4 hrs/día","4 a 6 hrs/día","Más de 6 hrs/día"] },
  { q:"¿Qué quieres mejorar primero?", opts:["Conseguir más clientes","Automatizar procesos","Mejorar mi imagen","Todo lo anterior"] },
];

function Diagnostico() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const choose = async (opt) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    if (step < DIAG_Q.length - 1) { setStep(step + 1); return; }
    setLoading(true);
    try {
      const qa = DIAG_Q.map((q, i) => `${q.q}: ${newAnswers[i]}`).join(" | ");
      const res = await fetch("/api/ai", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:`Eres el asesor digital de Tempvs7 en Santiago, Chile. Analiza las respuestas del diagnóstico y responde SOLO en JSON válido:
{"score":7,"nivel":"Medio","areas":[{"nombre":"Gestión de ventas","estado":"Crítico","impacto":"Pierdes tiempo y clientes por falta de automatización"},{"nombre":"Presencia digital","estado":"Mejorable","impacto":"Descripción del impacto"}],"servicios":["Servicio 1 de Tempvs7 que aplica","Servicio 2"],"mensaje":"2 oraciones directas diciendo qué está perdiendo este negocio sin digitalización y cómo Tempvs7 puede solucionarlo en semanas, no meses."}`,
          messages:[{ role:"user", content:`Diagnóstico: ${qa}` }],
          max_tokens:600,
        }),
      });
      const d = await res.json();
      const text = d.content?.[0]?.text || "";
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch { setResult({ score:5, nivel:"Medio", areas:[], servicios:[], mensaje:"Tu negocio tiene oportunidades claras de mejora digital. Maximo puede ayudarte a identificarlas y ejecutarlas." }); }
    setLoading(false);
  };

  const scoreColor = result ? (result.score>=8?"#22C55E":result.score>=5?"#F59E0B":"#EF4444") : C.ac;
  const pct = result ? (result.score/10)*100 : 0;

  return (
    <section id="diagnostico" style={{ padding:"96px 60px", background:C.bg, borderTop:`1px solid ${C.brd}` }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Space Grotesk',sans-serif" }}>— Diagnóstico Digital Gratis</div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(26px,3.5vw,44px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1, marginBottom:14 }}>
            ¿Está tu negocio<br/><span style={{ color:C.ac }}>perdiendo dinero sin saberlo?</span>
          </h2>
          <p style={{ fontSize:15, color:C.mid, lineHeight:1.7 }}>5 preguntas — descubre tu nivel digital y qué hacer primero.</p>
        </div>

        {!result && !loading && (
          <div style={{ maxWidth:640, margin:"0 auto" }}>
            {/* Barra de progreso */}
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:12, color:C.mid }}>Pregunta {step+1} de {DIAG_Q.length}</span>
              <span style={{ fontSize:12, color:C.ac, fontWeight:600 }}>{Math.round(((step)/DIAG_Q.length)*100)}%</span>
            </div>
            <div style={{ height:4, background:C.bgS, borderRadius:2, marginBottom:32, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(step/DIAG_Q.length)*100}%`, background:C.ac, borderRadius:2, transition:"width .4s ease" }}/>
            </div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(17px,2.5vw,22px)", fontWeight:600, color:C.txt, marginBottom:24, lineHeight:1.3 }}>
              {DIAG_Q[step].q}
            </h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {DIAG_Q[step].opts.map((opt,i) => (
                <button key={i} onClick={() => choose(opt)} style={{
                  background:C.bgC, border:`1.5px solid ${C.brd}`, borderRadius:12,
                  padding:"16px 20px", cursor:"pointer", textAlign:"left",
                  fontFamily:"'Inter',sans-serif", fontSize:15, color:C.txt,
                  transition:"all .2s", display:"flex", alignItems:"center", gap:12,
                }} onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.ac; e.currentTarget.style.background=C.acT; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.brd; e.currentTarget.style.background=C.bgC; }}>
                  <span style={{ width:28,height:28,borderRadius:"50%",background:C.bgS,border:`1px solid ${C.brd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.ac,flexShrink:0,fontWeight:600 }}>{i+1}</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ width:44,height:44,border:`3px solid ${C.acT}`,borderTopColor:C.ac,borderRadius:"50%",animation:"spn 1s linear infinite",margin:"0 auto 20px" }}/>
            <p style={{ color:C.mid, fontSize:15 }}>Analizando tu diagnóstico...</p>
          </div>
        )}

        {result && (
          <div style={{ animation:"fup .5s ease both", maxWidth:780, margin:"0 auto" }}>
            {/* Score */}
            <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:32, alignItems:"center", background:C.bgC, border:`1.5px solid ${C.brd}`, borderRadius:18, padding:32, marginBottom:20 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ position:"relative", width:110, height:110 }}>
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="48" fill="none" stroke={C.bgS} strokeWidth="8"/>
                    <circle cx="55" cy="55" r="48" fill="none" stroke={scoreColor} strokeWidth="8"
                      strokeDasharray={`${pct*3.015} 301.5`} strokeLinecap="round" transform="rotate(-90 55 55)"
                      style={{ transition:"stroke-dasharray 1s ease" }}/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:30, color:scoreColor, lineHeight:1 }}>{result.score}</span>
                    <span style={{ fontSize:11, color:C.mid }}>de 10</span>
                  </div>
                </div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:14, color:scoreColor, marginTop:8 }}>{result.nivel}</div>
              </div>
              <div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:20, color:C.txt, marginBottom:12 }}>Tu diagnóstico digital</div>
                {result.areas?.slice(0,2).map((a,i) => (
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:5, background:a.estado==="Crítico"?"rgba(239,68,68,.15)":"rgba(245,158,11,.15)", color:a.estado==="Crítico"?"#F87171":"#FCD34D", fontWeight:600, flexShrink:0, marginTop:1 }}>{a.estado}</span>
                    <div><div style={{ fontSize:13, fontWeight:600, color:C.txt }}>{a.nombre}</div><div style={{ fontSize:12, color:C.mid }}>{a.impacto}</div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mensaje y servicios recomendados */}
            <div style={{ background:`rgba(0,180,255,.06)`, border:`1.5px solid rgba(0,180,255,.22)`, borderRadius:14, padding:22, marginBottom:16 }}>
              <div style={{ fontSize:10.5, color:C.ac, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8, fontWeight:600 }}>✦ Lo que necesitas</div>
              <p style={{ fontSize:14, color:C.txt, lineHeight:1.75, marginBottom:14 }}>{result.mensaje}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {result.servicios?.map(s => <span key={s} style={{ fontSize:12, padding:"4px 12px", borderRadius:6, background:C.acT, color:C.ac, border:`1px solid ${C.brd}`, fontWeight:500 }}>{s}</span>)}
              </div>
            </div>

            <button onClick={() => document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})} style={{
              width:"100%", background:C.ac, color:C.bg, border:"none", padding:"17px",
              borderRadius:11, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif",
              fontWeight:700, fontSize:16, boxShadow:`0 0 30px ${C.acG}`,
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            }}>
              Quiero mejorar mi negocio digital <ArrowRight size={18}/>
            </button>
            <p style={{ textAlign:"center", fontSize:12, color:C.lgt, marginTop:10 }}>Consulta gratuita · Sin compromiso · Respuesta en 24h</p>

            <button onClick={() => { setStep(0); setAnswers([]); setResult(null); }} style={{ display:"block", margin:"16px auto 0", background:"none", border:"none", cursor:"pointer", color:C.mid, fontSize:13 }}>
              Repetir diagnóstico
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ── CALCULADORA ROI ───────────────────────────────────────────────
function ROICalculator() {
  const [form, setForm] = useState({ employees:"", hours:"", rate:"", process:"" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    const { employees, hours, rate, process } = form;
    if (!employees || !hours || !rate) return;
    setLoading(true); setResult(null);
    const costYear = Number(employees) * Number(hours) * Number(rate) * 260;
    try {
      const res = await fetch("/api/ai", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:`Eres un asesor de digitalización de Tempvs7 en Chile. Responde SOLO en JSON:
{"ahorro_pct":75,"roi_meses":8,"mensaje_urgencia":"2 oraciones impactantes sobre el costo de seguir sin software, con números específicos del costo calculado","solucion":"Nombre de la solución concreta que Tempvs7 implementaría para este caso","plazo":"X a Y semanas","beneficios":["beneficio específico 1","beneficio específico 2","beneficio específico 3"]}`,
          messages:[{ role:"user", content:`Negocio: proceso lento: ${process||"procesos administrativos"}. ${employees} empleados. ${hours} hrs/día en tareas manuales. Costo hora: $${Number(rate).toLocaleString("es-CL")} CLP. Costo anual calculado: $${costYear.toLocaleString("es-CL")} CLP.` }],
          max_tokens:400,
        }),
      });
      const d = await res.json();
      const text = d.content?.[0]?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setResult({ ...parsed, costYear, employees:Number(employees), hours:Number(hours), rate:Number(rate) });
    } catch { setResult({ ahorro_pct:70, roi_meses:8, mensaje_urgencia:`Estás gastando $${costYear.toLocaleString("es-CL")} CLP al año en tareas manuales. Con software adecuado, podrías reducirlo en un 70% en menos de 3 meses.`, solucion:"Sistema de gestión a medida", plazo:"6 a 10", beneficios:["Reducción de tiempo administrativo","Menos errores humanos","Información en tiempo real"], costYear, employees:Number(employees), hours:Number(hours) }); }
    setLoading(false);
  };

  const inp = { background:C.bgS, border:`1.5px solid ${C.brd}`, borderRadius:10, padding:"13px 16px", color:C.txt, fontSize:15, fontFamily:"'Inter',sans-serif", width:"100%", boxSizing:"border-box" };

  return (
    <section id="roi" style={{ padding:"96px 60px", background:C.bgC, borderTop:`1px solid ${C.brd}` }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Space Grotesk',sans-serif" }}>— Calculadora ROI</div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(26px,3.5vw,44px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1, marginBottom:14 }}>
            ¿Cuánto te cuesta<br/><span style={{ color:C.ac }}>no tener software?</span>
          </h2>
          <p style={{ fontSize:15, color:C.mid, lineHeight:1.7 }}>Calcula el costo real de los procesos manuales en tu negocio.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"start" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { key:"employees", label:"¿Cuántos empleados tienes?", ph:"Ej: 3", type:"number" },
              { key:"hours", label:"Horas/día en tareas manuales (por persona)", ph:"Ej: 2", type:"number" },
              { key:"rate", label:"Costo de la hora de trabajo (CLP)", ph:"Ej: 8000", type:"number" },
              { key:"process", label:"¿Cuál es el proceso más lento? (opcional)", ph:"Ej: tomar pedidos, hacer facturas...", type:"text" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize:12.5, fontWeight:500, color:C.mid, display:"block", marginBottom:7 }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.ph} style={inp}/>
              </div>
            ))}
            <button onClick={calculate} disabled={loading||!form.employees||!form.hours||!form.rate} style={{
              background:form.employees&&form.hours&&form.rate?C.ac:C.bgH,
              color:form.employees&&form.hours&&form.rate?C.bg:C.lgt,
              border:"none", padding:"15px", borderRadius:10, cursor:form.employees&&form.hours&&form.rate?"pointer":"not-allowed",
              fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:form.employees&&form.hours&&form.rate?`0 0 24px ${C.acG}`:"none", transition:"all .3s",
            }}>
              {loading?<><div style={{ width:18,height:18,border:"2px solid rgba(0,0,0,.3)",borderTopColor:C.bg,borderRadius:"50%",animation:"spn 1s linear infinite" }}/>Calculando...</>:"Calcular mi ROI"}
            </button>
          </div>

          <div>
            {!result && !loading && (
              <div style={{ background:C.bgS, border:`1px dashed ${C.brd}`, borderRadius:16, padding:40, textAlign:"center", opacity:.45 }}>
                <div style={{ fontSize:42, marginBottom:12 }}>$</div>
                <p style={{ color:C.mid, fontSize:14 }}>El cálculo aparecerá aquí</p>
              </div>
            )}
            {loading && (
              <div style={{ background:C.bgS, border:`1px solid ${C.brd}`, borderRadius:16, padding:40, textAlign:"center" }}>
                <div style={{ width:40,height:40,border:`3px solid ${C.acT}`,borderTopColor:C.ac,borderRadius:"50%",animation:"spn 1s linear infinite",margin:"0 auto 16px" }}/>
                <p style={{ color:C.mid }}>Calculando el costo real...</p>
              </div>
            )}
            {result && (
              <div style={{ animation:"fup .5s ease both" }}>
                <div style={{ background:C.bgS, border:`1.5px solid ${C.brd}`, borderRadius:16, padding:26, marginBottom:14 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                    {[
                      { lbl:"Costo actual/año", val:`$${result.costYear.toLocaleString("es-CL")} CLP`, color:"#F87171" },
                      { lbl:"Ahorro potencial/año", val:`$${Math.round(result.costYear*(result.ahorro_pct/100)).toLocaleString("es-CL")} CLP`, color:"#22C55E" },
                      { lbl:"Recuperación inversión", val:`${result.roi_meses} meses`, color:C.ac },
                      { lbl:"Reducción de tiempo", val:`${result.ahorro_pct}%`, color:C.ac },
                    ].map((item,i) => (
                      <div key={i} style={{ background:C.bgC, border:`1px solid ${C.brd}`, borderRadius:10, padding:14, textAlign:"center" }}>
                        <div style={{ fontSize:10.5, color:C.mid, letterSpacing:".06em", textTransform:"uppercase", marginBottom:4 }}>{item.lbl}</div>
                        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:18, color:item.color }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:`rgba(0,180,255,.06)`, border:`1px solid rgba(0,180,255,.2)`, borderRadius:10, padding:14, marginBottom:12 }}>
                    <p style={{ fontSize:13.5, color:C.txt, lineHeight:1.7 }}>{result.mensaje_urgencia}</p>
                  </div>
                  <div style={{ marginBottom:4 }}>
                    <div style={{ fontSize:11, color:C.mid, letterSpacing:".08em", textTransform:"uppercase", marginBottom:8 }}>Solución: <strong style={{ color:C.txt }}>{result.solucion}</strong> · {result.plazo} semanas</div>
                    {result.beneficios?.map((b,i) => <div key={i} style={{ fontSize:12.5, color:C.mid, marginBottom:4, display:"flex", gap:8 }}><span style={{ color:C.ac }}>✓</span>{b}</div>)}
                  </div>
                </div>
                <button onClick={() => document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})} style={{
                  width:"100%", background:C.ac, color:C.bg, border:"none", padding:"16px",
                  borderRadius:10, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif",
                  fontWeight:700, fontSize:15, boxShadow:`0 0 28px ${C.acG}`,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}>
                  Quiero empezar a ahorrar <ArrowRight size={16}/>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ DINÁMICA IA ───────────────────────────────────────────────
const FAQS_PRESET = [
  "¿Cuánto cuesta un sitio web?",
  "¿Cuánto tiempo toma un proyecto?",
  "¿Trabajan con empresas pequeñas?",
  "¿Puedo pagar en cuotas?",
  "¿Qué necesito para empezar?",
  "¿Hacen soporte después de entregar?",
  "¿Pueden modernizar mi sistema antiguo?",
  "¿Trabajan en toda Latinoamérica?",
];

function FAQDinamica() {
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState({});
  const [custom, setCustom] = useState("");
  const [loadingKey, setLoadingKey] = useState(null);

  const ask = async (question, key) => {
    if (answers[key]) { setActive(key); return; }
    setActive(key); setLoadingKey(key);
    try {
      const res = await fetch("/api/ai", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:`Eres el asistente de Tempvs7, empresa de desarrollo de software de Maximo Henriquez Olivares en Santiago, Chile. Responde preguntas sobre los servicios de manera directa, honesta y orientada a convertir al cliente. Máximo 4 líneas. Si preguntan precio, di que depende del proyecto pero los proyectos simples parten desde $300.000 CLP y los medianos desde $1.500.000 CLP. Siempre termina con una micro-CTA natural.`,
          messages:[{ role:"user", content:question }],
          max_tokens:200,
        }),
      });
      const d = await res.json();
      const text = d.content?.[0]?.text || "";
      setAnswers(prev => ({...prev, [key]:text}));
    } catch { setAnswers(prev => ({...prev, [key]:"Hubo un error. Escríbeme directo a maximo.henriquez@icloud.com"})); }
    setLoadingKey(null);
  };

  return (
    <section id="faq" style={{ padding:"96px 60px", background:C.bg, borderTop:`1px solid ${C.brd}` }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.ac, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Space Grotesk',sans-serif" }}>— Preguntas Frecuentes</div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(26px,3.5vw,44px)", fontWeight:700, color:C.txt, letterSpacing:"-.04em", lineHeight:1.1 }}>
            Resolvemos tus dudas<br/><span style={{ color:C.ac }}>al instante.</span>
          </h2>
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:28 }}>
          {FAQS_PRESET.map((q,i) => (
            <button key={i} onClick={() => ask(q, q)} style={{
              padding:"9px 18px", borderRadius:20, border:`1.5px solid ${active===q?C.ac:C.brd}`,
              background:active===q?C.acT:C.bgC, color:active===q?C.ac:C.mid,
              cursor:"pointer", fontSize:13.5, fontFamily:"'Inter',sans-serif",
              transition:"all .2s", fontWeight:active===q?500:400,
            }}>{q}</button>
          ))}
        </div>

        {active && (
          <div style={{ background:C.bgC, border:`1.5px solid ${C.ac}`, borderRadius:16, padding:26, marginBottom:24, animation:"fup .4s ease" }}>
            <div style={{ fontSize:12, color:C.ac, fontWeight:600, marginBottom:10, letterSpacing:".06em", textTransform:"uppercase" }}>✦ {active}</div>
            {loadingKey===active ? (
              <div style={{ display:"flex", gap:5 }}>{[0,1,2].map(i => <div key={i} style={{ width:7,height:7,borderRadius:"50%",background:C.ac,animation:`blk 1s ease ${i*.2}s infinite` }}/>)}</div>
            ) : (
              <p style={{ fontSize:14.5, color:C.txt, lineHeight:1.75, whiteSpace:"pre-wrap" }}>{answers[active]}</p>
            )}
          </div>
        )}

        <div style={{ background:C.bgS, border:`1px solid ${C.brd}`, borderRadius:14, padding:22, marginBottom:24 }}>
          <div style={{ fontSize:13, color:C.mid, marginBottom:12 }}>¿Tienes otra pregunta?</div>
          <div style={{ display:"flex", gap:10 }}>
            <input value={custom} onChange={e=>setCustom(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&custom.trim()&&ask(custom.trim(), custom.trim())}
              placeholder="Escribe tu duda aquí..." style={{ flex:1, background:C.bgC, border:`1px solid ${C.brd}`, borderRadius:9, padding:"12px 14px", color:C.txt, fontSize:14, fontFamily:"'Inter',sans-serif" }}/>
            <button onClick={() => custom.trim() && ask(custom.trim(), custom.trim())} style={{
              background:C.ac, color:C.bg, border:"none", padding:"0 20px", borderRadius:9,
              cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:14,
            }}>Preguntar</button>
          </div>
        </div>

        <div style={{ textAlign:"center" }}>
          <p style={{ color:C.mid, fontSize:14, marginBottom:14 }}>¿Prefieres hablar directamente?</p>
          <button onClick={() => document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})} style={{
            background:"transparent", color:C.ac, border:`1.5px solid ${C.ac}`,
            padding:"13px 32px", borderRadius:10, cursor:"pointer",
            fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:15,
          }}>
            Agenda una consulta gratuita →
          </button>
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
      const res = await fetch("/api/ai", {
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
      <div style={{ height:220, overflow:"hidden", position:"relative", background:C.bgS }}>
        {imgs[0] ? (
          <>
            <img src={imgs[idx]} alt={p.title} loading="lazy" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top left", transition:"transform .6s ease", transform:hov?"scale(1.04)":"scale(1)" }} />
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
          <a href={p.url && !p.url.startsWith("http") ? "https://"+p.url : p.url} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:500, color:C.ac, textDecoration:"none" }}>
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



// ── WHATSAPP FLOTANTE ────────────────────────────────────────────
function WhatsApp({ number }) {
  // Usar el número configurado o el de Maximo por defecto
  const tel = number || "+56940042905";
  if (!tel) return null;
  const clean = tel.replace(/\D/g, "");
  const msg = encodeURIComponent("Hola Maximo, vi tu sitio Tempvs7.cl y me interesa cotizar un proyecto. ¿Podemos hablar?");
  const url = `https://wa.me/${clean}?text=${msg}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      title="Escríbenos por WhatsApp"
      style={{
        position:"fixed", bottom:84, right:20, zIndex:199,
        width:52, height:52, borderRadius:"50%",
        background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 4px 20px rgba(37,211,102,.45)", transition:"transform .25s",
        textDecoration:"none",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.549 4.098 1.51 5.824L0 24l6.335-1.496A11.926 11.926 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.5-5.18-1.375l-.37-.22-3.84.906.96-3.757-.24-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    </a>
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
      const res = await fetch("/api/ai", {
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





// ── MÓDULO COTIZACIÓN ────────────────────────────────────────────
const SERVICIOS_COTIZACION = [
  { id:"ux", label:"Diseño UX/UI", precio:350000 },
  { id:"front", label:"Desarrollo Frontend (React)", precio:600000 },
  { id:"back", label:"Desarrollo Backend (Node.js/API)", precio:700000 },
  { id:"db", label:"Base de datos (Supabase/PostgreSQL)", precio:250000 },
  { id:"deploy", label:"Deploy y configuración (Vercel/AWS)", precio:200000 },
  { id:"api", label:"Integraciones de API externas", precio:300000 },
  { id:"pwa", label:"App Progresiva (PWA)", precio:400000 },
  { id:"consultoria", label:"Consultoría de Arquitectura", precio:500000 },
  { id:"testing", label:"Testing y QA", precio:200000 },
  { id:"soporte", label:"Soporte post-entrega (3 meses)", precio:300000 },
];

function QuoteModule({ onClose }) {
  const [step, setStep] = useState(1); // 1=datos, 2=servicios, 3=preview
  const [client, setClient] = useState({ name:"", company:"", email:"", phone:"" });
  const [selected, setSelected] = useState({});
  const [custom, setCustom] = useState([]);
  const [notes, setNotes] = useState("");
  const [validity, setValidity] = useState("15");
  const [discount, setDiscount] = useState(0);

  const toggleService = (id) => setSelected(p => ({ ...p, [id]:!p[id] }));
  const addCustom = () => setCustom(p => [...p, { desc:"", precio:0 }]);
  const subtotal = SERVICIOS_COTIZACION.filter(s => selected[s.id]).reduce((a,s) => a+s.precio, 0)
    + custom.reduce((a,c) => a+Number(c.precio||0), 0);
  const total = subtotal * (1 - discount/100);
  const today = new Date().toLocaleDateString("es-CL");

  const inp = { background:"#F4F6F9", border:"1px solid #DDE1E8", borderRadius:8, padding:"10px 14px", fontSize:13, width:"100%", fontFamily:"'Inter',sans-serif", boxSizing:"border-box", color:"#1A1D23" };

  const sendEmail = () => {
    const body = `Estimado/a ${client.name},\n\nAdjunto la propuesta comercial de Tempvs7 para su proyecto:\n\n${SERVICIOS_COTIZACION.filter(s=>selected[s.id]).map(s=>`• ${s.label}: $${s.precio.toLocaleString("es-CL")} CLP`).join("\n")}\n\nTotal: $${Math.round(total).toLocaleString("es-CL")} CLP\n\nVálida hasta: ${validity} días\n\n${notes ? `Notas: ${notes}\n\n` : ""}Quedo a disposición para coordinar los próximos pasos.\n\nSaludos,\nMaximo Henriquez\nTempvs7 — Ingeniería de Software\nmaximo.henriquez@icloud.com | +56 9 4004 2905`;
    window.open(`mailto:${client.email}?subject=Propuesta Tempvs7 — ${client.company||client.name}&body=${encodeURIComponent(body)}`);
  };

  const printPDF = () => {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>Propuesta Tempvs7 — ${client.name}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color:#1A1D23; background:#fff; padding:0; }
  .header { background:#04090F; color:white; padding:32px 40px; display:flex; justify-content:space-between; align-items:center; }
  .brand { font-size:24px; font-weight:800; letter-spacing:2px; }
  .brand span { color:#00B4FF; }
  .tag { font-size:11px; color:#8BAEC8; letter-spacing:3px; margin-top:4px; }
  .meta { font-size:12px; color:#8BAEC8; text-align:right; line-height:1.8; }
  .body { padding:40px; }
  .section { margin-bottom:32px; }
  .section-title { font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#00B4FF; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #E4E4E7; }
  .client-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; background:#F8F9FA; padding:20px; border-radius:10px; }
  .client-item label { font-size:10px; color:#6B7280; letter-spacing:.06em; text-transform:uppercase; }
  .client-item p { font-size:14px; font-weight:500; color:#1A1D23; margin-top:2px; }
  .services-table { width:100%; border-collapse:collapse; }
  .services-table th { background:#04090F; color:white; padding:10px 14px; text-align:left; font-size:12px; font-weight:600; }
  .services-table td { padding:11px 14px; border-bottom:1px solid #E4E4E7; font-size:13px; }
  .services-table tr:nth-child(even) td { background:#F8F9FA; }
  .price-cell { text-align:right; font-weight:600; color:#1A1D23; white-space:nowrap; }
  .totals { margin-top:20px; }
  .total-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #E4E4E7; font-size:13px; }
  .total-final { display:flex; justify-content:space-between; padding:14px 0; font-size:18px; font-weight:800; color:#04090F; }
  .notes { background:#F0F9FF; border-left:3px solid #00B4FF; padding:16px; border-radius:4px; font-size:13px; line-height:1.7; color:#1A1D23; }
  .footer { background:#04090F; color:white; padding:24px 40px; text-align:center; margin-top:40px; }
  .footer-brand { font-size:16px; font-weight:800; letter-spacing:2px; }
  .footer-contact { font-size:12px; color:#8BAEC8; margin-top:6px; }
  .validity { font-size:12px; color:#6B7280; margin-top:12px; font-style:italic; }
  @media print { body{-webkit-print-color-adjust:exact;print-color-adjust:exact;} }
</style></head><body>
<div class="header">
  <div>
    <div class="brand">TEMPVS<span>7</span></div>
    <div class="tag">SOFTWARE ENGINEERING</div>
  </div>
  <div class="meta">
    <div>Propuesta Técnica y Comercial</div>
    <div>Fecha: ${today}</div>
    <div>Folio: T7-${Date.now().toString().slice(-6)}</div>
  </div>
</div>
<div class="body">
  <div class="section">
    <div class="section-title">Datos del Cliente</div>
    <div class="client-grid">
      <div class="client-item"><label>Nombre</label><p>${client.name||"—"}</p></div>
      <div class="client-item"><label>Empresa</label><p>${client.company||"—"}</p></div>
      <div class="client-item"><label>Email</label><p>${client.email||"—"}</p></div>
      <div class="client-item"><label>Teléfono</label><p>${client.phone||"—"}</p></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Servicios Incluidos</div>
    <table class="services-table">
      <thead><tr><th>Servicio</th><th style="text-align:right">Valor (CLP)</th></tr></thead>
      <tbody>
        ${SERVICIOS_COTIZACION.filter(s=>selected[s.id]).map(s=>`<tr><td>${s.label}</td><td class="price-cell">$${s.precio.toLocaleString("es-CL")}</td></tr>`).join("")}
        ${custom.filter(c=>c.desc).map(c=>`<tr><td>${c.desc}</td><td class="price-cell">$${Number(c.precio||0).toLocaleString("es-CL")}</td></tr>`).join("")}
      </tbody>
    </table>
    <div class="totals">
      <div class="total-row"><span>Subtotal</span><span>$${subtotal.toLocaleString("es-CL")}</span></div>
      ${discount>0?`<div class="total-row"><span>Descuento (${discount}%)</span><span style="color:#16A34A">-$${Math.round(subtotal*discount/100).toLocaleString("es-CL")}</span></div>`:""}
      <div class="total-final"><span>TOTAL INVERSIÓN</span><span>$${Math.round(total).toLocaleString("es-CL")} CLP</span></div>
    </div>
  </div>
  ${notes?`<div class="section"><div class="section-title">Notas y Alcance</div><div class="notes">${notes}</div></div>`:""}
  <div class="validity">• Esta propuesta es válida por ${validity} días calendario desde la fecha de emisión.<br>• Los precios no incluyen IVA. Forma de pago: 50% al inicio, 50% al término del proyecto.</div>
</div>
<div class="footer">
  <div class="footer-brand">TEMPVS7</div>
  <div class="footer-contact">maximo.henriquez@icloud.com &nbsp;|&nbsp; +56 9 4004 2905 &nbsp;|&nbsp; www.tempvs7.cl &nbsp;|&nbsp; Santiago, Chile</div>
</div>
<script>window.onload=()=>{window.print();}<\/script></body></html>`);
    w.document.close();
  };

  const A = { bg:"#FFFFFF", surface:"#F4F6F9", border:"#DDE1E8", text:"#1A1D23", mid:"#6B7280", ac:C.ac };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:400, background:"rgba(0,0,0,.6)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:A.bg, borderRadius:20, width:"100%", maxWidth:720, maxHeight:"92vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 30px 80px rgba(0,0,0,.35)" }}>
        {/* Header */}
        <div style={{ padding:"18px 24px", borderBottom:`1px solid ${A.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:17, color:A.text }}>Nueva Cotización</div>
            <div style={{ fontSize:12, color:A.mid }}>Paso {step} de 3 — {["","Datos del cliente","Servicios","Vista previa"][step]}</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {step>1 && <button onClick={()=>setStep(p=>p-1)} style={{ background:A.surface, border:`1px solid ${A.border}`, borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:500, color:A.text }}>← Atrás</button>}
            {step<3 && <button onClick={()=>setStep(p=>p+1)} disabled={step===1&&(!client.name||!client.email)} style={{ background:step===1&&(!client.name||!client.email)?"#E4E4E7":A.ac, color:step===1&&(!client.name||!client.email)?A.mid:"#fff", border:"none", borderRadius:8, padding:"8px 20px", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>Siguiente →</button>}
            {step===3 && <>
              <button onClick={sendEmail} style={{ background:"#16A34A", color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>✉ Enviar Email</button>
              <button onClick={printPDF} style={{ background:A.ac, color:"#04090F", border:"none", borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>⬇ PDF</button>
            </>}
            <button onClick={onClose} style={{ background:A.surface, border:`1px solid ${A.border}`, borderRadius:8, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={15} color={A.mid}/></button>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:28 }}>
          {/* PASO 1: Datos cliente */}
          {step===1 && (
            <div>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:600, color:A.text, marginBottom:20 }}>Información del cliente</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[{k:"name",l:"Nombre *",ph:"Juan Pérez"},{k:"company",l:"Empresa",ph:"Mi Empresa Ltda."},{k:"email",l:"Email *",ph:"cliente@email.com"},{k:"phone",l:"Teléfono",ph:"+56 9 XXXX XXXX"}].map(f => (
                  <div key={f.k}>
                    <label style={{ fontSize:11, fontWeight:600, color:A.mid, display:"block", marginBottom:6, letterSpacing:".06em" }}>{f.l.toUpperCase()}</label>
                    <input value={client[f.k]} onChange={e=>setClient({...client,[f.k]:e.target.value})} placeholder={f.ph} style={inp}/>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20 }}>
                <label style={{ fontSize:11, fontWeight:600, color:A.mid, display:"block", marginBottom:6, letterSpacing:".06em" }}>NOTAS / DESCRIPCIÓN DEL PROYECTO</label>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Descripción del proyecto, requerimientos especiales, plazos esperados..." rows={4} style={{ ...inp, resize:"vertical" }}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:14 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:A.mid, display:"block", marginBottom:6, letterSpacing:".06em" }}>VALIDEZ (DÍAS)</label>
                  <select value={validity} onChange={e=>setValidity(e.target.value)} style={{ ...inp }}>
                    <option value="7">7 días</option><option value="15">15 días</option>
                    <option value="30">30 días</option><option value="60">60 días</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:A.mid, display:"block", marginBottom:6, letterSpacing:".06em" }}>DESCUENTO (%)</label>
                  <input type="number" min="0" max="50" value={discount} onChange={e=>setDiscount(Number(e.target.value))} style={inp}/>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Servicios */}
          {step===2 && (
            <div>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:600, color:A.text, marginBottom:6 }}>Selecciona los servicios</p>
              <p style={{ fontSize:12, color:A.mid, marginBottom:20 }}>Los precios son referenciales. Puedes agregar ítems personalizados.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
                {SERVICIOS_COTIZACION.map(s => (
                  <label key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:selected[s.id]?"#EEF2FF":A.surface, border:`1.5px solid ${selected[s.id]?"#6366F1":A.border}`, borderRadius:10, cursor:"pointer", transition:"all .2s" }}>
                    <input type="checkbox" checked={!!selected[s.id]} onChange={()=>toggleService(s.id)} style={{ width:16, height:16, accentColor:"#6366F1", cursor:"pointer", flexShrink:0 }}/>
                    <span style={{ flex:1, fontSize:13.5, color:A.text, fontWeight:selected[s.id]?500:400 }}>{s.label}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:selected[s.id]?"#4338CA":A.mid, whiteSpace:"nowrap" }}>${s.precio.toLocaleString("es-CL")}</span>
                  </label>
                ))}
              </div>
              {custom.map((c,i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:8, marginBottom:8 }}>
                  <input value={c.desc} onChange={e=>{const n=[...custom];n[i]={...n[i],desc:e.target.value};setCustom(n);}} placeholder="Servicio personalizado..." style={{...inp,marginBottom:0}}/>
                  <input type="number" value={c.precio} onChange={e=>{const n=[...custom];n[i]={...n[i],precio:e.target.value};setCustom(n);}} placeholder="Precio CLP" style={{...inp,marginBottom:0,width:140}}/>
                  <button onClick={()=>setCustom(custom.filter((_,x)=>x!==i))} style={{ background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:8,padding:"0 12px",cursor:"pointer",display:"flex",alignItems:"center" }}><X size={14} color="#F87171"/></button>
                </div>
              ))}
              <button onClick={addCustom} style={{ background:"none", border:`1px dashed ${A.border}`, borderRadius:8, padding:"10px 16px", cursor:"pointer", fontSize:13, color:A.mid, width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:4 }}>
                <Plus size={14}/> Agregar ítem personalizado
              </button>
              <div style={{ background:A.surface, borderRadius:12, padding:"16px 20px", marginTop:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, color:A.mid }}>Total estimado:</span>
                <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:22, color:A.text }}>${Math.round(total).toLocaleString("es-CL")} <span style={{ fontSize:13, fontWeight:400, color:A.mid }}>CLP</span></span>
              </div>
            </div>
          )}

          {/* PASO 3: Vista previa */}
          {step===3 && (
            <div>
              <div style={{ background:A.surface, borderRadius:14, padding:24, marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                  <div><div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:20, color:A.text, letterSpacing:"1px" }}>TEMPVS7</div><div style={{ fontSize:10, color:A.mid, letterSpacing:"3px" }}>SOFTWARE ENGINEERING</div></div>
                  <div style={{ textAlign:"right", fontSize:12, color:A.mid, lineHeight:1.8 }}>
                    <div><strong>Fecha:</strong> {today}</div>
                    <div><strong>Válida:</strong> {validity} días</div>
                  </div>
                </div>
                <div style={{ background:A.bg, borderRadius:10, padding:14, marginBottom:14 }}>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, fontWeight:600, color:A.mid, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>Cliente</div>
                  <div style={{ fontSize:14, fontWeight:600, color:A.text }}>{client.name} {client.company&&`· ${client.company}`}</div>
                  <div style={{ fontSize:13, color:A.mid }}>{client.email} {client.phone&&`· ${client.phone}`}</div>
                </div>
                <div>
                  {SERVICIOS_COTIZACION.filter(s=>selected[s.id]).map(s => (
                    <div key={s.id} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${A.border}`, fontSize:13 }}>
                      <span style={{ color:A.text }}>{s.label}</span>
                      <span style={{ fontWeight:600, color:A.text }}>${s.precio.toLocaleString("es-CL")}</span>
                    </div>
                  ))}
                  {custom.filter(c=>c.desc).map((c,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${A.border}`, fontSize:13 }}>
                      <span style={{ color:A.text }}>{c.desc}</span>
                      <span style={{ fontWeight:600, color:A.text }}>${Number(c.precio||0).toLocaleString("es-CL")}</span>
                    </div>
                  ))}
                  {discount>0 && <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", fontSize:13, color:"#16A34A" }}><span>Descuento {discount}%</span><span>-${Math.round(subtotal*discount/100).toLocaleString("es-CL")}</span></div>}
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 0 0", fontSize:18, fontWeight:800, color:A.text }}>
                    <span>TOTAL</span><span>${Math.round(total).toLocaleString("es-CL")} CLP</span>
                  </div>
                </div>
                {notes && <div style={{ marginTop:14, background:"#F0F9FF", borderLeft:"3px solid #00B4FF", padding:"12px 14px", borderRadius:4, fontSize:13, color:A.text, lineHeight:1.7 }}>{notes}</div>}
              </div>
              <p style={{ fontSize:12, color:A.mid, textAlign:"center" }}>Usa los botones arriba para enviar por email o descargar como PDF</p>
            </div>
          )}
        </div>
      </div>
      {showQuote && <QuoteModule onClose={()=>setShowQuote(false)}/>}
    </div>
  );
}

// ── IMAGE UPLOADER ────────────────────────────────────────────────
function ImageUploader({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file); onChange(url); }
    catch { alert("Error al subir. Verifica que el bucket 'images' sea público en Supabase → Storage."); }
    setUploading(false);
  };
  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ fontSize:11, fontWeight:500, color:"#6B7280", display:"block", marginBottom:6 }}>{label}</label>
      {value && (
        <div style={{ position:"relative", marginBottom:8 }}>
          <img src={value} alt="" style={{ width:"100%", height:120, objectFit:"cover", borderRadius:9, display:"block", border:"1px solid #DDE1E8" }}/>
          <button onClick={() => onChange("")} style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,.7)", border:"none", borderRadius:"50%", width:24, height:24, cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={12}/></button>
        </div>
      )}
      <div style={{ display:"flex", gap:8 }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])}/>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ background:uploading?"#F4F6F9":"#EEF2FF", border:"1px solid #DDE1E8", borderRadius:8, padding:"9px 14px", cursor:uploading?"not-allowed":"pointer", color:uploading?"#9CA3AF":"#4338CA", fontSize:12, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif", display:"flex", alignItems:"center", gap:6, flexShrink:0, whiteSpace:"nowrap" }}>
          {uploading ? <><div style={{ width:12,height:12,border:"2px solid rgba(67,56,202,.3)",borderTopColor:"#4338CA",borderRadius:"50%",animation:"spn 1s linear infinite" }}/>Subiendo...</> : "↑ Subir foto"}
        </button>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="O pega una URL..." style={{ flex:1, background:"#F4F6F9", border:"1px solid #DDE1E8", borderRadius:8, padding:"9px 12px", color:"#1A1D23", fontSize:12, fontFamily:"'Inter',sans-serif" }}/>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────
function Admin({ data, onSave, onClose }) {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState(() => { try { return localStorage.getItem("t7_email")||""; } catch { return ""; } });
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState(data.projects);
  const [sectors, setSectors] = useState(data.sectors);
  const [social, setSocial] = useState({...data.social});
  const [np, setNp] = useState({ title:"", desc:"", url:"", imgs:["","",""], tags:"" });
  const [editingId, setEditingId] = useState(null);
  const [ns, setNs] = useState("");
  const [contacts, setContacts] = useState([]);
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [aiReply, setAiReply] = useState({});
  const [loadingReply, setLoadingReply] = useState(null);
  const [showQuote, setShowQuote] = useState(false);
  const [saving, setSaving] = useState(false);

  const NAV = [
    { id:"projects",  icon:"📁", label:"Proyectos" },
    { id:"cotizacion",icon:"📋", label:"Cotizar"   },
    { id:"sectors",   icon:"🏷️", label:"Sectores"  },
    { id:"social",    icon:"🔗", label:"Redes"     },
    { id:"contacts",  icon:"💬", label:"Mensajes"  },
  ];

  const inp = {
    background:"#F7F8FA", border:"1.5px solid #E2E5EA",
    borderRadius:9, padding:"11px 14px", color:"#111827",
    fontSize:13.5, width:"100%", fontFamily:"'Inter',sans-serif",
    boxSizing:"border-box", outline:"none", transition:"border-color .2s",
  };

  const handleLogin = async () => {
    if (!email||!pwd) return;
    setLoginLoading(true); setLoginError("");
    try {
      await adminLogin(email, pwd);
      if (rememberMe) { try { localStorage.setItem("t7_email", email); } catch {} }
      setAuth(true);
    } catch { setLoginError("Email o contraseña incorrectos"); }
    setLoginLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try { await updateSocial(social); } catch(e) { console.error(e); }
    onSave({ projects, sectors, social });
    setSaving(false);
  };

  const handleClose = async () => { await adminLogout(); onClose(); };
  const startEdit = (p) => { setEditingId(p.id); setNp({ title:p.title, desc:p.desc||"", url:p.url||"", imgs:[...p.imgs], tags:p.tags.join(", ") }); };
  const cancelEdit = () => { setEditingId(null); setNp({ title:"", desc:"", url:"", imgs:["","",""], tags:"" }); };

  const loadContacts = async () => {
    if (contactsLoaded) return;
    try { const c = await getContacts(); setContacts(c); setContactsLoaded(true); } catch(e) { console.error(e); }
  };

  const suggestReply = async (c) => {
    setLoadingReply(c.id);
    try {
      const res = await fetch("/api/ai", { method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ system:"Eres Maximo Henriquez de Tempvs7. Redacta una respuesta profesional, cálida y directa a este mensaje de un potencial cliente. Máximo 5 líneas. Propón una llamada o videollamada gratuita.", messages:[{ role:"user", content:`Nombre: ${c.name}. Email: ${c.email}. Servicio: ${c.service||"no especificado"}. Mensaje: ${c.message}` }], max_tokens:250 }) });
      const d = await res.json();
      setAiReply(prev => ({...prev, [c.id]: d.content?.[0]?.text||""}));
    } catch { setAiReply(prev => ({...prev, [c.id]:"Error al generar."})); }
    setLoadingReply(null);
  };

  // ── LOGIN ──────────────────────────────────────────────────────
  if (!auth) return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(4,9,15,.97)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#07101E", border:"1px solid rgba(0,180,255,.18)", borderRadius:24, padding:"44px 40px", maxWidth:400, width:"100%", margin:24, boxShadow:"0 30px 80px rgba(0,0,0,.6)" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}><Mark size={40}/></div>
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:700, color:"#EDF4FF", marginBottom:6, textAlign:"center" }}>Panel Admin</h3>
        <p style={{ fontSize:13, color:"#8BAEC8", marginBottom:32, textAlign:"center" }}>Acceso seguro · Tempvs7</p>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:600, color:"#8BAEC8", display:"block", marginBottom:6, letterSpacing:".08em" }}>EMAIL</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="tu@email.com"
            style={{ background:"#0A1628", border:"1px solid rgba(0,180,255,.2)", borderRadius:10, padding:"13px 16px", color:"#EDF4FF", fontSize:14, width:"100%", fontFamily:"'Inter',sans-serif", boxSizing:"border-box" }}/>
        </div>
        <div style={{ marginBottom:14, position:"relative" }}>
          <label style={{ fontSize:11, fontWeight:600, color:"#8BAEC8", display:"block", marginBottom:6, letterSpacing:".08em" }}>CONTRASEÑA</label>
          <input type={showPwd?"text":"password"} value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••"
            style={{ background:"#0A1628", border:"1px solid rgba(0,180,255,.2)", borderRadius:10, padding:"13px 48px 13px 16px", color:"#EDF4FF", fontSize:14, width:"100%", fontFamily:"'Inter',sans-serif", boxSizing:"border-box" }}/>
          <button onClick={()=>setShowPwd(p=>!p)} style={{ position:"absolute", right:14, top:36, background:"none", border:"none", cursor:"pointer", color:"#8BAEC8", padding:0, display:"flex" }}>
            {showPwd
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>
        <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24, cursor:"pointer" }}>
          <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{ width:15, height:15, accentColor:C.ac }}/>
          <span style={{ fontSize:13, color:"#8BAEC8" }}>Recordar mi email</span>
        </label>
        {loginError && <p style={{ color:"#F87171", fontSize:12.5, marginBottom:16, background:"rgba(239,68,68,.1)", padding:"8px 12px", borderRadius:8, textAlign:"center" }}>{loginError}</p>}
        <button onClick={handleLogin} disabled={loginLoading} style={{ background:C.ac, color:"#04090F", border:"none", padding:"14px", borderRadius:10, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15, width:"100%", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {loginLoading ? <><div style={{ width:16,height:16,border:"2px solid rgba(0,0,0,.2)",borderTopColor:"#04090F",borderRadius:"50%",animation:"spn 1s linear infinite" }}/>Verificando...</> : "Ingresar"}
        </button>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#5A7A9A", fontSize:13, width:"100%", textAlign:"center" }}>Cancelar</button>
      </div>
    </div>
  );

  // ── PANEL ─────────────────────────────────────────────────────
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,.5)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#FFFFFF", borderRadius:20, width:"100%", maxWidth:860, height:"90vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 30px 80px rgba(0,0,0,.3)" }}>

        {/* ── HEADER ── */}
        <div style={{ padding:"16px 24px", borderBottom:"1px solid #EAECF0", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Mark size={32}/>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15, color:"#111827" }}>Panel Admin</div>
              <div style={{ fontSize:11, color:"#9CA3AF" }}>Tempvs7 · {NAV.find(n=>n.id===tab)?.label}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={handleSave} disabled={saving} style={{ background:C.ac, color:"#04090F", border:"none", padding:"9px 20px", borderRadius:9, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
              {saving ? "Guardando..." : "💾 Guardar"}
            </button>
            <button onClick={handleClose} style={{ background:"#F3F4F6", border:"none", borderRadius:9, width:38, height:38, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6B7280" }}>
              <X size={16}/>
            </button>
          </div>
        </div>

        {/* ── BODY: sidebar + contenido ── */}
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

          {/* SIDEBAR */}
          <div style={{ width:180, background:"#F9FAFB", borderRight:"1px solid #EAECF0", display:"flex", flexDirection:"column", padding:"16px 10px", gap:4, flexShrink:0 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => { setTab(n.id); if(n.id==="contacts") loadContacts(); }}
                style={{
                  display:"flex", alignItems:"center", gap:10, padding:"11px 14px",
                  borderRadius:10, border:"none", cursor:"pointer", textAlign:"left",
                  background: tab===n.id ? "#EEF2FF" : "transparent",
                  color: tab===n.id ? "#4338CA" : "#4B5563",
                  fontFamily:"'Inter',sans-serif", fontSize:13.5, fontWeight: tab===n.id ? 600 : 400,
                  transition:"all .15s",
                }}>
                <span style={{ fontSize:16 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>

          {/* CONTENIDO */}
          <div style={{ flex:1, overflowY:"auto", padding:28, background:"#fff" }}>

            {/* ── PROYECTOS ── */}
            {tab==="projects" && (
              <div>
                <div style={{ marginBottom:22 }}>
                  <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:"#111827", marginBottom:4 }}>{editingId ? "✏️ Editar proyecto" : "➕ Nuevo proyecto"}</h2>
                  <p style={{ fontSize:13, color:"#6B7280" }}>Completa los campos y guarda.</p>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ fontSize:11, fontWeight:600, color:"#6B7280", display:"block", marginBottom:5, letterSpacing:".06em" }}>TÍTULO *</label>
                    <input value={np.title} onChange={e=>setNp({...np,title:e.target.value})} placeholder="Nombre del proyecto" style={inp}/>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:"#6B7280", display:"block", marginBottom:5, letterSpacing:".06em" }}>URL DEL PROYECTO</label>
                    <input value={np.url} onChange={e=>setNp({...np,url:e.target.value})} placeholder="https://..." style={inp}/>
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:"#6B7280", display:"block", marginBottom:5, letterSpacing:".06em" }}>TAGS</label>
                    <input value={np.tags} onChange={e=>setNp({...np,tags:e.target.value})} placeholder="React, AWS, Node.js" style={inp}/>
                  </div>
                </div>

                <div style={{ marginBottom:14, position:"relative" }}>
                  <label style={{ fontSize:11, fontWeight:600, color:"#6B7280", display:"block", marginBottom:5, letterSpacing:".06em" }}>DESCRIPCIÓN</label>
                  <textarea value={np.desc} onChange={e=>setNp({...np,desc:e.target.value})} placeholder="Describe el proyecto..." rows={3} style={{ ...inp, resize:"vertical", paddingRight:110 }}/>
                  <button onClick={async()=>{
                    if(!np.title){alert("Escribe el título primero.");return;}
                    const btn=document.getElementById("aiBtn"); if(btn){btn.textContent="...";btn.disabled=true;}
                    try{
                      const res=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:"Genera una descripción profesional de máximo 50 palabras para este proyecto de desarrollo web. Solo el texto, sin comillas.",messages:[{role:"user",content:`Proyecto: ${np.title}. Tags: ${np.tags||"desarrollo web"}`}],max_tokens:120})});
                      const d=await res.json();
                      setNp(prev=>({...prev,desc:(d.content?.[0]?.text||"").trim()}));
                    }catch{}
                    if(btn){btn.textContent="✨ IA";btn.disabled=false;}
                  }} id="aiBtn" style={{ position:"absolute",top:28,right:8,background:C.ac,color:"#04090F",border:"none",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif" }}>✨ IA</button>
                </div>

                <div style={{ background:"#F9FAFB", borderRadius:12, padding:16, marginBottom:18 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"#6B7280", letterSpacing:".06em", marginBottom:12 }}>IMÁGENES DEL PROYECTO</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                    {["Principal *","Imagen 2","Imagen 3"].map((lbl,i) => (
                      <ImageUploader key={i} label={lbl} value={np.imgs[i]} onChange={v=>{const imgs=[...np.imgs];imgs[i]=v;setNp({...np,imgs});}}/>
                    ))}
                  </div>
                </div>

                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={async()=>{
                    if(!np.title)return;
                    const tags=np.tags.split(",").map(t=>t.trim()).filter(Boolean);
                    if(editingId){
                      const updated={...np,id:editingId,tags};
                      try{await updateProject(updated);}catch(e){console.error(e);}
                      setProjects(projects.map(x=>x.id===editingId?updated:x)); cancelEdit();
                    } else {
                      const p={id:Date.now(),...np,tags};
                      try{await saveProject(p);}catch(e){console.error(e);}
                      setProjects([...projects,p]);
                      setNp({title:"",desc:"",url:"",imgs:["","",""],tags:""});
                    }
                  }} style={{ background:editingId?"#7C3AED":C.ac, color:"#fff", border:"none", padding:"11px 24px", borderRadius:9, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:13.5, display:"flex", alignItems:"center", gap:6 }}>
                    {editingId ? <><Check size={15}/>Guardar cambios</> : <><Plus size={15}/>Agregar proyecto</>}
                  </button>
                  {editingId && <button onClick={cancelEdit} style={{ background:"#F3F4F6", border:"none", color:"#4B5563", padding:"11px 18px", borderRadius:9, cursor:"pointer", fontSize:13 }}>Cancelar</button>}
                </div>

                {projects.length > 0 && (
                  <div style={{ marginTop:28 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:"#6B7280", letterSpacing:".06em", marginBottom:12 }}>PROYECTOS ACTUALES ({projects.length})</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {projects.map(p => (
                        <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background: editingId===p.id?"#EEF2FF":"#F9FAFB", border:`1.5px solid ${editingId===p.id?"#6366F1":"#EAECF0"}`, borderRadius:10 }}>
                          {p.imgs?.[0] && <img src={p.imgs[0]} alt="" style={{ width:48, height:36, objectFit:"cover", borderRadius:6, flexShrink:0 }}/>}
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontWeight:600, fontSize:13.5, color:"#111827", marginBottom:2 }}>{p.title}</div>
                            <div style={{ fontSize:12, color:"#9CA3AF", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.tags?.join(", ")}</div>
                          </div>
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={()=>startEdit(p)} style={{ background:"#EEF2FF", border:"1px solid #C7D2FE", borderRadius:7, padding:"6px 12px", cursor:"pointer", color:"#4338CA", fontSize:12, fontWeight:500 }}>Editar</button>
                            <button onClick={async()=>{try{await deleteProject(p.id);}catch{}setProjects(projects.filter(x=>x.id!==p.id));}} style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:7, padding:"6px 10px", cursor:"pointer", display:"flex", alignItems:"center" }}><Trash2 size={13} color="#EF4444"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── COTIZACIONES ── */}
            {tab==="cotizacion" && (
              <div style={{ textAlign:"center", paddingTop:32 }}>
                <div style={{ fontSize:52, marginBottom:16 }}>📋</div>
                <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:"#111827", marginBottom:8 }}>Módulo de Cotización</h2>
                <p style={{ fontSize:14, color:"#6B7280", maxWidth:400, margin:"0 auto 28px", lineHeight:1.65 }}>Crea propuestas profesionales con desglose de servicios. Genera PDF o envía por email con un clic.</p>
                <button onClick={()=>setShowQuote(true)} style={{ background:C.ac, color:"#04090F", border:"none", padding:"14px 32px", borderRadius:10, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15, display:"inline-flex", alignItems:"center", gap:8 }}>
                  <Plus size={16}/> Nueva Cotización
                </button>
              </div>
            )}

            {/* ── SECTORES ── */}
            {tab==="sectors" && (
              <div>
                <div style={{ marginBottom:22 }}>
                  <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:"#111827", marginBottom:4 }}>🏷️ Sectores que atiendes</h2>
                  <p style={{ fontSize:13, color:"#6B7280" }}>Aparecen en el carrusel del sitio.</p>
                </div>
                <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                  <input value={ns} onChange={e=>setNs(e.target.value)} onKeyDown={async e=>{ if(e.key==="Enter"&&ns.trim()){try{await addSector(ns.trim());}catch{}setSectors([...sectors,ns.trim()]);setNs(""); }}} placeholder="Ej: Tecnología, Retail, Salud..." style={{ ...inp, flex:1 }}/>
                  <button onClick={async()=>{ if(!ns.trim())return; try{await addSector(ns.trim());}catch{} setSectors([...sectors,ns.trim()]); setNs(""); }} style={{ background:C.ac, color:"#04090F", border:"none", padding:"0 20px", borderRadius:9, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:13, display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    <Plus size={14}/> Agregar
                  </button>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {sectors.map((s,i) => (
                    <div key={i} style={{ background:"#EEF2FF", border:"1px solid #C7D2FE", borderRadius:20, padding:"8px 16px", display:"flex", alignItems:"center", gap:8, fontSize:13.5, fontWeight:500, color:"#3730A3" }}>
                      {s}
                      <button onClick={async()=>{ try{await removeSector(s);}catch{} setSectors(sectors.filter((_,x)=>x!==i)); }} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", opacity:.6, marginLeft:2 }}><X size={14} color="#4338CA"/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── REDES ── */}
            {tab==="social" && (
              <div>
                <div style={{ marginBottom:22 }}>
                  <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:"#111827", marginBottom:4 }}>🔗 Redes y Contacto</h2>
                  <p style={{ fontSize:13, color:"#6B7280" }}>Configura tus redes sociales y el número de WhatsApp.</p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:18, maxWidth:480 }}>
                  {[
                    { k:"linkedin",  lbl:"LinkedIn URL",               ph:"https://linkedin.com/in/...",  icon:"💼" },
                    { k:"instagram", lbl:"Instagram URL",              ph:"https://instagram.com/...",    icon:"📷" },
                    { k:"whatsapp",  lbl:"WhatsApp (con código país)", ph:"+56 9 XXXX XXXX",              icon:"💬" },
                  ].map(s => (
                    <div key={s.k}>
                      <label style={{ fontSize:11, fontWeight:600, color:"#6B7280", display:"block", marginBottom:6, letterSpacing:".06em" }}>{s.icon} {s.lbl.toUpperCase()}</label>
                      <input value={social[s.k]||""} onChange={e=>setSocial({...social,[s.k]:e.target.value})} placeholder={s.ph} style={inp}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MENSAJES ── */}
            {tab==="contacts" && (
              <div>
                <div style={{ marginBottom:22 }}>
                  <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:"#111827", marginBottom:4 }}>💬 Mensajes recibidos</h2>
                  <p style={{ fontSize:13, color:"#6B7280" }}>Contactos del formulario y el chatbot.</p>
                </div>
                {contacts.length===0 && <div style={{ textAlign:"center", padding:"40px 0", color:"#9CA3AF", fontSize:14 }}>No hay mensajes aún.</div>}
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {contacts.map(c => (
                    <div key={c.id} style={{ background:"#F9FAFB", border:"1.5px solid #EAECF0", borderRadius:14, padding:18 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:8, flexWrap:"wrap" }}>
                        <div>
                          <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{c.name}</div>
                          <div style={{ fontSize:12.5, color:"#6B7280", marginTop:2 }}>{c.email}{c.phone&&` · ${c.phone}`}</div>
                        </div>
                        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                          {c.service && <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"#EEF2FF", color:"#4338CA", fontWeight:600 }}>{c.service}</span>}
                          <span style={{ fontSize:11, color:"#9CA3AF" }}>{new Date(c.created_at).toLocaleDateString("es-CL")}</span>
                        </div>
                      </div>
                      <p style={{ fontSize:13.5, color:"#374151", lineHeight:1.65, background:"#fff", borderRadius:8, padding:"10px 14px", border:"1px solid #E5E7EB", marginBottom:12 }}>{c.message}</p>
                      {aiReply[c.id] ? (
                        <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:14 }}>
                          <div style={{ fontSize:11, color:"#16A34A", fontWeight:700, marginBottom:6, letterSpacing:".06em" }}>✦ RESPUESTA SUGERIDA</div>
                          <p style={{ fontSize:13, color:"#166534", lineHeight:1.7, whiteSpace:"pre-wrap", marginBottom:10 }}>{aiReply[c.id]}</p>
                          <a href={`mailto:${c.email}?subject=Re: Tu consulta en Tempvs7&body=${encodeURIComponent(aiReply[c.id])}`}
                            style={{ fontSize:12.5, fontWeight:600, color:"#16A34A", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:4 }}>
                            ✉ Abrir en mail →
                          </a>
                        </div>
                      ) : (
                        <button onClick={()=>suggestReply(c)} disabled={loadingReply===c.id}
                          style={{ background:"#EEF2FF", border:"1px solid #C7D2FE", color:"#4338CA", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:12.5, fontWeight:600, fontFamily:"'Inter',sans-serif", display:"inline-flex", alignItems:"center", gap:6, opacity:loadingReply===c.id?.6:1 }}>
                          {loadingReply===c.id ? "Generando..." : "✦ Sugerir respuesta con IA"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      {showQuote && <QuoteModule onClose={()=>setShowQuote(false)}/>}
    </div>
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
      <Diagnostico/>
      <ROICalculator/>
      <Estimador/>
      <Sectors sectors={data.sectors}/>
      <Projects projects={data.projects}/>
      <About social={data.social}/>
      <FAQDinamica/>
      <Contact/>
      <Footer social={data.social} onAdmin={() => setAdmin(true)}/>
      <WhatsApp number={data.social?.whatsapp}/>
      <ChatBot/>
      {admin && <Admin data={data} onSave={d=>{setData(d);setAdmin(false);}} onClose={() => setAdmin(false)}/>}
    </>
  );
}
