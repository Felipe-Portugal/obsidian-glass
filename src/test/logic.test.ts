import { describe, expect, it } from 'vitest'
import { detectLanguage } from '../i18n/detect'
import { ui } from '../i18n/ui'
import { LIMITS, mapSubmissionError, validateContact, type SubmissionErrorLike } from '../lib/contact'
import { mailto } from '../lib/mailto'
import { resolveTheme } from '../theme/theme'

function shape(value: unknown): unknown {
  if (typeof value === 'function') return 'function'
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
  }
  return typeof value
}

function emptyStrings(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return value.trim() ? [] : [path]
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => emptyStrings(item, `${path}.${key}`))
  }
  return []
}

describe('traductions', () => {
  it('ont la même structure en français et en anglais', () => {
    expect(shape(ui.en)).toEqual(shape(ui.fr))
  })

  it('ne contiennent aucun libellé vide', () => {
    expect(emptyStrings(ui.fr)).toEqual([])
    expect(emptyStrings(ui.en)).toEqual([])
  })
})

describe('langue initiale', () => {
  it.each([
    [['fr-CA', 'en'], 'fr'],
    [['en-US'], 'en'],
    [['es-MX', 'en-CA'], 'en'],
    [['es-ES', 'de'], 'fr'],
    [[], 'fr'],
  ] as const)('%j → %s', (preferences, expected) => {
    expect(detectLanguage(preferences)).toBe(expected)
  })
})

describe('thème', () => {
  it('suit le système en mode automatique et respecte le choix manuel', () => {
    expect(resolveTheme('auto', true)).toBe('dark')
    expect(resolveTheme('auto', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})

describe('validation du formulaire de contact', () => {
  const valid = { email: 'recruteur@example.com', subject: 'Stage hiver', message: 'Bonjour, votre profil nous intéresse.' }

  it('accepte un message complet', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('signale les champs vides, trop courts, trop longs ou invalides', () => {
    expect(validateContact({ email: '', subject: '', message: '' })).toEqual({
      email: 'required',
      subject: 'required',
      message: 'required',
    })
    expect(validateContact({ ...valid, email: 'pas-une-adresse' }).email).toBe('invalid')
    expect(validateContact({ ...valid, subject: 'ok' }).subject).toBe('tooShort')
    expect(validateContact({ ...valid, message: 'Court' }).message).toBe('tooShort')
    expect(validateContact({ ...valid, message: 'x'.repeat(LIMITS.messageMax + 1) }).message).toBe('tooLong')
  })
})

describe('courriel préparé sans service de formulaire', () => {
  it('encode le sujet et le message dans un lien mailto', () => {
    const url = new URL(mailto('Demande de CV', 'Courriel de réponse: recruteur@example.com\n\nBonjour Felipe.'))
    expect(url.protocol).toBe('mailto:')
    expect(url.searchParams.get('subject')).toBe('Demande de CV')
    expect(url.searchParams.get('body')).toBe('Courriel de réponse: recruteur@example.com\n\nBonjour Felipe.')
  })
})

describe('erreurs renvoyées par Formspree', () => {
  const error = (
    form: { code: string; message: string }[],
    fields: Record<string, { code: string; message: string }[]> = {},
  ): SubmissionErrorLike => ({
    getFormErrors: () => form,
    getFieldErrors: (field) => fields[field] ?? [],
  })

  it('traduit les codes connus', () => {
    expect(mapSubmissionError(error([{ code: 'INACTIVE', message: 'Form not active' }])).form).toBe('unavailable')
    expect(mapSubmissionError(error([{ code: 'BLOCKED', message: 'Blocked' }])).form).toBe('blocked')
    expect(
      mapSubmissionError(error([], { email: [{ code: 'TYPE_EMAIL', message: 'should be an email' }] })).fields,
    ).toEqual({ email: 'invalid' })
  })

  it('distingue une panne réseau d’une erreur inconnue du service', () => {
    const unknown = error([{ code: 'UNSPECIFIED', message: 'Failed to fetch' }])
    expect(mapSubmissionError(unknown, false)).toEqual({ form: 'network', fields: {}, detail: null })
    expect(mapSubmissionError(unknown, true)).toEqual({ form: 'generic', fields: {}, detail: 'Failed to fetch' })
  })
})
