import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Globe2,
  MapPin,
  Search,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import SpaceBackground from '@/components/SpaceBackground';
import { ambassadorProfiles } from '@/data/ambassadors';

const activeAmbassadors = ambassadorProfiles.filter(({ status }) => status !== 'inactive');
const newAmbassadorCount = ambassadorProfiles.filter(({ isNew }) => isNew).length;
const regions = ['All', ...new Set(ambassadorProfiles.map(({ region }) => region))];
const countryCount = new Set(activeAmbassadors.map(({ country }) => country)).size;

const AmbassadorDirectory = () => {
  const [query, setQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');

  const filteredAmbassadors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return ambassadorProfiles.filter(({ name, country, city, region }) => {
      const matchesRegion = activeRegion === 'All' || region === activeRegion;
      const matchesQuery =
        !normalizedQuery ||
        name.toLowerCase().includes(normalizedQuery) ||
        country.toLowerCase().includes(normalizedQuery) ||
        city.toLowerCase().includes(normalizedQuery) ||
        region.toLowerCase().includes(normalizedQuery);

      return matchesRegion && matchesQuery;
    });
  }, [activeRegion, query]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Helmet>
        <title>Ambassador Directory | S.P.A.C.E. for Everyone</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="googlebot" content="noindex, nofollow, noarchive" />
      </Helmet>

      <SpaceBackground />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_20%,hsl(var(--primary)/0.12),transparent_28%),radial-gradient(circle_at_82%_5%,hsl(var(--accent)/0.14),transparent_30%)]"
        aria-hidden="true"
      />

      <Navigation />

      <main className="relative z-10">
        <section className="px-4 pb-12 pt-40 sm:px-6 md:pb-16 md:pt-48 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              to="/space-ambassador-program"
              className="group mb-8 flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              Back to Ambassador Program
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              A worldwide community
            </motion.div>

            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                  S.P.A.C.E. Ambassador Directory
                </p>
                <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl md:text-7xl">
                  Local voices.
                  <span className="gradient-text block">One shared sky.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Meet the growing network bringing space closer to communities
                  around the world.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.16 }}
                className="grid w-full grid-cols-2 gap-3 lg:w-auto"
              >
                <div className="card-glow min-w-36 rounded-2xl p-5">
                  <UsersRound className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="font-display text-3xl font-bold">{ambassadorProfiles.length}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Total</p>
                </div>
                <div className="card-glow min-w-36 rounded-2xl p-5">
                  <Sparkles className="mb-4 h-5 w-5 text-accent" aria-hidden="true" />
                  <p className="font-display text-3xl font-bold">{newAmbassadorCount}</p>
                  <p className="mt-1 text-sm text-muted-foreground">New</p>
                </div>
                <div className="card-glow min-w-36 rounded-2xl p-5">
                  <CircleCheck className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="font-display text-3xl font-bold">{activeAmbassadors.length}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Active</p>
                </div>
                <div className="card-glow min-w-36 rounded-2xl p-5">
                  <Globe2 className="mb-4 h-5 w-5 text-accent" aria-hidden="true" />
                  <p className="font-display text-3xl font-bold">{countryCount}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Active countries</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 md:pb-32 lg:px-8" aria-labelledby="directory-heading">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-5 border-y border-border/70 py-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 id="directory-heading" className="font-display text-2xl font-semibold">
                  Ambassador network
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredAmbassadors.length} {filteredAmbassadors.length === 1 ? 'ambassador' : 'ambassadors'} shown
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex max-w-full gap-2 overflow-x-auto pb-1 sm:pb-0" aria-label="Filter by region">
                  {regions.map((region) => {
                    const isActive = region === activeRegion;

                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setActiveRegion(region)}
                        aria-pressed={isActive}
                        className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                          isActive
                            ? 'border-primary/50 bg-primary/15 text-primary'
                            : 'border-border bg-card/60 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>

                <label className="relative block sm:w-56">
                  <span className="sr-only">Search ambassadors</span>
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search ambassadors"
                    className="h-10 w-full rounded-full border border-border bg-card/70 pl-9 pr-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  />
                </label>
              </div>
            </div>

            {filteredAmbassadors.length > 0 ? (
              <motion.ul
                layout
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredAmbassadors.map((ambassador, index) => (
                  <motion.li
                    layout
                    key={`${ambassador.name}-${ambassador.city}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.24) }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card/75 shadow-[0_0_30px_hsl(var(--glow-primary)/0.04)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_12px_45px_hsl(var(--glow-primary)/0.10)]"
                  >
                    <div
                      className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/5 blur-2xl transition-colors group-hover:bg-primary/10"
                      aria-hidden="true"
                    />
                    <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-gradient-to-br from-secondary via-background to-accent/10">
                      {ambassador.photo ? (
                        <img
                          src={ambassador.photo}
                          alt={`${ambassador.name}, S.P.A.C.E. Ambassador`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          role="img"
                          aria-label={`Photo placeholder for ${ambassador.name}`}
                        >
                          <div className="absolute h-36 w-36 rounded-full border border-primary/10" aria-hidden="true" />
                          <div className="absolute h-24 w-24 rounded-full border border-accent/15" aria-hidden="true" />
                          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_35px_hsl(var(--glow-primary)/0.12)]">
                            <UserRound className="h-9 w-9 text-primary/65" aria-hidden="true" />
                          </div>
                        </div>
                      )}

                      <span
                        className="absolute left-4 top-4 text-2xl leading-none"
                        role="img"
                        aria-label={`${ambassador.country} flag`}
                      >
                        {ambassador.flag}
                      </span>
                      <span
                        className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${
                          ambassador.status === 'inactive'
                            ? 'border-amber-300/25 text-amber-200'
                            : 'border-emerald-400/20 text-emerald-300'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            ambassador.status === 'inactive'
                              ? 'bg-amber-200'
                              : 'bg-emerald-300'
                          }`}
                          aria-hidden="true"
                        />
                        {ambassador.status === 'inactive' ? 'No activity yet' : 'Active'}
                      </span>
                    </div>

                    <div className="relative p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/75">
                          S.P.A.C.E. Ambassador
                        </p>
                        {ambassador.isNew && (
                          <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            New
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-display text-xl font-bold text-foreground">
                        {ambassador.name}
                      </h3>
                      <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                        {ambassador.city}, {ambassador.country}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
                <Globe2 className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-semibold">No ambassadors found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another search or choose a different region.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 md:pb-32 lg:px-8" aria-labelledby="ambassador-cta-heading">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-accent/15 px-6 py-14 text-center shadow-[0_0_60px_hsl(var(--glow-primary)/0.10)] sm:px-10 md:py-20"
          >
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/40 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                S.P.A.C.E. Ambassador Program
              </span>
              <h2
                id="ambassador-cta-heading"
                className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
              >
                Bring space closer to your community.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Join a global network of local leaders making space knowledge
                welcoming, useful, and accessible to everyone.
              </p>
              <Link
                to="/space-ambassador-program"
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[0_0_30px_hsl(var(--glow-primary)/0.22)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Join now
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AmbassadorDirectory;
