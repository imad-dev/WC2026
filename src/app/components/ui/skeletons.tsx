import { Skeleton } from './skeleton'

export function StandingsSkeleton() {
  return (
    <div className="rounded overflow-hidden border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      <div className="border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="p-2 space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-12 grid grid-cols-[40px_1fr_repeat(8,40px)_120px] gap-2 items-center px-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-44" />
            {Array.from({ length: 8 }).map((__, statIndex) => (
              <Skeleton key={statIndex} className="h-5 w-8 justify-self-center" />
            ))}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((__, formIndex) => (
                <Skeleton key={formIndex} className="h-4 w-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden rounded border p-6 md:p-8" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-24" />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-14 flex-1" />
              <Skeleton className="h-16 w-16" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <Skeleton className="h-14 flex-1" />
              <Skeleton className="h-16 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-72" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="lg:col-span-5 space-y-3">
          <Skeleton className="h-4 w-40" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </section>
  )
}

export function KPIChipSkeleton() {
  return (
    <div className="rounded p-5 border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      <Skeleton className="h-5 w-5 mb-4" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-3 w-28 mt-2" />
      <Skeleton className="h-3 w-20 mt-1" />
    </div>
  )
}

export function MatchCardSkeleton() {
  return (
    <div className="rounded border overflow-hidden" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
      <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="p-4 space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function ScorerRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-10" />
    </div>
  )
}
