import clsx from 'clsx';
import styles from './styles.module.css';

/*
 * Figures for the Specified contracts deep dive. They speak the language of the
 * picture on the homepage: a domain is a yellow disc, and its contract is the
 * turquoise ring around it, with a port wherever the outside world connects.
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
function Arrow({x1, y1, x2, y2, head = 10, onDisc = false}) {
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
    <g className={clsx(styles.arrow, onDisc && styles.onDisc)}>
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

const DOMAIN = {label: 'Shipping', cx: 228, cy: 92, r: 58};
const RING_GAP = 14;
const PORT_RADIUS = 5;
const BOX = {width: 92, height: 36};
const PART = 13;

// What is inside the domain: classes, tables, files.
const PARTS = [
  {x: 212, y: 99},
  {x: 228, y: 123},
  {x: 251, y: 105},
];

const PART_LINKS = [
  [0, 2],
  [1, 2],
];

// Who uses the domain, and the part each of them ends up leaning on when
// nothing marks the edge.
const CONSUMERS = [
  {label: 'Frontend', x: 4, y: 50, leansOn: PARTS[0]},
  {label: 'Partner', x: 4, y: 112, leansOn: PARTS[1]},
];

// The middle of the side of a consumer's box that faces the domain.
const outlet = ({x, y}) => ({x: x + BOX.width, y: y + BOX.height / 2});

function direction(from, to) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  return {ux: (to.x - from.x) / distance, uy: (to.y - from.y) / distance};
}

// Where the straight line from `from` to `to` enters the disc.
function entry(from, to, disc) {
  const {ux, uy} = direction(from, to);
  const fx = disc.cx - from.x;
  const fy = disc.cy - from.y;
  // How far along the line its closest point to the centre lies, and how far
  // off the centre that point is (squared)
  const along = fx * ux + fy * uy;
  const offSquared = fx * fx + fy * fy - along * along;
  const t = along - Math.sqrt(disc.r ** 2 - offSquared);
  return {x: from.x + ux * t, y: from.y + uy * t};
}

// No edge: the arrow runs on into the disc, to one of its parts. It changes
// colour where it enters, because the disc is yellow in both colour modes.
function Reach({consumer}) {
  const from = outlet(consumer);
  const to = consumer.leansOn;
  const {ux, uy} = direction(from, to);
  const enters = entry(from, to, DOMAIN);
  const stop = PART / 2 + 3;
  return (
    <>
      <line
        className={styles.reach}
        x1={round(from.x + ux * 5)}
        y1={round(from.y + uy * 5)}
        x2={round(enters.x)}
        y2={round(enters.y)}
      />
      <Arrow
        onDisc
        x1={enters.x}
        y1={enters.y}
        x2={to.x - ux * stop}
        y2={to.y - uy * stop}
      />
    </>
  );
}

// An edge: the arrow ends at a port on the ring.
function port(consumer) {
  const centre = {x: DOMAIN.cx, y: DOMAIN.cy};
  const {ux, uy} = direction(outlet(consumer), centre);
  const radius = DOMAIN.r + RING_GAP;
  return {x: centre.x - ux * radius, y: centre.y - uy * radius, ux, uy};
}

function Connection({consumer}) {
  const from = outlet(consumer);
  const {x, y, ux, uy} = port(consumer);
  const stop = PORT_RADIUS + 3;
  return (
    <Arrow
      x1={from.x + ux * 5}
      y1={from.y + uy * 5}
      x2={x - ux * stop}
      y2={y - uy * stop}
    />
  );
}

function Consumers() {
  return (
    <>
      {CONSUMERS.map((c) => (
        <g key={c.label}>
          <rect
            className={styles.box}
            x={c.x}
            y={c.y}
            width={BOX.width}
            height={BOX.height}
          />
          <text
            className={styles.boxLabel}
            x={c.x + BOX.width / 2}
            y={c.y + BOX.height / 2}
            dy="0.35em">
            {c.label}
          </text>
        </g>
      ))}
    </>
  );
}

function Domain() {
  return (
    <>
      <circle className={styles.disc} cx={DOMAIN.cx} cy={DOMAIN.cy} r={DOMAIN.r} />
      <g className={styles.parts}>
        {PART_LINKS.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={PARTS[a].x}
            y1={PARTS[a].y}
            x2={PARTS[b].x}
            y2={PARTS[b].y}
          />
        ))}
        {PARTS.map((p) => (
          <rect
            key={`${p.x}-${p.y}`}
            x={p.x - PART / 2}
            y={p.y - PART / 2}
            width={PART}
            height={PART}
          />
        ))}
      </g>
      <text className={styles.discLabel} x={DOMAIN.cx} y={DOMAIN.cy - 25} dy="0.35em">
        {DOMAIN.label}
      </text>
    </>
  );
}

export function EdgeFigure() {
  const ring = DOMAIN.r + RING_GAP;
  return (
    <Figure caption="The same domain and the same two consumers. Without a contract they build on whatever they can reach. With one they connect at the edge, and the inside stays free to change.">
      <div className={styles.panels}>
        <div>
          <p className={styles.panelTitle}>Implicit</p>
          <svg
            className={styles.svg}
            viewBox="0 0 320 214"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="A domain, Shipping, drawn as a disc with three small parts inside it. Arrows from two consumers, a frontend and a partner, run straight through the edge of the disc and end at parts on the inside.">
            <Consumers />
            <Domain />
            {CONSUMERS.map((c) => (
              <Reach key={c.label} consumer={c} />
            ))}
            <Callout
              x={DOMAIN.cx}
              fromY={DOMAIN.cy + DOMAIN.r - 11}
              toY={180}
              text="everything gets used"
              onDisc
            />
          </svg>
        </div>
        <div>
          <p className={styles.panelTitle}>Specified</p>
          <svg
            className={styles.svg}
            viewBox="0 0 320 214"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="The same disc with a ring around it, its contract, and two ports on the ring. The arrows from the frontend and the partner end at the ports, and nothing reaches the parts inside.">
            <Consumers />
            <circle className={styles.ring} cx={DOMAIN.cx} cy={DOMAIN.cy} r={ring} />
            <Domain />
            {CONSUMERS.map((c) => (
              <Connection key={c.label} consumer={c} />
            ))}
            <g className={styles.ports}>
              {CONSUMERS.map((c) => {
                const {x, y} = port(c);
                return <circle key={c.label} cx={round(x)} cy={round(y)} r={PORT_RADIUS} />;
              })}
            </g>
            <Callout
              x={DOMAIN.cx}
              fromY={DOMAIN.cy + ring}
              toY={180}
              text="only the edge is promised"
            />
          </svg>
        </div>
      </div>
    </Figure>
  );
}

// A timeline: version 2 is published at `deprecated`, version 1 goes at `off`.
const TIME = {from: 42, to: 392, deprecated: 150, off: 306, axis: 160};
// Half the thickness of a version that receives every call
const BAND = 17;
const ROWS = {v1: 62, v2: 120};

const polygon = (points) => points.map(([x, y]) => `${x},${y}`).join(' ');

export function VersionsFigure() {
  const {from, to, deprecated, off, axis} = TIME;
  const {v1, v2} = ROWS;
  return (
    <Figure caption="The thickness of a band is the share of calls a version receives. Version 1 is switched off on the date that was announced, and by then the numbers show that nobody is left on it.">
      <svg
        className={clsx(styles.svg, styles.versions)}
        viewBox="0 0 400 212"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A timeline with two bands. Version 1 runs at full thickness until version 2 is published and version 1 is deprecated. From that moment version 1 gets thinner and version 2 thicker, while both versions work, until version 1 is switched off and only version 2 remains.">
        <polygon
          className={clsx(styles.band, styles.old)}
          points={polygon([
            [from, v1 - BAND],
            [deprecated, v1 - BAND],
            [off, v1],
            [deprecated, v1 + BAND],
            [from, v1 + BAND],
          ])}
        />
        {/* Version 2 carries on, so its band fades out instead of ending */}
        <defs>
          <linearGradient
            id="specified-contracts-carries-on"
            gradientUnits="userSpaceOnUse"
            x1={off}
            x2={to}>
            <stop className={styles.bandStop} offset="0.45" />
            <stop className={styles.bandStop} offset="1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#specified-contracts-carries-on)"
          points={polygon([
            [deprecated, v2],
            [off, v2 - BAND],
            [to, v2 - BAND],
            [to, v2 + BAND],
            [off, v2 + BAND],
          ])}
        />
        <text className={styles.rowLabel} x="6" y={v1} dy="0.35em">
          v1
        </text>
        <text className={styles.rowLabel} x="6" y={v2} dy="0.35em">
          v2
        </text>

        <g className={styles.span}>
          <polyline
            points={polygon([
              [deprecated, axis],
              [deprecated, 28],
              [off, 28],
              [off, axis],
            ])}
          />
          <text x={(deprecated + off) / 2} y="18">
            both versions work
          </text>
        </g>

        <Arrow x1={from} y1={axis} x2={to + 4} y2={axis} head={9} />
        <g className={styles.moments}>
          <circle cx={deprecated} cy={axis} r="3.5" />
          <circle cx={off} cy={axis} r="3.5" />
          <text x={deprecated} y={axis + 23}>
            v2 published,
          </text>
          <text x={deprecated} y={axis + 42}>
            v1 deprecated
          </text>
          <text x={off} y={axis + 23}>
            v1 switched off
          </text>
        </g>
      </svg>
    </Figure>
  );
}
