import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { projects } from "@/lib/projects";
import { BudgetMateMedia } from "@/components/project-media";
import { MyulWorkflow } from "@/components/myul-workflow";
import { MoveInMedicalMedia } from "@/components/moveinmedical-media";
import { PortfolioGuide } from "@/components/guide";
import { Footer } from "@/components/footer";
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project?.name ?? "Project not found",
    description: project?.description,
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <main id="main" className="container case-study">
        <Link className="back-link" href="/#work">
          <ArrowLeft size={17} />
          All selected work
        </Link>
        <header className="case-header">
          <span className="project-kind">
            {project.kind} / {project.category}
          </span>
          <h1>{project.name}</h1>
          <p className="case-headline">{project.headline}</p>
          <div className="case-meta">
            <p>
              <span className="micro muted">My role</span>
              {project.role}
            </p>
            <ul className="tags" aria-label="Technologies">
              {project.stack.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </header>
        <section
          className={`case-visual ${project.slug === "budgetmate" ? "has-phones" : ""}`}
          aria-label={`${project.name} imagery`}
        >
          {project.slug === "budgetmate" ? (
            <BudgetMateMedia detailed />
          ) : project.slug === "moveinmedical" ? (
            <MoveInMedicalMedia detailed />
          ) : (
            <MyulWorkflow detailed />
          )}
        </section>
        <div className="case-content">
          <section>
            <h2>The context</h2>
            <p>{project.context}</p>
          </section>
          <section>
            <h2>My contribution</h2>
            <ul className="contribution-list">
              {project.contributions.map((text) => (
                <li key={text}>
                  <Check size={18} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Inside the work</h2>
            <div className="decision-list">
              {project.decisions.map((item, index) => (
                <article key={item.title}>
                  <span className="micro accent">0{index + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h2>Outcome & scope</h2>
            <p>{project.outcome}</p>
          </section>
          <section>
            <h2>What I took from it</h2>
            <p>{project.lessons}</p>
          </section>
        </div>
        <Link className="next-project" href={`/projects/${next.slug}`}>
          <span>
            <span className="micro muted">Next project</span>
            <strong>{next.name}</strong>
          </span>
          <ArrowUpRight size={40} />
        </Link>
      </main>
      <Footer />
      <PortfolioGuide />
    </>
  );
}
