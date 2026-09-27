import { Camera } from 'lucide-react';

const ambassadorPhotos = [
  {
    src: '/ambassador1.jpeg',
    alt: 'A young participant holding a Space is for Everyone sign',
    width: 1600,
    height: 1200,
  },
  {
    src: '/ambassador%202.jpeg',
    alt: 'A space ambassador leading a hands-on learning activity with a child',
    width: 2048,
    height: 1536,
  },
  {
    src: '/ambassador3.webp',
    alt: 'A space ambassador speaking at a community event',
    width: 1920,
    height: 1280,
  },
  {
    src: '/ambassador4.webp',
    alt: 'A space ambassador guiding students as they hold up their Space is for Everyone signs',
    width: 1024,
    height: 768,
  },
  {
    src: '/ambassador-amy.webp',
    alt: 'Two young participants holding a Space is for Everyone, I am part of it sign signed Amy',
    width: 1600,
    height: 1200,
  },
];

const AmbassadorGallery = () => {
  return (
    <section className="px-4 pb-24 md:pb-32" aria-labelledby="ambassador-gallery-heading">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-9">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-4">
            <Camera className="w-4 h-4" aria-hidden="true" />
            Photo gallery
          </div>
          <h2
            id="ambassador-gallery-heading"
            className="font-display text-3xl md:text-5xl font-bold text-foreground"
          >
            Ambassadors in action
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Real moments of people making space education welcoming, hands-on,
            and connected to their communities.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {ambassadorPhotos.map((photo, index) => (
            <figure
              key={photo.src}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_0_30px_hsl(var(--glow-accent)/0.08)]"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/55 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <span
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/70 border border-white/15 backdrop-blur-sm flex items-center justify-center font-display text-xs font-semibold text-foreground"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmbassadorGallery;
