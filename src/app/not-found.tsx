import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container not-found">
      <span className="micro accent">404</span>
      <h1>This page took a wrong turn.</h1>
      <p>Let’s get you back to the work.</p>
      <Link className="button primary" href="/">
        Back to portfolio
      </Link>
    </main>
  );
}
