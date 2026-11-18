"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { resumeUrl } from "@/lib/projects";
const links = [
  ["Work", "/#work"],
  ["Experience", "/#experience"],
  ["About", "/#about"],
  ["Contact", "/#contact"],
] as const;
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="wordmark" href="/" aria-label="Ifraz Ali home">
          IFRAZ<span>.</span>ALI
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <a
          className="button resume-button"
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Résumé <ArrowUpRight size={16} />
          <span className="sr-only"> (opens in new tab)</span>
        </a>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className="icon-button mobile-toggle"
              aria-label="Open navigation"
            >
              <Menu />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay mobile-menu-overlay" />
            <Dialog.Content className="mobile-menu">
              <Dialog.Title className="wordmark">IFRAZ.ALI</Dialog.Title>
              <Dialog.Description className="muted">
                Find your way around.
              </Dialog.Description>
              <Dialog.Close
                className="icon-button menu-close"
                aria-label="Close navigation"
              >
                <X />
              </Dialog.Close>
              <nav aria-label="Mobile navigation">
                {links.map(([label, href]) => (
                  <Link key={label} href={href} onClick={() => setOpen(false)}>
                    {label}
                    <ArrowUpRight />
                  </Link>
                ))}
              </nav>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button primary"
              >
                View Résumé <ArrowUpRight size={18} />
              </a>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
