"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ArrowUpRight, Bot, X } from "lucide-react";
import { resumeUrl, social } from "@/lib/projects";
import { Typewriter } from "./typewriter";
import { RobotLoader, RobotLoadingBoundary } from "./robot-loader";
import { GUIDE_LOADING } from "@/lib/guide-loading";
const RobotScene = dynamic(() => import("./robot-scene"), { ssr: false });
const topics = {
  about: {
    label: "Who is Ifraz?",
    message:
      "Ifraz is a Full Stack Engineer based in Karachi. He builds web and mobile applications, with experience at Azality and freelance work on telehealth and delivery platforms.",
    actions: [
      { label: "Get to know Ifraz", href: "/#about" },
      { label: "View résumé", href: resumeUrl },
    ],
  },
  work: {
    label: "Show me the work",
    message:
      "Start with MoveInMedical, his freelance telehealth work. Myul explores delivery bidding and payments, followed by BudgetMate, his final-year finance app.",
    actions: [
      { label: "Explore selected work", href: "/#work" },
      { label: "Read BudgetMate’s story", href: "/projects/budgetmate" },
    ],
  },
  hiring: {
    label: "I’m hiring",
    message:
      "Looking for a full stack engineer? Explore Ifraz’s experience at Azality and his freelance projects, or open his résumé for the details.",
    actions: [
      { label: "Explore experience", href: "/#experience" },
      { label: "View résumé", href: resumeUrl },
    ],
  },
  project: {
    label: "I have a project",
    message:
      "Have something in mind? Ifraz works across web applications, mobile experiences, APIs, and integrations. Share what you’re building and the help you need.",
    actions: [
      { label: "Discuss your project", href: social.email },
      { label: "Explore capabilities", href: "/#capabilities" },
    ],
  },
  skills: {
    label: "Explore skills",
    message:
      "His main tools include React, Next.js, TypeScript, React Native, Node.js, Express, and MongoDB. He’s also continuing to learn Python and AI engineering.",
    actions: [
      { label: "See the toolkit", href: "/#skills" },
      { label: "See it in practice", href: "/#work" },
    ],
  },
  contact: {
    label: "Contact Ifraz",
    message:
      "Ready to connect? Send Ifraz an email or find him on LinkedIn. Whether it’s a role or a freelance project, start with a little about what you have in mind.",
    actions: [
      { label: "Send an email", href: social.email },
      { label: "Open LinkedIn", href: social.linkedin },
    ],
  },
} as const;
type Topic = keyof typeof topics;
const prompts: {
  topic: Topic;
  question: string;
  description: string;
  action: string;
}[] = [
  {
    topic: "about",
    question: "Who is Ifraz?",
    description: "Meet the engineer behind the work.",
    action: "Get to know Ifraz",
  },
  {
    topic: "project",
    question: "Have something in mind?",
    description: "Let’s talk about your next project.",
    action: "Discuss a project",
  },
  {
    topic: "hiring",
    question: "Looking for an engineer?",
    description: "Explore experience or open the résumé.",
    action: "Explore experience",
  },
  {
    topic: "work",
    question: "Want to see what I build?",
    description: "Start with the projects and their stories.",
    action: "Show me the work",
  },
  {
    topic: "skills",
    question: "Curious about the toolkit?",
    description: "Discover the tools behind the applications.",
    action: "Explore skills",
  },
  {
    topic: "contact",
    question: "Ready to connect?",
    description: "A role, an idea, or a quick hello.",
    action: "Contact Ifraz",
  },
];
export function GuideController({ hero = false }: { hero?: boolean }) {
  const [open, setOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(hero);
  const [pageVisible, setPageVisible] = useState(true);
  const [greeting, setGreeting] = useState(false);
  const [topic, setTopic] = useState<Topic>("about");
  const [wave, setWave] = useState(0);
  const [supports3D, setSupports3D] = useState(false);
  const [capabilityChecked, setCapabilityChecked] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [promptStep, setPromptStep] = useState(0);
  const [completedPrompt, setCompletedPrompt] = useState(-1);
  const [readTopics, setReadTopics] = useState<Topic[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const reduced = useReducedMotion();
  const region = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const typingReaction = useRef({ started: 0, finished: 0 });
  const startTyping = useCallback(() => {
    typingReaction.current = { started: performance.now() / 1000, finished: 0 };
    requestRender.current?.();
  }, []);
  const finishPrompt = useCallback(
    (didAnimate: boolean) => {
      setCompletedPrompt(promptStep);
      if (didAnimate)
        typingReaction.current.finished = performance.now() / 1000;
    },
    [promptStep],
  );
  const finishAnswer = useCallback(
    (didAnimate: boolean) => {
      setReadTopics((previous) =>
        previous.includes(topic) ? previous : [...previous, topic],
      );
      if (didAnimate)
        typingReaction.current.finished = performance.now() / 1000;
    },
    [topic],
  );
  const orientation = useRef({ yaw: -0.25, pitch: 0 });
  const requestRender = useRef<(() => void) | null>(null);
  const drag = useRef<{
    x: number;
    y: number;
    yaw: number;
    pitch: number;
    moved: boolean;
  } | null>(null);
  const dragged = useRef(false);
  const onReady = useCallback(() => setSceneReady(true), []);
  const onFailure = useCallback(() => setSceneFailed(true), []);
  const failed = sceneFailed || (capabilityChecked && !supports3D);
  const robotReady = sceneReady && !failed;
  const loading = !failed && !robotReady;
  useEffect(() => {
    if (!hero || !region.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(region.current);
    return () => observer.disconnect();
  }, [hero]);
  useEffect(() => {
    const change = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    if (!hero) return;
    const timer = window.setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2", {
          failIfMajorPerformanceCaveat: true,
        });
        setSupports3D(Boolean(gl));
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        setSupports3D(false);
      } finally {
        setCapabilityChecked(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [hero]);
  useEffect(() => {
    if (!hero || !loading) return;
    const timer = window.setTimeout(onFailure, GUIDE_LOADING.timeoutMs);
    return () => window.clearTimeout(timer);
  }, [hero, loading, onFailure]);
  useEffect(() => {
    if (!hero || !robotReady) return;
    const timer = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem("ifraz-guide-prompts-dismissed-v2")) return;
      } catch {
        /* A blocked storage API must not break navigation. */
      }
      setGreeting(true);
      setWave((value) => value + 1);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [hero, robotReady]);
  useEffect(() => {
    if (
      !greeting ||
      !heroVisible ||
      !pageVisible ||
      completedPrompt !== promptStep ||
      open ||
      hovered ||
      focusWithin
    )
      return;
    const timer = window.setTimeout(
      () => setPromptStep((value) => value + 1),
      5000,
    );
    return () => window.clearTimeout(timer);
  }, [
    greeting,
    heroVisible,
    pageVisible,
    open,
    hovered,
    focusWithin,
    completedPrompt,
    promptStep,
  ]);
  const changeOpen = (value: boolean) => {
    setOpen(value);
    if (value) {
      setWave((count) => count + 1);
    }
  };
  const selectTopic = (value: Topic) => {
    setTopic(value);
    setWave((count) => count + 1);
  };
  const active = heroVisible && pageVisible && !open;
  const answer = topics[topic];
  const prompt = prompts[promptStep % prompts.length];
  const dismissPrompts = () => {
    setGreeting(false);
    try {
      sessionStorage.setItem("ifraz-guide-prompts-dismissed-v2", "yes");
    } catch {
      /* Navigation does not depend on storage. */
    }
  };
  const resetView = () => {
    orientation.current = { yaw: -0.25, pitch: 0 };
    pointer.current = { x: 0, y: 0 };
    requestRender.current?.();
  };
  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      {hero ? (
        <div
          className="hero-bot robot-region"
          ref={region}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => {
            setHovered(false);
            pointer.current = { x: 0, y: 0 };
          }}
          onFocusCapture={() => setFocusWithin(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setFocusWithin(false);
          }}
          onPointerMove={(event) => {
            if (reduced || event.pointerType === "touch" || drag.current?.moved)
              return;
            const rect = event.currentTarget.getBoundingClientRect();
            pointer.current = {
              x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
              y: -((event.clientY - rect.top) / rect.height - 0.5) * 2,
            };
          }}
        >
          <AnimatePresence>
            {greeting && robotReady ? (
              <motion.aside
                className="robot-greeting"
                initial={{ opacity: 0, y: reduced ? 0 : 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                aria-label="Questions from the portfolio guide"
                aria-hidden={!heroVisible || open}
                inert={!heroVisible || open}
                style={{ visibility: open ? "hidden" : "visible" }}
              >
                <p>
                  <strong>{prompt.question}</strong>
                  <br />
                  <Typewriter
                    key={promptStep}
                    text={prompt.description}
                    paused={!heroVisible || !pageVisible || open}
                    onStart={startTyping}
                    onComplete={finishPrompt}
                  />
                </p>
                <button
                  className="greeting-close"
                  aria-label="Dismiss rotating questions"
                  onClick={dismissPrompts}
                >
                  <X size={14} />
                </button>
                <button
                  className="greeting-action"
                  onClick={() => {
                    selectTopic(prompt.topic);
                    changeOpen(true);
                  }}
                >
                  {prompt.action} <ArrowRight size={13} />
                </button>
                <button
                  className="next-prompt"
                  aria-label="Next guide question"
                  onClick={() => setPromptStep((value) => value + 1)}
                >
                  <ArrowRight size={12} />
                </button>
              </motion.aside>
            ) : null}
          </AnimatePresence>
          <Dialog.Trigger asChild>
            <button
              aria-label="Open portfolio guide"
              aria-hidden={!heroVisible}
              tabIndex={heroVisible ? 0 : -1}
              className="bot-hero-button bot-3d-button"
              data-renderer={robotReady ? "webgl" : failed ? "unavailable" : "loading"}
              aria-describedby="robot-rotation-help"
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                dragged.current = false;
                drag.current = {
                  x: event.clientX,
                  y: event.clientY,
                  yaw: orientation.current.yaw,
                  pitch: orientation.current.pitch,
                  moved: false,
                };
              }}
              onPointerMove={(event) => {
                const start = drag.current;
                if (!start || !robotReady) return;
                const dx = event.clientX - start.x,
                  dy = event.clientY - start.y;
                if (
                  !start.moved &&
                  Math.abs(dx) > 5 &&
                  Math.abs(dx) > Math.abs(dy)
                ) {
                  start.moved = true;
                  dragged.current = true;
                  event.currentTarget.setPointerCapture(event.pointerId);
                }
                if (start.moved) {
                  orientation.current = {
                    yaw: start.yaw + dx * 0.014,
                    pitch: Math.max(
                      -0.35,
                      Math.min(0.35, start.pitch + dy * 0.004),
                    ),
                  };
                  pointer.current = { x: 0, y: 0 };
                  requestRender.current?.();
                }
              }}
              onPointerUp={(event) => {
                drag.current = null;
                if (event.currentTarget.hasPointerCapture(event.pointerId))
                  event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
              onClickCapture={(event) => {
                if (dragged.current && event.detail !== 0) {
                  event.preventDefault();
                  event.stopPropagation();
                  dragged.current = false;
                }
              }}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key))
                  return;
                event.preventDefault();
                if (event.key === "Home") {
                  resetView();
                  return;
                }
                orientation.current.yaw +=
                  event.key === "ArrowLeft" ? -Math.PI / 8 : Math.PI / 8;
                requestRender.current?.();
              }}
            >
              <AnimatePresence initial={false}>{loading ? <motion.div key="robot-loader" className="robot-loader-layer" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.18}}><RobotLoader variant={GUIDE_LOADING.variant} paused={!heroVisible || !pageVisible}/></motion.div> : null}</AnimatePresence>
              {failed ? <span className="robot-unavailable"><Bot size={42} strokeWidth={1.25}/><span>Open portfolio guide <ArrowUpRight size={14}/></span><small>Explore Ifraz’s work</small></span> : null}
              {supports3D && !failed ? (
                <div className="robot-canvas" data-ready={robotReady}>
                  <RobotLoadingBoundary onFailure={onFailure}>
                  <RobotScene
                    active={active}
                    reduced={Boolean(reduced)}
                    wave={wave}
                    pointer={pointer}
                    onReady={onReady}
                    onFailure={onFailure}
                    orientation={orientation}
                    requestRender={requestRender}
                    typingReaction={typingReaction}
                  />
                  </RobotLoadingBoundary>
                </div>
              ) : null}
            </button>
          </Dialog.Trigger>
          {robotReady ? <div className="bot-shadow" aria-hidden="true" /> : null}
          <div className="robot-controls" aria-hidden={!heroVisible}>
            <span id="robot-rotation-help">
              {robotReady
                ? "Drag to rotate 360° · ← → keys"
                : "Your portfolio companion"}
            </span>
            {robotReady ? (
              <button onClick={resetView} tabIndex={heroVisible ? 0 : -1}>
                Reset view
              </button>
            ) : null}
          </div>
          <button
            className="bot-caption bot-caption-button"
            onClick={() => changeOpen(true)}
            tabIndex={heroVisible ? 0 : -1}
            aria-hidden={!heroVisible}
          >
            <span className="status-dot" />
            Meet my portfolio guide <ArrowUpRight size={13} />
          </button>
        </div>
      ) : null}
      <AnimatePresence>
        {!heroVisible ? (
          <motion.div
            className="guide-launcher"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Dialog.Trigger asChild>
              <button
                aria-label="Open portfolio guide"
                className="launcher-button"
              >
                <Image
                  src="/images/guide-bot.png"
                  alt=""
                  width={78}
                  height={78}
                />
                <span>Ask about my work</span>
              </button>
            </Dialog.Trigger>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay guide-overlay" />
        <Dialog.Content className="guide-panel conversational-guide">
          <div className="guide-panel-heading">
            <Image src="/images/guide-bot.png" alt="" width={60} height={60} />
            <div>
              <Dialog.Title>Meet my portfolio guide</Dialog.Title>
              <span className="micro">
                A little about Ifraz. A way into his work.
              </span>
            </div>
            <Dialog.Close
              className="icon-button"
              aria-label="Close portfolio guide"
            >
              <X size={20} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="guide-intro">
            What would you like to know?
          </Dialog.Description>
          <div className="guide-topics" aria-label="Choose a topic">
            {(Object.entries(topics) as [Topic, (typeof topics)[Topic]][]).map(
              ([key, value]) => (
                <button
                  key={key}
                  aria-pressed={topic === key}
                  onClick={() => selectTopic(key)}
                >
                  {value.label}
                </button>
              ),
            )}
          </div>
          <div className="guide-answer" aria-live="polite" aria-atomic="true">
            <span className="micro">{answer.label}</span>
            <p>
              <Typewriter
                key={topic}
                text={answer.message}
                animate={!readTopics.includes(topic)}
                paused={!pageVisible}
                onStart={startTyping}
                onComplete={finishAnswer}
              />
            </p>
            <div className="guide-answer-actions">
              {answer.actions.map((action) => {
                const external =
                  action.href === resumeUrl || action.href.startsWith("https:");
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    onClick={() => {
                      if (!external && !action.href.startsWith("mailto:"))
                        setOpen(false);
                    }}
                  >
                    {action.label}
                    <ArrowUpRight size={14} />
                    {external ? (
                      <span className="sr-only"> (opens in new tab)</span>
                    ) : null}
                  </a>
                );
              })}
            </div>
          </div>
          <p className="guide-note">
            Guided answers about Ifraz’s work. No live AI chat.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
