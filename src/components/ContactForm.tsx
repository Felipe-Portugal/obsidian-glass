import { createClient, isSubmissionError } from '@formspree/core'
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/LanguageProvider'
import {
  CONTACT_FIELDS,
  LIMITS,
  mapSubmissionError,
  validateContact,
  type ContactField,
  type ContactValues,
  type FieldIssue,
  type FieldIssues,
  type MappedSubmissionError,
} from '../lib/contact'

interface FieldProps {
  id: string
  label: string
  error: string | null
  extra?: ReactNode
  children: ReactNode
}

function Field({ id, label, error, extra, children }: FieldProps) {
  return (
    <div className="field" data-invalid={error ? 'true' : undefined}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {(error || extra) && (
        <div className="field__meta">
          {error && (
            <p className="field__error" id={`${id}-error`}>
              <AlertCircle aria-hidden="true" size={14} strokeWidth={2} />
              {error}
            </p>
          )}
          {extra}
        </div>
      )}
    </div>
  )
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

/**
 * Formulaire de contact envoyé par Formspree (@formspree/core, sans module Stripe).
 * Le succès affiché est celui confirmé par le service ; aucun envoi n'est simulé.
 */
export default function ContactForm({ formId, initialSubject }: { formId: string; initialSubject?: string }) {
  const { t } = useLanguage()
  const client = useMemo(() => createClient(), [])
  const [values, setValues] = useState<ContactValues>({ email: '', subject: initialSubject ?? '', message: '' })
  const [issues, setIssues] = useState<FieldIssues>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [serviceError, setServiceError] = useState<MappedSubmissionError | null>(null)
  const honeypot = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLElement>(null)
  const fieldRefs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({})

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const issueText = (field: ContactField, issue: FieldIssue | undefined): string | null => {
    if (!issue) return null
    const e = t.contact.errors
    if (field === 'email') {
      if (issue === 'required') return e.emailRequired
      if (issue === 'tooLong') return e.emailLong(LIMITS.email)
      return e.emailInvalid
    }
    if (field === 'subject') {
      if (issue === 'required') return e.subjectRequired
      if (issue === 'tooShort') return e.subjectShort(LIMITS.subjectMin)
      if (issue === 'tooLong') return e.subjectLong(LIMITS.subjectMax)
      return e.subjectRequired
    }
    if (issue === 'required') return e.messageRequired
    if (issue === 'tooShort') return e.messageShort(LIMITS.messageMin)
    if (issue === 'tooLong') return e.messageLong(LIMITS.messageMax)
    return e.messageRequired
  }

  const serviceText = (error: MappedSubmissionError): string => {
    const e = t.contact.errors
    switch (error.form) {
      case 'unavailable':
        return e.unavailable
      case 'blocked':
        return e.blocked
      case 'empty':
        return e.empty
      case 'network':
        return e.network
      case 'generic':
        return e.generic
      default:
        return e.summary
    }
  }

  const onChange = (field: ContactField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.target.value }
    setValues(next)
    if (attempted || issues[field]) setIssues((current) => ({ ...current, [field]: validateContact(next)[field] }))
  }

  const onBlur = (field: ContactField) => () => {
    if (!values[field].trim() && !attempted) return
    setIssues((current) => ({ ...current, [field]: validateContact(values)[field] }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return
    setAttempted(true)
    const found = validateContact(values)
    setIssues(found)
    const firstInvalid = CONTACT_FIELDS.find((field) => found[field])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
      return
    }

    setStatus('submitting')
    setServiceError(null)
    const subject = values.subject.trim()
    const result = await client.submitForm(formId, {
      email: values.email.trim(),
      subject,
      message: values.message.trim(),
      _subject: `Portfolio · ${subject}`,
      _gotcha: honeypot.current?.value ?? '',
    })

    if (isSubmissionError(result)) {
      const mapped = mapSubmissionError(result)
      setIssues((current) => ({ ...current, ...mapped.fields }))
      setServiceError(mapped)
      setStatus('error')
      const firstServerInvalid = CONTACT_FIELDS.find((field) => mapped.fields[field])
      if (firstServerInvalid) fieldRefs.current[firstServerInvalid]?.focus()
      return
    }
    setStatus('success')
  }

  const reset = () => {
    setValues({ email: values.email, subject: '', message: '' })
    setIssues({})
    setAttempted(false)
    setServiceError(null)
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <section className="form-success" aria-labelledby="contact-success-title" tabIndex={-1} ref={successRef}>
        <CheckCircle2 aria-hidden="true" size={22} strokeWidth={1.75} />
        <p className="form-success__title" id="contact-success-title">
          {t.contact.success.title}
        </p>
        <p>{t.contact.success.body}</p>
        <button type="button" className="button button--quiet" onClick={reset}>
          {t.contact.success.again}
        </button>
      </section>
    )
  }

  const describe = (field: ContactField, extra?: string) => {
    const ids = [issues[field] ? `contact-${field}-error` : null, extra].filter(Boolean)
    return ids.length ? ids.join(' ') : undefined
  }
  const submitting = status === 'submitting'

  return (
    <form className="form" noValidate onSubmit={onSubmit} aria-describedby="contact-required">
      <p className="form__hint" id="contact-required">
        {t.contact.form.allRequired}
      </p>

      <Field id="contact-email" label={t.contact.form.email} error={issueText('email', issues.email)}>
        <input
          ref={(element) => {
            fieldRefs.current.email = element
          }}
          id="contact-email"
          className="input"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          maxLength={LIMITS.email}
          value={values.email}
          onChange={onChange('email')}
          onBlur={onBlur('email')}
          aria-invalid={issues.email ? true : undefined}
          aria-describedby={describe('email')}
        />
      </Field>

      <Field id="contact-subject" label={t.contact.form.subject} error={issueText('subject', issues.subject)}>
        <input
          ref={(element) => {
            fieldRefs.current.subject = element
          }}
          id="contact-subject"
          className="input"
          type="text"
          name="subject"
          autoComplete="off"
          required
          minLength={LIMITS.subjectMin}
          maxLength={LIMITS.subjectMax}
          value={values.subject}
          onChange={onChange('subject')}
          onBlur={onBlur('subject')}
          aria-invalid={issues.subject ? true : undefined}
          aria-describedby={describe('subject')}
        />
      </Field>

      <Field
        id="contact-message"
        label={t.contact.form.message}
        error={issueText('message', issues.message)}
        extra={
          <p className="field__count" id="contact-message-count">
            {t.contact.form.counter(values.message.length, LIMITS.messageMax)}
          </p>
        }
      >
        <textarea
          ref={(element) => {
            fieldRefs.current.message = element
          }}
          id="contact-message"
          className="input input--area"
          name="message"
          rows={5}
          required
          minLength={LIMITS.messageMin}
          maxLength={LIMITS.messageMax}
          value={values.message}
          onChange={onChange('message')}
          onBlur={onBlur('message')}
          aria-invalid={issues.message ? true : undefined}
          aria-describedby={describe('message', 'contact-message-count')}
        />
      </Field>

      {/* Champ piège anti-robots de Formspree : invisible et hors de la navigation clavier. */}
      <div className="form__trap" aria-hidden="true">
        <label htmlFor="contact-gotcha">{t.contact.form.honeypot}</label>
        <input id="contact-gotcha" ref={honeypot} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' && serviceError?.form && (
        <div className="form__alert" role="alert">
          <AlertCircle aria-hidden="true" size={16} strokeWidth={2} />
          <div>
            <p>{serviceText(serviceError)}</p>
            {serviceError.detail && (
              <p className="form__detail">
                {t.contact.errors.serviceDetail} <span lang="en">{serviceError.detail}</span>
              </p>
            )}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
        </div>
      )}

      <div className="form__actions">
        <button type="submit" className="button button--primary" aria-disabled={submitting || undefined}>
          {submitting ? (
            <LoaderCircle className="spin" aria-hidden="true" size={16} strokeWidth={2} />
          ) : (
            <Send aria-hidden="true" size={16} strokeWidth={2} />
          )}
          <span>{submitting ? t.contact.form.submitting : t.contact.form.submit}</span>
        </button>
        <output className="sr-only">{submitting ? t.contact.form.submitting : ''}</output>
        <p className="form__privacy">{t.contact.form.privacy}</p>
      </div>
    </form>
  )
}
