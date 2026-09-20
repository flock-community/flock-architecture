import clsx from 'clsx';
import styles from './styles.module.css';

/*
 * The picture the whole site is built on: parts of a business drawn as circles
 * that never overlap.
 *
 *   inside   the disc               Domain isolation
 *   edge     the ring and its ports Specified contracts
 *   between  the travelling dots    Event-driven
 *
 * `highlight` lights one of these roles and dims the other two.
 */

const round = (n) => Math.round(n * 10) / 10;

// A link runs from the contract ring of one domain to the ring of another.
function linkGeometry(from, to, ringGap) {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const distance = Math.hypot(dx, dy);
  const ux = dx / distance;
  const uy = dy / distance;
  const x1 = from.cx + ux * (from.r + ringGap);
  const y1 = from.cy + uy * (from.r + ringGap);
  const x2 = to.cx - ux * (to.r + ringGap);
  const y2 = to.cy - uy * (to.r + ringGap);
  return {x1, y1, x2, y2, length: Math.hypot(x2 - x1, y2 - y1)};
}

function Scene({
  viewBox,
  domains,
  links,
  callouts = [],
  highlight = 'all',
  animated = true,
  showLabels = false,
  onBlack = false,
  ringGap = 16,
  dotRadius = 4,
  portRadius = 5.5,
  dotSpacing = 85,
  speed = 26,
  label,
  className,
}) {
  const byId = Object.fromEntries(domains.map((d) => [d.id, d]));
  const geometry = links.map(([from, to]) =>
    linkGeometry(byId[from], byId[to], ringGap),
  );

  return (
    <svg
      className={clsx(
        styles.scene,
        animated && styles.animated,
        onBlack && styles.onBlack,
        className,
      )}
      data-highlight={highlight}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      {...(label ? {role: 'img', 'aria-label': label} : {'aria-hidden': true})}>
      <g className={styles.links}>
        {geometry.map((g, i) => (
          <line
            key={i}
            x1={round(g.x1)}
            y1={round(g.y1)}
            x2={round(g.x2)}
            y2={round(g.y2)}
          />
        ))}
      </g>

      <g className={styles.dots}>
        {geometry.map((g, i) => {
          const count = Math.max(2, Math.round(g.length / dotSpacing));
          return Array.from({length: count}, (_, n) => (
            <circle
              key={`${i}-${n}`}
              cx={round(g.x1)}
              cy={round(g.y1)}
              r={dotRadius}
              style={{
                '--dx': `${round(g.x2 - g.x1)}px`,
                '--dy': `${round(g.y2 - g.y1)}px`,
                '--p': round((n + 0.5) / count),
                '--dur': `${round(g.length / speed)}s`,
              }}
            />
          ));
        })}
      </g>

      {domains.map((d) => (
        <g key={d.id}>
          <circle className={styles.ring} cx={d.cx} cy={d.cy} r={d.r + ringGap} />
          <circle className={styles.disc} cx={d.cx} cy={d.cy} r={d.r} />
          {showLabels && (
            <text className={styles.domainLabel} x={d.cx} y={d.cy} dy="0.35em">
              {d.label}
            </text>
          )}
        </g>
      ))}

      <g className={styles.ports}>
        {geometry.map((g, i) => (
          <g key={i}>
            <circle cx={round(g.x1)} cy={round(g.y1)} r={portRadius} />
            <circle cx={round(g.x2)} cy={round(g.y2)} r={portRadius} />
          </g>
        ))}
      </g>

      {callouts.length > 0 && (
        <g className={styles.callouts}>
          {callouts.map((c) => (
            <g key={c.text}>
              <polyline points={c.line.map((p) => p.join(',')).join(' ')} />
              <circle
                className={clsx(c.onDisc && styles.onDisc)}
                cx={c.line[0][0]}
                cy={c.line[0][1]}
                r="3.5"
              />
              <text x={c.x} y={c.y} textAnchor={c.anchor ?? 'start'}>
                {c.text}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

// A web shop, the example used throughout the site.
const SHOP_DOMAINS = [
  {id: 'customers', label: 'Customers', cx: 150, cy: 262, r: 66},
  {id: 'checkout', label: 'Checkout', cx: 430, cy: 170, r: 92},
  {id: 'payments', label: 'Payments', cx: 640, cy: 318, r: 60},
  {id: 'shipping', label: 'Shipping', cx: 860, cy: 160, r: 78},
  {id: 'warehouse', label: 'Warehouse', cx: 1068, cy: 300, r: 58},
];

const SHOP_LINKS = [
  ['customers', 'checkout'],
  ['checkout', 'payments'],
  ['checkout', 'shipping'],
  ['payments', 'warehouse'],
  ['shipping', 'warehouse'],
];

// Each callout: a leader line from the thing it names to its label.
const SHOP_CALLOUTS = [
  {
    text: 'Domain isolation',
    onDisc: true,
    line: [[384, 112], [322, 50], [292, 50]],
    x: 282,
    y: 56,
    anchor: 'end',
  },
  {
    text: 'Specified contracts',
    line: [[932, 100], [982, 50], [1000, 50]],
    x: 1010,
    y: 56,
  },
  {
    text: 'Event-driven',
    line: [[841, 310], [876, 376], [894, 376]],
    x: 904,
    y: 382,
  },
];

export function HeroScene({className}) {
  return (
    <Scene
      className={className}
      onBlack
      viewBox="0 0 1200 420"
      domains={SHOP_DOMAINS}
      links={SHOP_LINKS}
      callouts={SHOP_CALLOUTS}
      showLabels
      label="Five parts of a web shop drawn as circles that never overlap. Each circle is a domain, the ring around it is its contract, and the dots travelling between the rings are events."
    />
  );
}

const GLYPH_DOMAINS = [
  {id: 'a', cx: 84, cy: 92, r: 44},
  {id: 'b', cx: 292, cy: 72, r: 32},
];

// The same picture up close, with one role lit: 'inside', 'edge' or 'between'.
export function PillarGlyph({highlight, className}) {
  return (
    <Scene
      className={className}
      onBlack
      viewBox="0 0 360 170"
      domains={GLYPH_DOMAINS}
      links={[['a', 'b']]}
      highlight={highlight}
      animated={highlight === 'between'}
      ringGap={12}
      dotRadius={3.5}
      portRadius={5}
      dotSpacing={36}
      speed={18}
    />
  );
}
