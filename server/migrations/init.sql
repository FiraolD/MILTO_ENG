-- ============================================================================
-- MILTO ENGINEERING PLC – Full Database Migration (Neon PostgreSQL)
-- Creates ALL 11 tables, indexes, and seed data
-- ============================================================================

-- ============================================================================
-- 1. USERS – admin user accounts with bcrypt password hashes
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 2. SITE CONTENT – key-value store for editable text blocks
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

-- ============================================================================
-- 3. SEO METADATA – per-route SEO settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  og_image text DEFAULT '',
  keywords text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 4. NAVIGATION LINKS – sortable nav items
-- ============================================================================
CREATE TABLE IF NOT EXISTS navigation_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 5. MEDIA ASSETS – image/asset metadata
-- ============================================================================
CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alt text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  section text DEFAULT '',
  sort_order integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 6. CONTACT INQUIRIES – lead capture from contact form
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  organization text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 7. ARTICLES – blog / news articles
-- ============================================================================
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text DEFAULT '',
  excerpt text DEFAULT '',
  author text DEFAULT '',
  category text DEFAULT '',
  type text DEFAULT 'news',
  image_url text DEFAULT '',
  video_url text DEFAULT '',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 8. PROJECTS – project portfolio
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client text NOT NULL,
  location text NOT NULL,
  year text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  brief_description text DEFAULT '',
  video_url text DEFAULT '',
  images jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 9. SERVICES – engineering services
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  details jsonb DEFAULT '[]'::jsonb,
  icon text DEFAULT '',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 10. SITE SETTINGS – global key-value JSON settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 11. TEAM MEMBERS – staff profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 12. GALLERY ITEMS – photo/video gallery for the website
-- ============================================================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  media_type text NOT NULL DEFAULT 'image',
  url text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  category text DEFAULT '',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 13. ANNOUNCEMENTS – vacancy and bid announcements
-- ============================================================================
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  type text NOT NULL DEFAULT 'vacancy',
  title text NOT NULL,
  description text DEFAULT '',
  content text DEFAULT '',
  deadline_date date,
  attachment_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ALTER TABLES – add new columns to existing tables (idempotent)
-- Must run BEFORE indexes that reference these columns
-- ============================================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS brief_description text DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url text DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS type text DEFAULT 'news';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS video_url text DEFAULT '';

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content (section, key);
CREATE INDEX IF NOT EXISTS idx_seo_metadata_route ON seo_metadata (route);
CREATE INDEX IF NOT EXISTS idx_navigation_links_sort ON navigation_links (sort_order);
CREATE INDEX IF NOT EXISTS idx_media_assets_section ON media_assets (section, sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created ON contact_inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category, is_active);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services (slug);
CREATE INDEX IF NOT EXISTS idx_services_sort ON services (sort_order, is_active);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings (key);
CREATE INDEX IF NOT EXISTS idx_team_members_sort ON team_members (sort_order, is_active);
CREATE INDEX IF NOT EXISTS idx_articles_type ON articles (type, is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items (category, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements (type, is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_slug ON announcements (slug);

-- ============================================================================
-- SEED: Default admin user
-- Password: MiltoAdmin@2024!  (bcrypt hash, cost 12)
-- IMPORTANT: Replace this hash in production with your own password.
-- Generate with:  bcrypt.hash("YourPassword", 12)
-- ============================================================================
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@miltoengineering.com',
   '$2a$12$LJ3m4ys3GZ6zz0KQqgNvYOHwGkKt5Fj7GJn5RkxYwD3bX8mF0eK6e',
   'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- SEED: Navigation links
-- ============================================================================
INSERT INTO navigation_links (label, href, sort_order) VALUES
  ('Home', '#home', 1),
  ('About', '#about', 2),
  ('Services', '#services', 3),
  ('Projects', '#projects', 4),
  ('Team', '#team', 5),
  ('Contact', '#contact', 6)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: SEO metadata
-- ============================================================================
INSERT INTO seo_metadata (route, title, description, keywords) VALUES
  ('/', 'MILTO ENGINEERING PLC | Water Resources Engineering Ethiopia',
   'Ethiopia''s trusted Grade One Water Resources consulting and engineering firm. Professional services in water resources, groundwater, hydrogeology, geotechnical engineering.',
   'water resources engineering, groundwater, hydrogeology, geotechnical, Ethiopia, engineering consulting')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: Site content blocks
-- ============================================================================
INSERT INTO site_content (section, key, value) VALUES
  ('hero', 'title', 'Engineering Water Resources. Understanding the Earth. Building a Sustainable Future.'),
  ('hero', 'subtitle', 'Ethiopia''s trusted Grade One Water Resources consulting and engineering firm delivering professional services since 2021.'),
  ('hero', 'cta', 'Explore Our Services'),
  ('about', 'title', 'About MILTO ENGINEERING PLC'),
  ('about', 'body', 'MILTO ENGINEERING PLC is a Grade One Water Resources consulting and engineering firm based in Addis Ababa, Ethiopia. We provide professional services in water resources, groundwater, hydrogeology, geophysics, geotechnical investigation, environmental services, GIS/remote sensing, and engineering consulting.'),
  ('services', 'title', 'Our Services'),
  ('projects', 'title', 'Our Projects'),
  ('team', 'title', 'Our Team'),
  ('contact', 'title', 'Get in Touch'),
  ('footer', 'tagline', 'Engineering Water Resources. Understanding the Earth. Building a Sustainable Future.')
ON CONFLICT (section, key) DO NOTHING;

-- ============================================================================
-- SEED: Services
-- ============================================================================
INSERT INTO services (slug, title, description, details, icon, sort_order) VALUES
  ('water-resources', 'Water Resources Engineering',
   'Comprehensive water resources assessment, planning, and management including surface water hydrology, dam and reservoir engineering, and irrigation system design.',
   '["Surface water hydrology and modeling","Dam and reservoir engineering","Irrigation system design and management","Water supply system planning","Flood risk assessment and management","Watershed management and conservation"]'::jsonb,
   'Drop', 1),
  ('groundwater', 'Groundwater & Hydrogeology',
   'Expert groundwater exploration, assessment, and development services using advanced hydrogeological techniques and modeling.',
   '["Groundwater exploration and assessment","Aquifer characterization and modeling","Well field design and development","Groundwater quality monitoring","Hydrogeological mapping","Managed aquifer recharge"]'::jsonb,
   'WaveTriangle', 2),
  ('geophysics', 'Geophysics & Geotechnical',
   'Advanced geophysical surveys and geotechnical investigations for infrastructure, water resources, and construction projects.',
   '["Electrical resistivity tomography (ERT)","Seismic refraction and MASW surveys","Ground Penetrating Radar (GPR)","Borehole geophysical logging","Soil mechanics and foundation analysis","Slope stability and earthworks assessment"]'::jsonb,
   'CompassTool', 3),
  ('environmental', 'Environmental Services',
   'Integrated environmental assessment, impact studies, and management solutions for sustainable development projects.',
   '["Environmental Impact Assessment (EIA)","Environmental and social management plans","Water quality assessment and monitoring","Wastewater treatment and management","Ecosystem restoration and conservation","Climate change adaptation strategies"]'::jsonb,
   'Leaf', 4),
  ('gis', 'GIS & Remote Sensing',
   'State-of-the-art spatial analysis, remote sensing, and geographic information systems for informed decision-making.',
   '["Spatial data collection and analysis","Satellite imagery processing and interpretation","Land use and land cover mapping","Hydrological and watershed modeling","Infrastructure and utility mapping","Web-based GIS solutions"]'::jsonb,
   'GlobeHemisphereWest', 5),
  ('engineering', 'Engineering Consulting',
   'Comprehensive engineering consulting services spanning feasibility studies, design, supervision, and project management.',
   '["Feasibility studies and master planning","Detailed engineering design","Construction supervision and contract administration","Project management and monitoring","Technical due diligence","Capacity building and training"]'::jsonb,
   'GearSix', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED: Team members
-- ============================================================================
INSERT INTO team_members (name, role, bio, sort_order) VALUES
  ('Eng. Tekle Berhanu', 'Managing Director & Senior Water Resources Engineer',
   'Over 15 years of experience in water resources engineering, leading multi-disciplinary teams on major infrastructure projects across Ethiopia.', 1),
  ('Dr. Abebech Assefa', 'Head of Hydrogeology & Environmental Services',
   'PhD in Hydrogeology with extensive experience in groundwater assessment, aquifer modeling, and environmental impact assessment for development projects.', 2),
  ('Eng. Girma Mekonnen', 'Senior Geotechnical & Geophysics Engineer',
   'Specialist in geophysical surveys and geotechnical investigations with a track record of delivering complex subsurface characterization projects.', 3),
  ('Eng. Almaz Wondimu', 'GIS & Remote Sensing Lead',
   'Expert in spatial analysis, remote sensing applications, and GIS-based decision support systems for water resources and environmental management.', 4)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: Projects
-- ============================================================================
INSERT INTO projects (slug, title, client, location, year, category, description) VALUES
  ('rift-valley-basin-groundwater-assessment',
   'Rift Valley Basin Groundwater Assessment',
   'Ministry of Water and Energy', 'Oromia & SNNP Regions', '2023', 'Groundwater',
   'Comprehensive groundwater resource assessment of the Rift Valley Basin, including aquifer characterization, water quality analysis, and sustainable yield estimation for 15 woredas.'),
  ('addis-ababa-water-supply-expansion',
   'Addis Ababa Water Supply System Expansion',
   'Addis Ababa Water and Sewerage Authority', 'Addis Ababa', '2023-2024', 'Water Resources',
   'Feasibility study and detailed design for expansion of water supply infrastructure serving 500,000 residents, including reservoir design, transmission mains, and distribution network optimization.'),
  ('awash-river-basin-irrigation',
   'Awash River Basin Irrigation Development Study',
   'Ethiopian Agricultural Transformation Agency', 'Afar & Amhara Regions', '2022-2023', 'Water Resources',
   'Irrigation development master plan covering 25,000 hectares, including water availability assessment, canal system design, and environmental and social management framework.'),
  ('geotechnical-investigation-highway',
   'Geotechnical Investigation for Highway Project',
   'Ethiopian Roads Authority', 'Multiple Regions', '2023', 'Geotechnical',
   'Subsurface geotechnical investigation for 120 km highway corridor, including borehole drilling, soil testing, seismic surveys, and foundation recommendations for 12 major bridge structures.'),
  ('lake-tana-basin-environmental',
   'Lake Tana Basin Environmental Assessment',
   'World Bank / Ethiopian Biodiversity Institute', 'Amhara Region', '2022-2024', 'Environmental',
   'Environmental Impact Assessment and management plan for integrated watershed management project, addressing water quality, ecosystem conservation, and community livelihood sustainability.'),
  ('urban-water-supply-gis-platform',
   'Urban Water Supply GIS Platform',
   'Multiple Municipalities', 'Various Cities, Ethiopia', '2023-2024', 'GIS',
   'Development of web-based GIS platform for urban water supply infrastructure management, integrating asset mapping, customer management, and leak detection analytics for 8 municipalities.')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED: Site settings
-- ============================================================================
INSERT INTO site_settings (key, value) VALUES
  ('brand', '{"name":"MILTO ENGINEERING PLC","shortName":"MILTO","tagline":"Engineering Water Resources. Understanding the Earth. Building a Sustainable Future.","founded":"2021","headquarters":"Addis Ababa, Ethiopia","grade":"Grade One"}'::jsonb),
  ('contact', '{"email":"info@miltoengineering.com","phone":"+251-11-XXX-XXXX","address":"Addis Ababa, Ethiopia"}'::jsonb),
  ('social', '{"linkedin":"https://linkedin.com/company/miltoengineering","twitter":"https://twitter.com/miltoengineering","youtube":"https://youtube.com/@miltoengineering"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- SEED: News articles (type = 'news')
-- ============================================================================
INSERT INTO articles (slug, title, excerpt, content, author, category, type, image_url, is_published, published_at) VALUES
  ('milto-completes-rift-valley-assessment',
   'MILTO Completes Rift Valley Basin Groundwater Assessment',
   'A comprehensive groundwater resource assessment covering 15 woredas in the Rift Valley Basin has been successfully completed.',
   'MILTO ENGINEERING PLC has successfully completed a comprehensive groundwater resource assessment of the Rift Valley Basin, covering 15 woredas across Oromia and SNNP regions. The project, commissioned by the Ministry of Water and Energy, included aquifer characterization, water quality analysis, and sustainable yield estimation to support regional water resource planning and development.',
   'MILTO Communications', 'Company News', 'news', 'https://picsum.photos/seed/milto-news-1/1200/700', true, now()),
  ('new-gis-platform-launched',
   'New Web-Based GIS Platform Launched for Urban Water Supply',
   'MILTO launches a web-based GIS platform integrating asset mapping and leak detection for 8 municipalities.',
   'MILTO ENGINEERING PLC has launched a new web-based GIS platform designed for urban water supply infrastructure management. The platform integrates asset mapping, customer management, and leak detection analytics, serving 8 municipalities across Ethiopia. This represents a significant step forward in leveraging technology for water resource management.',
   'MILTO Communications', 'Technology', 'news', 'https://picsum.photos/seed/milto-news-2/1200/700', true, now() - interval '5 days'),
  ('environmental-impact-assessment-lake-tana',
   'Environmental Impact Assessment Completed for Lake Tana Basin',
   'A comprehensive EIA and management plan for the Lake Tana Basin watershed project has been finalized.',
   'MILTO ENGINEERING PLC has completed the Environmental Impact Assessment and management plan for the integrated watershed management project at Lake Tana Basin. The assessment, commissioned by the World Bank and Ethiopian Biodiversity Institute, addresses water quality, ecosystem conservation, and community livelihood sustainability, setting a benchmark for environmentally responsible development.',
   'MILTO Communications', 'Environmental', 'news', 'https://picsum.photos/seed/milto-news-3/1200/700', true, now() - interval '10 days')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED: Gallery items
-- ============================================================================
INSERT INTO gallery_items (title, description, media_type, url, thumbnail_url, category, sort_order) VALUES
  ('Rift Valley Basin Survey', 'Field team conducting electrical resistivity tomography survey in the Rift Valley Basin.', 'image',
   'https://images.unsplash.com/photo-1581094794389-cd04a64d1353?w=800', '', 'Field Work', 1),
  ('Groundwater Exploration', 'Drilling rig in operation during groundwater exploration in Oromia region.', 'image',
   'https://images.unsplash.com/photo-1581094271901-7ce2c8b3f5e0?w=800', '', 'Drilling', 2),
  ('GIS Mapping Workshop', 'GIS team analyzing spatial data for urban water supply infrastructure mapping.', 'image',
   'https://images.unsplash.com/photo-1551434678-e076c8c480a4?w=800', '', 'GIS', 3),
  ('Project Overview Video', 'Documentary overview of the Addis Ababa Water Supply System Expansion project.', 'video',
   'https://www.youtube.com/embed/dQw4w9WgXcQ',
   'https://images.unsplash.com/photo-1581094794389-cd04a64d1353?w=800', 'Projects', 4)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED: Announcements (vacancies and bids)
-- ============================================================================
INSERT INTO announcements (slug, type, title, description, content, deadline_date, attachment_url) VALUES
  ('senior-water-resources-engineer-2026', 'vacancy',
   'Senior Water Resources Engineer',
   'We are seeking an experienced Senior Water Resources Engineer to join our team in Addis Ababa.',
   'MILTO ENGINEERING PLC is seeking a Senior Water Resources Engineer with 10+ years of experience in water resources assessment, dam engineering, and irrigation system design. The position is based in Addis Ababa with field assignments across Ethiopia. Requirements: MSc in Water Resources Engineering or related field, professional registration, proven project management experience.',
   '2026-09-30', ''),
  ('gis-specialist-2026', 'vacancy',
   'GIS & Remote Sensing Specialist',
   'Looking for a GIS specialist with expertise in spatial analysis and remote sensing applications.',
   'MILTO ENGINEERING PLC is hiring a GIS & Remote Sensing Specialist with 5+ years of experience in spatial data analysis, satellite imagery processing, and web-based GIS solutions. Requirements: MSc in GIS, Geomatics, or related field. Proficiency in ArcGIS, QGIS, and Python scripting.',
   '2026-09-15', ''),
  ('bid-geotechnical-investigation-2026', 'bid',
   'Bid: Geotechnical Investigation Services for Highway Project',
   'Request for proposals for geotechnical investigation services along a 120 km highway corridor.',
   'MILTO ENGINEERING PLC invites qualified firms to submit proposals for geotechnical investigation services along a 120 km highway corridor. The scope includes borehole drilling, soil testing, seismic surveys, and foundation recommendations for 12 major bridge structures. Submission deadline: see attachment.',
   NULL, ''),
  ('bid-water-supply-design-2026', 'bid',
   'Bid: Water Supply System Design Consultancy',
   'Request for proposals for water supply system design and expansion consultancy.',
   'MILTO ENGINEERING PLC invites qualified consulting firms to submit proposals for water supply system design and expansion consultancy. The project covers feasibility study and detailed design for water supply infrastructure serving 500,000 residents, including reservoir design, transmission mains, and distribution network optimization.',
   NULL, '')
ON CONFLICT (slug) DO NOTHING;
