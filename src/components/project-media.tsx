import Image from "next/image";
import { ImageIcon } from "lucide-react";
export function BudgetMateMedia({ detailed = false }: { detailed?: boolean }) {
  return (
    <div
      className={`phone-composition ${detailed ? "detailed" : ""}`}
      aria-label="BudgetMate application screenshots"
    >
      <figure className="phone phone-primary">
        <div className="phone-screen">
          <Image
            src="/images/budgetmate-overview.png"
            alt="BudgetMate overview showing balance, income, expenses, and a cash-flow forecast"
            width={597}
            height={1294}
            sizes="(max-width: 700px) 46vw, 270px"
            className="screen-overview"
          />
        </div>
      </figure>
      <figure className="phone phone-secondary">
        <div className="phone-screen">
          <Image
            src="/images/budgetmate-categories.png"
            alt="BudgetMate spending categories and pie chart"
            width={586}
            height={1270}
            sizes="(max-width: 700px) 42vw, 250px"
            className="screen-categories"
          />
        </div>
      </figure>
    </div>
  );
}
export function PendingMedia({ name }: { name: string }) {
  return (
    <div className="pending-media">
      <ImageIcon size={28} strokeWidth={1.25} />
      <span>Project screenshots coming soon</span>
      <span className="sr-only"> for {name}</span>
    </div>
  );
}
