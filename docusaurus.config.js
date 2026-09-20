// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Flock. Architecture',
  tagline: 'Three ideas behind software that has to keep changing',
  favicon: 'img/logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Published on GitHub Pages under a custom domain, which is set in the
  // repository's Pages settings. Without that domain the site would live at
  // flock-community.github.io/flock-architecture/ and need that as baseUrl.
  url: 'https://architecture.flock.community',
  baseUrl: '/',
  // GitHub Pages serves /domain-isolation from domain-isolation.html without a redirect
  trailingSlash: false,

  // GitHub pages deployment config.
  organizationName: 'flock-community',
  projectName: 'flock-architecture',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Self-hosted fonts
  clientModules: ['./src/clientModules/fonts.js'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // The deep dives are the site, so they live at the root: /domain-isolation
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Flock. Architecture',
        logo: {
          alt: '',
          src: 'img/logo.svg',
        },
        // Plain links, so only the pillar you are reading is highlighted
        items: [
          {
            to: '/specified-contracts',
            position: 'right',
            label: 'Specified contracts',
          },
          {
            to: '/domain-isolation',
            position: 'right',
            label: 'Domain isolation',
          },
          {
            to: '/event-driven',
            position: 'right',
            label: 'Event-driven',
          },
          {
            to: '/study-material',
            position: 'right',
            label: 'Study material',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'The three pillars',
            items: [
              {label: 'Specified contracts', to: '/specified-contracts'},
              {label: 'Domain isolation', to: '/domain-isolation'},
              {label: 'Event-driven', to: '/event-driven'},
            ],
          },
          {
            title: 'Study material',
            items: [
              {label: 'All study material', to: '/study-material'},
              {label: 'The pragmatic repository', to: '/study-material/pragmatic'},
              {label: 'The workshop', to: '/study-material/workshop'},
            ],
          },
          {
            title: 'Flock',
            items: [
              {label: 'flock.community', href: 'https://flock.community'},
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Flock.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
