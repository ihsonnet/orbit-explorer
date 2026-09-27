import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import type { FeatureCollection, Geometry } from 'geojson';
import { Globe2, MapPin } from 'lucide-react';
import { feature } from 'topojson-client';
import world from '@d3-maps/atlas/world/countries/countries-110m';

type AmbassadorLocation = {
  country: string;
  iso3: string;
  coordinates: [number, number];
  status: 'active' | 'developing';
};

type CountryProperties = {
  id: string;
  name: string;
  name_long: string;
};

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

const ambassadorLocations: AmbassadorLocation[] = [
  { country: 'Bangladesh', iso3: 'BGD', coordinates: [90.3563, 23.685], status: 'active' },
  { country: 'Hungary', iso3: 'HUN', coordinates: [19.5033, 47.1625], status: 'active' },
  { country: 'Germany', iso3: 'DEU', coordinates: [10.4515, 51.1657], status: 'active' },
  { country: 'South Korea', iso3: 'KOR', coordinates: [127.7669, 35.9078], status: 'active' },
  { country: 'Nepal', iso3: 'NPL', coordinates: [84.124, 28.3949], status: 'active' },
  { country: 'India', iso3: 'IND', coordinates: [78.9629, 20.5937], status: 'active' },
  { country: 'USA', iso3: 'USA', coordinates: [-98.5795, 39.8283], status: 'active' },
  { country: 'Canada', iso3: 'CAN', coordinates: [-106.3468, 56.1304], status: 'active' },
  { country: 'Turkey', iso3: 'TUR', coordinates: [35.2433, 38.9637], status: 'active' },
  { country: 'Colombia', iso3: 'COL', coordinates: [-74.2973, 4.5709], status: 'active' },
  { country: 'Tajikistan', iso3: 'TJK', coordinates: [71.2761, 38.861], status: 'developing' },
  { country: 'Kyrgyzstan', iso3: 'KGZ', coordinates: [74.7661, 41.2044], status: 'developing' },
  { country: 'Mongolia', iso3: 'MNG', coordinates: [103.8467, 46.8625], status: 'developing' },
  { country: 'Pakistan', iso3: 'PAK', coordinates: [69.3451, 30.3753], status: 'developing' },
];

const activeLocations = ambassadorLocations.filter(({ status }) => status === 'active');
const developingLocations = ambassadorLocations.filter(
  ({ status }) => status === 'developing',
);

const countries = feature(
  world,
  world.objects.features,
) as FeatureCollection<Geometry, CountryProperties>;

const countryStatus = new Map(
  ambassadorLocations.map(({ iso3, status }) => [iso3, status]),
);

const projection = geoNaturalEarth1().fitExtent(
  [
    [24, 24],
    [MAP_WIDTH - 24, MAP_HEIGHT - 24],
  ],
  countries,
);

const path = geoPath(projection);
const graticulePath = path(geoGraticule10());

const AmbassadorMap = () => {
  return (
    <section className="px-4 pb-24 md:pb-32" aria-labelledby="ambassador-map-heading">
      <div className="max-w-7xl mx-auto">
        <div className="card-glow rounded-[2rem] p-3 sm:p-5 md:p-7 overflow-hidden">
          <div className="relative rounded-[1.4rem] overflow-hidden bg-gradient-to-br from-secondary/65 via-background/70 to-accent/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(var(--primary)/0.10),transparent_58%)]" />
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              className="relative w-full h-auto block"
              role="img"
              aria-labelledby="ambassador-map-title ambassador-map-description"
            >
              <title id="ambassador-map-title">Countries with S.P.A.C.E. Ambassadors</title>
              <desc id="ambassador-map-description">
                A world map marking ambassadors in Bangladesh, Hungary, Germany,
                South Korea, Nepal, India, the United States, Canada, Turkey, and
                Colombia, with additional engagement developing in Tajikistan,
                Kyrgyzstan, Mongolia, and Pakistan.
              </desc>

              {graticulePath && (
                <path
                  d={graticulePath}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.8"
                  opacity="0.35"
                />
              )}

              <g aria-hidden="true">
                {countries.features.map((country) => {
                  const countryPath = path(country);
                  const status = countryStatus.get(country.properties.id);

                  if (!countryPath) return null;

                  return (
                    <path
                      key={country.properties.id}
                      d={countryPath}
                      fill={
                        status === 'active'
                          ? 'hsl(var(--accent) / 0.58)'
                          : status === 'developing'
                            ? 'hsl(var(--accent) / 0.26)'
                            : 'hsl(var(--muted) / 0.72)'
                      }
                      stroke="hsl(var(--background))"
                      strokeWidth={status ? 1.5 : 0.8}
                      className="transition-colors duration-300"
                    />
                  );
                })}
              </g>

              <g>
                {developingLocations.map((location) => {
                  const point = projection(location.coordinates);
                  if (!point) return null;

                  return (
                    <g
                      key={location.iso3}
                      transform={`translate(${point[0]}, ${point[1]})`}
                    >
                      <title>{`${location.country} (developing)`}</title>
                      <circle
                        r="4.5"
                        fill="hsl(var(--background))"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
                {activeLocations.map((location, index) => {
                  const point = projection(location.coordinates);
                  if (!point) return null;

                  return (
                    <g
                      key={location.iso3}
                      transform={`translate(${point[0]}, ${point[1]})`}
                    >
                      <title>{location.country}</title>
                      <circle
                        r="9"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity="0.65"
                        className="motion-reduce:hidden"
                      >
                        <animate
                          attributeName="r"
                          values="7;13;7"
                          dur="2.8s"
                          begin={`${index * 0.14}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.75;0;0.75"
                          dur="2.8s"
                          begin={`${index * 0.14}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        r="5.5"
                        fill="hsl(var(--primary))"
                        stroke="hsl(var(--background))"
                        strokeWidth="2.5"
                      />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 lg:gap-10 items-center mt-6 md:mt-8 px-1 sm:px-2 pb-1">
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
                <Globe2 className="w-4 h-4" aria-hidden="true" />
                A growing global community
              </div>
              <h2
                id="ambassador-map-heading"
                className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight"
              >
                Our ambassadors around the world
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Making space more approachable in their own communities—active in{' '}
                <span className="text-foreground font-semibold">ten countries</span>,
                with engagement developing in four more.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" aria-hidden="true" />
                  Active ambassadors
                </h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
                  {activeLocations.map((location) => (
                    <li
                      key={location.iso3}
                      className="flex items-center gap-2 rounded-xl bg-secondary/55 border border-border/70 px-3 py-2.5 text-sm text-foreground"
                    >
                      <MapPin className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                      <span className="truncate">{location.country}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-primary" aria-hidden="true" />
                  Engagement developing
                </h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
                  {developingLocations.map((location) => (
                    <li
                      key={location.iso3}
                      className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm text-foreground/80"
                    >
                      <MapPin className="w-4 h-4 text-primary/60 shrink-0" aria-hidden="true" />
                      <span className="truncate">{location.country}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmbassadorMap;
