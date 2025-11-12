'use client'

import { cn } from '@/lib/utils'

type Props = {
  index: number
  question: string
  options: string[]
  value: number | null
  onChange: (value: number) => void
}

export function QuestionCard({ index, question, options, value, onChange }: Props) {
  return (
    <article className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm shadow-blue-500/10">
      <p className="font-medium text-slate-900">
        {index + 1}. {question}
      </p>

      <div className="mt-3 space-y-2 text-sm text-slate-700">
        {options.map((opt, optIndex) => (
          <label
            key={optIndex}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-white/60 px-3 py-2 transition hover:border-blue-200 hover:bg-white',
              value === optIndex && 'border-blue-400 bg-white shadow-sm shadow-blue-500/20'
            )}
          >
            <input
              type="radio"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              checked={value === optIndex}
              onChange={() => onChange(optIndex)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </article>
  )
}

