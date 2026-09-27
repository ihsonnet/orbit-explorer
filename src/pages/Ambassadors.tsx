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
import activityNotes from '@/assets/ambassadors/activity-notes.webp';
import reportingEvent from '@/assets/ambassadors/reporting-event.webp';
import spaceWorkshop from '@/assets/ambassadors/space-workshop.webp';
import stargazingHost from '@/assets/ambassadors/stargazing-host.webp';

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

        <section className="px-4 pb-24 md:pb-32" aria-labelledby="become-ambassador-title">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
            className="max-w-7xl mx-auto card-glow rounded-[2rem] overflow-hidden"
          >
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="p-7 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-primary mb-6">
                  <span className="font-display text-sm font-semibold tracking-[0.24em]">01</span>
                  <span className="h-px w-10 bg-primary/50" />
                  <UsersRound className="w-5 h-5" aria-hidden="true" />
                </div>

                <h2
                  id="become-ambassador-title"
                  className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight"
                >
                  SPACE4E — Become a Space Ambassador
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  Apply to represent S.P.A.C.E. in your community. Share useful
                  knowledge, create welcoming conversations, and help more people
                  recognize the space systems already supporting their lives.
                </p>

                <ul className="mt-7 space-y-3 text-sm text-foreground/90">
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

                <Button variant="hero" size="lg" className="mt-9 w-full sm:w-fit" asChild>
                  <a href={BECOME_AMBASSADOR_URL} target="_blank" rel="noopener noreferrer">
                    Become a Space Ambassador
                    <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                  </a>
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">Opens the SPACE4E application form</p>
              </div>

              <div className="grid grid-cols-5 gap-2 p-2 min-h-[420px] lg:min-h-[620px]">
                <div className="col-span-3 overflow-hidden rounded-[1.55rem]">
                  <img
                    src={stargazingHost}
                    alt="A space ambassador welcoming a community group to a rooftop stargazing session"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    width="1448"
                    height="1086"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="col-span-2 overflow-hidden rounded-[1.55rem]">
                  <img
                    src={spaceWorkshop}
                    alt="A space ambassador leading a hands-on satellite workshop"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    width="1448"
                    height="1086"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="px-4 pb-24 md:pb-32" aria-labelledby="activity-report-title">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
            className="max-w-7xl mx-auto card-glow rounded-[2rem] overflow-hidden"
          >
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="grid grid-cols-5 gap-2 p-2 min-h-[420px] lg:min-h-[620px] order-2 lg:order-1">
                <div className="col-span-2 overflow-hidden rounded-[1.55rem]">
                  <img
                    src={activityNotes}
                    alt="Ambassadors organizing photos and notes from a community astronomy event"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    width="1448"
                    height="1086"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="col-span-3 overflow-hidden rounded-[1.55rem]">
                  <img
                    src={reportingEvent}
                    alt="A space ambassador recording the results of a stargazing activity"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    width="1448"
                    height="1086"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="p-7 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center order-1 lg:order-2">
                <div className="flex items-center gap-3 text-accent mb-6">
                  <span className="font-display text-sm font-semibold tracking-[0.24em]">02</span>
                  <span className="h-px w-10 bg-accent/50" />
                  <ClipboardCheck className="w-5 h-5" aria-hidden="true" />
                </div>

                <h2
                  id="activity-report-title"
                  className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight"
                >
                  SPACE4E — Ambassador Activity Report
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  Already an ambassador? Tell us about the activity you led, who it
                  reached, and what you learned. Each report helps build a clearer
                  picture of our shared impact.
                </p>

                <ul className="mt-7 space-y-3 text-sm text-foreground/90">
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

                <Button variant="nebula" size="lg" className="mt-9 w-full sm:w-fit" asChild>
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
      </main>

      <Footer />
    </div>
  );
};

export default Ambassadors;
