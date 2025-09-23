import type { IFeaturesSectionProps, TFeature } from "@/types";

const styles = {
  wrap: "py-16",
  title: "text-3xl font-bold",
  subtitle: "mt-2 text-muted-foreground",
  grid: "mt-8 grid grid-cols-1 md:grid-cols-3 gap-6",
  card:
    "group relative p-6 rounded-lg border border-base-300/70 bg-base-100/60 transition-all hover:border-[oklch(0.72_0.17_210)] hover:shadow-neon",
  iconWrap: "mb-3 text-2xl text-[oklch(0.72_0.17_210)]",
  cardTitle: "text-xl font-semibold",
  cardSub: "mt-2 text-sm text-muted-foreground",
};

export function FeaturesSection({ data }: { data: IFeaturesSectionProps }) {
  if (!data) return null;
  const { heading, subHeading, features = [] } = data;

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>{heading}</h2>
      <p className={styles.subtitle}>{subHeading}</p>

      <div className={styles.grid}>
        {features.map((f: TFeature, idx: number) => (
          <div key={`${f.id}-${idx}`} className={styles.card}>
            {f.icon && <div className={styles.iconWrap}>{f.icon}</div>}
            <div className={styles.cardTitle}>{f.heading}</div>
            <div className={styles.cardSub}>{f.subHeading}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;

