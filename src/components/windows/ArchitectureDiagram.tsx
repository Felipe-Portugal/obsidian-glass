import type { DiagramFlow, DiagramNode, DiagramSpec } from '../../data/types'
import { useLanguage } from '../../i18n/LanguageProvider'
import { brandStyle, TechGlyph } from '../ui/TechGlyph'
import './diagram.css'

function NodeLogos({ node }: { node: DiagramNode }) {
  if (!node.tech?.length) return null
  return (
    <span className="arch__logos" aria-hidden="true">
      {node.tech.map((id) => (
        <span key={id} className="arch__logo" style={brandStyle(id)}>
          <TechGlyph id={id} />
        </span>
      ))}
    </span>
  )
}

function Flow({ flow, labelId }: { flow: DiagramFlow; labelId: string }) {
  const { pick, t } = useLanguage()
  const List = flow.link === 'none' ? 'ul' : 'ol'
  return (
    <div className="arch__flow" data-link={flow.link} data-count={flow.nodes.length}>
      {flow.title && (
        <p className="arch__flow-title" id={labelId}>
          {pick(flow.title)}
        </p>
      )}
      <p className="sr-only">{pick(flow.summary)}</p>
      <List className="arch__nodes" {...(flow.title ? { 'aria-labelledby': labelId } : {})}>
        {flow.nodes.map((node) => (
          <li key={node.id} className={`arch__node arch__node--${node.kind ?? 'component'}`} data-contributed={node.contributed ? 'true' : undefined}>
            <span className="arch__head">
              <NodeLogos node={node} />
              <span className="arch__label">{pick(node.label)}</span>
            </span>
            {node.detail && <span className="arch__detail">{pick(node.detail)}</span>}
            {node.contributed && (
              <>
                <span className="arch__mark" aria-hidden="true" />
                <span className="sr-only"> {t.diagram.contributedSr}</span>
              </>
            )}
          </li>
        ))}
      </List>
    </div>
  )
}

/** Schéma d'architecture conceptuel, lisible au lecteur d'écran et réorganisé en colonne sur petit écran. */
export function ArchitectureDiagram({ spec, id }: { spec: DiagramSpec; id: string }) {
  const { pick, t } = useLanguage()
  const titleId = `${id}-arch-title`
  return (
    <figure className="arch" aria-labelledby={titleId}>
      <figcaption className="arch__caption">
        <span id={titleId} className="arch__title">
          {pick(spec.title)}
        </span>
        <span className="arch__desc">{pick(spec.description)}</span>
      </figcaption>

      <div className="arch__canvas">
        {spec.flows.map((flow) => (
          <Flow key={flow.id} flow={flow} labelId={`${id}-flow-${flow.id}`} />
        ))}

        {spec.groups?.map((group) => (
          <div key={group.id} className={`arch__group arch__group--${group.variant}`}>
            <p className="arch__group-title" id={`${id}-group-${group.id}`}>
              {pick(group.title)}
            </p>
            <ul className="arch__chips" aria-labelledby={`${id}-group-${group.id}`}>
              {group.nodes.map((node) => (
                <li key={node.id} className="arch__chip">
                  <NodeLogos node={node} />
                  <span>{pick(node.label)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="arch__foot">
        <ul className="arch__legend" aria-label={t.diagram.legendTitle}>
          {spec.legend.map((key) => (
            <li key={key} className={`legend legend--${key}`}>
              <span className="legend__swatch" aria-hidden="true" />
              <span>{t.diagram.legend[key]}</span>
            </li>
          ))}
        </ul>
        <p className="arch__note">{pick(spec.note)}</p>
      </div>
    </figure>
  )
}

