export type Status = 'draft' | 'published'

export interface EventItem {
  id: string
  title: string
  summary: string | null
  description: string
  starts_at: string
  ends_at: string | null
  all_day: boolean
  location: string | null
  poster_url: string | null
  gallery: string[]
  external_url: string | null
  status: Status
}

export interface Attachment { name: string; url: string }

export interface NewsItem {
  id: string
  title: string
  summary: string | null
  body: string
  image_url: string | null
  attachments: Attachment[]
  external_url: string | null
  status: Status
  publish_at: string | null
  created_at: string
}

export type AlbumCategory = 'eventi' | 'manifestazioni' | 'coro' | 'scuola' | 'attivita' | 'storici'
export interface Album { id: string; title: string; category: AlbumCategory; sort: number }
export interface Photo { id: string; album_id: string; url: string; caption: string | null }

export type DocCategory = 'statuto' | 'atto' | 'bilanci' | 'attestazioni' | 'riconoscimenti' | 'altri'
export interface DocumentItem {
  id: string
  title: string
  category: DocCategory
  url: string
  doc_date: string | null
  is_published: boolean
  sort: number
}

export type TeamGroup = 'direttivo' | 'consigliere' | 'collaboratore'
export interface TeamMember {
  id: string
  full_name: string
  role: string
  group_name: TeamGroup
  bio: string | null
  photo_url: string | null
  sort: number
}

export interface Contacts {
  emails: string[]
  pec: string
  phone: string
  hours: string
  address: string
  map_query: string
  fiscal_code: string
}
export interface Socials { instagram: string; facebook: string; youtube: string }
export interface HomeContent {
  hero_image_url: string | null
  about_image_url: string | null
  activity_images: (string | null)[]
}
export interface Settings {
  contacts: Contacts
  socials: Socials
  home: HomeContent
  logo_url: string | null
}

export interface PageText { slug: string; title: string; body: string }
export interface ContactMessage { id: string; name: string; email: string; message: string; created_at: string }
