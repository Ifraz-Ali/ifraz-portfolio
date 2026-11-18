import Image from "next/image";
import styles from "./moveinmedical-media.module.css";

const screens = [
  { file: "assistant", width: 1440, height: 942, title: "Medical assistant", description: "A conversational intake interface collecting patient details.", alt: "MoveInMedical desktop medical assistant with a navigation sidebar and patient intake conversation" },
  { file: "consultation", width: 1441, height: 1335, title: "Consultation & connected devices", description: "The consultation workspace brings device connections, vitals, recordings, and reviewed media together.", alt: "MoveInMedical desktop consultation with participant tiles and a sidebar for connected devices, vital signs, recordings, and reviewed images" },
  { file: "patient-report", width: 666, height: 1271, title: "Patient report & clinical documentation", description: "A desktop report view with demographics, vital signs, clinical notes, recordings, and billing fields.", alt: "MoveInMedical patient report showing demographics, vital signs, assessment, treatment plan, recordings, billing, and reviewed images" },
] as const;

export function MoveInMedicalMedia({ detailed = false }: { detailed?: boolean }) {
  return <div className={`${styles.media} ${detailed ? styles.detailed : styles.preview}`}>
    {(detailed ? screens : screens.slice(0, 1)).map(screen => <figure key={screen.file} className={styles.figure}>
      <div className={styles.frame}>
        <div className={styles.toolbar} aria-hidden="true"><span>● ● ●</span><span>MOVEINMED / {screen.title}</span></div>
        {detailed ? <a href={`/images/moveinmedical-${screen.file}.png`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${screen.title} screenshot at full size in a new tab`}><Image src={`/images/moveinmedical-${screen.file}.png`} alt={screen.alt} width={screen.width} height={screen.height} sizes="(max-width: 700px) 90vw, 1050px" className={screen.file === "patient-report" ? styles.report : undefined}/></a> : <Image src={`/images/moveinmedical-${screen.file}.png`} alt={screen.alt} width={screen.width} height={screen.height} sizes="(max-width: 700px) 90vw, 420px"/>}
      </div>
      {detailed ? <figcaption><h3>{screen.title}</h3><p>{screen.description}</p><a href={`/images/moveinmedical-${screen.file}.png`} target="_blank" rel="noopener noreferrer">View full-size screenshot ↗</a></figcaption> : null}
    </figure>)}
  </div>;
}
