import type { IFeaturesSectionProps, TFeature } from "@/types";

export function FeaturesSection({ data }: { data: IFeaturesSectionProps }) {
  if (!data) return null;
  const { heading, subHeading, features = [] } = data;

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-base-content mb-4">
            {heading}
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {subHeading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f: TFeature, idx: number) => (
            <div
              key={`${f.id}-${idx}`}
              className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="card-body items-center text-center">
                {f.icon && (
                  <div className="text-4xl text-primary mb-4">{f.icon}</div>
                )}
                <h3 className="card-title text-xl text-base-content justify-center">
                  {f.heading}
                </h3>
                <p className="text-base-content/70 text-sm">{f.subHeading}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
