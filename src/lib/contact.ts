/** Sous-ensemble de SubmissionError (@formspree/core) utilisé ici ; facilite les tests. */
export interface SubmissionErrorLike {
  getFormErrors(): readonly { readonly code: string; readonly message: string }[]
  getFieldErrors(field: string): readonly { readonly code: string; readonly message: string }[]
}

export const LIMITS = {
  email: 254,
  subjectMin: 3,
  subjectMax: 120,
  messageMin: 10,
  messageMax: 4000,
} as const

export type ContactField = 'email' | 'subject' | 'message'
export type ContactValues = Record<ContactField, string>
export type FieldIssue = 'required' | 'invalid' | 'tooShort' | 'tooLong'
export type FieldIssues = Partial<Record<ContactField, FieldIssue>>
export type ServiceIssue = 'unavailable' | 'blocked' | 'empty' | 'network' | 'generic'

export const CONTACT_FIELDS: readonly ContactField[] = ['email', 'subject', 'message']

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Identifiant public du formulaire Formspree (pas un secret) ; vide = formulaire non configuré. */
export function formspreeId(): string | null {
  const raw = import.meta.env.VITE_FORMSPREE_ID?.trim()
  return raw && /^[A-Za-z0-9]+$/.test(raw) ? raw : null
}

export function validateContact(values: ContactValues, requireEmail = true): FieldIssues {
  const issues: FieldIssues = {}
  const email = values.email.trim()
  const subject = values.subject.trim()
  const message = values.message.trim()

  if (requireEmail) {
    if (!email) issues.email = 'required'
    else if (email.length > LIMITS.email) issues.email = 'tooLong'
    else if (!EMAIL_PATTERN.test(email)) issues.email = 'invalid'
  }

  if (!subject) issues.subject = 'required'
  else if (subject.length < LIMITS.subjectMin) issues.subject = 'tooShort'
  else if (subject.length > LIMITS.subjectMax) issues.subject = 'tooLong'

  if (!message) issues.message = 'required'
  else if (message.length < LIMITS.messageMin) issues.message = 'tooShort'
  else if (message.length > LIMITS.messageMax) issues.message = 'tooLong'

  return issues
}

export interface MappedSubmissionError {
  form: ServiceIssue | null
  fields: FieldIssues
  /** Message brut renvoyé par le service, affiché en complément lorsqu'il n'est pas déjà traduit. */
  detail: string | null
}

/** Traduit les codes d'erreur Formspree en problèmes affichables dans les deux langues. */
export function mapSubmissionError(
  error: SubmissionErrorLike,
  online: boolean = typeof navigator === 'undefined' ? true : navigator.onLine,
): MappedSubmissionError {
  const fields: FieldIssues = {}
  for (const field of CONTACT_FIELDS) {
    const [first] = error.getFieldErrors(field)
    if (!first) continue
    if (first.code === 'TYPE_EMAIL') fields[field] = 'invalid'
    else if (first.code === 'REQUIRED_FIELD_EMPTY' || first.code === 'REQUIRED_FIELD_MISSING') fields[field] = 'required'
    else fields[field] = 'invalid'
  }

  const [formError] = error.getFormErrors()
  let form: ServiceIssue | null = null
  let detail: string | null = null
  if (formError) {
    switch (formError.code) {
      case 'FORM_NOT_FOUND':
      case 'INACTIVE':
      case 'PROJECT_NOT_FOUND':
        form = 'unavailable'
        break
      case 'BLOCKED':
        form = 'blocked'
        break
      case 'EMPTY':
        form = 'empty'
        break
      default:
        form = online ? 'generic' : 'network'
        detail = online ? formError.message : null
    }
  } else if (Object.keys(fields).length === 0) {
    form = 'generic'
  }
  return { form, fields, detail }
}
