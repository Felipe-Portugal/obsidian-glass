import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it } from 'vitest'
import { App } from '../App'
import type { Lang } from '../data/types'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { ThemeProvider } from '../theme/ThemeProvider'

function renderApp(lang: Lang = 'fr') {
  // Même arbre que main.tsx, StrictMode compris : son double montage a déjà fermé des fenêtres.
  return render(
    <StrictMode>
      <ThemeProvider>
        <LanguageProvider initial={lang}>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </StrictMode>,
  )
}

const headings = (level: number) => screen.getAllByRole('heading', { level }).map((node) => node.textContent)

describe('page', () => {
  it('présente le profil et les sections attendues, dans l’ordre', () => {
    renderApp('fr')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Felipe Portugal.')
    expect(screen.getByText('Développeur logiciel polyvalent')).toBeTruthy()
    expect(headings(2)).toEqual(['Projets', 'Expérience', 'Formation', 'Compétences', 'Contact'])
    expect(document.documentElement.lang).toBe('fr')
  })

  it('bascule en anglais sans rechargement et mémorise le choix', () => {
    renderApp('fr')
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(headings(2)).toEqual(['Projects', 'Experience', 'Education', 'Skills', 'Contact'])
    expect(document.documentElement.lang).toBe('en')
    expect(window.localStorage.getItem('og-lang')).toBe('en')
    expect(document.title).toMatch(/Versatile software developer/)
  })

  it('mémorise un thème manuel et oublie le mode automatique', () => {
    renderApp('fr')
    fireEvent.click(screen.getByRole('button', { name: 'Thème sombre' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('og-theme')).toBe('dark')
    fireEvent.click(screen.getByRole('button', { name: /Thème automatique/ }))
    expect(window.localStorage.getItem('og-theme')).toBeNull()
  })

  it('n’a aucun lien fictif et sécurise les liens externes', () => {
    renderApp('fr')
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href') ?? ''
      expect(href, link.textContent ?? '').not.toBe('#')
      expect(href).not.toBe('')
      if (link.getAttribute('target') === '_blank') expect(link.getAttribute('rel')).toMatch(/noopener/)
    }
  })

  it('donne un nom accessible à chaque bouton', () => {
    renderApp('en')
    for (const button of screen.getAllByRole('button')) {
      const name = button.getAttribute('aria-label') ?? button.textContent ?? ''
      expect(name.trim(), button.outerHTML.slice(0, 80)).not.toBe('')
    }
  })

  it('ouvre le formulaire avec une demande de CV préremplie, sans faux téléchargement', async () => {
    renderApp('fr')
    fireEvent.click(screen.getByRole('button', { name: 'Demander le CV' }))
    const dialog = await screen.findByRole('dialog', { name: 'Me contacter' }, { timeout: 3000 })
    expect((await within(dialog).findByRole('textbox', { name: 'Sujet' }) as HTMLInputElement).value).toBe('Demande de CV')
  })
})

describe('logos des compétences', () => {
  it('sont nommés, regroupés en barres d’outils et parcourables aux flèches', () => {
    renderApp('fr')
    const toolbar = screen.getByRole('toolbar', { name: 'Langages' })
    const tiles = within(toolbar).getAllByRole('button')
    expect(tiles.map((tile) => tile.getAttribute('aria-label'))).toContain('Python')
    expect(tiles.filter((tile) => tile.tabIndex === 0)).toHaveLength(1)

    tiles[0]?.focus()
    fireEvent.keyDown(toolbar, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(tiles[1])
    fireEvent.keyDown(toolbar, { key: 'End' })
    expect(document.activeElement).toBe(tiles.at(-1))
  })

  it('affichent leur nom au toucher', () => {
    renderApp('fr')
    const tile = within(screen.getByRole('toolbar', { name: 'Langages' })).getByRole('button', { name: 'Rust' })
    fireEvent.pointerDown(tile, { pointerType: 'touch' })
    fireEvent.click(tile)
    expect(tile.dataset.visible).toBe('true')
    expect(tile.querySelector('.tip')?.textContent).toBe('Rust')
  })

  it('restent sur les tuiles de projet, sans ouvrir l’étude de cas', () => {
    renderApp('fr')
    const toolbar = screen.getByRole('toolbar', { name: 'Technologies principales, Gestion des stationnements' })
    fireEvent.click(within(toolbar).getByRole('button', { name: 'PostgreSQL' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('fenêtres', () => {
  it('ouvrent une étude de cas nommée, à onglets, puis rendent le focus à la fermeture', async () => {
    renderApp('fr')
    const opener = screen.getByRole('button', { name: /Ouvrir l’étude de cas\s*: Gestion des stationnements/ })
    opener.focus()
    fireEvent.click(opener)

    const dialog = await screen.findByRole('dialog', { name: 'Gestion des stationnements' })
    const closeButton = within(dialog).getByRole('button', { name: /Fermer/ })
    expect(closeButton.textContent).toBe('')
    expect(closeButton.querySelector('svg')).toBeTruthy()
    expect(within(dialog).getByRole('heading', { name: 'Défi technique' })).toBeTruthy()
    expect(document.activeElement).toBe(within(dialog).getByRole('heading', { level: 2, name: 'Gestion des stationnements' }))
    // Les onglets : l'architecture n'est rendue qu'une fois son onglet choisi.
    expect(within(dialog).queryByRole('figure')).toBeNull()
    fireEvent.mouseDown(within(dialog).getByRole('tab', { name: 'Architecture' }))
    expect(within(dialog).getByRole('figure', { name: 'Architecture conceptuelle' })).toBeTruthy()
    expect(opener.getAttribute('aria-expanded')).toBe('true')

    // Le double montage de StrictMode ne doit pas refermer la fenêtre.
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(screen.getByRole('dialog', { name: 'Gestion des stationnements' })).toBeTruthy()

    fireEvent.click(closeButton)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(opener.getAttribute('aria-expanded')).toBe('false')
    await waitFor(() => expect(document.activeElement).toBe(opener))
  })

  it('détaillent une période d’expérience dans la même structure, onglets et logos compris', async () => {
    renderApp('fr')
    const row = screen.getByRole('button', { name: /Conseiller technique – Systèmes embarqués/ })
    expect(row.getAttribute('aria-haspopup')).toBe('dialog')
    fireEvent.click(row)

    const dialog = await screen.findByRole('dialog', { name: 'Conseiller technique – Systèmes embarqués' })
    expect(within(dialog).getByRole('tablist', { name: 'Sections de la période' })).toBeTruthy()
    expect(within(dialog).getByText(/pytest, incluant des tests de charge/)).toBeTruthy()
    expect(row.getAttribute('aria-expanded')).toBe('true')

    fireEvent.mouseDown(within(dialog).getByRole('tab', { name: 'Technologies' }))
    const chips = within(dialog).getByRole('list', { name: 'Technologies et outils nommés dans ces réalisations.' })
    expect(within(chips).getByText('Rust')).toBeTruthy()
    expect(within(chips).getByText('pytest')).toBeTruthy()

    // Ouverte d'un clic, sans focus préalable : le focus revient quand même à la rangée.
    fireEvent.keyDown(dialog, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(row.getAttribute('aria-expanded')).toBe('false')
    await waitFor(() => expect(document.activeElement).toBe(row))
  })

  it('situent les deux rôles d’une même période dans l’en-tête', async () => {
    renderApp('en')
    fireEvent.click(screen.getByRole('button', { name: /Industrial Data Visualization Assistant Developer/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Industrial Data Visualization Assistant Developer' })
    expect(within(dialog).getByText('Work across the whole period, from January to September 2025.')).toBeTruthy()
    expect(within(dialog).getByText('Industrial Data Visualization Developer Intern')).toBeTruthy()
    expect(within(dialog).getByText('Jan. – May 2025')).toBeTruthy()
  })

  it('se ferment avec Échap', async () => {
    renderApp('en')
    fireEvent.click(screen.getByRole('button', { name: /Open the case study\s*: Boston Dynamics Spot robotics/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Boston Dynamics Spot robotics' })
    fireEvent.keyDown(dialog, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('ouvre le formulaire depuis la section Contact et valide les champs avant de préparer un courriel', async () => {
    renderApp('fr')
    fireEvent.click(screen.getByRole('button', { name: 'Écrire un message' }))
    const dialog = await screen.findByRole('dialog', { name: 'Me contacter' }, { timeout: 3000 })
    expect(await within(dialog).findByText(/prépare un courriel/, {}, { timeout: 3000 })).toBeTruthy()
    const emailLink = within(dialog).getByRole('link', { name: 'Ouvrir mon application courriel' })
    fireEvent.click(emailLink)
    expect(within(dialog).getByText('Indiquez votre adresse courriel.')).toBeTruthy()
    expect(within(dialog).getByText('Indiquez un sujet.')).toBeTruthy()

    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Votre courriel' }), { target: { value: 'recruteur@example.com' } })
    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Sujet' }), { target: { value: 'Stage hiver' } })
    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Message' }), { target: { value: 'Bonjour Felipe, votre profil nous intéresse.' } })
    const draft = new URL(emailLink.getAttribute('href') ?? '')
    expect(draft.protocol).toBe('mailto:')
    expect(draft.searchParams.get('subject')).toBe('Stage hiver')
    expect(draft.searchParams.get('body')).toContain('recruteur@example.com')
    expect(draft.searchParams.get('body')).toContain('Bonjour Felipe, votre profil nous intéresse.')
  })
})
