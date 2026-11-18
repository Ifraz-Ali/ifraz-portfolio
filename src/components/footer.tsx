import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { resumeUrl, social } from "@/lib/projects";
export function Footer() {
  return (
    <footer id="contact" className="container contact-section">
      <div className="contact-inner">
        <div>
          <span className="section-label">Have something in mind?</span>
          <h2>
            Let’s discuss
            <br />
            your <span>next project.</span>
          </h2>
          <p className="muted">
            Hiring for your team or building something new?
            <br />
            I’d be happy to hear from you.
          </p>
        </div>
        <div className="contact-links">
          <a href={social.email}>
            <Mail size={18} />
            ifrazali662@gmail.com
            <ArrowUpRight size={15} />
          </a>
          <a href={social.github} target="_blank" rel="noopener noreferrer">
            <Github size={18} />
            GitHub
            <ArrowUpRight size={15} />
          </a>
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={18} />
            LinkedIn
            <ArrowUpRight size={15} />
          </a>
          <a
            className="resume-inline"
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Résumé
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Ifraz Ali</span>
        <span>Built with care. Based in Karachi.</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
