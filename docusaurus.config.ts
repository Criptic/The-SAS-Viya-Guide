// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The SAS Viya Guide',
  tagline: 'A Comprehensive Resource for SAS Viya Developers and Users - by David Weik',
  url: 'https://criptic.github.io',
  baseUrl: '/The-SAS-Viya-Guide/',
  onBrokenLinks: 'throw',
  deploymentBranch: 'gh-pages',
  markdown: {
    format: 'mdx', // Optional: specify format if needed
    mermaid: true, // Optional: if you use mermaid diagrams
    preprocessor: ({ filePath, fileContent }) => {
      return fileContent;
    },
    // The specific fix for your warning:
    hooks: {onBrokenMarkdownLinks: 'warn'}
  },
  projectName: 'the-sas-viya-guide', 

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/criptic/the-sas-viya-guide/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
        [
      '@docusaurus/plugin-content-docs',
      {
        // Instance 2: The "Procs"
        id: 'procs', 
        path: 'procs', 
        routeBasePath: 'procs',
        sidebarPath: './sidebarsProcs.ts', // Separate sidebar file
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        // Instance 2: The "Updates"
        id: 'updates', 
        path: 'updates', 
        routeBasePath: 'updates',
        sidebarPath: './sidebarsUpdates.ts', // Separate sidebar file
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'SAS Viya Guide',
      items: [
        {type: 'doc', docId: 'intro', position: 'left', label: 'Guides'},
        {type: 'doc', docId: 'intro', docsPluginId: 'procs', position: 'left', label: 'Proc Guide'},
        {type: 'doc', docId: 'intro', docsPluginId: 'updates', position: 'left', label: 'Updates'},
        {
          href: 'https://github.com/criptic/the-sas-viya-guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      additionalLanguages: ['sas', 'python', 'sql', 'bash', 'r'],
    },
  },
  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        docsRouteBasePath: "/",
        explicitSearchResultPath: true,
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
    "@docusaurus/theme-mermaid",
  ],
};

module.exports = config;