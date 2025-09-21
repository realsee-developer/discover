import type { IFeaturesSectionProps, TFeature } from "@/types";

const styles = {
  wrap: "py-16",
  title: "text-3xl font-bold",
  subtitle: "mt-2 text-muted-foreground",
  grid: "mt-8 grid grid-cols-1 md:grid-cols-3 gap-6",
  card: "p-6 rounded-lg border",
  iconWrap: "mb-3 text-2xl",
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

