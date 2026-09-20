import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {HeroScene, PillarGlyph} from '@site/src/components/Scene';

import styles from './index.module.css';

const PILLARS = [
  {
    title: 'Specified contracts',
    to: '/specified-contracts',
    highlight: 'edge',
    deepDive: 'How contracts work',
    essence: 'Write down what you promise the outside world.',
    body: (
      <>
        Every system makes promises to the people and systems that use it:
        which data it offers, and in what shape. Left implicit, nobody knows
        what is safe to change. A specified contract makes those promises
        explicit and versioned. You know who relies on what, you can announce
        changes in time, and you stay free to improve everything behind the
        contract.
      </>
    ),
  },
  {
    title: 'Domain isolation',
    to: '/domain-isolation',
    highlight: 'inside',
    deepDive: 'Where the boundaries go',
    essence: 'Keep the heart of the business free of everything else.',
    body: (
      <>
        The domain is the part of the software that captures how the business
        works, in the words the business uses. We keep it on its own. It
        doesn&apos;t depend on a database, a framework or another team&apos;s
        model; everything else depends on it. Each part of the business has one
        owner, and other parts refer to it by an identifier instead of reaching
        into its data.
      </>
    ),
  },
  {
    title: 'Event-driven',
    to: '/event-driven',
    highlight: 'between',
    deepDive: 'What events give you',
    essence: 'Record what happened, not only how things are now.',
    body: (
      <>
        Most systems only store the current state: the latest address, the
        latest balance. An event-driven system records what happened, in words
        everyone understands: an item was added to the cart, a customer moved
        house. Other parts of the system react to those events and build the
        view they need. Keep the events, and you keep the full history.
      </>
    ),
  },
];

function Pillar({title, to, highlight, deepDive, essence, body}) {
  return (
    <article className={styles.pillar}>
      <PillarGlyph highlight={highlight} className={styles.pillarGlyph} />
      <Heading as="h2" className={styles.pillarTitle}>
        <Link to={to}>{title}</Link>
      </Heading>
      <p className={styles.pillarEssence}>{essence}</p>
      <p className={styles.pillarBody}>{body}</p>
      <Link className={styles.deepDive} data-role={highlight} to={to}>
        {deepDive}
      </Link>
    </article>
  );
}

export default function Home() {
  return (
    <Layout
      title="Three ideas behind software that has to keep changing"
      description="Flock's view on software architecture, built on three pillars: Specified contracts, Domain isolation and Event-driven.">
      <header className={clsx(styles.onBlack, styles.hero)}>
        <div className={clsx('container', styles.heroText)}>
          <Heading as="h1" className={styles.heroTitle}>
            Architecture for software that has to keep changing.
          </Heading>
          <p className={styles.heroLead}>
            The only constant in software is change. At Flock we build on
            three ideas that keep a system easy to change, long after its
            first release.
          </p>
        </div>
        <div className={clsx('container', styles.sceneWrap)}>
          <HeroScene />
        </div>
      </header>

      <main>
        <section
          className={clsx(styles.onBlack, styles.pillars)}
          aria-labelledby="pillars-title">
          <div className="container">
            <Heading as="h2" id="pillars-title" className={styles.srOnly}>
              The three pillars
            </Heading>
            <div className={styles.pillarGrid}>
              {PILLARS.map((pillar) => (
                <Pillar key={pillar.to} {...pillar} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.prose}>
          <div className={clsx('container', styles.proseGrid)}>
            <div>
              <Heading as="h2" className={styles.proseTitle}>
                How the three fit together
              </Heading>
              <p>
                Picture a system as circles that never overlap. Domain isolation
                is the inside of each circle: one part of the business, with one
                owner. Specified contracts are the edge: the only places where
                the outside world connects, written down and versioned. Events
                are what travels in between: facts about what happened, which
                others can use without reaching inside.
              </p>
              <p>
                Each idea protects the other two. Without an explicit edge, the
                inside leaks out through the interface, and what you have given
                away is hard to take back. With a contract in place, the inside
                can change faster than the outside. And because others build what
                they need from events, the owner of the data stays the single
                source of truth.
              </p>
            </div>
            <div>
              <Heading as="h2" className={styles.proseTitle}>
                Why these three
              </Heading>
              <p>
                Architecture is the set of decisions that are hard to reverse.
                Programming languages, frameworks and tools change every few
                years, and replacing them is work that can be planned. How you
                divide a system, what you promise to others and how you deal with
                history are different: once a system is in use, they are
                expensive to undo.
              </p>
              <p>
                So these are the decisions we take a position on. How far you
                take each of them depends on your situation. It is about the
                right choice, not the best one.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
