import clsx from 'clsx';
import styles from './styles.module.css';

/*
 * Figures for the Event-driven deep dive. They speak the language of the
 * picture on the homepage: an event is a dot that travels along a line.
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
    <Figure caption="One record of what happened, and three views derived from it. A view can be thrown away and rebuilt from the record.">
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

/* Two questions that are easily confused: how domains are coupled, and what a domain keeps */

// What a domain keeps, from the top row down
const KEEPS = ['Its history', 'Its state'];

// How domains are coupled, from the left column to the right
const COUPLED = [
  {name: 'Tightly coupled', how: ['one calls,', 'the other answers']},
  {name: 'Loosely coupled', how: ['one publishes,', 'the others react']},
];

// `title` says what the quadrant combines and `known` is the name it goes by.
// Both are broken for the narrow picture. The wide one puts each on one line.
const QUADRANTS = [
  {col: 0, row: 0, title: ['Calls and', 'history'], known: ['History', 'table']},
  {col: 1, row: 0, title: ['Events and', 'history'], known: ['Audit log or', 'event sourcing']},
  {col: 0, row: 1, title: ['Calls and', 'state'], known: ['Request and', 'response']},
  {col: 1, row: 1, title: ['Events and', 'state'], known: ['Event', 'streaming']},
];

// Wide: "what a domain keeps" stands left of its row.
const QUADRANT_WIDE = {
  wide: true,
  width: 620,
  cellX: [140, 379],
  cellY: [36, 156],
  cell: {width: 229, height: 110},
  keepsTitle: {x: 12, y: 20},
  keepsLabel: (rowTop) => ({x: 12, y: rowTop + 55, dy: '0.35em'}),
  glyphDy: -30,
  titleDy: 4,
  knownDy: 26,
};

// Narrow: "what a domain keeps" stands above its row, and names break in two.
const QUADRANT_COMPACT = {
  wide: false,
  width: 340,
  cellX: [20, 180],
  cellY: [50, 204],
  cell: {width: 150, height: 120},
  keepsTitle: {x: 20, y: 16},
  keepsLabel: (rowTop) => ({x: 20, y: rowTop - 10}),
  glyphDy: -40,
  titleDy: -14,
  knownDy: 26,
};

const LINE = 16;

// A label of one or more lines, the first on the baseline y.
function Lines({className, x, y, lines, gap = LINE}) {
  return (
    <text className={className} x={x} y={y}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : gap}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

// How the two columns talk. A call goes out and an answer comes back. An
// event is the dot from the homepage, travelling one way.
function CouplingGlyph({events, x, y}) {
  if (events) {
    return (
      <g>
        <circle className={styles.event} cx={x - 13} cy={y} r="5.5" />
        <Arrow x1={x - 3} y1={y} x2={x + 19} y2={y} head={7} />
      </g>
    );
  }
  return (
    <g>
      <Arrow x1={x - 15} y1={y - 4.5} x2={x + 15} y2={y - 4.5} head={7} />
      <Arrow x1={x + 15} y1={y + 4.5} x2={x - 15} y2={y + 4.5} head={7} />
    </g>
  );
}

function QuadrantChart({layout, className}) {
  const {wide, cellX, cellY, cell} = layout;
  const join = (lines) => (wide ? [lines.join(' ')] : lines);
  const left = cellX[0] - 8;
  const right = cellX[1] + cell.width;
  const axisY = cellY[1] + cell.height + 8;
  const nameY = axisY + 22;
  const howY = nameY + 18;
  const titleY = howY + (wide ? 0 : LINE) + 30;
  return (
    <svg
      className={clsx(styles.svg, className)}
      viewBox={`0 0 ${layout.width} ${titleY + 14}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A grid of two by two. From left to right: how domains are coupled. Tightly on the left, where one calls and the other answers, and loosely on the right, where one publishes and the others react. From bottom to top: what a domain keeps, its state in the bottom row and its history in the top row. Bottom left is calls and state, known as request and response. Bottom right is events and state, known as event streaming. Top left is calls and history, a history table. Top right is events and history, an audit log or event sourcing.">
      <line className={styles.axis} x1={left} y1={axisY} x2={left} y2={cellY[0]} />
      <line className={styles.axis} x1={left} y1={axisY} x2={right} y2={axisY} />
      <text className={styles.axisTitle} x={layout.keepsTitle.x} y={layout.keepsTitle.y}>
        What a domain keeps
      </text>
      {KEEPS.map((label, row) => (
        <text key={label} className={styles.axisValue} {...layout.keepsLabel(cellY[row])}>
          {label}
        </text>
      ))}
      {COUPLED.map((column, col) => {
        const x = cellX[col] + cell.width / 2;
        return (
          <g key={column.name}>
            <text className={clsx(styles.axisValue, styles.centred)} x={x} y={nameY}>
              {column.name}
            </text>
            <Lines
              className={clsx(styles.field, styles.centred)}
              x={x}
              y={howY}
              lines={join(column.how)}
            />
          </g>
        );
      })}
      <text
        className={clsx(styles.axisTitle, styles.centred)}
        x={(cellX[0] + cellX[1] + cell.width) / 2}
        y={titleY}>
        How domains are coupled
      </text>
      {QUADRANTS.map((quadrant) => {
        const x = cellX[quadrant.col];
        const y = cellY[quadrant.row];
        const cx = x + cell.width / 2;
        const cy = y + cell.height / 2;
        const title = join(quadrant.title);
        return (
          <g key={title.join(' ')}>
            <rect className={styles.box} x={x} y={y} width={cell.width} height={cell.height} />
            <CouplingGlyph events={quadrant.col === 1} x={cx} y={cy + layout.glyphDy} />
            <Lines
              className={styles.boxLabel}
              x={cx}
              y={cy + layout.titleDy}
              lines={title}
              gap={LINE + 1}
            />
            <Lines
              className={clsx(styles.field, styles.centred)}
              x={cx}
              y={cy + layout.knownDy}
              lines={join(quadrant.known)}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function QuadrantFigure() {
  return (
    <Figure caption="Two separate questions: how domains are coupled, and what a domain keeps. None of the four is wrong. Within one team, calls are fine, and between teams events loosen the coupling. Event-driven is the right-hand column. The top row is a separate choice for each domain.">
      <div className={styles.quadrant}>
        <QuadrantChart layout={QUADRANT_WIDE} className={styles.quadrantWide} />
        <QuadrantChart layout={QUADRANT_COMPACT} className={styles.quadrantCompact} />
      </div>
    </Figure>
  );
}
