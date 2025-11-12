'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  query: string
  onQueryChange: (value: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
  onPrintSelected: () => void
  onPrintAll: () => void
  selectedCount: number
  totalVisible: number
}

export function SubmissionsToolbar({
  query,
  onQueryChange,
  onSelectAll,
  onClearSelection,
  onPrintSelected,
  onPrintAll,
  selectedCount,
  totalVisible,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm shadow-slate-900/5 backdrop-blur print:hidden lg:flex-row lg:items-end lg:justify-between">
      <div className="w-full lg:max-w-md">
        <label className="text-sm font-medium text-slate-600">ค้นหา</label>
        <Input
          placeholder="ชื่อบริษัท, ผู้เข้าอบรม หรือหมายเลขบัตร"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSelectAll} disabled={totalVisible === 0}>
          เลือกทั้งหมด
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          ล้างการเลือก
        </Button>
        <Button
          size="sm"
          onClick={onPrintSelected}
          disabled={selectedCount === 0}
        >
          พิมพ์ที่เลือก ({selectedCount})
        </Button>
        <Button size="sm" variant="primary" onClick={onPrintAll} disabled={totalVisible === 0}>
          พิมพ์ทั้งหมด ({totalVisible})
        </Button>
      </div>
    </div>
  )
}

