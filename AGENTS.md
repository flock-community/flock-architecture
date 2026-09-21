# Flock Architecture: instructions for agents

## What this project is

This repository is a documentation website built with [Docusaurus](https://docusaurus.io/). It presents Flock's thinking on software architecture, to share with clients and the wider community. Everything on the site is public-facing and should read as finished, published material.

All site content is written in English.

## The three pillars

The whole site is built around three concepts:

1. **Specified contracts**
2. **Domain isolation**
3. **Event-driven**

These are the pillars of the site. The navigation, the page structure and the story all follow from them. Use these exact names everywhere.

If you think the site needs content that fits none of the three pillars, raise it with the user instead of adding a fourth top-level topic. The two sections beside the pillars, Study material and Tools, support the pillars rather than adding to them; both are described below.

## Site structure

The site starts with an overview of the three pillars. A visitor first sees what the three concepts are, in a few sentences each, and how they fit together. From the overview, the visitor can dive into each pillar, and each pillar has its own deep dive. In the menu the three deep dives sit together in a section called "Three pillars" (`docs/three-pillars/`, one folder per pillar).

After the deep dives come two more sections, "Study material" and "Tools". Neither is a fourth topic, and neither explains a concept. Study material points to material in which the concepts can be seen at work, and Tools describes the tools Flock built to put a pillar into practice, each with a page per item.

Overview first, then three deep dives, then the study material and the tools: that is the whole shape of the site. Keep the navigation that simple.

## Keep the deep dives free of overlap

This is the most important editorial rule of the site. Each deep dive is strictly about its own pillar. A reader who opens "Domain isolation" should read about domain isolation and nothing else, and a reader who goes through all three deep dives should never meet the same explanation twice. The value of the site lies in three sharp, distinct ideas, and overlap blurs them.

In practice:

- **Every topic has exactly one home.** Before writing about something, decide which pillar owns it. Overlap creeps in at the borders: the format of an event, for example, touches both specified contracts and event-driven. Pick the one pillar where the topic fits best, explain it there, and link to it from the other pillar instead of explaining it again.
- **How the pillars relate belongs in the overview.** The way the pillars depend on and strengthen each other is explained on the overview page, not inside the deep dives. A deep dive may point to another pillar with a single sentence and a link, and no more than that.
- **Read before you write.** Before adding or changing content in one deep dive, read the other two so you know what they already cover. When you finish, check your text for passages that repeat or re-explain something from another pillar, and replace them with a link.

## Study material

The site points readers to material in which they can see the ideas at work, made by Flock engineers: at the moment a code repository and a workshop. The material lives in the "Study material" section (`docs/study-material/`): an index page that lists every item in a sentence, and one page per item that explains what it is, who made it, what it shows and where to look, and how to get or run it. Those pages describe the material and link to the deep dives for the ideas; they never explain a pillar again.

Two places point into the section and say no more than needed. The overview page lists the items in a sentence each, with the pillars they show. A deep dive may list, under a "Study material" heading at the end, only the material that shows its own pillar, with a sentence or two on what to look for in it, linking to the item's page. Don't list material in a deep dive whose pillar it does not show. Describe material from what it actually contains, so check it before you write about it.

## Tools

The Tools section (`docs/tools/`) has one page per tool that Flock built to put a pillar into practice: Wirespec for Specified contracts, KMapper for Domain isolation. It is not a fourth pillar. The section supports the pillars and stays out of the overview.

- **Every tool page names the pillar it serves** and links to that deep dive.
- **The link runs one way.** The overview and the deep dives never name a tool, not even in passing: the ideas stand on their own, and a reader of "Specified contracts" must not find Wirespec there. That includes the study material listed at the end of a deep dive: say what the material shows without naming the tool it uses. Pillars link to pillars, tools link to pillars.
- **Study material pages may name a tool**, since they describe what a repository or a workshop is built with. Link the first mention to the tool's page.
- **A tool page explains what the tool is, what it brings and where it fits.** Installation and usage detail belongs on the tool's own site, which the page links to.
- **A new tool gets a page of its own** in `docs/tools/`, with a `slug` under `/tools/`, and an entry in the list on the section's index page.

## Audience and tone

The readers are software engineers and managers, and every page has to work for both. A manager without a programming background should be able to follow it. An engineer should still find it accurate and worth reading.

So the site is a high-level explanation of concepts, not a technical manual:

- Focus on what a concept is, why it matters and what it brings. How to implement it is secondary and stays at a high level.
- Use plain language. Avoid jargon where a normal word works. When a technical term is needed, explain it in a sentence the first time it appears.
- Keep implementation detail (code, frameworks, configuration) to a minimum. When a concrete example helps, keep it small and say in words what it shows.

## Tone of voice

Write the way an engineer explains something to a colleague: friendly, direct and to the point. The model is the blog posts of Yvonne Ceelie on axoniq.io. The whole site was rewritten to this tone in one go, so any new or changed text has to match it.

- Talk to the reader as "you". Flock is "we": "we deliberately don't call this pillar contract first", not "this pillar is deliberately not called contract first".
- Open with the problem the reader recognises, then the idea. Bring in one concrete example early (the web shop) and stick with it.
- Tell the reasoning as a story: "The quick way is X. At first this seems free. But ... So instead ...". A question now and then is fine: "Sounds like a weakness?"
- Short sentences, short paragraphs, plain words. One idea per paragraph. When in doubt, cut.
- Active voice. Avoid inversions ("Of the three pillars, this is the one ...") and abstract openers like "It is ... that ...".
- No Dutch English: no literal translations of Dutch idiom, and no long sentences held together by colons and semicolons.
- Headings say what the section says, in a few words. A deep dive ends with a short "Conclusion" in plain prose, a few sentences and no list, followed by one sentence that links to the other two pillars and the overview.
- Link instead of pointing: "[Domain isolation](/domain-isolation) rules that out", not "which is the subject of".

## Source material

The `transcripts/` folder holds raw, machine-made transcripts of the conversations, held in Dutch, in which these ideas were worked out. They are internal conversations, so the folder is kept out of git: never commit it or quote from it, and expect it to be missing from a fresh checkout. Use the transcripts as input for the ideas and the reasoning, not as text to translate. They are spoken language, they wander between topics, and they contain transcription errors ("Vlok" is Flock, for example).

The transcripts often call the first pillar "contract first". That name was deliberately replaced by "Specified contracts": what matters is that an explicit specification of the contract exists, not that it is written before the code. Always use "Specified contracts" on the site.

## Publishing

Every push to `main` is built and deployed to the public site, https://architecture.flock.community, by `.github/workflows/deploy.yml`. Treat `main` as live. Work that isn't ready for readers goes on a branch and through a pull request, which runs the same build as a check.

The custom domain is set in the repository's Pages settings, and its DNS is proxied by Cloudflare. If the domain is ever removed, `url` and `baseUrl` in `docusaurus.config.js` have to change with it. The organisation is on GitHub's Free plan, where Pages only works for public repositories, so making this repository private takes the site down.

## Working on the site

- `npm start` runs the site locally with live reload.
- `npm run build` has to succeed before work counts as done. The build fails on broken links, which matters here because the deep dives link to each other instead of repeating content.
