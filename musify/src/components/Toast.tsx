import { useAppStore } from '@/store'
import clsx from 'clsx'

export default function Toast() {
  const toast = useAppStore(s => s.toast)
  return (
    <div className={clsx(
      'fixed bottom-24 left-1/2 -translate-x-1/2 z-[999] pointer-events-none',
      'bg-s3 border border-white/10 text-tx px-[18px] py-[9px] rounded-lg',
      'text-xs font-medium whitespace-nowrap shadow-2xl',
      'transition-all duration-200',
      toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    )}>
      {toast}
    </div>
  )
}
