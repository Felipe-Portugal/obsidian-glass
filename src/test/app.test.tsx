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
    expect(headings(2)).toEqual(['Projets', 'Expérience', 'Compétences', 'Formation'])
    expect(document.documentElement.lang).toBe('fr')
  })

  it('bascule en anglais sans rechargement et mémorise le choix', () => {
    renderApp('fr')
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(headings(2)).toEqual(['Projects', 'Experience', 'Skills', 'Education'])
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
})

describe('fenêtres', () => {
  it('ouvrent une fiche projet nommée, puis rendent le focus à la fermeture', async () => {
    renderApp('fr')
    const opener = screen.getByRole('button', { name: /Voir la fiche\s*: Gestion des stationnements/ })
    opener.focus()
    fireEvent.click(opener)

    const dialog = await screen.findByRole('dialog', { name: 'Gestion des stationnements' })
    expect(within(dialog).getByRole('heading', { name: 'Défi technique' })).toBeTruthy()
    expect(within(dialog).getByRole('figure', { name: 'Architecture conceptuelle' })).toBeTruthy()
    expect(document.activeElement?.id).toBe('parking-window-title')

    // L'événement close différé du double montage ne doit pas refermer la fenêtre.
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(screen.getByRole('dialog', { name: 'Gestion des stationnements' })).toBeTruthy()

    fireEvent.click(within(dialog).getByRole('button', { name: /Fermer/ }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(opener)
  })

  it('se ferment avec Échap', async () => {
    renderApp('en')
    fireEvent.click(screen.getByRole('button', { name: /Open case study\s*: Boston Dynamics Spot robotics/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Boston Dynamics Spot robotics' })
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('proposent le CV sur demande et un repli courriel tant que le formulaire n’est pas configuré', async () => {
    renderApp('fr')
    fireEvent.click(screen.getByRole('button', { name: /CV sur demande/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Me contacter' })
    expect(within(dialog).getByText('Le formulaire en ligne n’est pas encore activé.')).toBeTruthy()
    const write = within(dialog).getByRole('link', { name: /Écrire un courriel/ })
    expect(write.getAttribute('href')).toBe(
      'mailto:felipe-alberto.padilla-portugal.1@ens.etsmtl.ca?subject=Demande%20de%20CV',
    )
    expect(within(dialog).queryByRole('button', { name: /Envoyer/ })).toBeNull()
  })
})
