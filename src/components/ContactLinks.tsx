import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'
import { notify } from '../lib/notify'
import { Tip } from './Tip'

/** Copie l'adresse courriel ; la confirmation (ou l'échec) s'annonce dans un toast (Sonner). */
export function CopyButton({ value }: { value: string }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      notify(t.contact.copied)
      timer.current = window.setTimeout(() => setCopied(false), 2400)
    } catch {
      notify(t.contact.copyFailed)
    }
  }

  return (
    <Tip label={t.contact.copy}>
      <button type="button" className="icon-button" onClick={copy} aria-label={t.contact.copy} data-state={copied ? 'copied' : 'idle'}>
        {copied ? <Check aria-hidden="true" size={16} strokeWidth={2} /> : <Copy aria-hidden="true" size={16} strokeWidth={1.75} />}
      </button>
    </Tip>
  )
}
