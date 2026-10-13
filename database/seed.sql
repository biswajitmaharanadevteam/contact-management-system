-- Seed Contacts Data

INSERT INTO contacts (first_name, last_name, email, phone, category, company, job_title, address, notes, is_favorite, avatar_color)
VALUES
('Alexander', 'Wright', 'alex.wright@techflow.io', '+1 (555) 234-5678', 'Work', 'TechFlow Innovations', 'Principal Architect', '742 Evergreen Terrace, Seattle, WA', 'Lead architect on the cloud migration project. Prefers Slack or email.', 1, '#3b82f6'),
('Sophia', 'Chen', 'sophia.chen@nexusmedia.com', '+1 (555) 876-5432', 'Work', 'Nexus Media Labs', 'VP of Product Design', '120 Market Street, San Francisco, CA', 'Met at Design Summit 2026. Great resource for UX reviews.', 1, '#8b5cf6'),
('Marcus', 'Vance', 'marcus.v@familymail.net', '+1 (555) 345-6789', 'Family', 'Self-Employed', 'Landscape Designer', '88 Maple Grove Lane, Portland, OR', 'Cousin Marcus. Birthday is November 14th.', 1, '#10b981'),
('Elena', 'Rostova', 'elena.rostova@quantumfin.com', '+1 (555) 456-7890', 'Work', 'Quantum Financial', 'Senior Quant Analyst', '45 Wall St, New York, NY', 'Discuss quarterly revenue forecast and data pipelines.', 0, '#f59e0b'),
('Liam', 'Gallagher', 'liam.g@oasisband.co.uk', '+44 20 7946 0912', 'Friends', 'Acoustic Labs', 'Sound Engineer', '14 Abbey Road, London, UK', 'College roommate. Organizes annual hiking trip.', 1, '#ec4899'),
('Dr. Maya', 'Patel', 'dr.patel@cardiohealth.org', '+1 (555) 987-6543', 'Personal', 'CardioHealth Clinic', 'Cardiologist', '500 Medical Plaza, Chicago, IL', 'Family doctor. Annual health checkup scheduled for October.', 0, '#06b6d4'),
('Jordan', 'Kim', 'jordan.kim@startuphub.co', '+1 (555) 654-3210', 'Friends', 'Venture Next', 'Community Lead', '300 Pine Street, Austin, TX', 'Organizes local developer meetups and hackathons.', 0, '#6366f1'),
('Rachel', 'Green', 'rachel.green@ralphlauren.fashion', '+1 (555) 789-0123', 'Family', 'Ralph Lauren Corp', 'Merchandising Director', '90 Bedford Street, New York, NY', 'Aunt Rachel. Loves French espresso roast.', 0, '#f97316'),
('David', 'O''Connor', 'doconnor@apexlaw.com', '+1 (555) 890-1234', 'Other', 'Apex Legal Partners', 'Managing Partner', '200 Constitution Ave, Boston, MA', 'Legal advisor for contracts and intellectual property rights.', 0, '#64748b');
