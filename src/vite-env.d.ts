/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Identifiant public du formulaire Formspree (p. ex. « xyzabcd »), défini au build. */
  readonly VITE_FORMSPREE_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
