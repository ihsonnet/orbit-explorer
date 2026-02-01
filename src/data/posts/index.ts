import { SpacePost } from './types';

// Sample approved posts
export const posts: SpacePost[] = [
  {
    id: 'post-001',
    title: 'How Starlink is Revolutionizing LEO Internet',
    content: `SpaceX's Starlink constellation represents one of the most ambitious satellite projects in history. With over 5,000 satellites already in Low Earth Orbit, Starlink is providing high-speed internet to remote areas worldwide.

**Key Technical Aspects:**
- Orbital altitude: ~550 km
- Laser inter-satellite links for reduced latency
- Phased array antennas for ground stations
- Automated collision avoidance systems

The constellation demonstrates how LEO satellites can provide services previously only possible with ground infrastructure. Each satellite completes an orbit in roughly 90 minutes, requiring sophisticated handoff protocols to maintain continuous coverage.

**Impact on Daily Life:**
- Rural communities now have broadband access
- Emergency services in disaster zones can stay connected
- Maritime and aviation connectivity improved dramatically`,
    excerpt: 'SpaceX\'s Starlink constellation is bringing high-speed internet to remote areas worldwide through innovative LEO satellite technology.',
    authorEmail: 'space.enthusiast@example.com',
    authorName: 'Alex Chen',
    category: 'leo',
    tags: ['starlink', 'spacex', 'internet', 'constellation'],
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    publishedAt: '2024-01-16T08:00:00Z',
  },
  {
    id: 'post-002',
    title: 'GPS III: The Next Generation of Navigation',
    content: `The GPS III satellite series represents a major upgrade to the Global Positioning System. These new satellites offer improved accuracy, better anti-jamming capabilities, and longer operational lifespans.

**New Features in GPS III:**
- L1C civil signal compatible with other GNSS systems
- 3x better accuracy than previous generation
- 8x improved anti-jamming power
- 15-year design life (vs 7.5 years for GPS IIA)

**How GPS Actually Works:**
Each GPS satellite continuously broadcasts its position and precise time using atomic clocks accurate to nanoseconds. Your device receives signals from at least 4 satellites and uses trilateration to determine your exact position.

The satellites orbit at approximately 20,200 km in Medium Earth Orbit, completing two orbits per day. This altitude provides the perfect balance between coverage area and signal strength.`,
    excerpt: 'GPS III satellites bring 3x better accuracy and 8x improved anti-jamming capabilities to the navigation system we rely on daily.',
    authorEmail: 'navigation.pro@example.com',
    authorName: 'Maria Santos',
    category: 'gps',
    tags: ['gps', 'navigation', 'gnss', 'positioning'],
    status: 'approved',
    createdAt: '2024-01-20T14:00:00Z',
    publishedAt: '2024-01-21T09:00:00Z',
  },
  {
    id: 'post-003',
    title: 'GOES-18: Watching Weather from Geostationary Orbit',
    content: `NOAA's GOES-18 satellite provides continuous monitoring of weather patterns across the Western Hemisphere from its geostationary position at 35,786 km altitude.

**What Makes GEO Special for Weather:**
- Stays fixed above one point on Earth
- Same region always visible
- Perfect for tracking storm development
- 10-minute full disk imagery

**GOES-18 Instruments:**
- Advanced Baseline Imager (ABI): 16 spectral bands
- Geostationary Lightning Mapper (GLM): Real-time lightning detection
- Space Weather instruments for solar monitoring

**Real-World Impact:**
GOES satellites have dramatically improved weather forecasting accuracy. Hurricane track predictions are now accurate to within 100 miles up to 5 days out, compared to 350 miles just 20 years ago. This accuracy saves lives and reduces economic losses.`,
    excerpt: 'GOES-18 watches weather patterns 24/7 from geostationary orbit, dramatically improving hurricane forecasting and severe weather warnings.',
    authorEmail: 'weather.watcher@example.com',
    authorName: 'James Wilson',
    category: 'weather',
    tags: ['goes', 'weather', 'noaa', 'geostationary', 'hurricanes'],
    status: 'approved',
    createdAt: '2024-02-01T08:00:00Z',
    publishedAt: '2024-02-02T10:00:00Z',
  },
  {
    id: 'post-004',
    title: 'SpaceX Falcon Heavy: Launching the Heaviest Payloads',
    content: `The Falcon Heavy rocket has opened new possibilities for launching massive payloads to orbit. With 27 Merlin engines generating over 5 million pounds of thrust, it's currently the most powerful operational rocket.

**Falcon Heavy Specifications:**
- Payload to LEO: 63,800 kg
- Payload to GTO: 26,700 kg
- Payload to Mars: 16,800 kg
- Reusable side boosters

**Notable Launches:**
- Arabsat-6A: Largest commercial communications satellite
- USSF-44: Critical military payload
- Psyche mission: Journey to a metal asteroid

**The Economics of Reusability:**
SpaceX's reusable boosters have fundamentally changed the economics of space launch. A Falcon Heavy launch costs approximately $97 million in expendable mode, but as low as $67 million when boosters are recovered and reused.`,
    excerpt: 'Falcon Heavy\'s 27 engines and reusable boosters have revolutionized heavy-lift launches, cutting costs while increasing capability.',
    authorEmail: 'rocket.fan@example.com',
    authorName: 'Sarah Johnson',
    category: 'launches',
    tags: ['spacex', 'falcon-heavy', 'rockets', 'reusability'],
    status: 'approved',
    createdAt: '2024-02-10T16:00:00Z',
    publishedAt: '2024-02-11T12:00:00Z',
  },
  {
    id: 'post-005',
    title: 'Sentinel-2: Monitoring Earth\'s Changes from Space',
    content: `The Copernicus Sentinel-2 mission provides unprecedented views of Earth's surface, enabling monitoring of land use, vegetation health, and environmental changes.

**Mission Overview:**
- Two identical satellites (2A and 2B)
- 290 km swath width
- 10m resolution in visible bands
- 5-day revisit time at equator

**Applications:**
1. **Agriculture**: Crop health monitoring, yield prediction
2. **Forestry**: Deforestation tracking, forest fire damage assessment
3. **Urban Planning**: City expansion monitoring
4. **Water Management**: Lake and reservoir levels, water quality

**Free and Open Data:**
Unlike commercial Earth observation, Sentinel-2 data is completely free and openly accessible. Scientists, farmers, and urban planners worldwide use this data daily to make informed decisions.

This democratization of Earth observation data exemplifies how space technology truly serves everyone.`,
    excerpt: 'Sentinel-2 provides free, open satellite imagery that farmers, scientists, and planners use to monitor our changing planet.',
    authorEmail: 'earth.observer@example.com',
    authorName: 'Dr. Elena Petrova',
    category: 'earth-observation',
    tags: ['sentinel', 'copernicus', 'esa', 'earth-observation', 'free-data'],
    status: 'approved',
    createdAt: '2024-02-15T11:00:00Z',
    publishedAt: '2024-02-16T08:00:00Z',
  },
];

// Get only approved posts
export function getApprovedPosts(): SpacePost[] {
  return posts.filter(post => post.status === 'approved');
}

// Get posts by category
export function getPostsByCategory(category: string): SpacePost[] {
  return getApprovedPosts().filter(post => post.category === category);
}
