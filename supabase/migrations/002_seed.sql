-- Dati iniziali recuperati dal vecchio sito (sites.google.com/site/aviscasorateprimo).
-- Eseguire una sola volta dopo 001_schema.sql.

insert into public.site_settings (key, value) values
 ('contacts', '{
    "emails": ["aviscasorate1@gmail.com", "casorateprimo.comunale@avis.it"],
    "pec": "aviscasorate@pec.it",
    "phone": "+39 393 6815319",
    "hours": "Lunedì–venerdì 8:30–12:00 e 15:00–17:30, esclusi i festivi",
    "address": "Presso Ospedale Carlo Mira, Casorate Primo (PV)",
    "map_query": "Ospedale Carlo Mira, Casorate Primo",
    "fiscal_code": "96030470189"
  }'::jsonb),
 ('socials', '{
    "instagram": "https://www.instagram.com/avis_casorateprimo",
    "facebook": "https://facebook.com/aviscasorate",
    "youtube": "https://www.youtube.com/channel/UCKrrjyl2QJr7on1Dm8VL5Qg"
  }'::jsonb)
on conflict (key) do nothing;

insert into public.team_members (full_name, role, group_name, sort) values
 ('Benedetta Maiocchi', 'Presidente', 'direttivo', 1),
 ('Giovanni Indaco', 'Vicepresidente vicario', 'direttivo', 2),
 ('Ruben Zanellato', 'Segretario', 'direttivo', 3),
 ('Axel Indaco', 'Tesoriere', 'direttivo', 4),
 ('Giuseppina Deamici', 'Medico responsabile', 'direttivo', 5),
 ('Caterina Barillà', 'Consigliere', 'consigliere', 10),
 ('Laura Bersani', 'Consigliere', 'consigliere', 11),
 ('Aura Emanueli', 'Consigliere', 'consigliere', 12),
 ('Danilo Facchetti', 'Consigliere', 'consigliere', 13),
 ('Massimo Fachin', 'Consigliere', 'consigliere', 14),
 ('Paolo Forneris', 'Consigliere', 'consigliere', 15),
 ('Fabio Maiocchi', 'Consigliere', 'consigliere', 16),
 ('Loredana Negroni', 'Consigliere', 'consigliere', 17),
 ('Vladimiro Quattrini', 'Consigliere', 'consigliere', 18),
 ('Lidia G. Vignoni', 'Consigliere', 'consigliere', 19),
 ('Serena Magistroni', 'Collaboratrice', 'collaboratore', 30);

-- Giornate di donazione con Autoemoteca AVIS Milano (calendario del vecchio sito; orari non pubblicati).
insert into public.events (title, summary, description, starts_at, all_day, location, status) values
 ('Donazione con Autoemoteca', 'Giornata di donazione presso l''Ospedale Carlo Mira.',
  'Giornata di donazione con l''Autoemoteca AVIS Milano. Gli orari non sono indicati nel calendario originale: contattaci per prenotare.',
  '2026-09-27 00:00:00+02', true, 'Ospedale Carlo Mira, Casorate Primo', 'published'),
 ('Donazione con Autoemoteca', 'Giornata di donazione presso l''Ospedale Carlo Mira.',
  'Giornata di donazione con l''Autoemoteca AVIS Milano. Gli orari non sono indicati nel calendario originale: contattaci per prenotare.',
  '2026-10-07 00:00:00+02', true, 'Ospedale Carlo Mira, Casorate Primo', 'published'),
 ('Donazione con Autoemoteca', 'Giornata di donazione presso l''Ospedale Carlo Mira.',
  'Giornata di donazione con l''Autoemoteca AVIS Milano. Gli orari non sono indicati nel calendario originale: contattaci per prenotare.',
  '2026-11-28 00:00:00+01', true, 'Ospedale Carlo Mira, Casorate Primo', 'published'),
 ('Donazione con Autoemoteca', 'Giornata di donazione presso l''Ospedale Carlo Mira.',
  'Giornata di donazione con l''Autoemoteca AVIS Milano. Gli orari non sono indicati nel calendario originale: contattaci per prenotare.',
  '2026-12-12 00:00:00+01', true, 'Ospedale Carlo Mira, Casorate Primo', 'published');

-- Documenti con link pubblici noti. Statuto 2022 e Atto costitutivo: carica i PDF dal pannello admin.
insert into public.documents (title, category, url, sort) values
 ('Primo statuto (curiosità storica)', 'statuto', 'https://drive.google.com/file/d/1LkrCz7R6zoZXE-YXMHtTWmTJekFtExep/view', 20),
 ('Bilanci sociali (cartella)', 'bilanci', 'https://drive.google.com/folderview?id=1k64QhLceVAv-h5DJNsDSuhuhccBASHMA', 10),
 ('Modulo di iscrizione donatori', 'altri', 'https://drive.google.com/file/d/1q2o4tb-rZJx8MA1-yqLnYZKM0Nhsv5Xz/view', 10);

insert into public.albums (title, category, sort) values
 ('Eventi', 'eventi', 1), ('Manifestazioni', 'manifestazioni', 2), ('Coro Gocce d''Amore', 'coro', 3),
 ('Progetto Scuola', 'scuola', 4), ('Attività associative', 'attivita', 5), ('Eventi storici', 'storici', 6);
