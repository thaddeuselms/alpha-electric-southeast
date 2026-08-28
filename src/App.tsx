import { useEffect, useState } from "react";
import { FaFacebookF, FaLocationDot, FaStar } from "react-icons/fa6";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { siteConfig as c } from "./config";
import { Applications, Contact, Home, OurWork } from "./pages";

function Logo() {
  return (
    <span className="logo">
      <img
        className="logo-image"
        src="/logo-alpha-electric.svg"
        alt="Alpha Electric Southeast"
        width="78"
        height="78"
      />
      <span className="logo-name">Alpha Electric Southeast LLC</span>
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <div className="topbar">
          <span>Licensed &amp; insured electrical services</span>
          <a href={c.phoneHref}>Call {c.phoneDisplay}</a>
        </div>
        <div className="navwrap">
          <Link to="/" aria-label="Alpha Electric Southeast home">
            <Logo />
          </Link>
          <button
            id="menu-toggle"
            className="menu"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen(!open)}
          >
            <span aria-hidden="true">{open ? "×" : "☰"}</span>{" "}
            {open ? "Close" : "Menu"}
          </button>
          <nav
            id="primary-nav"
            className={open ? "open" : ""}
            aria-label="Primary navigation"
          >
            <NavLink to="/">Home</NavLink>
            <NavLink to="/applications">Applications</NavLink>
            <NavLink to="/our-work">Our Work</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <Link className="nav-cta" to="/contact">
              Free estimate <span>↗</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer>
      <div>
        <Link className="footer-brand" to="/">
          <Logo />
        </Link>
        <p>Safe power. Careful craft. Local service.</p>
      </div>
      <div className="footer-links">
        <a href={c.phoneHref}>{c.phoneDisplay}</a>
        <a
          className="social-icon"
          href={c.facebookUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Visit Alpha Electric Southeast on Facebook"
          title="Facebook"
        >
          <FaFacebookF aria-hidden="true" />
        </a>
        <a
          className="social-icon"
          href={c.mapsUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="View Alpha Electric Southeast on Google Maps"
          title="Google Maps"
        >
          <FaLocationDot aria-hidden="true" />
        </a>
        <a
          className="social-icon"
          href={c.reviewsUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Read Alpha Electric Southeast reviews"
          title="Reviews"
        >
          <FaStar aria-hidden="true" />
        </a>
      </div>
      <small>
        © {new Date().getFullYear()} Alpha Electric Southeast
        <br />
        Serving {c.serviceArea}
      </small>
    </footer>
  );
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "Electrician"],
            name: c.name,
            telephone: "+1-910-619-9999",
            areaServed: [
              "New Hanover County",
              "Pender County",
              "Brunswick County",
            ],
            url: window.location.origin,
            priceRange: "$$",
          }),
        }}
      />
    </>
  );
}
