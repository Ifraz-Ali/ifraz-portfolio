const projectDetails = [
  {
    slug: "budgetmate",
    name: "BudgetMate",
    kind: "Final-year project",
    category: "Mobile finance",
    headline: "Everyday finances, brought into focus.",
    description:
      "Income and expense tracking, cash-flow forecasts, and spending insights.",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
    ],
    context:
      "A final-year Computer Science project at KIET, bringing individual and shared family financial management into a cross-platform mobile application.",
    role: "Full stack development · Final-year project",
    contributions: [
      "Built mobile and backend workflows for income, expenses, budgets, savings goals, and recurring transactions.",
      "Implemented authentication, email verification, and role-based family permissions.",
      "Integrated OCR-assisted receipt entry, financial reporting, push notifications, and Urdu localization.",
    ],
    decisions: [
      {
        title: "A useful overview, before the detail",
        text: "The overview places current balance, income, expenses, and a month-end forecast together. Category breakdowns and recent transactions provide the next level of detail.",
      },
      {
        title: "Less manual entry",
        text: "Receipt processing combines OCR.space, Gemini, and Cloudinary to assist with extracting receipt information and recommending transaction categories.",
      },
      {
        title: "Payments with explicit boundaries",
        text: "PaymentIntents, verified webhooks, refunds, and seeded bill-provider data supported payment testing. This is a tested integration, not a claim of a live banking service.",
      },
    ],
    outcome:
      "Completed as a final-year project at KIET. BudgetMate brings together transaction tracking, budgeting, cash-flow forecasts, category insights, and shared family permissions in one cross-platform application.",
    lessons:
      "Building across mobile UI, APIs, integrations, and reporting reinforced the importance of consistent permissions, useful feedback, and testing complete financial workflows.",
  },
  {
    slug: "moveinmedical",
    name: "MoveInMedical",
    kind: "Freelance project",
    category: "Telehealth",
    headline: "Connecting care, consultations, and devices.",
    description:
      "Clinical workflows, connected devices, and real-time consultations.",
    stack: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Zoom Video SDK",
      "Socket.IO",
    ],
    context:
      "Freelance work on a telehealth platform supporting patients, physicians, care facilities, administrators, and connected clinical examination devices.",
    role: "Full Stack Developer · Freelance",
    contributions: [
      "Developed interfaces and APIs for intake, clinical documentation, uploads, appointment scheduling, payments, and PDF workflows.",
      "Integrated Zoom Video SDK and Socket.IO for consultations, device connections, remote media controls, and session events.",
      "Worked on device provisioning and session recovery using QR setup, token authentication, heartbeats, reconnect logic, and revocation.",
    ],
    decisions: [
      {
        title: "Coordinate the consultation",
        text: "Video and real-time application events serve different roles. The integration connects clinician-led sessions with device controls, invitations, notes, and related clinical workflows.",
      },
      {
        title: "Plan for disconnections",
        text: "Provisioning, reconnect logic, refresh tokens, and device revocation address the lifecycle of connected devices beyond an initial successful connection.",
      },
    ],
    outcome:
      "Freelance development spanning frontend, backend, video integration, and connected-device workflows. Screens shown here cover the medical assistant, consultation workspace, and patient report.",
    lessons:
      "Real-time workflows require attention to connection state, user permissions, and recovery paths, as well as the primary consultation experience.",
  },
  {
    slug: "myul",
    name: "Myul",
    kind: "Freelance project",
    category: "Delivery platform",
    headline: "From a delivery request to the next move.",
    description: "Delivery requests, courier bidding, and payment workflows.",
    stack: ["React", "Next.js", "Node.js", "MongoDB", "Stripe Connect"],
    context:
      "Freelance work on a delivery bidding platform with customer, courier, and administrator workflows.",
    role: "Full Stack Developer · Freelance",
    contributions: [
      "Developed workflows for delivery requests, courier bidding, tracking, transactions, and refunds.",
      "Built administration screens for users, deliveries, payments, disputes, and platform operations.",
      "Integrated Stripe Connect onboarding and payments alongside real-time notifications and tracking.",
    ],
    decisions: [
      {
        title: "Different roles, connected workflows",
        text: "Customer requests, courier bids, and administrative oversight connect around delivery state. Role-specific views keep the relevant actions available to each participant.",
      },
      {
        title: "Treat payments as a workflow",
        text: "Courier onboarding, transactions, refunds, and disputes are part of the platform workflow, rather than a standalone checkout screen.",
      },
      {
        title: "Keep delivery state understandable",
        text: "The engineering challenge spans requests, bids, delivery progress, and financial state. My work connected these workflows through application interfaces, backend APIs, real-time notifications, and administration screens for oversight.",
      },
    ],
    outcome:
      "Freelance contributions across customer and courier workflows, backend APIs, Stripe Connect integration, real-time updates, and administration dashboards for deliveries, payments, and disputes.",
    lessons:
      "Delivery products connect logistics, role-based access, real-time updates, and financial state. Clear transitions and operational visibility are important throughout.",
  },
] as const;
// Shared display order for the homepage and case-study navigation.
export const projects = [projectDetails[1], projectDetails[2], projectDetails[0]] as const;
export type Project = (typeof projects)[number];
export const resumeUrl = "/resume/Ifraz-Ali-Resume.pdf";
export const social = {
  github: "https://github.com/Ifraz-Ali",
  linkedin: "https://www.linkedin.com/in/ifraz-ali-1430a82a9/",
  email: "mailto:ifrazali662@gmail.com",
};
