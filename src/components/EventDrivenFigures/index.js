import clsx from 'clsx';
import styles from './styles.module.css';

/*
 * Figures for the Event-driven deep dive. They speak the language of the
 * picture on the homepage: a domain is a yellow disc, and an event is a dot
 * that travels between discs.
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
function Arrow({x1, y1, x2, y2, head = 10, className}) {
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
    <g className={clsx(styles.arrow, className)}>
      <line x1={round(x1)} y1={round(y1)} x2={round(bx)} y2={round(by)} />
      <polygon points={points.map(([x, y]) => `${round(x)},${round(y)}`).join(' ')} />
    </g>
  );
}

// From just outside one disc to just outside another.
function between(from, to, gap = 6) {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const distance = Math.hypot(dx, dy);
  const ux = dx / distance;
  const uy = dy / distance;
  return {
    x1: from.cx + ux * (from.r + gap),
    y1: from.cy + uy * (from.r + gap),
    x2: to.cx - ux * (to.r + gap),
    y2: to.cy - uy * (to.r + gap),
  };
}

// A line under a picture that says what it shows.
function Note({x, y, children}) {
  return (
    <text className={styles.note} x={x} y={y}>
      {children}
    </text>
  );
}

function Panel({title, children}) {
  return (
    <div>
      <p className={styles.panelTitle}>{title}</p>
      {children}
    </div>
  );
}

// A domain with its name inside.
function Disc({cx, cy, r, label}) {
  return (
    <g>
      <circle className={styles.disc} cx={cx} cy={cy} r={r} />
      <text className={styles.discLabel} x={cx} y={cy} dy="0.35em">
        {label}
      </text>
    </g>
  );
}

// A domain drawn small, with its name next to or under it.
function SmallDisc({cx, cy, r, label, labelX, labelY, anchor = 'start'}) {
  return (
    <g>
      <circle className={styles.disc} cx={cx} cy={cy} r={r} />
      <text
        className={styles.sideLabel}
        x={labelX ?? cx + r + 8}
        y={labelY ?? cy}
        dy={labelY === undefined ? '0.35em' : 0}
        textAnchor={anchor}>
        {label}
      </text>
    </g>
  );
}

/* The same change, stored as state and recorded as what happened */

const RECORD = {x: 44, y: 34, width: 232, height: 104};

// Monospace at 13px is about 7.8px per character
const STRUCK = {x: 130, y: 90, text: 'Main Street 3'};

export function StateHistoryFigure() {
  const struckWidth = STRUCK.text.length * 7.8;
  return (
    <Figure caption="A customer moves house. On the left the address is updated and the old one is lost. On the right the move is recorded, and the current address follows from the record.">
      <div className={styles.panels}>
        <Panel title="State">
          <svg
            className={styles.svg}
            viewBox="0 0 320 200"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="A customer record with one address field. The old value, Main Street 3, is struck through and faded; the new value, Oak Avenue 12, has taken its place.">
            <rect className={styles.record} {...RECORD} />
            <text className={styles.recordTitle} x={RECORD.x + 16} y={RECORD.y + 26}>
              Customer 4711
            </text>
            <text className={styles.field} x={RECORD.x + 16} y={STRUCK.y}>
              address
            </text>
            <text className={clsx(styles.value, styles.struck)} x={STRUCK.x} y={STRUCK.y}>
              {STRUCK.text}
            </text>
            <line
              className={styles.strike}
              x1={STRUCK.x - 2}
              y1={STRUCK.y - 4}
              x2={round(STRUCK.x + struckWidth + 2)}
              y2={STRUCK.y - 4}
            />
            <text className={styles.value} x={STRUCK.x} y={STRUCK.y + 30}>
              Oak Avenue 12
            </text>
            <Note x={160} y={178}>
              the old value is gone
            </Note>
          </svg>
        </Panel>
        <Panel title="What happened">
          <svg
            className={styles.svg}
            viewBox="0 0 320 200"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="A timeline with two events on it: Registered, with the address Main Street 3, and Moved house, with the address Oak Avenue 12. The line continues to the right.">
            <Arrow className={styles.stream} x1={24} y1={88} x2={300} y2={88} />
            {[
              {x: 92, name: 'Registered', value: 'Main Street 3'},
              {x: 208, name: 'Moved house', value: 'Oak Avenue 12'},
            ].map((event) => (
              <g key={event.name}>
                <circle className={styles.event} cx={event.x} cy={88} r="6.5" />
                <text className={styles.eventName} x={event.x} y={118}>
                  {event.name}
                </text>
                <text className={clsx(styles.value, styles.centred)} x={event.x} y={137}>
                  {event.value}
                </text>
              </g>
            ))}
            <Note x={160} y={178}>
              nothing is overwritten
            </Note>
          </svg>
        </Panel>
      </div>
    </Figure>
  );
}

/* Two ways for the other domains to learn that an order was placed */

const CHECKOUT = {cx: 60, cy: 88, r: 36};

const CALLED = [
  {cx: 220, cy: 28, r: 16, label: 'Shipping'},
  {cx: 220, cy: 88, r: 16, label: 'Payments'},
  {cx: 220, cy: 148, r: 16, label: 'Warehouse'},
];

const LISTENING = [
  {cx: 130, cy: 138, r: 16, label: 'Shipping'},
  {cx: 200, cy: 138, r: 16, label: 'Payments'},
  {cx: 270, cy: 138, r: 16, label: 'Warehouse'},
];

const STREAM = {x1: 104, y: 88, x2: 300};
const TRAVELLING = [112, 165, 235];

export function AskListenFigure() {
  return (
    <Figure caption="Two ways for the other domains to learn that an order was placed. On the left Checkout calls each of them. On the right Checkout publishes the fact, and each of them listens.">
      <div className={styles.panels}>
        <Panel title="Ask">
          <svg
            className={styles.svg}
            viewBox="0 0 320 206"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Checkout, drawn as a disc, with three arrows leaving it, one to each of Shipping, Payments and Warehouse.">
            {CALLED.map((domain) => (
              <Arrow key={domain.label} {...between(CHECKOUT, domain)} />
            ))}
            <Disc {...CHECKOUT} label="Checkout" />
            {CALLED.map((domain) => (
              <SmallDisc key={domain.label} {...domain} />
            ))}
            <Note x={160} y={196}>
              Checkout has to know each of them
            </Note>
          </svg>
        </Panel>
        <Panel title="Listen">
          <svg
            className={styles.svg}
            viewBox="0 0 320 206"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Checkout, drawn as a disc, with a stream of event dots labelled order placed leaving it. Shipping, Payments and Warehouse each tap into the stream; no arrow runs from Checkout to any of them.">
            <Arrow
              className={styles.stream}
              x1={STREAM.x1}
              y1={STREAM.y}
              x2={STREAM.x2}
              y2={STREAM.y}
            />
            <text className={clsx(styles.value, styles.centred)} x={202} y={72}>
              order placed
            </text>
            {TRAVELLING.map((x) => (
              <circle key={x} className={styles.event} cx={x} cy={STREAM.y} r="5" />
            ))}
            {LISTENING.map((domain) => (
              <line
                key={domain.label}
                className={styles.tap}
                x1={domain.cx}
                y1={STREAM.y}
                x2={domain.cx}
                y2={domain.cy - domain.r - 2}
              />
            ))}
            <Disc {...CHECKOUT} label="Checkout" />
            {LISTENING.map((domain) => (
              <SmallDisc
                key={domain.label}
                {...domain}
                labelX={domain.cx}
                labelY={domain.cy + domain.r + 17}
                anchor="middle"
              />
            ))}
            <Note x={160} y={196}>
              Checkout doesn’t know who listens
            </Note>
          </svg>
        </Panel>
      </div>
    </Figure>
  );
}

/* One record of what happened, and the views derived from it */

const LOG = {x: 90, top: 30, bottom: 208};
const RECORDED = [50, 76, 102, 128, 154, 180];
const VIEWS = [
  {label: 'Order overview', y: 36},
  {label: 'Sales per day', y: 98},
  {label: 'Search index', y: 160},
];
const VIEW_BOX = {x: 292, width: 160, height: 40};

export function ViewsFigure() {
  const origin = {x: LOG.x + 18, y: (LOG.top + LOG.bottom) / 2};
  return (
    <Figure caption="One record of what happened, and three views derived from it. A view can be thrown away and rebuilt from the record at any time.">
      <svg
        className={clsx(styles.svg, styles.views)}
        viewBox="0 0 480 230"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A vertical line of event dots labelled the events. Three arrows fan out from it to three boxes: Order overview, Sales per day and Search index.">
        <text className={clsx(styles.field, styles.centred)} x={LOG.x} y={18}>
          the events
        </text>
        <Arrow className={styles.stream} x1={LOG.x} y1={LOG.top} x2={LOG.x} y2={LOG.bottom} />
        {RECORDED.map((y) => (
          <circle key={y} className={styles.event} cx={LOG.x} cy={y} r="5.5" />
        ))}
        {VIEWS.map((view) => (
          <g key={view.label}>
            <Arrow
              x1={origin.x}
              y1={origin.y}
              x2={VIEW_BOX.x - 6}
              y2={view.y + VIEW_BOX.height / 2}
            />
            <rect
              className={styles.box}
              x={VIEW_BOX.x}
              y={view.y}
              width={VIEW_BOX.width}
              height={VIEW_BOX.height}
            />
            <text
              className={styles.boxLabel}
              x={VIEW_BOX.x + VIEW_BOX.width / 2}
              y={view.y + VIEW_BOX.height / 2}
              dy="0.35em">
              {view.label}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}
