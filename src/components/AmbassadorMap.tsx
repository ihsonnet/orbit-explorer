import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import type { FeatureCollection, Geometry } from 'geojson';
import { Globe2, MapPin } from 'lucide-react';
import { feature } from 'topojson-client';
import world from '@d3-maps/atlas/world/countries/countries-110m';

type AmbassadorLocation = {
  country: string;
  iso3: string;
  coordinates: [number, number];
};

type CountryProperties = {
  id: string;
  name: string;
  name_long: string;
};

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

const ambassadorLocations: AmbassadorLocation[] = [
  { country: 'Bangladesh', iso3: 'BGD', coordinates: [90.3563, 23.685] },
  { country: 'Hungary', iso3: 'HUN', coordinates: [19.5033, 47.1625] },
  { country: 'Germany', iso3: 'DEU', coordinates: [10.4515, 51.1657] },
  { country: 'South Korea', iso3: 'KOR', coordinates: [127.7669, 35.9078] },
  { country: 'Nepal', iso3: 'NPL', coordinates: [84.124, 28.3949] },
  { country: 'India', iso3: 'IND', coordinates: [78.9629, 20.5937] },
  { country: 'USA', iso3: 'USA', coordinates: [-98.5795, 39.8283] },
  { country: 'Canada', iso3: 'CAN', coordinates: [-106.3468, 56.1304] },
  { country: 'Turkey', iso3: 'TUR', coordinates: [35.2433, 38.9637] },
  { country: 'Colombia', iso3: 'COL', coordinates: [-74.2973, 4.5709] },
];

const countries = feature(
  world,
  world.objects.features,
) as FeatureCollection<Geometry, CountryProperties>;

const activeCountryIds = new Set(ambassadorLocations.map(({ iso3 }) => iso3));

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
        <div className="max-w-2xl mb-9">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
            <Globe2 className="w-4 h-4" aria-hidden="true" />
            A growing global community
          </div>
          <h2
            id="ambassador-map-heading"
            className="font-display text-3xl md:text-5xl font-bold text-foreground"
          >
            Our ambassadors around the world
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            S.P.A.C.E. Ambassadors are making space more approachable in their
            own communities—starting across ten countries and growing.
          </p>
        </div>

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
                A world map marking Bangladesh, Hungary, Germany, South Korea,
                Nepal, India, the United States, Canada, Turkey, and Colombia.
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
                  const isActive = activeCountryIds.has(country.properties.id);

                  if (!countryPath) return null;

                  return (
                    <path
                      key={country.properties.id}
                      d={countryPath}
                      fill={
                        isActive
                          ? 'hsl(var(--accent) / 0.58)'
                          : 'hsl(var(--muted) / 0.72)'
                      }
                      stroke="hsl(var(--background))"
                      strokeWidth={isActive ? 1.5 : 0.8}
                      className="transition-colors duration-300"
                    />
                  );
                })}
              </g>

              <g>
                {ambassadorLocations.map((location, index) => {
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

          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-5">
            {ambassadorLocations.map((location) => (
              <li
                key={location.iso3}
                className="flex items-center gap-2 rounded-xl bg-secondary/55 border border-border/70 px-3 py-2.5 text-sm text-foreground"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>{location.country}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AmbassadorMap;
