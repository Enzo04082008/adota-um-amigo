/**
 * ADOTA UM AMIGO — React App
 * The Witcher Style
 *
 * Conceitos React abordados:
 *  - Componentes funcionais & JSX
 *  - Props & State (useState)
 *  - Efeitos & ciclo de vida (useEffect)
 *  - Hooks personalizados (useScrollReveal, useCustomCursor, useScrollNav)
 *  - Fetching de dados via API externa (The Dog API / The Cat API)
 *  - Renderização condicional e listas (.map, .filter)
 *  - Navegação com React Router (HashRouter, Routes, Route, Link, useParams, useNavigate)
 *  - Organização modular (cada secção é o seu próprio componente)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

/* ─────────────────────────────────────────────
   DADOS ESTÁTICOS (Bestiário local)
   Complementados com dados da API externa
───────────────────────────────────────────── */
const ANIMAIS_LOCAIS = [
  {
    id: "thor",
    nome: "Thor",
    tipo: "caes",
    genero: "Macho",
    idade: "3 anos",
    porte: "Grande",
    estado: "Vacinado ✓",
    emoji: "🐺",
    destaque: false,
    entrada:
      "Um guerreiro leal e veloz como o vento das planícies. Ama correr e proteger os seus. Vacinado e pronto para aventuras.",
    localizacao: "Porto, Portugal",
    raca: "Husky Siberiano",
    descricao:
      "Thor chegou ao abrigo depois de ser encontrado nas margens do Douro, sozinho e faminto. Apesar das cicatrizes do passado, mantém o coração de um lobo nobre — fiel, corajoso e cheio de amor. Ideal para famílias activas que gostem de caminhadas e espaços ao ar livre.",
  },
  {
    id: "mia",
    nome: "Mia",
    tipo: "gatos",
    genero: "Fêmea",
    idade: "2 anos",
    porte: "Pequeno",
    estado: "Castrada ✓",
    emoji: "🐱",
    destaque: true,
    entrada:
      "Uma feiticeira de olhos dourados. Dócil como a calmaria antes da tempestade, feroz no amor que oferece a quem a merecer.",
    localizacao: "Lisboa, Portugal",
    raca: "Persa mix",
    descricao:
      "Mia chegou como um enigma — silenciosa, altiva e com um olhar que parece atravessar a alma. Com o tempo, revela-se uma companheira gentil e carinhosa, especialmente com adultos tranquilos. Perfeita para apartamentos e lares serenos.",
  },
  {
    id: "mel",
    nome: "Mel",
    tipo: "caes",
    genero: "Fêmea",
    idade: "1 ano",
    porte: "Médio",
    estado: "Vacinada ✓",
    emoji: "🐶",
    destaque: false,
    entrada:
      "Filhote de espírito dourado, nascida para trazer luz aos lares sombrios. Ama crianças e não conhece inimigos.",
    localizacao: "Coimbra, Portugal",
    raca: "Golden Retriever mix",
    descricao:
      "Mel é pura alegria em forma de cão. Jovem, enérgica e incapaz de guardar rancor, adapta-se a qualquer família e adora crianças. Está a fazer treino básico e aprende rapidamente.",
  },
  {
    id: "simba",
    nome: "Simba",
    tipo: "gatos",
    genero: "Macho",
    idade: "4 anos",
    porte: "Médio",
    estado: "Castrado ✓",
    emoji: "🦁",
    destaque: false,
    entrada:
      "Rei deposto que aguarda o seu regresso ao trono. Sábio, paciente e absolutamente majestoso.",
    localizacao: "Braga, Portugal",
    raca: "Maine Coon mix",
    descricao:
      "Simba é o sábio do abrigo. Com os seus quatro anos e postura real, é um gato experiente que prefere a paz a brincadeiras caóticas. Ideal para quem busca um companheiro sereno e independente.",
  },
  {
    id: "bolinha",
    nome: "Bolinha",
    tipo: "outros",
    genero: "Macho",
    idade: "1 ano",
    porte: "Pequeno",
    estado: "Vacinado ✓",
    emoji: "🐰",
    destaque: false,
    entrada:
      "Pequeno mas feroz. Este coelho de olhos atentos guarda mais coragem do que o seu tamanho sugere.",
    localizacao: "Faro, Portugal",
    raca: "Coelho anão",
    descricao:
      "Bolinha prova que os heróis vêm em todos os tamanhos. É um coelho curioso e activo, que adora explorar o espaço ao redor. Precisa de espaço para correr e muito amor.",
  },
  {
    id: "bob",
    nome: "Bob",
    tipo: "caes",
    genero: "Macho",
    idade: "5 anos",
    porte: "Grande",
    estado: "Vacinado ✓",
    emoji: "🐕",
    destaque: false,
    entrada:
      "Um veterano de mil batalhas. Bob sobreviveu ao abandono e ao inverno — e ainda assim, abanando o rabo, oferece todo o seu amor.",
    localizacao: "Setúbal, Portugal",
    raca: "Labrador mix",
    descricao:
      "Bob é o mais velho do abrigo e o mais paciente. Cinco anos de vida moldaram-no num companheiro calmo, gentil e absolutamente fiel. Ideal para quem procura um cão adulto, já socializado.",
  },
];

/* ─────────────────────────────────────────────
   HOOK PERSONALIZADO — useScrollNav
   Adiciona classe 'scrolled' à nav no scroll
───────────────────────────────────────────── */
function useScrollNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

function PassoCard({ p, i, setHovering }) {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <>
      <div
        ref={ref}
        style={{
          flex: "1 1 180px",
          maxWidth: 220,
          textAlign: "center",
          padding: "2rem 1.2rem",
          border: "1px solid rgba(201,168,76,0.15)",
          background: "rgba(20,16,8,0.6)",
          transform: visible ? "translateY(0)" : "translateY(20px)",
          opacity: visible ? 1 : 0,
          transition: "0.5s",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div>{p.num}</div>
        <div>{p.glyph}</div>
        <h3>{p.titulo}</h3>
        <p>{p.desc}</p>
      </div>

      {i < 3 && <div>✦</div>}
    </>
  );
}

/* ─────────────────────────────────────────────
   HOOK PERSONALIZADO — useCustomCursor
───────────────────────────────────────────── */
function useCustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return { pos, hovering, setHovering };
}

/* ─────────────────────────────────────────────
   HOOK PERSONALIZADO — useScrollReveal
   Intersection Observer para animações de entrada
───────────────────────────────────────────── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─────────────────────────────────────────────
   HOOK PERSONALIZADO — useAnimalAPI
   Fetching de imagens reais da API pública
   The Dog API: https://dog.ceo/api
   The Cat API: https://api.thecatapi.com
───────────────────────────────────────────── */
function useAnimalAPI(tipo) {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setImgUrl(null);

    async function fetchImg() {
      try {
        let url = null;
        if (tipo === "caes") {
          const res = await fetch("https://dog.ceo/api/breeds/image/random");
          const data = await res.json();
          url = data.status === "success" ? data.message : null;
        } else if (tipo === "gatos") {
          const res = await fetch("https://api.thecatapi.com/v1/images/search");
          const data = await res.json();
          url = data[0]?.url ?? null;
        }
        if (!cancelled) setImgUrl(url);
      } catch {
        // API offline — mostra emoji fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchImg();
    return () => { cancelled = true; };
  }, [tipo]);

  return { imgUrl, loading };
}

/* ─────────────────────────────────────────────
   COMPONENTE — CustomCursor
───────────────────────────────────────────── */
function CustomCursor({ pos, hovering }) {
  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 24,
        height: 24,
        fontSize: 14,
        color: "#c9a84c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10000,
        transform: `translate(-50%,-50%) ${hovering ? "scale(1.6) rotate(45deg)" : "scale(1)"}`,
        transition: "transform 0.15s, color 0.2s",
        filter: "drop-shadow(0 0 6px #c9a84c)",
        textShadow: "0 0 8px #c9a84c",
      }}
    >
      ✦
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — Navbar
───────────────────────────────────────────── */
function Navbar({ setHovering }) {
  const scrolled = useScrollNav();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    background: scrolled ? "rgba(13,11,8,0.93)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(232,213,163,0.1)" : "none",
    transition: "background 0.4s",
  };

  return (
    <nav style={navStyle}>
      <div style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(232,213,163,0.18)", letterSpacing: "0.3em", padding: "0.3rem" }}>
        ᛞ ᚢ ᛚ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
        {/* Logo */}
        <Link to="/" style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.1rem", color: "#c9a84c", letterSpacing: "0.1em", textDecoration: "none" }}
          onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
          ☽ Adota um Amigo ☾
        </Link>

        {/* Links Desktop */}
        <ul style={{ display: "flex", gap: "2rem", listStyle: "none", fontFamily: "'Cinzel', serif", fontSize: "0.82rem", letterSpacing: "0.1em" }}>
          {isHome ? (
            <>
              {["bestiario", "ritual", "cronicas"].map((id) => (
                <li key={id}>
                  <a href={`#${id}`} style={{ color: "rgba(232,213,163,0.7)", transition: "color 0.2s" }}
                    onMouseEnter={e => { e.target.style.color = "#c9a84c"; setHovering(true); }}
                    onMouseLeave={e => { e.target.style.color = "rgba(232,213,163,0.7)"; setHovering(false); }}>
                    {id === "bestiario" ? "O Bestiário" : id === "ritual" ? "O Ritual" : "Crónicas"}
                  </a>
                </li>
              ))}
            </>
          ) : null}
          <li>
            <Link to="/sobre" style={{ color: "rgba(232,213,163,0.7)", transition: "color 0.2s" }}
              onMouseEnter={e => { e.target.style.color = "#c9a84c"; setHovering(true); }}
              onMouseLeave={e => { e.target.style.color = "rgba(232,213,163,0.7)"; setHovering(false); }}>
              Sobre
            </Link>
          </li>
        </ul>

        {/* Hamburger mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 4 }}
          className="hamburger-btn">
          {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 22, height: 2, background: "#c9a84c" }} />)}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "rgba(13,11,8,0.97)", borderTop: "1px solid rgba(201,168,76,0.2)", padding: "1.5rem 2rem", textAlign: "center" }}>
          <ul style={{ listStyle: "none", fontFamily: "'Cinzel', serif", fontSize: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li><a href="#bestiario" onClick={() => setMenuOpen(false)} style={{ color: "#c9a84c" }}>O Bestiário</a></li>
            <li><a href="#ritual" onClick={() => setMenuOpen(false)} style={{ color: "#c9a84c" }}>O Ritual</a></li>
            <li><Link to="/sobre" onClick={() => setMenuOpen(false)} style={{ color: "#c9a84c" }}>Sobre</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — HeroSection
───────────────────────────────────────────── */
function HeroSection({ setHovering }) {
  const [flicker, setFlicker] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFlicker(Math.random()), 180);
    return () => clearInterval(id);
  }, []);

  const glow = `0 2px 32px rgba(0,0,0,0.8), 0 0 ${60 + flicker * 40}px rgba(201,168,76,${0.08 + flicker * 0.06})`;

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", textAlign: "center", padding: "8rem 1.5rem 4rem",
      background: "radial-gradient(ellipse at 50% 0%, #241d10 0%, #0d0b08 60%)",
    }}>
      {/* Fog layers */}
      {[1,2,3].map(i => (
        <div key={i} style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: `${20 + i * 8}vh`,
          background: `radial-gradient(ellipse at 50% 100%, rgba(200,180,130,${0.04 - i * 0.01}) 0%, transparent 70%)`,
          animation: `fogDrift${i} ${12 + i * 4}s ease-in-out infinite alternate`,
          pointerEvents: "none",
        }} />
      ))}

      <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.8rem", letterSpacing: "0.4em", color: "rgba(232,213,163,0.5)", marginBottom: "1.5rem" }}>
        — Bestiário do Coração —
      </p>

      <h1 style={{
        fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(3rem, 8vw, 6rem)",
        lineHeight: 1.1, color: "#e8d5a3", textShadow: glow, marginBottom: "2rem",
      }}>
        Todo Ser<br /><em style={{ color: "#c9a84c", fontStyle: "italic" }}>Merece</em><br />um Lar
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.8rem", color: "rgba(232,213,163,0.3)", letterSpacing: "0.3em" }}>ᚦ</span>
        <div style={{ height: 1, width: 60, background: "rgba(201,168,76,0.3)" }} />
        <span style={{ fontSize: "1.5rem" }}>🐺</span>
        <div style={{ height: 1, width: 60, background: "rgba(201,168,76,0.3)" }} />
        <span style={{ fontSize: "0.8rem", color: "rgba(232,213,163,0.3)", letterSpacing: "0.3em" }}>ᚦ</span>
      </div>

      <blockquote style={{
        maxWidth: 640, fontFamily: "'Crimson Text', serif", fontSize: "1.1rem",
        fontStyle: "italic", color: "rgba(232,213,163,0.65)", lineHeight: 1.8,
        borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: "1.5rem", marginBottom: "2.5rem",
      }}>
        "Num mundo repleto de criaturas abandonadas à sua sorte, existem aqueles que escolhem a misericórdia."
      </blockquote>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3rem" }}>
        <a href="#bestiario"
          style={{ fontFamily: "'Cinzel', serif", fontSize: "0.85rem", letterSpacing: "0.15em", padding: "0.9rem 2rem", border: "1px solid #c9a84c", color: "#c9a84c", background: "rgba(201,168,76,0.08)", transition: "all 0.3s" }}
          onMouseEnter={e => { e.target.style.background = "rgba(201,168,76,0.18)"; setHovering(true); }}
          onMouseLeave={e => { e.target.style.background = "rgba(201,168,76,0.08)"; setHovering(false); }}>
          ⚔ Consultar o Bestiário ⚔
        </a>
        <a href="#ritual"
          style={{ fontFamily: "'Cinzel', serif", fontSize: "0.85rem", letterSpacing: "0.15em", padding: "0.9rem 2rem", border: "1px solid rgba(232,213,163,0.2)", color: "rgba(232,213,163,0.7)", background: "transparent", transition: "all 0.3s" }}
          onMouseEnter={e => { e.target.style.borderColor = "#c9a84c"; setHovering(true); }}
          onMouseLeave={e => { e.target.style.borderColor = "rgba(232,213,163,0.2)"; setHovering(false); }}>
          O Ritual da Adoção
        </a>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        {[["847", "Almas Resgatadas"], ["200+", "À espera de um lar"], ["∞", "Amor oferecido"]].map(([num, lbl], i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.8rem", color: "#c9a84c" }}>{num}</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(232,213,163,0.4)", textTransform: "uppercase" }}>{lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — AnimalCard
   Recebe um animal como prop e renderiza o card
───────────────────────────────────────────── */
function AnimalCard({ animal, setHovering, delay = 0 }) {
  const { ref, visible } = useScrollReveal(0.1);
  const { imgUrl, loading } = useAnimalAPI(animal.tipo);
  const navigate = useNavigate();

  return (
    <article
      ref={ref}
      onClick={() => navigate(`/animal/${animal.id}`)}
      style={{
        position: "relative",
        border: `1px solid ${animal.destaque ? "#c9a84c" : "rgba(201,168,76,0.2)"}`,
        background: animal.destaque ? "rgba(201,168,76,0.06)" : "rgba(20,16,8,0.8)",
        padding: "1.5rem",
        cursor: "pointer",
        transition: "transform 0.3s, box-shadow 0.3s, opacity 0.5s",
        transform: visible ? "translateY(0)" : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        boxShadow: animal.destaque ? "0 0 30px rgba(201,168,76,0.12)" : "none",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.15)"; setHovering(true); }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = animal.destaque ? "0 0 30px rgba(201,168,76,0.12)" : "none"; setHovering(false); }}
    >
      {/* Corner ornaments */}
      {["◤","◥","◣","◢"].map((c,i) => (
        <span key={i} style={{
          position: "absolute", fontSize: "0.9rem", color: "rgba(201,168,76,0.4)",
          top: i < 2 ? 6 : "auto", bottom: i >= 2 ? 6 : "auto",
          left: i % 2 === 0 ? 6 : "auto", right: i % 2 !== 0 ? 6 : "auto",
        }}>{c}</span>
      ))}

      {animal.destaque && (
        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#c9a84c", color: "#0d0b08", fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.15em", padding: "0.2rem 0.8rem", whiteSpace: "nowrap" }}>
          ⭐ Destaque do Bestiário
        </div>
      )}

      <div style={{ fontSize: "0.7rem", textAlign: "center", letterSpacing: "0.3em", color: "rgba(201,168,76,0.3)", marginBottom: "1rem" }}>✦ ᚢᛞ ✦</div>

      {/* Imagem da API ou emoji fallback */}
      <div style={{ height: 140, borderRadius: 2, overflow: "hidden", marginBottom: "1rem", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {loading ? (
          <span style={{ fontSize: "2.5rem", opacity: 0.5, animation: "pulse 1.5s ease-in-out infinite" }}>{animal.emoji}</span>
        ) : imgUrl ? (
          <img src={imgUrl} alt={animal.nome} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(40%) brightness(0.8)" }} />
        ) : (
          <span style={{ fontSize: "3.5rem" }}>{animal.emoji}</span>
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(232,213,163,0.5)" }}>
          {animal.tipo === "caes" ? "Cão" : animal.tipo === "gatos" ? "Gato" : "Outro"} · {animal.genero}
        </span>
        <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.4rem", color: "#c9a84c", margin: "0.3rem 0" }}>{animal.nome}</h3>
        <div style={{ color: "rgba(201,168,76,0.3)", fontSize: "0.8rem", marginBottom: "0.75rem" }}>— ✦ —</div>
        <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: "italic", fontSize: "0.9rem", color: "rgba(232,213,163,0.6)", lineHeight: 1.6, marginBottom: "1rem" }}>
          "{animal.entrada}"
        </p>
        <div style={{ borderTop: "1px solid rgba(201,168,76,0.15)", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "1rem" }}>
          {[["Idade", animal.idade], ["Porte", animal.porte], ["Estado", animal.estado]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Cinzel', serif", fontSize: "0.68rem", color: "rgba(232,213,163,0.5)" }}>
              <span>{k}</span><span style={{ color: "rgba(232,213,163,0.8)" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.15em", padding: "0.6rem 1rem", border: "1px solid rgba(201,168,76,0.4)", color: "#c9a84c", background: "rgba(201,168,76,0.06)", marginTop: "0.5rem" }}>
          ⚔ Ver Ficha Completa ⚔
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — FilterBar
   Barra de filtros por tipo de animal
───────────────────────────────────────────── */
function FilterBar({ filtro, setFiltro, filtroRaca, setFiltroRaca, filtroLocalizacao, setFiltroLocalizacao, setHovering, racas, localizacoes }) {
  const opcoes = [
    { valor: "todos", label: "✦ Todos" },
    { valor: "caes", label: "🐺 Cães" },
    { valor: "gatos", label: "🐱 Gatos" },
    { valor: "outros", label: "🐰 Outros" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "0.9rem", marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        {opcoes.map(({ valor, label }) => (
          <button key={valor} onClick={() => setFiltro(valor)}
            style={{
              fontFamily: "'Cinzel', serif", fontSize: "0.78rem", letterSpacing: "0.15em",
              padding: "0.45rem 1rem",
              border: `1px solid ${filtro === valor ? "#c9a84c" : "rgba(201,168,76,0.2)"}`,
              color: filtro === valor ? "#0d0b08" : "rgba(232,213,163,0.6)",
              background: filtro === valor ? "#c9a84c" : "transparent",
              transition: "all 0.25s", cursor: "pointer",
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <select value={filtroRaca} onChange={e => setFiltroRaca(e.target.value)} style={{ fontFamily: "'Crimson Text', serif", fontSize: "0.9rem", padding: "0.45rem 0.8rem", border: "1px solid rgba(201,168,76,0.2)", background: "rgba(20,16,8,0.8)", color: "#e8d5a3", cursor: "pointer", minWidth: 140 }}
          onFocus={e => e.target.style.borderColor = "#c9a84c"}
          onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.2)"}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}>
          <option value="todos">Todas as Raças</option>
          {racas.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select value={filtroLocalizacao} onChange={e => setFiltroLocalizacao(e.target.value)} style={{ fontFamily: "'Crimson Text', serif", fontSize: "0.9rem", padding: "0.45rem 0.8rem", border: "1px solid rgba(201,168,76,0.2)", background: "rgba(20,16,8,0.8)", color: "#e8d5a3", cursor: "pointer", minWidth: 140 }}
          onFocus={e => e.target.style.borderColor = "#c9a84c"}
          onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.2)"}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}>
          <option value="todos">Todas as Localizações</option>
          {localizacoes.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — SearchBar
   Barra de pesquisa por nome
───────────────────────────────────────────── */
function SearchBar({ pesquisa, setPesquisa }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
      <input
        type="text"
        placeholder="🔍  Procurar criatura (nome, raça ou localização)..."
        value={pesquisa}
        onChange={e => setPesquisa(e.target.value)}
        style={{
          fontFamily: "'Crimson Text', serif", fontSize: "1rem",
          padding: "0.65rem 1.5rem", width: "100%", maxWidth: 420,
          background: "rgba(20,16,8,0.8)", border: "1px solid rgba(201,168,76,0.25)",
          color: "#e8d5a3", outline: "none", borderRadius: 0,
          transition: "border-color 0.25s",
        }}
        onFocus={e => e.target.style.borderColor = "#c9a84c"}
        onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.25)"}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — BestiarioSection
   Lista de animais com filtros e pesquisa
───────────────────────────────────────────── */
function BestiarioSection({ setHovering }) {
  const [filtro, setFiltro] = useState("todos");
  const [filtroRaca, setFiltroRaca] = useState("todos");
  const [filtroLocalizacao, setFiltroLocalizacao] = useState("todos");
  const [pesquisa, setPesquisa] = useState("");

  const racas = Array.from(new Set(ANIMAIS_LOCAIS.map(a => a.raca))).sort();
  const localizacoes = Array.from(new Set(ANIMAIS_LOCAIS.map(a => a.localizacao))).sort();

  // Renderização condicional e listas com .filter e .map
  const animaisFiltrados = ANIMAIS_LOCAIS.filter(a => {
    const passaTipo = filtro === "todos" || a.tipo === filtro;
    const passaRaca = filtroRaca === "todos" || a.raca === filtroRaca;
    const passaLocalizacao = filtroLocalizacao === "todos" || a.localizacao === filtroLocalizacao;
    const term = pesquisa.toLowerCase();
    const passaPesquisa =
      a.nome.toLowerCase().includes(term) ||
      a.raca.toLowerCase().includes(term) ||
      a.localizacao.toLowerCase().includes(term);
    return passaTipo && passaRaca && passaLocalizacao && passaPesquisa;
  });

  return (
    <section id="bestiario" style={{ padding: "6rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
      <SectionHeader
        over="— Manuscrito dos Companheiros —"
        title={<>O <em style={{ color: "#c9a84c" }}>Bestiário</em> dos Animais Perdidos</>}
        lore="Cada criatura aqui catalogada aguarda um bravo guardião. Consulta as entradas e descobre quem ressoa com a tua alma."
      />
      <SearchBar pesquisa={pesquisa} setPesquisa={setPesquisa} />
      <FilterBar
        filtro={filtro}
        setFiltro={setFiltro}
        filtroRaca={filtroRaca}
        setFiltroRaca={setFiltroRaca}
        filtroLocalizacao={filtroLocalizacao}
        setFiltroLocalizacao={setFiltroLocalizacao}
        setHovering={setHovering}
        racas={racas}
        localizacoes={localizacoes}
      />

      {/* Renderização condicional — sem resultados */}
      {animaisFiltrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", fontFamily: "'Cinzel', serif", color: "rgba(232,213,163,0.4)", fontSize: "1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔮</div>
          Nenhuma criatura encontrada para "{pesquisa}"
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {/* Renderização de lista com .map e props */}
          {animaisFiltrados.map((animal, i) => (
            <AnimalCard key={animal.id} animal={animal} setHovering={setHovering} delay={i * 80} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — SectionHeader (reutilizável)
───────────────────────────────────────────── */
function SectionHeader({ over, title, lore }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.78rem", letterSpacing: "0.4em", color: "rgba(232,213,163,0.4)", marginBottom: "0.75rem" }}>{over}</p>
      <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#e8d5a3", marginBottom: "1rem" }}>{title}</h2>
      {lore && <p style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.05rem", color: "rgba(232,213,163,0.55)", maxWidth: 600, margin: "0 auto 1.5rem" }}>{lore}</p>}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
        <div style={{ height: 1, width: 80, background: "rgba(201,168,76,0.25)" }} />
        <span style={{ color: "#c9a84c", fontSize: "0.8rem" }}>◆</span>
        <div style={{ height: 1, width: 80, background: "rgba(201,168,76,0.25)" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — RitualSection
───────────────────────────────────────────── */
function RitualSection({ setHovering }) {
  const passos = [
    { num: "Ⅰ", glyph: "🔍", titulo: "Consulta o Bestiário", desc: "Percorre o manuscrito e encontra a criatura cujo espírito ressoa com o teu." },
    { num: "Ⅱ", glyph: "📜", titulo: "Redige o Contrato", desc: "Preenche o formulário. Como todo bom bruxo sabe — os contratos têm peso." },
    { num: "Ⅲ", glyph: "🤝", titulo: "O Encontro", desc: "Conhece o teu futuro companheiro. O vínculo forma-se no primeiro olhar." },
    { num: "Ⅳ", glyph: "🏰", titulo: "Leva para o Lar", desc: "Sela o pacto e leva o teu companheiro para o castelo que sempre mereceu." },
  ];

  return (
    <section id="ritual" style={{ padding: "6rem 1.5rem", background: "rgba(10,8,4,0.8)", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader over="— Pergaminho do Processo —" title={<>O Ritual <em style={{ color: "#c9a84c" }}>da Adoção</em></>} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {passos.map((p, i) => (
            <PassoCard key={p.num} p={p} i={i} setHovering={setHovering} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — CronicasSection
───────────────────────────────────────────── */
function CronicasSection() {
  const testemunhos = [
    { texto: "Adotar o Thor foi como assinar um pacto com o destino. Chegou como um guerreiro leal, e nunca mais me senti sozinha nas batalhas do quotidiano.", nome: "Ana Silva", papel: "Guardiã do Thor · 2023", avatar: "👩" },
    { texto: "A Mia apareceu como uma feiticeira: silenciosa, misteriosa e completamente irresistível. Agora governa a minha casa como uma rainha governa Cintra.", nome: "Carlos Mendes", papel: "Servo da Mia · 2024", avatar: "👨" },
    { texto: "Nunca pensei que uma criatura tão pequena pudesse ter um impacto tão grande. O Bolinha prova que os maiores heróis vêm nos pacotes mais inesperados.", nome: "Julia Rocha", papel: "Protetora do Bolinha · 2024", avatar: "👧" },
  ];

  return (
    <section id="cronicas" style={{ padding: "6rem 1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <SectionHeader over="— Crónicas de Adotantes —" title={<>Histórias que os <em style={{ color: "#c9a84c" }}>Bardos Cantam</em></>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
        {testemunhos.map((t, i) => {
          const { ref, visible } = useScrollReveal(0.1);
          return (
            <div key={i} ref={ref} style={{
              padding: "2rem", border: `1px solid ${i === 1 ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.15)"}`,
              background: i === 1 ? "rgba(201,168,76,0.06)" : "rgba(13,11,8,0.6)",
              transition: "transform 0.5s, opacity 0.5s",
              transform: visible ? "translateY(0)" : "translateY(20px)",
              opacity: visible ? 1 : 0,
              transitionDelay: `${i * 100}ms`,
            }}>
              <div style={{ fontSize: "2.5rem", color: "rgba(201,168,76,0.2)", lineHeight: 1, marginBottom: "1rem" }}>❝</div>
              <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: "italic", fontSize: "1.05rem", color: "rgba(232,213,163,0.7)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                "{t.texto}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderTop: "1px solid rgba(201,168,76,0.15)", paddingTop: "1rem" }}>
                <span style={{ fontSize: "1.8rem" }}>{t.avatar}</span>
                <div>
                  <strong style={{ fontFamily: "'Cinzel', serif", fontSize: "0.8rem", color: "#c9a84c", display: "block" }}>{t.nome}</strong>
                  <em style={{ fontFamily: "'Crimson Text', serif", fontSize: "0.85rem", color: "rgba(232,213,163,0.4)" }}>{t.papel}</em>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — ContactoSection
───────────────────────────────────────────── */
function ContactoSection({ setHovering }) {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", tel: "", animal: "", descricao: "" });

  // Controlador de estado do formulário com useState
  const handleChange = useCallback(e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    setEnviado(true);
  }, []);

  const inputStyle = {
    width: "100%", padding: "0.65rem 1rem", background: "rgba(13,11,8,0.8)",
    border: "1px solid rgba(201,168,76,0.2)", color: "#e8d5a3",
    fontFamily: "'Crimson Text', serif", fontSize: "1rem", outline: "none", marginTop: "0.3rem",
  };

  return (
    <section id="contato" style={{ padding: "6rem 1.5rem", background: "rgba(10,8,4,0.7)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
        <div>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.78rem", letterSpacing: "0.4em", color: "rgba(232,213,163,0.4)", marginBottom: "0.5rem" }}>— Redigir uma Missiva —</p>
          <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "2rem", color: "#c9a84c", marginBottom: "1.5rem" }}>Selar o <em>Teu Pacto</em></h2>
          <blockquote style={{ fontFamily: "'Crimson Text', serif", fontStyle: "italic", fontSize: "1.05rem", color: "rgba(232,213,163,0.6)", lineHeight: 1.7, borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: "1rem", marginBottom: "2rem" }}>
            "Envia a tua missiva e os nossos emissários responderão em até dois dias."
          </blockquote>
          {[["✉", "adota@amigo.pt"], ["☎", "(11) 99999-0000"], ["⚑", "Lisboa, Portugal"]].map(([ico, txt]) => (
            <div key={txt} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", fontFamily: "'Crimson Text', serif", color: "rgba(232,213,163,0.7)" }}>
              <span style={{ color: "#c9a84c", fontSize: "1rem" }}>{ico}</span>{txt}
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid rgba(201,168,76,0.2)", padding: "2rem", background: "rgba(20,16,8,0.6)" }}>
          {enviado ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🐺</div>
              <h3 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.4rem", color: "#c9a84c", marginBottom: "0.5rem" }}>O Pacto foi Selado!</h3>
              <p style={{ fontFamily: "'Crimson Text', serif", color: "rgba(232,213,163,0.6)" }}>Os nossos emissários responderão em até 48 horas.</p>
              <div style={{ marginTop: "1rem", fontFamily: "'Cinzel', serif", fontSize: "0.75rem", color: "rgba(201,168,76,0.4)", letterSpacing: "0.3em" }}>— ᚦᚱᛁᛗᚾᚾ —</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {[
                { label: "Nome do Candidato", name: "nome", type: "text", placeholder: "Geralt de Rívia..." },
                { label: "Missiva (E-mail)", name: "email", type: "email", placeholder: "corvo@continente.com" },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: "1rem" }}>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(232,213,163,0.5)", display: "block" }}>{f.label}</label>
                  <input name={f.name} type={f.type} placeholder={f.placeholder} required
                    value={form[f.name]} onChange={handleChange} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#c9a84c"}
                    onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.2)"} />
                </div>
              ))}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(232,213,163,0.5)", display: "block" }}>Criatura de Interesse</label>
                <select name="animal" value={form.animal} onChange={handleChange} required style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={e => e.target.style.borderColor = "#c9a84c"}
                  onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.2)"}>
                  <option value="">Escolhe do Bestiário...</option>
                  {ANIMAIS_LOCAIS.map(a => <option key={a.id} value={a.id}>{a.nome} — {a.tipo === "caes" ? "Cão" : a.tipo === "gatos" ? "Gato" : "Outro"}, {a.idade}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(232,213,163,0.5)", display: "block" }}>Descreve o teu Castelo</label>
                <textarea name="descricao" value={form.descricao} onChange={handleChange}
                  placeholder="Narra a tua morada, família, estilo de vida..." rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => e.target.style.borderColor = "#c9a84c"}
                  onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.2)"} />
              </div>
              <button type="submit"
                style={{ width: "100%", padding: "0.85rem", fontFamily: "'Cinzel', serif", fontSize: "0.82rem", letterSpacing: "0.2em", background: "#c9a84c", color: "#0d0b08", border: "none", cursor: "pointer", transition: "background 0.25s" }}
                onMouseEnter={e => { e.target.style.background = "#e0c070"; setHovering(true); }}
                onMouseLeave={e => { e.target.style.background = "#c9a84c"; setHovering(false); }}>
                ⚔ Selar o Pacto ⚔
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE — Footer
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ padding: "3rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.1)", background: "#080604" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ height: 1, width: 60, background: "rgba(201,168,76,0.2)" }} /><span>🐺</span><div style={{ height: 1, width: 60, background: "rgba(201,168,76,0.2)" }} />
      </div>
      <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.1rem", color: "#c9a84c", marginBottom: "0.5rem" }}>☽ Adota um Amigo ☾</p>
      <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: "italic", color: "rgba(232,213,163,0.4)", marginBottom: "1rem" }}>
        "O mal mais poderoso do mundo não é o monstro — é o abandono."
      </p>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(232,213,163,0.25)" }}>
        © Anno Domini 2025 · Adota um Amigo · Adoção responsável · Sem fins lucrativos
      </p>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   PÁGINA — Home
───────────────────────────────────────────── */
function HomePage({ setHovering }) {
  return (
    <>
      <HeroSection setHovering={setHovering} />
      <BestiarioSection setHovering={setHovering} />
      <RitualSection setHovering={setHovering} />
      <CronicasSection />
      <ContactoSection setHovering={setHovering} />
    </>
  );
}

/* ─────────────────────────────────────────────
   PÁGINA — DetalheAnimal (React Router: useParams)
───────────────────────────────────────────── */
function DetalheAnimalPage({ setHovering }) {
  const { id } = useParams();                   // Hook do React Router
  const navigate = useNavigate();
  const { ref, visible } = useScrollReveal(0.05);
  const animal = ANIMAIS_LOCAIS.find(a => a.id === id);

  // Fetch de imagem real via API
  const { imgUrl, loading } = useAnimalAPI(animal?.tipo ?? "caes");

  // Scroll para o topo ao abrir a página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!animal) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
        <span style={{ fontSize: "4rem" }}>🔮</span>
        <h2 style={{ fontFamily: "'Cinzel', serif", color: "#c9a84c" }}>Criatura não encontrada no Bestiário</h2>
        <button onClick={() => navigate("/")} style={{ fontFamily: "'Cinzel', serif", padding: "0.75rem 2rem", border: "1px solid #c9a84c", color: "#c9a84c", background: "transparent", cursor: "pointer" }}>← Regressar</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "6rem", paddingBottom: "4rem" }}>
      <div ref={ref} style={{
        maxWidth: 860, margin: "0 auto", padding: "0 1.5rem",
        transform: visible ? "translateY(0)" : "translateY(30px)",
        opacity: visible ? 1 : 0, transition: "all 0.6s ease",
      }}>
        {/* Botão voltar */}
        <button onClick={() => navigate(-1)}
          style={{ fontFamily: "'Cinzel', serif", fontSize: "0.78rem", letterSpacing: "0.2em", color: "rgba(232,213,163,0.5)", background: "none", border: "none", cursor: "pointer", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          onMouseEnter={e => { e.target.style.color = "#c9a84c"; setHovering(true); }}
          onMouseLeave={e => { e.target.style.color = "rgba(232,213,163,0.5)"; setHovering(false); }}>
          ← Regressar ao Bestiário
        </button>

        <div style={{ border: "1px solid rgba(201,168,76,0.25)", background: "rgba(20,16,8,0.8)", padding: "3rem", position: "relative" }}>
          {/* Corner ornaments */}
          {["◤","◥","◣","◢"].map((c,i) => (
            <span key={i} style={{ position: "absolute", fontSize: "1rem", color: "rgba(201,168,76,0.35)", top: i < 2 ? 10 : "auto", bottom: i >= 2 ? 10 : "auto", left: i % 2 === 0 ? 10 : "auto", right: i % 2 !== 0 ? 10 : "auto" }}>{c}</span>
          ))}

          <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.4em", color: "rgba(232,213,163,0.3)", textAlign: "center", marginBottom: "0.5rem" }}>✦ ᚢᛞ ✦ — Ficha do Bestiário — ✦ ᚢᛞ ✦</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start", marginTop: "1.5rem" }}>
            {/* Imagem */}
            <div>
              <div style={{ border: "1px solid rgba(201,168,76,0.2)", overflow: "hidden", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                {loading ? (
                  <span style={{ fontSize: "5rem" }}>{animal.emoji}</span>
                ) : imgUrl ? (
                  <img src={imgUrl} alt={animal.nome} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(35%) brightness(0.85)" }} />
                ) : (
                  <span style={{ fontSize: "6rem" }}>{animal.emoji}</span>
                )}
              </div>
              {animal.destaque && (
                <div style={{ textAlign: "center", marginTop: "0.75rem", fontFamily: "'Cinzel', serif", fontSize: "0.72rem", color: "#c9a84c", letterSpacing: "0.2em" }}>⭐ Destaque do Bestiário</div>
              )}
            </div>

            {/* Info */}
            <div>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.25em", color: "rgba(232,213,163,0.4)" }}>
                {animal.tipo === "caes" ? "Cão" : animal.tipo === "gatos" ? "Gato" : "Outro"} · {animal.genero}
              </span>
              <h1 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#c9a84c", margin: "0.3rem 0 0.5rem" }}>{animal.nome}</h1>
              <div style={{ color: "rgba(201,168,76,0.3)", marginBottom: "1.25rem" }}>— ✦ —</div>

              <p style={{ fontFamily: "'Crimson Text', serif", fontStyle: "italic", fontSize: "1.05rem", color: "rgba(232,213,163,0.65)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                "{animal.entrada}"
              </p>

              {/* Codex / atributos */}
              <div style={{ borderTop: "1px solid rgba(201,168,76,0.15)", borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "1rem 0", marginBottom: "1.5rem" }}>
                {[["Raça", animal.raca], ["Idade", animal.idade], ["Porte", animal.porte], ["Estado", animal.estado], ["Localização", animal.localizacao]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Cinzel', serif", fontSize: "0.72rem", letterSpacing: "0.1em", padding: "0.35rem 0", borderBottom: "1px solid rgba(201,168,76,0.07)" }}>
                    <span style={{ color: "rgba(232,213,163,0.4)" }}>{k}</span>
                    <span style={{ color: "#e8d5a3" }}>{v}</span>
                  </div>
                ))}
              </div>

              <Link to="/#contato"
                style={{ display: "block", textAlign: "center", fontFamily: "'Cinzel', serif", fontSize: "0.8rem", letterSpacing: "0.2em", padding: "0.85rem", background: "#c9a84c", color: "#0d0b08", textDecoration: "none", transition: "background 0.25s" }}
                onMouseEnter={e => { e.target.style.background = "#e0c070"; setHovering(true); }}
                onMouseLeave={e => { e.target.style.background = "#c9a84c"; setHovering(false); }}>
                ⚔ Iniciar o Pacto ⚔
              </Link>
            </div>
          </div>

          {/* Descrição completa */}
          <div style={{ marginTop: "2.5rem", borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: "2rem" }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.85rem", letterSpacing: "0.25em", color: "rgba(232,213,163,0.5)", marginBottom: "1rem" }}>ENTRADA DO BESTIÁRIO</h3>
            <p style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.1rem", color: "rgba(232,213,163,0.7)", lineHeight: 1.85 }}>{animal.descricao}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PÁGINA — Sobre
───────────────────────────────────────────── */
function SobrePage({ setHovering }) {
  const { ref, visible } = useScrollReveal(0.05);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const conceitos = [
    { icon: "⚛️", titulo: "Componentes Funcionais & JSX", desc: "Cada secção da app é um componente reutilizável: Navbar, HeroSection, AnimalCard, FilterBar..." },
    { icon: "🎣", titulo: "Hooks — useState & useEffect", desc: "Estado local para filtros, pesquisa, formulários. Efeitos para fetch de API, cursor, scroll." },
    { icon: "🧩", titulo: "Hooks Personalizados", desc: "useScrollNav, useCustomCursor, useScrollReveal, useAnimalAPI — lógica encapsulada e reutilizável." },
    { icon: "🌐", titulo: "Fetching de API Externa", desc: "Imagens reais de cães e gatos via The Dog API e The Cat API. Loading states e error handling." },
    { icon: "🗺️", titulo: "React Router", desc: "HashRouter com rotas para Home, DetalheAnimal (/animal/:id) e Sobre. useParams, useNavigate, Link." },
    { icon: "🔍", titulo: "Filtros & Pesquisa", desc: "Renderização condicional de listas com .filter() e .map(). Pesquisa em tempo real por nome e raça." },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingTop: "6rem", paddingBottom: "4rem" }}>
      <div ref={ref} style={{ maxWidth: 860, margin: "0 auto", padding: "0 1.5rem", transform: visible ? "translateY(0)" : "translateY(30px)", opacity: visible ? 1 : 0, transition: "all 0.6s ease" }}>
        <SectionHeader
          over="— Tomo do Conhecimento —"
          title={<>Sobre o <em style={{ color: "#c9a84c" }}>Projecto</em></>}
          lore="Uma aplicação de adoção de animais construída com React, aplicando os principais conceitos da biblioteca."
        />

        <div style={{ border: "1px solid rgba(201,168,76,0.2)", padding: "2.5rem", background: "rgba(20,16,8,0.7)", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.1rem", color: "rgba(232,213,163,0.7)", lineHeight: 1.85, marginBottom: "1.5rem" }}>
            O <strong style={{ color: "#c9a84c" }}>Adota um Amigo</strong> é uma aplicação React que reimagina um site de adoção de animais 
            com a estética sombria e medieval do universo de <em>The Witcher</em>. 
            O projecto serve como demonstração prática dos principais pilares do React moderno.
          </p>
          <p style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.1rem", color: "rgba(232,213,163,0.7)", lineHeight: 1.85 }}>
            Cada animal tem uma página de detalhe dedicada, as imagens são carregadas via APIs públicas reais, 
            e toda a navegação usa React Router sem recarregar a página.
          </p>
        </div>

        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.85rem", letterSpacing: "0.3em", color: "rgba(232,213,163,0.4)", marginBottom: "1.5rem", textAlign: "center" }}>CONCEITOS REACT APLICADOS</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {conceitos.map((c, i) => (
            <div key={i} style={{ padding: "1.25rem", border: "1px solid rgba(201,168,76,0.15)", background: "rgba(13,11,8,0.6)", transition: "border-color 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; setHovering(true); }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)"; setHovering(false); }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{c.icon}</div>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.78rem", color: "#c9a84c", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>{c.titulo}</h4>
              <p style={{ fontFamily: "'Crimson Text', serif", fontSize: "0.9rem", color: "rgba(232,213,163,0.55)", lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link to="/"
            style={{ fontFamily: "'Cinzel', serif", fontSize: "0.82rem", letterSpacing: "0.2em", padding: "0.85rem 2.5rem", border: "1px solid #c9a84c", color: "#c9a84c", background: "rgba(201,168,76,0.06)", textDecoration: "none", display: "inline-block", transition: "all 0.25s" }}
            onMouseEnter={e => { e.target.style.background = "rgba(201,168,76,0.15)"; setHovering(true); }}
            onMouseLeave={e => { e.target.style.background = "rgba(201,168,76,0.06)"; setHovering(false); }}>
            ← Regressar ao Bestiário
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENTE RAIZ — App
   Configura o router e o layout global
───────────────────────────────────────────── */
export default function App() {
  const { pos, hovering, setHovering } = useCustomCursor();

  return (
    <HashRouter>
      {/* Cursor personalizado */}
      <CustomCursor pos={pos} hovering={hovering} />

      {/* Overlay de ruído e vinheta */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 9998, opacity: 0.5 }} />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, rgba(5,4,2,0.7) 100%)", pointerEvents: "none", zIndex: 9997 }} />

      {/* Fontes Google */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0d0b08; color: #e8d5a3; overflow-x: hidden; cursor: none; }
        * { cursor: none !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d0b08; }
        ::-webkit-scrollbar-thumb { background: #7a5e28; }
        a { text-decoration: none; color: inherit; }
        button { border: none; background: none; font-family: inherit; }
        input, select, textarea { font-family: 'Crimson Text', serif; color: #e8d5a3; border-radius: 0; }
        @keyframes fogDrift1 { from { transform: translateX(-3%) scaleY(1); } to { transform: translateX(3%) scaleY(1.1); } }
        @keyframes fogDrift2 { from { transform: translateX(2%) scaleY(1.05); } to { transform: translateX(-2%) scaleY(0.95); } }
        @keyframes fogDrift3 { from { transform: translateX(-1%); } to { transform: translateX(1%); } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>

      {/* Navbar presente em todas as páginas */}
      <Navbar setHovering={setHovering} />

      {/* Definição de rotas — React Router */}
      <Routes>
        <Route path="/" element={<HomePage setHovering={setHovering} />} />
        <Route path="/animal/:id" element={<DetalheAnimalPage setHovering={setHovering} />} />
        <Route path="/sobre" element={<SobrePage setHovering={setHovering} />} />
        {/* Rota fallback — renderização condicional */}
        <Route path="*" element={
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <span style={{ fontSize: "4rem" }}>🔮</span>
            <h2 style={{ fontFamily: "'Cinzel', serif", color: "#c9a84c" }}>Página não encontrada</h2>
            <Link to="/" style={{ fontFamily: "'Cinzel', serif", color: "rgba(232,213,163,0.5)", fontSize: "0.85rem" }}>← Regressar ao início</Link>
          </div>
        } />
      </Routes>

      <Footer />
    </HashRouter>
  );
}
