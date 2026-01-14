const path = require("path");
const fs = require("fs");

const dotenvPath = path.join(__dirname, "..", "compass_backend", ".env");
if (fs.existsSync(dotenvPath)) {
  require("dotenv").config({ path: dotenvPath });
}

if (typeof fetch !== "function") {
  throw new Error("Global fetch is not available in this Node version.");
}

const API_BASE_URL =
  process.env.API_BASE_URL || "https://compass-web-backend.onrender.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in compass_backend/.env");
}

const categoryCovers = {
  branding:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80",
  "ui-ux":
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  "web-development":
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
  applications:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
  "digital-marketing":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  "media-production":
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80"
};

const services = [
  {
    title: "Logo Design",
    category: "branding",
    summary: "Signature logos that anchor your identity and feel timeless.",
    description:
      "Crafted marks rooted in strategy, tested across real-world applications, and delivered with usable formats.",
    features: ["Concept exploration", "Typography lockups", "Logo system exports"],
    priceRange: "$1,500 - $4,000"
  },
  {
    title: "Visual Identity System",
    category: "branding",
    summary: "A complete visual system that scales with your brand.",
    description:
      "From color palettes to design assets, we deliver a cohesive identity system ready for growth.",
    features: ["Color and type system", "Graphic elements", "Brand collateral kit"],
    priceRange: "$3,500 - $8,500"
  },
  {
    title: "Brand Guidelines",
    category: "branding",
    summary: "Clear brand rules that keep every execution aligned.",
    description:
      "We document how to apply your identity across digital, print, and social channels.",
    features: ["Logo usage rules", "Voice and tone guide", "Do and dont examples"],
    priceRange: "$1,800 - $4,500"
  },
  {
    title: "Rebranding",
    category: "branding",
    summary: "Modernize your brand while protecting what works.",
    description:
      "Evolve your identity with strategic alignment, fresh visuals, and rollout support.",
    features: ["Audit and strategy", "New identity system", "Launch toolkit"],
    priceRange: "$6,000 - $14,000"
  },
  {
    title: "Naming and Brand Strategy",
    category: "branding",
    summary: "Naming workshops and positioning frameworks to sharpen the story.",
    description:
      "Define market narrative and choose names that resonate with the right audience.",
    features: ["Name ideation", "Positioning statement", "Launch narrative"],
    priceRange: "$2,500 - $7,000"
  },
  {
    title: "Website UI Design",
    category: "ui-ux",
    summary: "Conversion-focused layouts with a premium visual feel.",
    description:
      "Responsive website interfaces that feel fast, clear, and engineered for action.",
    features: ["Site structure", "UI kit", "Responsive breakpoints"],
    priceRange: "$2,500 - $8,000"
  },
  {
    title: "App UI Design",
    category: "ui-ux",
    summary: "Interface systems for mobile and web apps that feel effortless.",
    description:
      "Design app experiences backed by research, flows, and interaction detail.",
    features: ["User flows", "Component library", "Design handoff"],
    priceRange: "$3,000 - $10,000"
  },
  {
    title: "User Experience Research",
    category: "ui-ux",
    summary: "Insight-driven discovery to de-risk product decisions.",
    description:
      "Research that validates assumptions, maps user journeys, and prioritizes actions.",
    features: ["Stakeholder interviews", "User insights", "Opportunity map"],
    priceRange: "$2,000 - $6,000"
  },
  {
    title: "Wireframes and Prototypes",
    category: "ui-ux",
    summary: "Fast iteration before development starts.",
    description:
      "Clickable prototypes to validate structure, flow, and content hierarchy.",
    features: ["Low-fi wireframes", "Clickable prototype", "Iteration cycles"],
    priceRange: "$1,200 - $4,000"
  },
  {
    title: "UX Audit",
    category: "ui-ux",
    summary: "Identify friction points and conversion blockers.",
    description:
      "A structured audit that pinpoints issues and delivers a prioritized improvement plan.",
    features: ["Heuristic review", "Pain point report", "Action roadmap"],
    priceRange: "$1,500 - $5,000"
  },
  {
    title: "Corporate Websites",
    category: "web-development",
    summary: "Elegant company sites that communicate trust and clarity.",
    description:
      "Modern, fast sites with structured content, scalable pages, and clean CMS setup.",
    features: ["Responsive build", "CMS setup", "SEO-ready structure"],
    priceRange: "$3,500 - $12,000"
  },
  {
    title: "E-commerce Stores",
    category: "web-development",
    summary: "Online stores built for conversion and speed.",
    description:
      "Product catalogs, payment flows, and analytics setup tailored to your brand.",
    features: ["Product architecture", "Checkout flow", "Analytics setup"],
    priceRange: "$5,000 - $18,000"
  },
  {
    title: "Custom Websites",
    category: "web-development",
    summary: "Bespoke web experiences for complex needs.",
    description:
      "Custom builds when templates are not enough, with a focus on performance and scale.",
    features: ["Custom components", "Performance optimization", "Secure deployment"],
    priceRange: "$7,000 - $25,000"
  },
  {
    title: "WordPress Development",
    category: "web-development",
    summary: "Flexible WordPress sites with custom design and tooling.",
    description:
      "Custom themes, optimized performance, and clean editorial workflows.",
    features: ["Custom theme", "Editor training", "Speed tuning"],
    priceRange: "$3,000 - $10,000"
  },
  {
    title: "API Integrations",
    category: "web-development",
    summary: "Connect your site with external tools and data sources.",
    description:
      "Secure integrations for CRM, analytics, payments, and internal systems.",
    features: ["Integration planning", "Secure middleware", "Monitoring setup"],
    priceRange: "$2,000 - $8,000"
  },
  {
    title: "Performance and Security",
    category: "web-development",
    summary: "Keep sites fast, stable, and protected.",
    description:
      "Hardening, monitoring, and optimization for critical sites and platforms.",
    features: ["Performance audit", "Security hardening", "Monitoring setup"],
    priceRange: "$1,500 - $6,000"
  },
  {
    title: "Flutter Apps",
    category: "applications",
    summary: "Cross-platform apps for Android and iOS.",
    description:
      "Flutter builds that scale with your roadmap, from MVP to full product.",
    features: ["Cross-platform build", "App architecture", "Release support"],
    priceRange: "$8,000 - $30,000"
  },
  {
    title: "Dashboards",
    category: "applications",
    summary: "Data dashboards for teams and stakeholders.",
    description:
      "Role-based dashboards with clear analytics and actionable reporting.",
    features: ["Role-based views", "Data visualization", "Secure access"],
    priceRange: "$4,000 - $15,000"
  },
  {
    title: "Custom Systems (CRM / CMS)",
    category: "applications",
    summary: "Systems tailored to your internal workflows.",
    description:
      "Automate operations with custom CRM or CMS platforms built to match your process.",
    features: ["Workflow mapping", "Custom modules", "Training and handoff"],
    priceRange: "$10,000 - $40,000"
  },
  {
    title: "App Maintenance and Updates",
    category: "applications",
    summary: "Ongoing improvements after launch.",
    description:
      "Monthly maintenance, performance monitoring, and feature rollouts.",
    features: ["Bug fixes", "Performance tuning", "Feature releases"],
    priceRange: "$1,000 - $5,000 / month"
  },
  {
    title: "Social Media Management",
    category: "digital-marketing",
    summary: "Consistent publishing with strong brand voice.",
    description:
      "Content calendars, posting, and community engagement for major platforms.",
    features: ["Content planning", "Publishing rhythm", "Community management"],
    priceRange: "$1,200 - $4,000 / month"
  },
  {
    title: "Creative Content Production",
    category: "digital-marketing",
    summary: "Visual and written assets that drive engagement.",
    description:
      "Campaign-ready content aligned with strategy and brand guidelines.",
    features: ["Creative direction", "Content production", "Channel-ready formats"],
    priceRange: "$1,500 - $6,000"
  },
  {
    title: "Paid Campaigns",
    category: "digital-marketing",
    summary: "Targeted ads with structured optimization.",
    description:
      "Launch and optimize paid campaigns with clear performance reporting.",
    features: ["Audience targeting", "Creative testing", "Performance reporting"],
    priceRange: "$1,500 - $8,000 / month"
  },
  {
    title: "Copywriting",
    category: "digital-marketing",
    summary: "Messaging that converts and sounds confident.",
    description:
      "Website, campaign, and social copy that aligns with the brand voice.",
    features: ["Website copy", "Campaign messaging", "Tone consistency"],
    priceRange: "$800 - $3,500"
  },
  {
    title: "Digital Marketing Strategy",
    category: "digital-marketing",
    summary: "Growth strategy with clear KPIs.",
    description:
      "Channel planning, budget allocation, and campaign cadence for sustained growth.",
    features: ["Channel strategy", "Budget planning", "KPI tracking"],
    priceRange: "$2,500 - $9,000"
  },
  {
    title: "Social Media Design",
    category: "media-production",
    summary: "High-impact social visuals for every platform.",
    description:
      "Branded templates and campaign assets designed for performance.",
    features: ["Post templates", "Campaign sets", "Export variants"],
    priceRange: "$900 - $3,000"
  },
  {
    title: "Brochures and Company Profiles",
    category: "media-production",
    summary: "Clear, premium documents for sales and partnerships.",
    description:
      "Structured layouts for company decks, brochures, and capability documents.",
    features: ["Information hierarchy", "Layout design", "Print-ready files"],
    priceRange: "$1,200 - $5,000"
  },
  {
    title: "Posters and Ads",
    category: "media-production",
    summary: "Campaign visuals for digital and print placements.",
    description:
      "Bold creative that translates across sizes and placements.",
    features: ["Creative concepts", "Multi-size exports", "Brand-safe art direction"],
    priceRange: "$800 - $3,500"
  },
  {
    title: "Motion Graphics",
    category: "media-production",
    summary: "Animated content to explain and convert.",
    description:
      "Short animations that communicate value quickly and clearly.",
    features: ["Storyboard", "Animation production", "Multi-format delivery"],
    priceRange: "$2,000 - $8,000"
  },
  {
    title: "Short Promo Videos",
    category: "media-production",
    summary: "Short-form video for launches and social campaigns.",
    description:
      "Snappy edits with clear messaging and brand polish.",
    features: ["Concept and script", "Editing and grading", "Social cuts"],
    priceRange: "$2,000 - $9,000"
  }
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function login() {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Login failed: ${response.status} ${text}`);
  }
  const cookie = response.headers.get("set-cookie");
  if (!cookie) {
    throw new Error("No session cookie returned from login.");
  }
  return cookie.split(";")[0];
}

async function fetchExisting(cookie) {
  const response = await fetch(`${API_BASE_URL}/admin/services`, {
    headers: { Cookie: cookie }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Fetch services failed: ${response.status} ${text}`);
  }
  return response.json();
}

async function createService(cookie, payload) {
  const response = await fetch(`${API_BASE_URL}/admin/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Create service failed: ${response.status} ${text}`);
  }
  return response.json();
}

async function updateSettings(cookie, payload) {
  const response = await fetch(`${API_BASE_URL}/admin/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Update settings failed: ${response.status} ${text}`);
  }
  return response.json();
}

async function run() {
  const cookie = await login();
  const existing = await fetchExisting(cookie);
  const existingSlugs = new Set(existing.map((item) => item.slug));
  let createdCount = 0;

  for (const service of services) {
    const slug = slugify(service.title);
    if (existingSlugs.has(slug)) {
      continue;
    }
    const payload = {
      title: service.title,
      name: service.title,
      slug,
      summary: service.summary,
      description: service.description,
      features: service.features,
      category: service.category,
      priceRange: service.priceRange,
      coverUrl: categoryCovers[service.category]
    };
    await createService(cookie, payload);
    createdCount += 1;
  }

  await updateSettings(cookie, { serviceCategoryCovers: categoryCovers });

  console.log(`Services created: ${createdCount}`);
  console.log("Category covers updated.");
}

run().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
