# Ifraz Ali — Portfolio

Next.js App Router, TypeScript, Tailwind CSS, Motion, Radix Dialog, Three.js, and React Three Fiber. A custom charcoal/lime portfolio with real BudgetMate captures, three case studies, résumé preview, cursor lighting, and a keyboard-accessible 3D robot guide.

## Local development

Use Node.js 20.9+ and npm. Run `npm install`, then `npm run dev`. Open http://127.0.0.1:3000. Run `npm run build`, `npm run typecheck`, and `npm run lint` to validate.

## Update content

- Project descriptions: `src/lib/projects.ts`.
- Homepage and experience: `src/app/page.tsx`.
- Styling and responsive tokens: `src/app/globals.css`.
- Replace the résumé at `public/resume/Ifraz-Ali-Resume.pdf`. The View Résumé link opens this local asset in a new tab, subject to browser PDF settings.
- BudgetMate assets: `public/images/budgetmate-*.png`. The original captures were provided by Ifraz and retain their authentic blue/white UI. Phone framing crops the OS status area. Source images are publicly downloadable; replace with clean demo captures before deployment if any data should not be public.
- MoveInMedical screenshots: `public/images/moveinmedical-*.png`, presented by `src/components/moveinmedical-media.tsx`.
- Myul uses an explanatory platform workflow in `src/components/myul-workflow.tsx`.
- Project display order is MoveInMedical, Myul, then BudgetMate, configured in `src/lib/projects.ts`.

## Robot

The hero uses an original GLB model at `public/models/portfolio-guide.glb`, loaded separately through React Three Fiber. Separate head, arm, and eye nodes support gentle floating, pointer gaze, blinking, and a short greeting wave. The small launcher retains the original image; the hero uses no image fallback.

Four CSS loaders are available in `src/components/robot-loader.tsx`: robot eyes booting (`eyes`), assembly outline (`assembly`), orbital core (`orbital`), and diagnostic sequence (`diagnostic`). Select the loader in `src/lib/guide-loading.ts`; `eyes` is the default. The loader fades out after the first 3D frame, then the greeting starts. Unsupported or failed WebGL, or the configurable 20-second timeout, shows an accessible guide button. Reduced motion uses static loader graphics.

The speech bubble cycles through six questions: about Ifraz, freelance projects, hiring, selected work, skills, and contact. The question and actions appear immediately; the supporting sentence types at about 36 characters per second with a neon-green cursor. The cursor keeps blinking after completion, and the complete message remains for five seconds before cycling. Cycling pauses on hover/focus, offscreen, while hidden, or while the guide is open. Typing pauses offscreen, while hidden, or behind the open guide. Clicking an action opens its matching answer. Dismissal lasts for the browser session.

New guide answers type once; completed answers appear instantly when revisited in the same guide. Reduced motion shows full text immediately with a still cursor. The full text is provided separately to assistive technology, and the layout reserves its final height to avoid per-character shifting. Message text lives in `src/components/guide-controller.tsx`; reveal speed and cursor presentation live in `src/components/typewriter.tsx` and `src/app/globals.css`. These are curated messages with no AI API or backend. The 3D robot makes a small head tilt at typing start and a blink at completion when visible and motion is enabled.

Drag horizontally for unrestricted 360-degree rotation; vertical page scrolling is preserved on touchscreens. Focus the robot and use Left/Right arrows to rotate or Home to reset. A visible Reset view button is also available. Manual rotation still works with reduced motion enabled. Dragging does not open the guide.

Regenerate the model with `node scripts/generate-guide-model.mjs`; editable geometry and materials live in `scripts/guide-character.mjs`. The GLB can also be opened in Blender. Its curved inset visor, rounded helmet, tapered torso, stub fingers, and rear details are modeled independently. Reduced motion disables automatic animation and pointer gaze; the render loop pauses when offscreen, hidden, or the dialog is open. A CSS loader appears during loading; an icon and guide button appear on WebGL failure. Keyboard navigation and HTML messages work independently of the canvas.

## Deploy

Push this folder to a GitHub repository named `ifraz-portfolio`. Import that repository in Vercel with the Next.js preset. No environment variables, database, or separate server are needed. Add a custom domain in hosting settings when ready. Nothing has been published automatically.

## Before publishing

Confirm current experience dates and availability; review case-study descriptions against personal contributions; add client-approved screenshots where appropriate. No client statistics or results have been invented. Review personal contact information and résumé for public distribution. This repository intentionally does not include screenshot-based QA artifacts or local scratch files.

Design references and portable generator guidance are in `design/`.

