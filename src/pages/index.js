import {Fragment} from 'react';
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
        Every system makes promises to the people and third-party services that use it:
        which data it offers, and in what shape. If these stay
        implicit, nobody knows what is safe to change. A specified contract
        makes promises explicit and versioned. You know who relies on what, you
        can announce changes in time, and you stay free to improve everything
        behind the contract.
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
        The domain captures how your business operates and the rules it follows.
        The domain model is a representation of the domain. Not all parts of
        the domain are modelled, only the problems that need to be solved
        inside the domain. That scope is called a bounded context. Within a
        bounded context, we stick to consistent names, the same words the
        business uses. That&apos;s called ubiquitous language, and it means
        a non-technical person can read the code and still recognise what
        it&apos;s about.
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
        Most systems store state: the current situation, like the latest
        address or the latest balance. Every update overwrites what was
        there before. An event-driven system stores state changes instead:
        what happened, in words everyone understands. An item was added to
        the cart, a customer moved house. Other parts of the system build
        views from those events, and can always rebuild them, whether a
        table gets dropped or a new feature needs a different view. The
        events are the truth; everything else is volatile.
      </>
    ),
  },
];

// Material in which the ideas can be seen at work, each with a page in the
// study material section. `shows` names the pillars it covers, by their path.
const REFERENCES = [
  {
    kind: 'Code on GitHub',
    title: 'The pragmatic repository',
    to: '/study-material/pragmatic',
    shows: ['/specified-contracts', '/domain-isolation'],
    body: (
      <>
        A small but complete application in Kotlin. Its domain lives in a
        module of its own, and its API is written down as a specification. It
        shows a pragmatic functional style: invalid input is turned away at
        the edge, and errors are ordinary values instead of exceptions.
      </>
    ),
  },
  {
    kind: 'Hands-on workshop',
    title: 'Pragmatic Functional Programming in Kotlin',
    to: '/study-material/workshop',
    shows: ['/domain-isolation'],
    body: (
      <>
        A workshop by Jerre van Veluw, software engineer at Flock, at Kotlin
        Dev Day in Amsterdam. You take an existing application and isolate
        its domain step by step, in Kotlin with Spring Boot and Arrow. The
        workshop and the repository share a name, and the repository has the
        shape the workshop works towards.
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

function Reference({kind, title, to, shows, body}) {
  const pillars = shows.map((to) => PILLARS.find((pillar) => pillar.to === to));
  return (
    <article className={styles.reference}>
      <p className={styles.referenceKind}>{kind}</p>
      <Heading as="h3" className={styles.referenceTitle}>
        <Link to={to}>{title}</Link>
      </Heading>
      <p>{body}</p>
      <p className={styles.referenceShows}>
        Shows{' '}
        {pillars.map((pillar, i) => (
          <Fragment key={pillar.to}>
            {i > 0 && (i === pillars.length - 1 ? ' and ' : ', ')}
            <Link to={pillar.to}>{pillar.title}</Link>
          </Fragment>
        ))}
        .
      </p>
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
                A system consists of several bounded contexts, each with one
                owner. Domain isolation keeps everything inside a bounded
                context free of the rest of the system. Specified contracts
                are what a bounded context exposes at its edge, written down
                and versioned so others know what to expect. Events are
                shared both within a bounded context and between bounded
                contexts: domain events travel inside, integration events
                cross the edge. A bounded context should neither leak its
                internals out through those events, nor pull another
                context&apos;s internals in. That way each stays free to
                change on its own.
              </p>
              <p>
                The three protect each other. Without an explicit edge, the
                inside leaks out through the interface, and what you have given
                away is hard to take back. With a contract in place, the inside
                can change faster than the outside. And because others build
                what they need from events, the owner of the data stays the
                single source of truth.
              </p>
            </div>
            <div>
              <Heading as="h2" className={styles.proseTitle}>
                Why these three
              </Heading>
              <p>
                Architecture is the set of decisions that are hard to reverse.
                A programming language, a framework, a tool: these change
                every few years, and swapping one out is work you can plan
                for. How you divide a system, what you promise to others, and
                how you deal with history is a different story: once a
                system is live, undoing those decisions gets expensive fast.
              </p>
              <p>
                We see these three as tools in a toolbox, not a rulebook.
                Every domain is unique and asks for its own approach: how far
                you take each one depends on your situation. It&apos;s about
                the right choice, not the best one.
              </p>
            </div>
          </div>
        </section>

        <section
          id="study-material"
          className={styles.references}
          aria-labelledby="study-material-title">
          <div className="container">
            <Heading
              as="h2"
              id="study-material-title"
              className={styles.proseTitle}>
              Study material
            </Heading>
            <p className={styles.referencesLead}>
              Two places to see the ideas at work, both made by engineers at
              Flock. The <Link to="/study-material">study material section</Link>{' '}
              has a page on each.
            </p>
            <div className={styles.referenceGrid}>
              {REFERENCES.map((reference) => (
                <Reference key={reference.to} {...reference} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
