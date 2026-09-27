import type { PointerEvent } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Radio, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import SpaceBackground from '@/components/SpaceBackground';

const SpaceLab = () => {
  const shouldReduceMotion = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 180, damping: 22 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 180, damping: 22 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    tiltX.set(y * -8);
    tiltY.set(x * 8);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      <SEO
        title="S.P.A.C.E. Lab — Under Development"
        description="S.P.A.C.E. Lab is under development. Interactive 3D space and satellite learning experiences are being prepared for launch."
        keywords="interactive space lab, 3D satellite model, space education, satellite concepts"
        canonicalUrl="https://spaceforeveryone.com/space-lab"
        noIndex
      />
      <SpaceBackground />
      <Navigation />

      <main className="relative z-10 flex-1 flex items-center px-4 pt-36 pb-20 md:pt-40">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-7">
              <Radio className="w-4 h-4 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              Pre-launch
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              <span className="gradient-text">S.P.A.C.E.</span>
              <span className="block text-foreground">Lab</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Interactive 3D labs for space and satellite learning are being
              assembled. The hatch is not open yet.
            </p>

            <div className="mt-8 max-w-xl rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-foreground">Under development</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mission crew at work. Please check back after launch clearance.
                </p>
              </div>
            </div>

            <Button variant="cosmic" size="lg" className="mt-8" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Return to Mission Control
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative max-w-xl w-full mx-auto"
            aria-hidden="true"
          >
            <motion.div
              onPointerMove={handlePointerMove}
              onPointerLeave={resetTilt}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.012 }}
              style={{
                rotateX: smoothTiltX,
                rotateY: smoothTiltY,
                transformPerspective: 1000,
              }}
              className="card-glow rounded-[2rem] p-6 sm:p-9 aspect-square relative overflow-hidden cursor-crosshair"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.18),transparent_62%)]" />
              <motion.div
                animate={shouldReduceMotion ? undefined : { y: [-50, 560] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
                className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none"
              />

              <div className="absolute inset-x-8 top-8 flex justify-between font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                <span>Module 03</span>
                <span className="text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse motion-reduce:animate-none" />
                  Signal locked
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[78%] h-[40%] rounded-[50%] border border-primary/40"
                >
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--glow-primary))]" />
                </motion.div>

                <motion.div
                  animate={shouldReduceMotion ? undefined : { rotate: -360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-[52%] h-[80%] rounded-[50%] border border-accent/45"
                >
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_16px_hsl(var(--glow-accent))]" />
                </motion.div>

                <motion.div
                  animate={shouldReduceMotion ? undefined : { y: [0, -8, 0], rotateZ: [-1, 1, -1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-[76%] max-w-[360px] drop-shadow-[0_0_28px_hsl(var(--glow-primary)/0.22)]"
                >
                  <svg viewBox="0 0 360 210" className="w-full h-auto overflow-visible">
                    <defs>
                      <linearGradient id="lab-module-body" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--secondary))" />
                        <stop offset="55%" stopColor="hsl(var(--card))" />
                        <stop offset="100%" stopColor="hsl(var(--accent) / 0.32)" />
                      </linearGradient>
                      <linearGradient id="lab-solar-panel" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(var(--primary) / 0.08)" />
                        <stop offset="50%" stopColor="hsl(var(--primary) / 0.24)" />
                        <stop offset="100%" stopColor="hsl(var(--accent) / 0.18)" />
                      </linearGradient>
                    </defs>

                    {/* Antenna mast and dish */}
                    <path d="M180 55 L180 28" stroke="hsl(var(--primary))" strokeWidth="3" />
                    <path
                      d="M159 19 Q180 42 201 19 Q180 8 159 19Z"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                    />
                    <circle cx="180" cy="27" r="4" fill="hsl(var(--primary))" />

                    {/* Solar arrays */}
                    <g>
                      <rect x="7" y="82" width="105" height="58" rx="5" fill="url(#lab-solar-panel)" stroke="hsl(var(--primary) / 0.7)" strokeWidth="2" />
                      <path d="M33 83V139 M59 83V139 M85 83V139 M8 101H111 M8 120H111" stroke="hsl(var(--primary) / 0.38)" strokeWidth="1" />
                      <rect x="248" y="82" width="105" height="58" rx="5" fill="url(#lab-solar-panel)" stroke="hsl(var(--primary) / 0.7)" strokeWidth="2" />
                      <path d="M274 83V139 M300 83V139 M326 83V139 M249 101H352 M249 120H352" stroke="hsl(var(--primary) / 0.38)" strokeWidth="1" />
                      <path d="M112 103H126 M234 103H248" stroke="hsl(var(--primary))" strokeWidth="4" />
                    </g>

                    {/* Main laboratory module */}
                    <path
                      d="M145 47 H215 L236 68 V151 L215 172 H145 L124 151 V68 Z"
                      fill="url(#lab-module-body)"
                      stroke="hsl(var(--primary) / 0.8)"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M153 58 H207 L224 75 V144 L207 161 H153 L136 144 V75 Z"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />

                    {/* Observation port */}
                    <circle cx="180" cy="108" r="30" fill="hsl(var(--background) / 0.82)" stroke="hsl(var(--accent) / 0.8)" strokeWidth="2" />
                    <circle cx="180" cy="108" r="20" fill="hsl(var(--primary) / 0.09)" stroke="hsl(var(--primary) / 0.65)" strokeWidth="2" />
                    <path d="M165 108H195 M180 93V123" stroke="hsl(var(--primary) / 0.45)" strokeWidth="1.5" />
                    <circle cx="180" cy="108" r="5" fill="hsl(var(--primary))" className="animate-pulse motion-reduce:animate-none" />

                    {/* Equipment details and status lights */}
                    <rect x="145" y="72" width="20" height="8" rx="3" fill="hsl(var(--muted))" />
                    <rect x="195" y="72" width="20" height="8" rx="3" fill="hsl(var(--muted))" />
                    <circle cx="151" cy="146" r="3" fill="hsl(var(--primary))" />
                    <circle cx="161" cy="146" r="3" fill="hsl(var(--accent))" className="animate-pulse motion-reduce:animate-none" />
                    <path d="M196 143H215 M196 149H208" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" />

                    {/* Thruster assembly */}
                    <path d="M151 172 L157 190 H170 L173 172 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
                    <path d="M187 172 L190 190 H203 L209 172 Z" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
                    <motion.path
                      d="M160 192 L164 205 L168 192 Z"
                      fill="hsl(var(--primary) / 0.75)"
                      animate={shouldReduceMotion ? undefined : { opacity: [0.25, 0.9, 0.25] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <motion.path
                      d="M192 192 L196 205 L200 192 Z"
                      fill="hsl(var(--accent) / 0.75)"
                      animate={shouldReduceMotion ? undefined : { opacity: [0.9, 0.25, 0.9] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  </svg>
                </motion.div>
              </div>

              <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Systems check</div>
                  <div className="mt-1 font-display text-sm font-semibold text-foreground">Integration in progress</div>
                </div>
                <FlaskConical className="w-6 h-6 text-accent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SpaceLab;
