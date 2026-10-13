import { FileX2 } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search query or filter parameters to find relevant academic resources.',
  actionLabel,
  actionHref
}: EmptyStateProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-10 text-center my-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
        <FileX2 className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">{description}</p>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          {actionLabel}
        </a>
      )}
    </div>
  )
}
