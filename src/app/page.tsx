import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  GraduationCap,
  Laptop,
  Smartphone,
} from "lucide-react";
import { BudgetMateMedia } from "@/components/project-media";
import { MyulWorkflow } from "@/components/myul-workflow";
import { MoveInMedicalMedia } from "@/components/moveinmedical-media";
import { PortfolioGuide } from "@/components/guide";
import { Reveal } from "@/components/motion";
import { Footer } from "@/components/footer";
import { projects } from "@/lib/projects";
export default function Home() {
  const featured = projects[0];
  return (
    <>
      <main id="main" className="container">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              Karachi, Pakistan <span>/</span> Open to roles & freelance
              projects
            </p>
            <h1 id="hero-title">
              IFRAZ ALI<span>Full Stack Engineer</span>
            </h1>
            <p className="hero-intro">
              I build web and mobile applications, connecting thoughtful interfaces with reliable backend systems.
            </p>
            <div className="hero-actions">
              <a href="#work" className="button primary">
                View selected work <ArrowUpRight size={18} />
              </a>
              <a href="#contact" className="button">
                Get in touch
              </a>
            </div>
          </div>
          <PortfolioGuide hero />
        </section>
        <section id="work" aria-labelledby="work-heading">
          <div className="section-heading">
            <span>01 /</span>
            <h2 id="work-heading">Featured project</h2>
            <div />
          </div>
          <Reveal className="featured-project">
            <div className="featured-copy">
              <h3>{featured.name}</h3>
              <span className="project-kind">
                {featured.kind} / {featured.category}
              </span>
              <h4>{featured.headline}</h4>
              <p>{featured.description}</p>
              <ul className="tags" aria-label={`${featured.name} technologies`}>
                {featured.stack.slice(0, 4).map(
                  (tag) => (
                    <li key={tag}>{tag}</li>
                  ),
                )}
              </ul>
              <Link className="text-link" href={`/projects/${featured.slug}`}>
                View case study <ArrowUpRight size={19} />
              </Link>
            </div>
            <MoveInMedicalMedia />
          </Reveal>
          {projects.slice(1).map((project, index) => (
            <Reveal key={project.slug} className="project-row">
              <span className="project-index">0{index + 2} /</span>
              <div className="project-row-copy">
                <h3>{project.name}</h3>
                <span className="project-kind">
                  {project.kind} / {project.category}
                </span>
                <p>{project.description}</p>
                <Link className="text-link" href={`/projects/${project.slug}`}>
                  View case study <ArrowUpRight size={18} />
                </Link>
              </div>
              <ul
                className="stack-list"
                aria-label={`${project.name} technologies`}
              >
                {project.stack.slice(0, 4).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {project.slug === "budgetmate" ? <BudgetMateMedia /> : <MyulWorkflow />}
            </Reveal>
          ))}
        </section>
        <section
          id="experience"
          className="experience-section"
          aria-labelledby="experience-heading"
        >
          <div className="section-heading">
            <h2 id="experience-heading">Experience</h2>
            <div />
          </div>
          <Reveal>
            <article className="experience-row">
              <h3>Azality</h3>
              <div>
                <h4>Junior Software Engineer</h4>
                <p>
                  Business dashboards, role-based access, and AI-assisted
                  features.
                </p>
              </div>
              <p className="experience-date">Dec 2025 — Present</p>
            </article>
            <article className="experience-row">
              <h3>Freelance</h3>
              <div>
                <h4>Full Stack Developer</h4>
                <p>
                  MoveInMedical and Myul. Interfaces, APIs, and connected
                  workflows.
                </p>
              </div>
              <p className="experience-date">Jun 2025 — Aug 2026</p>
            </article>
          </Reveal>
        </section>
        <section
          id="about"
          className="about-section"
          aria-label="About, capabilities, and education"
        >
          <Reveal className="about-column">
            <div className="section-heading">
              <h2>About</h2>
              <div />
            </div>
            <h3>Based in Karachi.</h3>
            <p className="about-intro">
              Building across frontend
              <br /> and backend.
            </p>
            <p className="muted about-detail">
              I enjoy turning complex workflows into useful applications,
              connecting the interface with the systems behind it.
            </p>
          </Reveal>
          <Reveal className="capabilities-column">
            <div className="section-heading">
              <h2 id="capabilities">Capabilities</h2>
              <div />
            </div>
            <ul className="capabilities">
              <li>
                <Laptop />
                Web applications
              </li>
              <li>
                <Smartphone />
                Mobile development
              </li>
              <li>
                <Code2 />
                APIs & AI integrations
              </li>
            </ul>
            <div id="skills" className="skill-group">
              <h3 className="micro">Tools behind the work</h3>
              <ul className="tags">
                {[
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Node.js",
                  "Express",
                  "MongoDB",
                  "React Native",
                  "Git",
                ].map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal className="education-column">
            <div className="section-heading">
              <h2>Education</h2>
              <div />
            </div>
            <GraduationCap className="education-icon" />
            <h3>Bachelor of Computer Science</h3>
            <p>KIET</p>
            <p className="micro muted">Feb 2022 — Aug 2026</p>
            <div className="learning">
              <span className="micro">Continuing to learn</span>
              <p>Python & AI engineering</p>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
