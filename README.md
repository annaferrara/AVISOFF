# AVIS Casorate Primo — nuovo sito

React + TypeScript + Tailwind CSS + Supabase. Sito pubblico semplice (4 voci di menu + "Diventa donatore", home a 5 sezioni) e pannello admin protetto da login in `/admin`.

## Avvio

```bash
npm install
cp .env.example .env.local     # inserisci URL e anon key del progetto Supabase
npm run dev
```

Senza `.env.local` il sito funziona comunque con i contenuti ripresi dal vecchio sito (direttivo, soci fondatori, contatti, social, giornate di donazione 2026, documenti noti); il pannello admin richiede invece Supabase.

## Configurare Supabase (una volta sola)

1. Crea un progetto su supabase.com.
2. In **SQL Editor** esegui, in ordine, `supabase/migrations/001_schema.sql` (tabelle, Row Level Security, bucket `media`) e `002_seed.sql` (dati iniziali dal vecchio sito).
3. In **Authentication → Users** crea l'utente amministratore (email + password), poi in SQL Editor:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'email-admin@esempio.it';
   ```
4. In **Authentication → Providers** disattiva le registrazioni libere ("Allow new users to sign up"): gli admin si creano solo da dashboard.
5. Copia *Project URL* e *anon public key* in `.env.local`. Non usare mai la `service_role` key nel frontend.

## Sicurezza

- Lettura pubblica solo di eventi/news **pubblicati** (le news programmate compaiono dalla data scelta), foto, documenti visibili, direttivo, testi.
- Scrittura solo per chi è nella tabella `admins` (funzione `is_admin()`), anche sullo storage.
- I messaggi del modulo contatti: chiunque può inviarli, solo gli admin possono leggerli.

## Pubblicazione

`npm run build` genera `dist/`. Essendo una SPA con `BrowserRouter`, l'hosting deve reindirizzare tutte le rotte a `index.html` (Netlify, Vercel, Cloudflare Pages lo permettono; su GitHub Pages serve un `404.html` identico a `index.html`).

## Da completare con l'associazione

- **Logo ufficiale AVIS**: oggi c'è una goccia stilizzata; caricalo da Admin → Contatti e home.
- **Fotografie** (hero, chi siamo, card attività, galleria, direttivo): da caricare dal pannello.
- **Statuto 2022 e Atto costitutivo**: sul vecchio sito sono PDF incorporati da Google Drive senza link pubblico recuperabile; caricali da Admin → Documenti.
- **Indirizzo della sede e mappa**: il vecchio sito indica solo "all'interno dell'Ospedale Carlo Mira"; verifica l'indirizzo in Admin → Contatti e home.
- **Privacy e Cookie Policy**: testi base da far verificare, modificabili da Admin → Testi delle pagine.
- Pagine del vecchio sito non importate: *Humor*, *Dagli Studenti per l'Avis*, *La Preghiera del Donatore* (solo immagine), le singole pagine foto del coro.
