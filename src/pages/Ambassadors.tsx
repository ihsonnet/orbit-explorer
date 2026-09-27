import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  ClipboardCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import SpaceBackground from '@/components/SpaceBackground';
import AmbassadorMap from '@/components/AmbassadorMap';
import AmbassadorGallery from '@/components/AmbassadorGallery';
import roleInSpace from '@/assets/ambassadors/role-in-space.webp';
import manyCommunities from '@/assets/ambassadors/many-communities.webp';

const BECOME_AMBASSADOR_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeCaUxQdKfdPXeRQJgF7ENXJpB3rqmiAwanyFhY5AKJA6goDg/viewform';

const ACTIVITY_REPORT_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdHYbfDR-kUflNWXdqD_7g_WGSIkzEvLPbPonQSvBwhgIMZlw/viewform';

const Ambassadors = () => {
  const ambassadorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'S.P.A.C.E. Ambassador Program',
    description:
      'Join the S.P.A.C.E. Ambassador Program or report an ambassador activity in your community.',
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      <SEO
        title="S.P.A.C.E. Ambassador Program"
        description="Become a S.P.A.C.E. Ambassador, connect your community with space, and report the activities that turn curiosity into local impact."
        keywords="space ambassador, space outreach, community science, astronomy education, space education volunteer, SPACE4E"
        canonicalUrl="https://spaceforeveryone.com/space-ambassador-program"
        jsonLd={ambassadorJsonLd}
      />
      <SpaceBackground />
      <Navigation />

      <main className="relative z-10 flex-1">
        <section className="px-4 pt-36 pb-20 md:pt-44 md:pb-28">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-7"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Lead locally. Connect globally.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              <span className="gradient-text">S.P.A.C.E.</span>
              <span className="block text-foreground">Ambassador Program</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mt-7 text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Bring space closer to home. Help people in your community see how
              space shapes everyday life—and give their curiosity somewhere to go.
            </motion.p>
          </div>
        </section>

        <AmbassadorMap />

        <section className="px-4 pb-14 md:pb-20" aria-labelledby="become-ambassador-title">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
            className="max-w-7xl mx-auto card-glow rounded-[2rem] overflow-hidden"
          >
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-primary mb-4">
                  <span className="font-display text-sm font-semibold tracking-[0.24em]">01</span>
                  <span className="h-px w-10 bg-primary/50" />
                  <UsersRound className="w-5 h-5" aria-hidden="true" />
                </div>

                <h2
                  id="become-ambassador-title"
                  className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight"
                >
                  SPACE4E — Become a Space Ambassador
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Apply to represent S.P.A.C.E. in your community. Share useful
                  knowledge, create welcoming conversations, and help more people
                  recognize the space systems already supporting their lives.
                </p>

                <ul className="mt-5 space-y-2 text-sm text-foreground/90">
                  {[
                    'Make space knowledge approachable',
                    'Create meaningful local activities',
                    'Grow an inclusive, curious community',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button variant="hero" size="lg" className="mt-6 w-full sm:w-fit" asChild>
                  <a href={BECOME_AMBASSADOR_URL} target="_blank" rel="noopener noreferrer">
                    Become a Space Ambassador
                    <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                  </a>
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">Opens the SPACE4E application form</p>
              </div>

              <div className="p-2 lg:p-3 flex items-center">
                <div className="w-full aspect-[3/2] flex items-center justify-center overflow-hidden rounded-[1.55rem] bg-[#f3efe6] p-3 sm:p-4">
                  <img
                    src={roleInSpace}
                    alt="Illustration titled 'You have a role in space': a person walks across stepping stones labeled learn, question, explore, create, participate and share"
                    className="w-full h-full object-contain transition-transform duration-700 hover:scale-[1.03]"
                    width="2000"
                    height="1130"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="px-4 pb-20 md:pb-28" aria-labelledby="activity-report-title">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
            className="max-w-7xl mx-auto card-glow rounded-[2rem] overflow-hidden"
          >
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="p-2 lg:p-3 flex items-center order-2 lg:order-1">
                <div className="w-full aspect-[3/2] flex items-center justify-center overflow-hidden rounded-[1.55rem] bg-[#f3efe6] p-3 sm:p-4">
                  <img
                    src={manyCommunities}
                    alt="Illustration titled 'One planet. Many communities. One space.': a globe connected to parks, libraries, campuses, streets and community gatherings"
                    className="w-full h-full object-contain transition-transform duration-700 hover:scale-[1.03]"
                    width="2000"
                    height="1334"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-1 lg:order-2">
                <div className="flex items-center gap-3 text-accent mb-4">
                  <span className="font-display text-sm font-semibold tracking-[0.24em]">02</span>
                  <span className="h-px w-10 bg-accent/50" />
                  <ClipboardCheck className="w-5 h-5" aria-hidden="true" />
                </div>

                <h2
                  id="activity-report-title"
                  className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight"
                >
                  SPACE4E — Ambassador Activity Report
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Already an ambassador? Tell us about the activity you led, who it
                  reached, and what you learned. Each report helps build a clearer
                  picture of our shared impact.
                </p>

                <ul className="mt-5 space-y-2 text-sm text-foreground/90">
                  {[
                    'Capture the activity essentials',
                    'Share outcomes and observations',
                    'Help the ambassador community learn',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button variant="nebula" size="lg" className="mt-6 w-full sm:w-fit" asChild>
                  <a href={ACTIVITY_REPORT_URL} target="_blank" rel="noopener noreferrer">
                    Submit an Activity Report
                    <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                  </a>
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">Opens the SPACE4E activity report form</p>
              </div>
            </div>
          </motion.div>
        </section>

        <AmbassadorGallery />
      </main>

      <Footer />
    </div>
  );
};

export default Ambassadors;
