'use client'

import { Input } from '@/components/ui/input'

type OptionsEditorProps = {
  name: string
  options: string[]
  correctIndex: number
  onOptionChange: (index: number, value: string) => void
  onCorrectChange: (index: number) => void
}

export function OptionsEditor({ name, options, correctIndex, onOptionChange, onCorrectChange }: OptionsEditorProps) {
  return (
    <div className="space-y-2">
      {options.map((value, index) => (
        <div key={index} className="flex items-center gap-3">
          <Input
            className="flex-1"
            placeholder={`ตัวเลือกที่ ${index + 1}`}
            value={value}
            onChange={(event) => onOptionChange(index, event.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="radio"
              name={name}
              checked={correctIndex === index}
              onChange={() => onCorrectChange(index)}
            />
            เฉลย
          </label>
        </div>
      ))}
    </div>
  )
}

