import { Package, HandCoins, UserCheck, Route, CreditCard, ArrowRight } from "lucide-react";
import styles from "./myul-workflow.module.css";

const steps = [
  { title: "Delivery request", detail: "Customer creates a delivery request.", Icon: Package },
  { title: "Courier bids", detail: "Couriers submit bids for the delivery.", Icon: HandCoins },
  { title: "Courier selected", detail: "The customer chooses a courier.", Icon: UserCheck },
  { title: "Tracking", detail: "Delivery progress connects the participants.", Icon: Route },
  { title: "Payment", detail: "Payment workflows support the transaction.", Icon: CreditCard },
] as const;

export function MyulWorkflow({ detailed = false }: { detailed?: boolean }) {
  return <figure className={`${styles.workflow} ${detailed ? styles.detailed : styles.compact}`} aria-label="Myul platform workflow">
    <figcaption className={styles.caption}><span>MYUL</span><span>Platform workflow</span></figcaption>
    <ol className={styles.steps}>{steps.map(({ title, detail, Icon }, index) => <li key={title}>
      <div className={styles.node}><span className={styles.number}>0{index + 1}</span><Icon size={detailed ? 28 : 18} strokeWidth={1.4}/><h3>{title}</h3>{detailed ? <p>{detail}</p> : null}</div>
      {index < steps.length - 1 ? <ArrowRight className={styles.arrow} size={16} aria-hidden="true"/> : null}
    </li>)}</ol>
    {detailed ? <div className={styles.roles}><p><strong>Customer</strong>Requests, courier selection, and tracking</p><p><strong>Courier</strong>Bidding, onboarding, and delivery updates</p><p><strong>Administration</strong>Users, deliveries, payments, and disputes</p></div> : null}
    <p className={styles.footer}>Requests · Real-time updates · Stripe Connect</p>
  </figure>;
}
