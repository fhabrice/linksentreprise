'use client';

import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';

const iconNames = {
  'map-pin': Icons.MapPin, mail: Icons.Mail, phone: Icons.Phone,
  'arrow-up-right': Icons.ArrowUpRight, menu: Icons.Menu, x: Icons.X,
  'arrow-right': Icons.ArrowRight, 'arrow-down-right': Icons.ArrowDownRight,
  'badge-check': Icons.BadgeCheck, 'hard-hat': Icons.HardHat,
  'code-2': Icons.Code2, 'drafting-compass': Icons.DraftingCompass,
  network: Icons.Network, handshake: Icons.Handshake, 'hand-coins': Icons.HandCoins, 'bar-chart-3': Icons.BarChart3, 'graduation-cap': Icons.GraduationCap, rocket: Icons.Rocket, quote: Icons.Quote, 'message-circle': Icons.MessageCircle,
  send: Icons.Send, shield: Icons.ShieldCheck
};

function Icon({ name, size = 24 }) {
  const Component = iconNames[name];
  return Component ? <Component size={size} aria-hidden="true" /> : null;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const nav = document.getElementById('navbar');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 70);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  async function submitContact(event) {
    event.preventDefault();
    setSending(true); setFeedback('');
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Envoi impossible.');
      setFeedback('Votre demande est prête. Ouverture de WhatsApp…');
      form.reset();
      window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) { setFeedback(error.message); }
    finally { setSending(false); }
  }

  return (<>

  <div className="topbar">
    <div className="container"><span><Icon name="map-pin" size={13} /> RDC · Kenya · Canada</span><div className="topbar-right"><span><Icon name="mail" size={13} /><a href="mailto:contact@linksmartec.com">contact@linksmartec.com</a></span><span><Icon name="phone" size={13} /><a href="tel:+243976459970">+243 976 459 970</a></span></div></div>
  </div>
  <nav className="nav" id="navbar">
    <div className="container nav-inner">
      <a className="brand" href="#accueil" aria-label="Linkstech - Accueil"><img className="brand-logo" src="/assets/logo-linksmart.svg" alt="LINKSmart Technology — Connecting Minds, Empowering Futures" /></a>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks" onClick={() => setMenuOpen(false)}><a href="#accueil">Accueil</a><a href="#apropos">À propos</a><a href="#services">Expertises</a><a href="#projets">Projets</a><a href="/opportunities.php">Opportunités</a><a href="/blog.php">Blog</a><a href="#contact" className="btn">Être mis en relation <Icon name="arrow-up-right" size={16} /></a></div>
      <button className={menuOpen ? 'menu-btn active' : 'menu-btn'} id="menuBtn" type="button" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen} aria-controls="navLinks" onClick={() => setMenuOpen(v => !v)}><Icon name={menuOpen ? "x" : "menu"} /></button>
    </div>
  </nav>

  <main>
    <section className="hero" id="accueil">
      <div className="hero-bg"></div><div className="hero-grid"></div>
      <div className="container"><div className="hero-content"><div className="hero-tag"><i></i> Construction · Technologie · Connexions · Impact</div><h1>Nous connectons<br />les services aux clients,<br /><span>les marchés aux entreprises.</span></h1><p>Basée en RDC, au Kenya et au Canada, Linkstech développe des solutions de construction et de technologie et facilite les connexions commerciales à l’échelle internationale.</p><div className="hero-connect"><Icon name="handshake" size={25} /><span><strong>Entreprise, particulier ou porteur de startup ?</strong> Contactez-nous pour trouver l’expertise, le client, le partenaire, le financement ou le marché qu’il vous faut.</span></div><div className="hero-actions"><a className="btn btn-primary" href="#contact">Être mis en relation <Icon name="arrow-right" size={18} /></a><a className="btn btn-outline" href="/opportunities.php">Voir les opportunités</a></div></div></div>
      <div className="hero-foot"><div className="hero-stat"><strong>04</strong><small>Pôles d'expertise</small></div><div className="hero-stat"><strong>06+</strong><small>Solutions réalisées</small></div><div className="hero-stat"><strong>Global</strong><small>Notre ambition</small></div></div>
    </section>

    <section className="intro" id="apropos"><div className="container intro-grid">
      <div className="intro-media reveal"><img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85" alt="Architecture moderne et expertise Linkstech" /><div className="intro-badge"><strong>360°</strong><span>Une vision intégrée, du plan à la solution finale.</span></div></div>
      <div className="reveal"><div className="eyebrow">À propos de Linkstech</div><h2 className="section-title">Un seul partenaire.<br />Quatre expertises fortes.</h2><p className="section-copy">Basée en RDC, au Kenya et au Canada, Linkstech réunit construction, technologie, mise en relation et accompagnement des organisations pour servir les entreprises, ONG, associations, institutions et communautés à l’international.</p><p className="intro-note">Notre différence : comprendre chaque terrain, concevoir avec précision et livrer des solutions adaptées au contexte de chaque client, où qu’il se trouve.</p><div className="checks"><span><Icon name="badge-check" /> Exécution rigoureuse</span><span><Icon name="badge-check" /> Innovation utile</span><span><Icon name="badge-check" /> Expertise locale</span><span><Icon name="badge-check" /> Accompagnement durable</span></div><a href="#services" className="btn btn-outline">Explorer nos expertises <Icon name="arrow-down-right" size={18} /></a></div>
    </div></section>

    <section className="services" id="services"><div className="container">
      <div className="services-head reveal"><div><div className="eyebrow">Nos expertises</div><h2 className="section-title">Du chantier au digital,<br />nous créons de la valeur.</h2></div><p>Quatre pôles complémentaires, une même exigence : construire, digitaliser, connecter et renforcer les capacités avec des résultats mesurables.</p></div>
      <div className="service-grid reveal">
        <article className="service"><div className="service-icon"><Icon name="hard-hat" /></div><span className="service-num">01 / CONSTRUCTION</span><h3>Construction & Génie civil</h3><p>Étude, conception, planification et réalisation de projets de construction en RDC et à l’international, avec une attention constante à la qualité, aux normes et à la durabilité.</p></article>
        <article className="service"><div className="service-icon"><Icon name="code-2" /></div><span className="service-num">02 / TECHNOLOGIE</span><h3>Solutions informatiques</h3><p>Applications web, plateformes métiers, systèmes de gestion et outils digitaux sur mesure pour simplifier les opérations et accélérer la croissance.</p></article>
        <article className="service"><div className="service-icon"><Icon name="drafting-compass" /></div><span className="service-num">03 / INGÉNIERIE</span><h3>Études & accompagnement</h3><p>Analyse des besoins, études techniques, plans, estimation et suivi de projet : nous sécurisons chaque décision avant et pendant l'exécution.</p></article>
        <article className="service"><div className="service-icon"><Icon name="network" /></div><span className="service-num">04 / TRANSFORMATION</span><h3>Digitalisation d'entreprise</h3><p>Conseil, automatisation et déploiement de solutions adaptées pour rendre les organisations plus efficaces, connectées et performantes.</p></article>
        <article className="service service-marketplace"><div className="service-icon"><Icon name="handshake" /></div><span className="service-num">05 / MISE EN RELATION</span><h3>Connexion aux marchés & services</h3><p>Linkstech joue le rôle de passerelle commerciale : nous aidons les clients à trouver les services adaptés et nous rapprochons les entreprises des marchés, partenaires et opportunités dont elles ont besoin pour grandir.</p><div className="connection-paths"><span><strong>Services</strong><Icon name="arrow-right" size={18} /><strong>Clients</strong></span><span><strong>Marchés</strong><Icon name="arrow-right" size={18} /><strong>Entreprises</strong></span></div></article>
        <article className="service service-marketplace"><div className="service-icon"><Icon name="hand-coins" /></div><span className="service-num">06 / IMPACT & FINANCEMENT</span><h3>ONG, associations & bailleurs de fonds</h3><p>Nous rapprochons les ONG et associations des bailleurs de fonds, partenaires techniques et opportunités de financement. Linkstech aide à structurer les besoins, valoriser les projets et créer des collaborations crédibles et durables.</p><div className="connection-paths"><span><strong>ONG & associations</strong><Icon name="arrow-right" size={18} /><strong>Bailleurs de fonds</strong></span></div></article>
        <article className="service"><div className="service-icon"><Icon name="bar-chart-3" /></div><span className="service-num">07 / SUIVI DE PROJETS</span><h3>Outils de suivi & réalisation</h3><p>Nous développons des outils numériques utiles pour planifier les activités, suivre les indicateurs, documenter les résultats et améliorer la réalisation des projets sur le terrain.</p></article>
        <article className="service"><div className="service-icon"><Icon name="graduation-cap" /></div><span className="service-num">08 / CAPACITÉS</span><h3>Encadrement & formation</h3><p>Nous encadrons et formons les équipes à l’utilisation des outils, à la gestion opérationnelle et aux bonnes pratiques nécessaires pour assurer des projets performants et durables.</p></article>
        <article className="service service-marketplace"><div className="service-icon"><Icon name="rocket" /></div><span className="service-num">09 / ENTREPRENEURIAT</span><h3>Création d’entreprises techniques & startups</h3><p>Nous accompagnons les entrepreneurs de l’idée au lancement : structuration du projet, modèle d’affaires, identité, outils technologiques, ingénierie, organisation des équipes et connexion aux partenaires capables d’accélérer leur réussite.</p><div className="connection-paths"><span><strong>Idée</strong><Icon name="arrow-right" size={18} /><strong>Entreprise structurée</strong></span><span><strong>Innovation</strong><Icon name="arrow-right" size={18} /><strong>Startup performante</strong></span></div></article>
      </div>
    </div></section>

    <section className="brand-story"><div className="container"><div className="brand-story-head reveal"><div className="eyebrow">Notre nom, notre promesse</div><h2 className="section-title">LINKSTECH : le lien qui conduit vos projets vers la réussite.</h2><p className="section-copy">Notre identité résume notre manière de travailler : créer les bonnes connexions, rechercher l’excellence et mobiliser la technologie et l’ingénierie au service de chaque ambition.</p></div><div className="brand-values reveal"><article><span>LINKS</span><h3>Le lien vers la réussite</h3><p>Nous relions vos projets aux experts, clients, marchés, partenaires et financements qui permettent de les faire avancer.</p></article><article><span>SMART</span><h3>L’intelligence vers l’excellence</h3><p>Nous vous guidons avec méthode, innovation et vision stratégique pour atteindre un niveau supérieur de performance.</p></article><article><span>TECH</span><h3>Technologie & ingénierie</h3><p>Notre équipe d’experts développe les technologies, outils et solutions d’ingénierie nécessaires à la réussite de vos projets.</p></article></div></div></section>

    <section className="projects" id="projets"><div className="container">
      <div className="project-head reveal"><div><div className="eyebrow">Réalisations sélectionnées</div><h2 className="section-title">Des projets qui parlent<br />pour notre savoir-faire.</h2></div><div className="filters" aria-label="Filtrer les projets"><button type="button" className={`filter ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Tous</button><button type="button" className={`filter ${filter === "digital" ? "active" : ""}`} onClick={() => setFilter("digital")}>Digital</button><button type="button" className={`filter ${filter === "construction" ? "active" : ""}`} onClick={() => setFilter("construction")}>Construction</button></div></div>
      <div className="project-grid">
        <article className={`project-card featured reveal ${filter !== "all" && filter !== "digital" ? "hidden" : ""}`} data-category="digital"><div className="project-image"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85" alt="Tableau de bord de solution financière" /><span className="project-type">Fintech</span></div><div className="project-body"><h3>LITO Finance</h3><p>Conception d'une solution numérique orientée finance et gestion.</p></div></article>
        <article className={`project-card reveal ${filter !== "all" && filter !== "digital" ? "hidden" : ""}`} data-category="digital"><div className="project-image"><img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=85" alt="Projet de plateforme immobilière" /><span className="project-type">Immobilier</span></div><div className="project-body"><h3>Youpend ImmoSelect</h3><p>Une expérience digitale dédiée à la recherche et la valorisation immobilière.</p></div></article>
        <article className={`project-card reveal ${filter !== "all" && filter !== "digital" ? "hidden" : ""}`} data-category="digital"><div className="project-image"><img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=85" alt="Architecture urbaine Urbanova" /><span className="project-type">Proptech</span></div><div className="project-body"><h3>Urbanova</h3><p>Une solution moderne au service de la ville et de ses acteurs.</p></div></article>
        <article className={`project-card reveal ${filter !== "all" && filter !== "digital" ? "hidden" : ""}`} data-category="digital"><div className="project-image"><img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=85" alt="Événement professionnel" /><span className="project-type">Événementiel</span></div><div className="project-body"><h3>Smart Event Kivu</h3><p>Plateforme intelligente pour simplifier l'organisation événementielle.</p></div></article>
        <article className={`project-card reveal ${filter !== "all" && filter !== "digital" ? "hidden" : ""}`} data-category="digital"><div className="project-image"><img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85" alt="Outil numérique utilisé sur le terrain" /><span className="project-type">Field Tech</span></div><div className="project-body"><h3>FieldLink</h3><p>Des outils numériques qui connectent les équipes et les réalités du terrain.</p></div></article>
        <article className={`project-card featured reveal ${filter !== "all" && filter !== "construction" ? "hidden" : ""}`} data-category="construction"><div className="project-image"><img src="/assets/images/construction-rdc.jpg" alt="Équipe d'ingénieurs sur un chantier de construction en RDC" /><span className="project-type">Chantier · Goma</span></div><div className="project-body"><h3>Construction & suivi de chantier en RDC</h3><p>Étude, coordination et accompagnement de projets de construction adaptés aux matériaux, au terrain et aux réalités locales.</p></div></article>
        <article className={`project-card reveal ${filter !== "all" && filter !== "construction" ? "hidden" : ""}`} data-category="construction"><div className="project-image"><img src="/assets/images/maison-rdc.jpg" alt="Maison contemporaine adaptée au contexte de Goma en RDC" /><span className="project-type">Habitat · RDC</span></div><div className="project-body"><h3>Projets résidentiels à Goma</h3><p>Conception de maisons modernes, fonctionnelles et durables, intégrant les matériaux et le paysage du Nord-Kivu.</p></div></article>
      </div>
    </div></section>

    <section className="blog-cta"><div className="container blog-cta-inner reveal"><div><div className="eyebrow">Le blog LINKSmart</div><h2>Des idées et outils pour faire réussir vos projets.</h2><p>Retrouvez nos analyses et conseils sur les startups, l’ingénierie, la technologie, les marchés, le financement et la gestion de projets.</p></div><a className="btn btn-primary" href="/blog.php">Découvrir le blog <Icon name="arrow-right" size={18} /></a></div></section>

    <section className="founder"><div className="container"><div className="founder-card reveal"><div className="founder-copy"><div className="eyebrow">La vision du fondateur</div><p className="quote">« Construire utile, innover avec sens et créer des solutions capables d'améliorer durablement notre environnement. »</p><p className="section-copy">Ingénieur et entrepreneur, Fabrice Nzarubara a fondé Linkstech avec la conviction qu’une expertise née en RDC peut bâtir des réponses de niveau international et intervenir au-delà des frontières.</p><div className="founder-name"><div><strong>Fabrice Nzarubara</strong><span>Fondateur · Ingénieur & Entrepreneur</span></div><Icon name="quote" /></div></div></div></div></section>

    <section className="contact" id="contact"><div className="container contact-grid">
      <div className="reveal"><div className="eyebrow">Votre connexion commence ici</div><h2 className="section-title">Trouvez le bon service, le bon client ou le bon marché.</h2><p className="section-copy">Vous êtes une entreprise, un particulier, une ONG, une association ou un porteur de startup ? Présentez-nous votre besoin. LINKSTECH vous connecte aux services, marchés, partenaires et bailleurs adaptés, et accompagne vos équipes dans la réalisation des projets.</p><div className="contact-details"><a className="contact-item" href="tel:+243976459970"><Icon name="phone" /><div><span>Téléphone / WhatsApp</span><strong>+243 976 459 970</strong></div></a><a className="contact-item" href="mailto:contact@linksmartec.com"><Icon name="mail" /><div><span>E-mail</span><strong>contact@linksmartec.com</strong></div></a><div className="contact-item"><Icon name="map-pin" /><div><span>Nos implantations</span><strong>RDC · Kenya · Canada</strong></div></div></div></div>
      <form className="form reveal" id="contactForm" onSubmit={submitContact}><h3>Décrivez-nous votre besoin</h3><div className="form-row"><div className="field"><label htmlFor="name">Nom complet</label><input id="name" name="name" required placeholder="Votre nom" /></div><div className="field"><label htmlFor="phone">Téléphone</label><input id="phone" name="phone" required placeholder="+243..." /></div></div><div className="field"><label htmlFor="service">Service recherché</label><select id="service" name="service"><option>Construction & Génie civil</option><option>Solution informatique</option><option>Étude & accompagnement</option><option>Digitalisation d'entreprise</option><option>Connexion aux marchés & services</option><option>Connexion ONG / bailleurs de fonds</option><option>Outils de suivi de projets</option><option>Formation & encadrement des équipes</option><option>Création d’entreprise technique / startup</option><option>Autre demande</option></select></div><div className="field"><label htmlFor="message">Votre message</label><textarea id="message" name="message" required placeholder="Quel service, client, partenaire, marché ou accompagnement recherchez-vous ?"></textarea></div><button className="btn btn-primary" type="submit" disabled={sending}>{sending ? "Envoi en cours…" : "Envoyer la demande"} {!sending && <Icon name="send" size={17} />}</button>{feedback && <p className="form-feedback" role="status">{feedback}</p>}</form>
    </div></section>
  </main>

  <a className="admin-access" href="/admin/" aria-label="Ouvrir l’espace administrateur" title="Espace administrateur"><Icon name="shield" size={19} /><span>Administration</span></a>

  <footer><div className="container"><div className="footer-grid"><div className="footer-brand"><a className="brand" href="#accueil"><img className="brand-logo" src="/assets/logo-linksmart.svg" alt="LINKSmart Technology — Connecting Minds, Empowering Futures" /></a><p>Linkstech construit, digitalise et connecte : services aux clients, marchés aux entreprises, ONG et associations aux bailleurs de fonds, en RDC et à l’international.</p><div className="social"><a href="https://wa.me/243976459970" aria-label="WhatsApp"><Icon name="message-circle" /></a><a href="mailto:contact@linksmartec.com" aria-label="E-mail"><Icon name="mail" /></a><a href="tel:+243976459970" aria-label="Téléphone"><Icon name="phone" /></a></div></div><div><div className="footer-title">Navigation</div><div className="footer-links"><a href="#apropos">À propos</a><a href="#services">Nos expertises</a><a href="#projets">Nos projets</a><a href="/opportunities.php">Opportunités</a><a href="/blog.php">Blog</a><a href="/register.php">Rejoindre la plateforme</a><a href="/admin/">Administration</a><a href="#contact">Contact</a></div></div><div><div className="footer-title">Nous contacter</div><div className="footer-links"><a href="tel:+243976459970">+243 976 459 970</a><a href="mailto:contact@linksmartec.com">contact@linksmartec.com</a><span>Présence internationale<br />RDC · Kenya · Canada</span></div></div></div><div className="copyright"><span>© <span>{new Date().getFullYear()}</span> Linkstech. Tous droits réservés.</span><span>Une expertise congolaise, une ambition internationale.</span></div></div></footer>
  
  </>);
}
