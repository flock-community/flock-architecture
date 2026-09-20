import clsx from 'clsx';
import styles from './styles.module.css';

/*
 * Figures for the Domain isolation deep dive. They speak the language of the
 * picture on the homepage: a domain is a yellow disc, and discs never overlap.
 */

const round = (n) => Math.round(n * 10) / 10;

function Figure({caption, children}) {
  return (
    <figure className={styles.figure}>
      {children}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

// A straight arrow: a line with a solid head at (x2, y2).
function Arrow({x1, y1, x2, y2, head = 10}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  // Where the head starts, and half its width there
  const bx = x2 - cos * head;
  const by = y2 - sin * head;
  const wx = -sin * head * 0.45;
  const wy = cos * head * 0.45;
  const points = [
    [x2, y2],
    [bx + wx, by + wy],
    [bx - wx, by - wy],
  ];
  return (
    <g className={styles.arrow}>
      <line x1={round(x1)} y1={round(y1)} x2={round(bx)} y2={round(by)} />
      <polygon points={points.map(([x, y]) => `${round(x)},${round(y)}`).join(' ')} />
    </g>
  );
}

// A label below the picture, tied to the thing it names by a leader line.
function Callout({x, fromY, toY, text, onDisc = false}) {
  return (
    <g className={styles.callout}>
      <line x1={x} y1={fromY} x2={x} y2={toY} />
      <circle className={clsx(onDisc && styles.onDisc)} cx={x} cy={fromY} r="3.5" />
      <text x={x} y={toY + 21}>
        {text}
      </text>
    </g>
  );
}

const CORE = {cx: 200, cy: 150, r: 64};
const BOX = {width: 124, height: 40};

// The technology around a domain, one box in each corner of the picture.
const SURROUNDINGS = [
  {label: 'Web API', x: 4, y: 6},
  {label: 'Messaging', x: 272, y: 6},
  {label: 'Database', x: 4, y: 254},
  {label: 'Other systems', x: 272, y: 254},
];

// From the corner of a box that faces the domain to just outside the disc.
function spoke({x, y}) {
  const fromX = x < CORE.cx ? x + BOX.width : x;
  const fromY = y < CORE.cy ? y + BOX.height : y;
  const distance = Math.hypot(CORE.cx - fromX, CORE.cy - fromY);
  const ux = (CORE.cx - fromX) / distance;
  const uy = (CORE.cy - fromY) / distance;
  return {
    x1: fromX + ux * 5,
    y1: fromY + uy * 5,
    x2: CORE.cx - ux * (CORE.r + 7),
    y2: CORE.cy - uy * (CORE.r + 7),
  };
}

export function DependencyFigure() {
  return (
    <Figure caption="Each arrow reads as “depends on”.">
      <svg
        className={clsx(styles.svg, styles.dependency)}
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A domain drawn as a disc, with a web API, messaging, a database and other systems around it. An arrow points from each of them to the domain, and no arrow leaves the domain.">
        {SURROUNDINGS.map((s) => (
          <g key={s.label}>
            <rect
              className={styles.box}
              x={s.x}
              y={s.y}
              width={BOX.width}
              height={BOX.height}
            />
            <text
              className={styles.boxLabel}
              x={s.x + BOX.width / 2}
              y={s.y + BOX.height / 2}
              dy="0.35em">
              {s.label}
            </text>
            <Arrow {...spoke(s)} />
          </g>
        ))}
        <circle className={styles.disc} cx={CORE.cx} cy={CORE.cy} r={CORE.r} />
        <text className={styles.discLabel} x={CORE.cx} y={CORE.cy} dy="0.35em">
          Domain
        </text>
      </svg>
    </Figure>
  );
}

// The part of two overlapping circles that belongs to both: two arcs between
// the points where the circles cross. The circles have the same radius and sit
// on one horizontal line.
function lens(a, b) {
  const x = (a.cx + b.cx) / 2;
  const half = Math.sqrt(a.r ** 2 - ((b.cx - a.cx) / 2) ** 2);
  const top = round(a.cy - half);
  const bottom = round(a.cy + half);
  return `M${x} ${top} A${a.r} ${a.r} 0 0 0 ${x} ${bottom} A${a.r} ${a.r} 0 0 0 ${x} ${top} Z`;
}

const OVERLAPPING = [
  {label: 'Checkout', cx: 116, cy: 92, r: 68, labelX: 90},
  {label: 'Shipping', cx: 204, cy: 92, r: 68, labelX: 230},
];

const ISOLATED = [
  {label: 'Checkout', cx: 56, cy: 92, r: 50, labelX: 56},
  {label: 'Shipping', cx: 264, cy: 92, r: 50, labelX: 264},
];

function Discs({discs}) {
  return (
    <>
      {discs.map((d) => (
        <circle key={d.label} className={styles.disc} cx={d.cx} cy={d.cy} r={d.r} />
      ))}
    </>
  );
}

function DiscLabels({discs}) {
  return (
    <>
      {discs.map((d) => (
        <text
          key={d.label}
          className={clsx(styles.discLabel, styles.small)}
          x={d.labelX}
          y={d.cy}
          dy="0.35em">
          {d.label}
        </text>
      ))}
    </>
  );
}

export function OverlapFigure() {
  const shared = lens(...OVERLAPPING);
  return (
    <Figure caption="Two domains that share part of their model, and the same two with only an identifier between them.">
      <div className={styles.panels}>
        <div>
          <p className={styles.panelTitle}>Overlap</p>
          <svg
            className={styles.svg}
            viewBox="0 0 320 210"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Two overlapping circles, Checkout and Shipping. The part they share is hatched: both of them know it, and both of them change it.">
            <defs>
              <pattern
                id="domain-isolation-hatch"
                width="7"
                height="7"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)">
                <line className={styles.hatch} x1="0" y1="0" x2="0" y2="7" />
              </pattern>
            </defs>
            <Discs discs={OVERLAPPING} />
            <path d={shared} fill="url(#domain-isolation-hatch)" />
            <path className={styles.lens} d={shared} />
            <DiscLabels discs={OVERLAPPING} />
            <Callout
              x={160}
              fromY={92}
              toY={172}
              text="both know it, both change it"
              onDisc
            />
          </svg>
        </div>
        <div>
          <p className={styles.panelTitle}>No overlap</p>
          <svg
            className={styles.svg}
            viewBox="0 0 320 210"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Two separate circles, Checkout and Shipping. A single arrow labelled shipmentId runs from Checkout to Shipping: only an identifier crosses.">
            <Discs discs={ISOLATED} />
            <DiscLabels discs={ISOLATED} />
            <Arrow x1={114} y1={92} x2={206} y2={92} />
            <text className={styles.identifier} x={160} y={80}>
              shipmentId
            </text>
            <Callout x={160} fromY={92} toY={172} text="only an identifier crosses" />
          </svg>
        </div>
      </div>
    </Figure>
  );
}
