import { Empty, ExtLink, PageHero, Section, Spinner } from '../components/ui'
import { fetchDocuments, useAsync } from '../lib/data'
import { fmtDate } from '../lib/format'
import type { DocCategory, DocumentItem } from '../lib/types'

export const DOC_LABEL: Record<DocCategory, string> = {
  statuto: 'Statuto', atto: 'Atto di fondazione', bilanci: 'Bilanci sociali',
  attestazioni: 'Attestazioni', riconoscimenti: 'Riconoscimenti', altri: 'Altri documenti associativi',
}

export function Documenti() {
  const { data: docs, loading } = useAsync(() => fetchDocuments(), [] as DocumentItem[])
  return (
    <>
      <PageHero eyebrow="Trasparenza" title="Documenti e trasparenza" text="Statuto, atto di fondazione, bilanci sociali e altri documenti ufficiali dell’associazione." />
      <Section>
        {loading ? <Spinner /> : docs.length === 0 ? <Empty title="Nessun documento disponibile" /> : (
          <div className="space-y-10">
            {(Object.keys(DOC_LABEL) as DocCategory[]).map((cat) => {
              const items = docs.filter((d) => d.category === cat)
              if (items.length === 0) return null
              return (
                <div key={cat}>
                  <h2 className="mb-4 text-2xl font-bold">{DOC_LABEL[cat]}</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((d) => (
                      <div key={d.id} className="card flex items-center justify-between gap-4 p-5">
                        <div>
                          <p className="font-display font-bold text-navy">{d.title}</p>
                          {d.doc_date && <p className="text-sm text-ink/65">{fmtDate(d.doc_date)}</p>}
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <ExtLink href={d.url} className="btn-red !min-h-[44px] !px-5 !py-2 !text-xs">Apri</ExtLink>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Section>
    </>
  )
}
