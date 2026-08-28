import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { siteConfig as c } from "./config";
import { createQuotePayload, quoteSchema } from "./validation";

const projects = [
  {
    image: "/images/facebook-work/pool-landscape-lighting.jpeg",
    type: "Exterior lighting",
    title: "Pool terrace illumination",
    text: "Here I’m showing how we use low-voltage fixtures to pick up the pool edge, steps, and planting beds without overpowering the space.",
    alt: "Pool terrace at night with low-voltage lighting along the pool edge, steps, paths, and planting beds",
  },
  {
    image: "/images/facebook-work/residential-exterior-lighting.jpeg",
    type: "Exterior lighting",
    title: "Modern home exterior",
    text: "This dusk view shows the finished exterior lighting working across the levels of the home, including the entry, balconies, and soffits.",
    alt: "Multilevel modern home at dusk with illuminated entry, balconies, rooms, and exterior soffits",
  },
  {
    image: "/images/facebook-work/commercial-service-panels.jpeg",
    type: "Residential · Exterior lighting",
    title: "Home exterior lighting",
    text: "This finished home shows warm exterior lighting at the garage, entry, dormers, and rooflines, with the fixtures highlighting the architecture after dark.",
    alt: "Residential home at night with warm lighting at the garage, entry, dormers, and rooflines",
  },
  {
    image: "/images/facebook-work/wine-room-cabinet-lighting.jpeg",
    type: "Commercial · Electrical distribution",
    title: "Equipment room distribution",
    text: "This commercial equipment room has multiple distribution cabinets, breaker sections, disconnects, and conduit arranged for dependable service access.",
    alt: "Commercial equipment room with distribution cabinets, breaker sections, disconnects, and metal conduit",
  },
  {
    image: "/images/facebook-work/wine-room-linear-lighting.jpeg",
    type: "Interior accent lighting",
    title: "Wine-room linear lighting",
    text: "The continuous light lines in this wine room give the ceiling and wall a clean glow while the vertical strips bring the cabinetry forward.",
    alt: "Wine room with continuous linear ceiling lighting, wall lighting, and illuminated cabinetry",
  },
  {
    image: "/images/facebook-work/bathroom-chandelier-lighting.jpeg",
    type: "Residential · Bathroom lighting",
    title: "Bathroom chandelier installation",
    text: "This finished bathroom pairs recessed ceiling lights with a decorative chandelier over the tub; the fixture is centered as the room’s focal point.",
    alt: "Finished bathroom with a decorative chandelier over the freestanding tub and recessed ceiling lights",
  },
  {
    image: "/images/facebook-work/kitchen-linear-lighting.jpeg",
    type: "Stair lighting",
    title: "Staircase perimeter lighting",
    text: "Here the concealed lighting follows the stair edges and washes the wood treads, giving the homeowner a safer path with a finished look.",
    alt: "Wood staircase with concealed lighting along both side walls and illuminated treads",
  },
];
const services = [
  [
    "01",
    "Renovation & remodeling",
    "Kitchen and bath renovations, additions, lighting plans, receptacle relocation, and electrical updates tailored to the finished space.",
  ],
  [
    "02",
    "Electrical service & repairs",
    "Responsive troubleshooting for outages, unsafe wiring, breakers, switches, receptacles, fixtures, and other everyday electrical issues.",
  ],
  [
    "03",
    "New construction",
    "Reliable planning, rough-in, service installation, and trim-out for new homes, additions, offices, and light commercial spaces.",
  ],
  [
    "04",
    "Lighting & controls",
    "Interior, exterior, landscape, security, and smart lighting installed with clean lines and intuitive controls.",
  ],
  [
    "05",
    "Panels & power",
    "Panel replacements, circuit additions, surge protection, generator interlocks, EV-ready circuits, and capacity improvements.",
  ],
  [
    "06",
    "Residential & commercial",
    "Code-conscious electrical solutions for homeowners, builders, property managers, and locally owned businesses.",
  ],
];

const Arrow = () => <span aria-hidden="true">↗</span>;
function Cta() {
  return (
    <section className="cta">
      <p className="eyebrow">Ready when you are</p>
      <h2>
        Let’s power your
        <br />
        <em>next project.</em>
      </h2>
      <div>
        <Link className="button yellow" to="/contact">
          Request a free estimate <Arrow />
        </Link>
        <a className="text-link light" href={c.phoneHref}>
          Call {c.phoneDisplay} →
        </a>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <section className="hero">
        <img
          className="hero-media"
          src="/images/hero-electrician.jpg"
          alt="Professional residential electrician wearing safety glasses and gloves while working on an open main service panel with breakers, wiring, and testing tools"
          width="2200"
          height="1238"
          fetchPriority="high"
        />
        <div>
          <p className="eyebrow">Wilmington · Cape Fear region</p>
          <h1>
            Powering the places
            <br />
            <em>life happens.</em>
          </h1>
          <p className="lede">
            From a careful repair to a ground-up build, Alpha Electric Southeast
            brings safe, thoughtful electrical work to homes and businesses.
          </p>
          <div className="actions">
            <Link className="button yellow" to="/contact">
              Request a free estimate <Arrow />
            </Link>
            <a className="text-link light" href={c.phoneHref}>
              Call {c.phoneDisplay} →
            </a>
          </div>
        </div>
        <aside>
          <span></span>
          <p>
            Licensed &amp; insured
            <br />
            <strong>Local. Responsive. Built to last.</strong>
            <small className="safety-quip">
              "Don't be a dummy, gettin' shocked ain't funny!"
              <em>- a smart man</em>
            </small>
          </p>
        </aside>
      </section>
      <section className="trust" aria-label="Our commitments">
        <div>
          <b>01</b>
          <span>
            Safety first<small>Every time, every job</small>
          </span>
        </div>
        <div>
          <b>02</b>
          <span>
            Built to last<small>Quality workmanship</small>
          </span>
        </div>
        <div>
          <b>03</b>
          <span>
            Local &amp; responsive<small>Serving three counties</small>
          </span>
        </div>
      </section>
      <section className="split intro">
        <p className="section-label">What we do</p>
        <div>
          <h2>
            Electrical work
            <br />
            without the guesswork.
          </h2>
          <p>
            Whether you are renovating a room, opening a business, or need a
            dependable fix, we make the path from question to solution
            straightforward.
          </p>
          <Link className="text-link" to="/applications">
            Explore our services →
          </Link>
        </div>
      </section>
      <section className="feature">
        <img
          src="/images/facebook-work/pool-landscape-lighting.jpeg"
          alt="Pool terrace at night with illuminated steps, wall edges, paths, and planting beds"
          width="1788"
          height="1063"
        />
        <div>
          <p className="section-label">Care in every detail</p>
          <h2>
            Clean work.
            <br />
            <em>Clear answers.</em>
          </h2>
          <p>
            We plan carefully, communicate plainly, and respect your space—from
            the wiring behind the wall to the final fixture you see every day.
          </p>
          <Link className="button dark" to="/our-work">
            See our work <Arrow />
          </Link>
        </div>
      </section>
      <Cta />
    </>
  );
}

export function Applications() {
  return (
    <>
      <section className="page-hero applications-hero">
        <img
          className="page-hero-media"
          src="/images/facebook-work/wine-room-cabinet-lighting.jpeg"
          alt="Wine room with integrated cabinet lighting, glass doors, and illuminated shelves"
          width="1369"
          height="918"
          fetchPriority="high"
        />
        <div className="page-hero-content">
          <p className="eyebrow">Applications</p>
          <h1>
            Expert power for
            <br />
            <em>every plan.</em>
          </h1>
          <p>
            Practical electrical expertise for the way people live, work, and
            grow along the North Carolina coast.
          </p>
        </div>
      </section>
      <section className="services">
        {services.map(([, title, text], i) => (
          <article
            className={i === 1 ? "dark" : i === 2 ? "yellow" : ""}
            key={title}
          >
            <div className="service-icon" aria-hidden="true">
              {["⌂", "⌁", "＋", "✦", "▦", "↯"][i]}
            </div>
            <h2>{title}</h2>
            <p>{text}</p>
            <Link to="/contact" aria-label={`Request an estimate for ${title}`}>
              →
            </Link>
          </article>
        ))}
      </section>
      <section className="process">
        <p className="section-label">How we work</p>
        <h2>
          A straightforward path
          <br />
          from call to completion.
        </h2>
        <ol>
          <li>
            <b>01</b>
            <span>
              <strong>Start the conversation</strong>Tell us what is happening,
              what you are planning, and where the project is located.
            </span>
          </li>
          <li>
            <b>02</b>
            <span>
              <strong>Get a clear plan</strong>We assess the scope, answer
              questions, and outline the recommended next steps.
            </span>
          </li>
          <li>
            <b>03</b>
            <span>
              <strong>Finish with confidence</strong>We complete the work
              carefully and leave you with a safe, clean, dependable result.
            </span>
          </li>
        </ol>
      </section>
      <Cta />
    </>
  );
}

export function OurWork() {
  return (
    <>
      <section className="page-hero work-hero">
        <p className="eyebrow">Our work</p>
        <h1>
          Details matter.
          <br />
          <em>We notice them.</em>
        </h1>
        <p>
          Thoughtful execution for the parts you see and the parts you do not.
        </p>
      </section>
      <section className="gallery">
        <div className="section-heading">
          <div>
            <p className="section-label">Project gallery</p>
            <h2>Work with purpose.</h2>
          </div>
          <p>
            A selection of residential and commercial electrical work completed
            by Alpha Electric Southeast.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((p, i) => (
            <figure className={i === 0 ? "wide" : ""} key={p.title}>
              <img
                src={p.image}
                alt={p.alt}
                width="1200"
                height="900"
                loading="lazy"
              />
              <figcaption>
                <span>{p.type}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}

export function Contact() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = createQuotePayload(form);
    const parsed = quoteSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((x) => [String(x.path[0]), x.message]),
        ),
      );
      setState("idle");
      return;
    }
    setErrors({});
    setState("loading");
    try {
      const fd = new FormData(form);
      const photo = fd.get("photo") as File;
      if (photo?.size) {
        if (photo.size > 5_000_000)
          throw new Error("Photo must be under 5 MB.");
        if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type))
          throw new Error("Photo must be a JPG, PNG, or WebP image.");
        payload.photo = {
          name: photo.name,
          type: photo.type,
          data: await fileData(photo),
        };
      }
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(
          (await res.json().catch(() => ({}))).error ||
            "We could not send your request.",
        );
      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setErrors({
        form:
          err instanceof Error ? err.message : "Please try again or call us.",
      });
    }
  }
  if (state === "success")
    return (
      <section className="success" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <p className="eyebrow">Request received</p>
        <h1>Thank you.</h1>
        <p>We have your project details and will be in touch soon.</p>
        <a className="button dark" href={c.phoneHref}>
          Need us sooner? Call {c.phoneDisplay}
        </a>
      </section>
    );
  return (
    <section className="contact">
      <div className="contact-copy">
        <p className="section-label">Free project estimate</p>
        <h1>
          Let’s make
          <br />
          <em>a plan.</em>
        </h1>
        <p>
          Tell us about your project. We’ll follow up to understand the work,
          answer questions, and schedule the right next step.
        </p>
        <ul className="contact-benefits" aria-label="Estimate benefits">
          <li>
            <span aria-hidden="true">✓</span> Licensed &amp; insured
          </li>
          <li>
            <span aria-hidden="true">✓</span> Local three-county service
          </li>
          <li>
            <span aria-hidden="true">✓</span> Clear project follow-up
          </li>
        </ul>
        <address>
          <span>Prefer to talk?</span>
          <a href={c.phoneHref}>{c.phoneDisplay}</a>
          <small>Serving {c.serviceArea}</small>
        </address>
        <div className="external">
          <a href={c.mapsUrl} target="_blank" rel="noreferrer">
            Google Maps ↗
          </a>
          <a href={c.reviewsUrl} target="_blank" rel="noreferrer">
            Read reviews ↗
          </a>
        </div>
      </div>
      <form
        className="quote-card"
        onSubmit={submit}
        noValidate
        aria-busy={state === "loading"}
      >
        <div className="form-heading">
          <span>Tell us about the work</span>
          <strong>Request your free estimate</strong>
        </div>
        <div className="form-row">
          <Field name="name" label="Name" error={errors.name}>
            <input id="name" name="name" autoComplete="name" />
          </Field>
          <Field name="phone" label="Phone" error={errors.phone}>
            <input id="phone" name="phone" type="tel" autoComplete="tel" />
          </Field>
        </div>
        <Field name="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" />
        </Field>
        <Field
          name="serviceType"
          label="Service type"
          error={errors.serviceType}
        >
          <select id="serviceType" name="serviceType" defaultValue="">
            <option value="" disabled>
              Choose a service
            </option>
            <option>Renovation &amp; remodeling</option>
            <option>Electrical service &amp; repairs</option>
            <option>New construction</option>
            <option>Lighting &amp; controls</option>
            <option>Panel upgrade</option>
            <option>Residential / commercial</option>
          </select>
        </Field>
        <Field
          name="projectDetails"
          label="Project details"
          error={errors.projectDetails}
        >
          <textarea
            id="projectDetails"
            name="projectDetails"
            rows={5}
            placeholder="Tell us about the space, timeline, or electrical issue."
          />
        </Field>
        <fieldset>
          <legend>Preferred contact method</legend>
          <label>
            <input
              type="radio"
              name="preferredContact"
              value="Phone"
              defaultChecked
            />{" "}
            Phone
          </label>
          <label>
            <input type="radio" name="preferredContact" value="Text" /> Text
          </label>
          <label>
            <input type="radio" name="preferredContact" value="Email" /> Email
          </label>
        </fieldset>
        <label className="file">
          Optional project photo <small>JPG, PNG, or WebP · 5 MB max</small>
          <input
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
          />
        </label>
        <label className="consent">
          <input name="consent" type="checkbox" />{" "}
          <span>
            I agree that Alpha Electric Southeast may contact me about this
            request.
          </span>
        </label>
        {errors.consent && <span className="error">{errors.consent}</span>}
        <label className="honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        {state === "error" && (
          <p className="form-error" role="alert">
            {errors.form} Please try again or call{" "}
            <a href={c.phoneHref}>{c.phoneDisplay}</a>.
          </p>
        )}
        <div className="form-actions">
          <button className="button yellow" disabled={state === "loading"}>
            {state === "loading"
              ? "Sending request…"
              : "Request my free estimate"}{" "}
            <Arrow />
          </button>
          <a
            className="button emergency"
            href={c.phoneHref}
            aria-label={`Emergency Request — call ${c.phoneDisplay}`}
          >
            Emergency Request
          </a>
        </div>
        <p className="emergency-note">
          For an urgent electrical concern, call directly. Emergency
          availability is not guaranteed.
        </p>
      </form>
    </section>
  );
}
function Field({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field" htmlFor={name}>
      {label}
      {children}
      {error && <span className="error">{error}</span>}
    </label>
  );
}
function fileData(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = () => reject(new Error("Could not read that photo."));
    r.readAsDataURL(file);
  });
}
