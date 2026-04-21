interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Failed to load data.', onRetry }: ErrorStateProps) {
  return (
    <div
      className="rounded border p-4 flex flex-col items-start gap-3"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--red-loss)' }}
    >
      <p className="text-sm" style={{ color: 'var(--white-muted)' }}>
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1.5 rounded text-xs font-semibold uppercase"
          style={{ background: 'var(--red-loss)', color: 'var(--white-primary)', letterSpacing: '0.06em' }}
        >
          Retry
        </button>
      )}
    </div>
  )
}
