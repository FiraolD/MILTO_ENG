export const BRAND = {
  name: "MILTO ENGINEERING PLC",
  shortName: "MILTO",
  tagline: "Engineering Water Resources. Understanding the Earth. Building a Sustainable Future.",
  description:
    "Ethiopia's trusted Grade One Water Resources consulting and engineering firm, delivering professional services in water resources, groundwater, hydrogeology, geophysics, geotechnical investigation, environmental services, GIS/remote sensing, and engineering consulting since 2021.",
  year: 2021,
  founded: "2021",
  headquarters: "Addis Ababa, Ethiopia",
  grade: "Grade One",
};

export const CONTACT = {
  email: "info@miltoengineering.com",
  phone: "+251-11-XXX-XXXX",
  phoneDisplay: "+251 11 XXX XXXX",
  address: "Addis Ababa, Ethiopia",
  mapUrl: "https://maps.google.com/?q=Addis+Ababa+Ethiopia",
};

export const SOCIAL = {
  linkedin: "https://linkedin.com/company/milto-engineering-plc",
  youtube: "https://youtube.com/@miltoengineering",
  telegram: "https://t.me/miltoengineeringplc",
  facebook: "https://www.facebook.com/miltoengineering",
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;

export const SERVICES = [
  {
    id: "water-resources",
    title: "Water Resources Engineering",
    description:
      "Comprehensive water resources assessment, planning, and management including surface water hydrology, dam and reservoir engineering, and irrigation system design.",
    icon: "Drop",
    details: [
      "Surface water hydrology and modeling",
      "Dam and reservoir engineering",
      "Irrigation system design and management",
      "Water supply system planning",
      "Flood risk assessment and management",
      "Watershed management and conservation",
    ],
  },
  {
    id: "groundwater",
    title: "Groundwater & Hydrogeology",
    description:
      "Expert groundwater exploration, assessment, and development services using advanced hydrogeological techniques and modeling.",
    icon: "WaveTriangle",
    details: [
      "Groundwater exploration and assessment",
      "Aquifer characterization and modeling",
      "Well field design and development",
      "Groundwater quality monitoring",
      "Hydrogeological mapping",
      "Managed aquifer recharge",
    ],
  },
  {
    id: "geophysics",
    title: "Geophysics & Geotechnical",
    description:
      "Advanced geophysical surveys and geotechnical investigations for infrastructure, water resources, and construction projects.",
    icon: "CompassTool",
    details: [
      "Electrical resistivity tomography (ERT)",
      "Seismic refraction and MASW surveys",
      "Ground Penetrating Radar (GPR)",
      "Borehole geophysical logging",
      "Soil mechanics and foundation analysis",
      "Slope stability and earthworks assessment",
    ],
  },
  {
    id: "environmental",
    title: "Environmental Services",
    description:
      "Integrated environmental assessment, impact studies, and management solutions for sustainable development projects.",
    icon: "Leaf",
    details: [
      "Environmental Impact Assessment (EIA)",
      "Environmental and social management plans",
      "Water quality assessment and monitoring",
      "Wastewater treatment and management",
      "Ecosystem restoration and conservation",
      "Climate change adaptation strategies",
    ],
  },
  {
    id: "gis",
    title: "GIS & Remote Sensing",
    description:
      "State-of-the-art spatial analysis, remote sensing, and geographic information systems for informed decision-making.",
    icon: "GlobeHemisphereWest",
    details: [
      "Spatial data collection and analysis",
      "Satellite imagery processing and interpretation",
      "Land use and land cover mapping",
      "Hydrological and watershed modeling",
      "Infrastructure and utility mapping",
      "Web-based GIS solutions",
    ],
  },
  {
    id: "engineering",
    title: "Engineering Consulting",
    description:
      "Comprehensive engineering consulting services spanning feasibility studies, design, supervision, and project management.",
    icon: "GearSix",
    details: [
      "Feasibility studies and master planning",
      "Detailed engineering design",
      "Construction supervision and contract administration",
      "Project management and monitoring",
      "Technical due diligence",
      "Capacity building and training",
    ],
  },
];

export const STATS = [
  { label: "Years of Experience", value: "3+" },
  { label: "Projects Completed", value: "50+" },
  { label: "Expert Professionals", value: "25+" },
  { label: "Client Organizations", value: "30+" },
];

export const TEAM = [
  {
    name: "Eng. Tekle Berhanu",
    role: "Managing Director & Senior Water Resources Engineer",
    bio: "Over 15 years of experience in water resources engineering, leading multi-disciplinary teams on major infrastructure projects across Ethiopia.",
  },
  {
    name: "Dr. Abebech Assefa",
    role: "Head of Hydrogeology & Environmental Services",
    bio: "PhD in Hydrogeology with extensive experience in groundwater assessment, aquifer modeling, and environmental impact assessment for development projects.",
  },
  {
    name: "Eng. Girma Mekonnen",
    role: "Senior Geotechnical & Geophysics Engineer",
    bio: "Specialist in geophysical surveys and geotechnical investigations with a track record of delivering complex subsurface characterization projects.",
  },
  {
    name: "Eng. Almaz Wondimu",
    role: "GIS & Remote Sensing Lead",
    bio: "Expert in spatial analysis, remote sensing applications, and GIS-based decision support systems for water resources and environmental management.",
  },
];

export const PROJECTS = [
  {
    id: "project-1",
    title: "Rift Valley Basin Groundwater Assessment",
    client: "Ministry of Water and Energy",
    location: "Oromia & SNNP Regions",
    year: "2023",
    category: "Groundwater",
    description:
      "Comprehensive groundwater resource assessment of the Rift Valley Basin, including aquifer characterization, water quality analysis, and sustainable yield estimation for 15 woredas.",
    images: [],
  },
  {
    id: "project-2",
    title: "Addis Ababa Water Supply System Expansion",
    client: "Addis Ababa Water and Sewerage Authority",
    location: "Addis Ababa",
    year: "2023-2024",
    category: "Water Resources",
    description:
      "Feasibility study and detailed design for expansion of water supply infrastructure serving 500,000 residents, including reservoir design, transmission mains, and distribution network optimization.",
    images: [],
  },
  {
    id: "project-3",
    title: "Awash River Basin Irrigation Development Study",
    client: "Ethiopian Agricultural Transformation Agency",
    location: "Afar & Amhara Regions",
    year: "2022-2023",
    category: "Water Resources",
    description:
      "Irrigation development master plan covering 25,000 hectares, including water availability assessment, canal system design, and environmental and social management framework.",
    images: [],
  },
  {
    id: "project-4",
    title: "Geotechnical Investigation for Highway Project",
    client: "Ethiopian Roads Authority",
    location: "Multiple Regions",
    year: "2023",
    category: "Geotechnical",
    description:
      "Subsurface geotechnical investigation for 120 km highway corridor, including borehole drilling, soil testing, seismic surveys, and foundation recommendations for 12 major bridge structures.",
    images: [],
  },
  {
    id: "project-5",
    title: "Lake Tana Basin Environmental Assessment",
    client: "World Bank / Ethiopian Biodiversity Institute",
    location: "Amhara Region",
    year: "2022-2024",
    category: "Environmental",
    description:
      "Environmental Impact Assessment and management plan for integrated watershed management project, addressing water quality, ecosystem conservation, and community livelihood sustainability.",
    images: [],
  },
  {
    id: "project-6",
    title: "Urban Water Supply GIS Platform",
    client: "Multiple Municipalities",
    location: "Various Cities, Ethiopia",
    year: "2023-2024",
    category: "GIS",
    description:
      "Development of web-based GIS platform for urban water supply infrastructure management, integrating asset mapping, customer management, and leak detection analytics for 8 municipalities.",
    images: [],
  },
];

export const ADMIN_CREDENTIALS_HINT = {
  email: "admin@miltoengineering.com",
  password: "••••••••",
};

export const DEFAULT_SITE_CONTENT: Record<string, string> = {
  "hero_title": "Engineering Water Resources. Understanding the Earth. Building a Sustainable Future.",
  "hero_subtitle": "Ethiopia's trusted Grade One Water Resources consulting and engineering firm delivering professional services since 2021.",
  "hero_cta": "Explore Our Services",
  "about_title": "About MILTO ENGINEERING PLC",
  "about_body": "MILTO ENGINEERING PLC is a Grade One Water Resources consulting and engineering firm based in Addis Ababa, Ethiopia. We provide professional services in water resources, groundwater, hydrogeology, geophysics, geotechnical investigation, environmental services, GIS/remote sensing, and engineering consulting.",
  "services_title": "Our Services",
  "projects_title": "Our Projects",
  "team_title": "Our Team",
  "contact_title": "Get in Touch",
  "footer_tagline": "Engineering Water Resources. Understanding the Earth. Building a Sustainable Future.",
};

export const DEFAULT_SEO: Record<string, string> = {
  route: "/",
  title: "MILTO ENGINEERING PLC | Water Resources Engineering Ethiopia",
  description: "Ethiopia's trusted Grade One Water Resources consulting and engineering firm. Professional services in water resources, groundwater, hydrogeology, geotechnical engineering.",
  keywords: "water resources engineering, groundwater, hydrogeology, geotechnical, Ethiopia, engineering consulting",
};

export const VALUES = [
  {
    title: "Technical Excellence",
    description:
      "We deliver solutions grounded in rigorous science, advanced engineering, and continuous innovation.",
  },
  {
    title: "Integrity & Ethics",
    description:
      "We uphold the highest standards of professional ethics, transparency, and accountability in all engagements.",
  },
  {
    title: "Sustainability",
    description:
      "We integrate environmental stewardship and social responsibility into every project we undertake.",
  },
  {
    title: "Client Partnership",
    description:
      "We build lasting relationships through collaborative engagement, responsiveness, and tailored solutions.",
  },
];