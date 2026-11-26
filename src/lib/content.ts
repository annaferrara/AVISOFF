// Contenuti di riserva recuperati dal vecchio sito (sites.google.com/site/aviscasorateprimo).
// Vengono usati quando Supabase non è configurato o una tabella è vuota.
// Una volta caricati i dati dal pannello admin, questi valori non servono più.
import type { Contacts, DocumentItem, EventItem, Settings, Socials, TeamMember } from './types'

export const CONTACTS: Contacts = {
  emails: ['aviscasorate1@gmail.com', 'casorateprimo.comunale@avis.it'],
  pec: 'aviscasorate@pec.it',
  phone: '+39 393 6815319',
  hours: 'Lunedì–venerdì 8:30–12:00 e 15:00–17:30, esclusi i festivi',
  address: 'Presso Ospedale Carlo Mira, Casorate Primo (PV)',
  map_query: 'Ospedale Carlo Mira, Casorate Primo',
  fiscal_code: '96030470189',
}

export const SOCIALS: Socials = {
  instagram: 'https://www.instagram.com/avis_casorateprimo',
  facebook: 'https://facebook.com/aviscasorate',
  youtube: 'https://www.youtube.com/channel/UCKrrjyl2QJr7on1Dm8VL5Qg',
}

export const DEFAULT_SETTINGS: Settings = {
  contacts: CONTACTS,
  socials: SOCIALS,
  home: { hero_image_url: null, about_image_url: null, activity_images: [null, null, null, null] },
  logo_url: null,
}

const m = (
  n: number, full_name: string, role: string, group_name: TeamMember['group_name'],
): TeamMember => ({ id: `default-${n}`, full_name, role, group_name, bio: null, photo_url: null, sort: n })

export const DEFAULT_TEAM: TeamMember[] = [
  m(1, 'Benedetta Maiocchi', 'Presidente', 'direttivo'),
  m(2, 'Giovanni Indaco', 'Vicepresidente vicario', 'direttivo'),
  m(3, 'Ruben Zanellato', 'Segretario', 'direttivo'),
  m(4, 'Axel Indaco', 'Tesoriere', 'direttivo'),
  m(5, 'Giuseppina Deamici', 'Medico responsabile', 'direttivo'),
  m(10, 'Caterina Barillà', 'Consigliere', 'consigliere'),
  m(11, 'Laura Bersani', 'Consigliere', 'consigliere'),
  m(12, 'Aura Emanueli', 'Consigliere', 'consigliere'),
  m(13, 'Danilo Facchetti', 'Consigliere', 'consigliere'),
  m(14, 'Massimo Fachin', 'Consigliere', 'consigliere'),
  m(15, 'Paolo Forneris', 'Consigliere', 'consigliere'),
  m(16, 'Fabio Maiocchi', 'Consigliere', 'consigliere'),
  m(17, 'Loredana Negroni', 'Consigliere', 'consigliere'),
  m(18, 'Vladimiro Quattrini', 'Consigliere', 'consigliere'),
  m(19, 'Lidia G. Vignoni', 'Consigliere', 'consigliere'),
  m(30, 'Serena Magistroni', 'Collaboratrice', 'collaboratore'),
]

// Soci fondatori — 10 marzo 1963, sotto la guida del Dott. Piero Mergati.
export const FOUNDERS: string[] = [
  'Mergati Dott. Piero (Presidente promotore)', 'Andreoli Valerio', 'Belloni Antonietta', 'Belloni Bruno',
  'Beretta Francesco', 'Bonacina Carlo', 'Bonacina Giuseppe', 'Busseda Rag. Luigi', 'Busseda Maria',
  'Conti Angelo', 'De Vecchi Mario', 'Disabella Maria', 'Fabbi Giorgio', 'Franchi Domenico',
  'Franchi Maria', 'Galli Angelina', 'Gatti Giovanni', 'Gea Francesco', 'Leoni Maddalena',
  'Mergati Alberto', 'Mergati Luigi', 'Migliavacca Pietro', 'Nicoli Sigilfredo', 'Oldrati Luigi',
  'Piaggi Ercole', 'Polo Amelia', 'Quattrini Lugi', 'Quattro Carlotta', 'Ramus Rinaldo',
  'Ricci Alfonso', 'Ricci Battista', 'Riva Anna', 'Santagostino Barbone Ernesto', 'Schmitd Antonio',
  'Spadini Alfredo', 'Tascheri Angelo', 'Varesi Giuseppe', 'Zampollini Dino', 'Zecchini Maria',
]

const donation = (id: string, iso: string): EventItem => ({
  id,
  title: 'Donazione con Autoemoteca',
  summary: 'Giornata di donazione presso l’Ospedale Carlo Mira.',
  description:
    'Giornata di donazione con l’Autoemoteca AVIS Milano presso l’Ospedale Carlo Mira di Casorate Primo.\n\nGli orari non sono indicati nel calendario originale: contattaci per prenotare.',
  starts_at: iso,
  ends_at: null,
  all_day: true,
  location: 'Ospedale Carlo Mira, Casorate Primo',
  poster_url: null,
  gallery: [],
  external_url: null,
  status: 'published',
})

export const DEFAULT_EVENTS: EventItem[] = [
  donation('default-ev-1', '2026-09-27T00:00:00+02:00'),
  donation('default-ev-2', '2026-10-07T00:00:00+02:00'),
  donation('default-ev-3', '2026-11-28T00:00:00+01:00'),
  donation('default-ev-4', '2026-12-12T00:00:00+01:00'),
]

export const DEFAULT_DOCUMENTS: DocumentItem[] = [
  { id: 'd1', title: 'Bilanci sociali (cartella)', category: 'bilanci', is_published: true, sort: 10, doc_date: null,
    url: 'https://drive.google.com/folderview?id=1k64QhLceVAv-h5DJNsDSuhuhccBASHMA' },
  { id: 'd2', title: 'Primo statuto (curiosità storica)', category: 'statuto', is_published: true, sort: 20, doc_date: null,
    url: 'https://drive.google.com/file/d/1LkrCz7R6zoZXE-YXMHtTWmTJekFtExep/view' },
  { id: 'd3', title: 'Modulo di iscrizione donatori', category: 'altri', is_published: true, sort: 10, doc_date: null,
    url: 'https://drive.google.com/file/d/1q2o4tb-rZJx8MA1-yqLnYZKM0Nhsv5Xz/view' },
]

// Edizioni del torneo di pallavolo con i link pubblicati sul vecchio sito.
export interface TorneoEdition { label: string; links: { name: string; url: string }[] }
export const TORNEO: TorneoEdition[] = [
  { label: 'VII Torneo — 2016', links: [
    { name: 'Album foto (Seconda Divisione)', url: 'https://www.facebook.com/1605087826422118/photos/?tab=album&album_id=1688383054759261' },
    { name: 'Album foto (Under 13)', url: 'https://www.facebook.com/1605087826422118/photos/?tab=album&album_id=1688375238093376' },
  ] },
  { label: 'VI Torneo — 2013', links: [
    { name: 'Album foto', url: 'https://www.facebook.com/media/set/?set=a.618676771483421.1073741832.274255115925590&type=1' },
    { name: 'Evento su Facebook', url: 'https://www.facebook.com/events/613137292049412' },
  ] },
  { label: 'Torneo — 2010', links: [{ name: 'Album foto', url: 'https://photos.app.goo.gl/L2C3YamnfpwDA7C98' }] },
  { label: 'II Torneo — 2008', links: [{ name: 'Album foto', url: 'https://photos.app.goo.gl/hPH3yuFquJRXJ2rw8' }] },
  { label: 'I Torneo — 2007', links: [{ name: 'Album foto', url: 'https://photos.app.goo.gl/SDH6pScdxgZexaWZ6' }] },
]

export const VALUES: { title: string; text: string }[] = [
  { title: 'Solidarietà', text: 'Donare è dire con i fatti che la vita di chi soffre ci sta a cuore.' },
  { title: 'Altruismo', text: 'Un gesto gratuito, anonimo e volontario che arriva a chi ne ha bisogno.' },
  { title: 'Volontariato', text: 'Persone che mettono tempo ed energie al servizio degli altri.' },
  { title: 'Amicizia', text: 'Stare insieme, a partire dai più giovani, è il nostro modo di fare comunità.' },
  { title: 'Responsabilità', text: 'Donatori periodici e consapevoli: una garanzia per chi dona e per chi riceve.' },
  { title: 'Comunità', text: 'Il sangue è un patrimonio collettivo da cui ognuno può attingere in caso di bisogno.' },
]
