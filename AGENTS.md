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

If you think the site needs content that fits none of the three pillars, raise it with the user instead of adding a fourth top-level topic.

## Site structure

The site starts with an overview of the three pillars. A visitor first sees what the three concepts are, in a few sentences each, and how they fit together. From the overview, the visitor can dive into each pillar, and each pillar has its own deep-dive section.

Overview first, then three deep dives: that is the whole shape of the site. Keep the navigation that simple.

## Keep the deep dives free of overlap

This is the most important editorial rule of the site. Each deep dive is strictly about its own pillar. A reader who opens "Domain isolation" should read about domain isolation and nothing else, and a reader who goes through all three deep dives should never meet the same explanation twice. The value of the site lies in three sharp, distinct ideas, and overlap blurs them.

In practice:

- **Every topic has exactly one home.** Before writing about something, decide which pillar owns it. Overlap creeps in at the borders: the format of an event, for example, touches both specified contracts and event-driven. Pick the one pillar where the topic fits best, explain it there, and link to it from the other pillar instead of explaining it again.
- **How the pillars relate belongs in the overview.** The way the pillars depend on and strengthen each other is explained on the overview page, not inside the deep dives. A deep dive may point to another pillar with a single sentence and a link, and no more than that.
- **Read before you write.** Before adding or changing content in one deep dive, read the other two so you know what they already cover. When you finish, check your text for passages that repeat or re-explain something from another pillar, and replace them with a link.

## Audience and tone

The readers are software engineers and managers, and every page has to work for both. A manager without a programming background should be able to follow it. An engineer should still find it accurate and worth reading.

So the site is a high-level explanation of concepts, not a technical manual:

- Focus on what a concept is, why it matters and what it brings. How to implement it is secondary and stays at a high level.
- Use plain language. Avoid jargon where a normal word works. When a technical term is needed, explain it in a sentence the first time it appears.
- Keep implementation detail (code, frameworks, configuration) to a minimum. When a concrete example helps, keep it small and say in words what it shows.

## Source material

The `transcripts/` folder holds raw, machine-made transcripts of the conversations, held in Dutch, in which these ideas were worked out. They are internal conversations, so the folder is kept out of git: never commit it or quote from it, and expect it to be missing from a fresh checkout. Use the transcripts as input for the ideas and the reasoning, not as text to translate. They are spoken language, they wander between topics, and they contain transcription errors ("Vlok" is Flock, for example).

The transcripts often call the first pillar "contract first". That name was deliberately replaced by "Specified contracts": what matters is that an explicit specification of the contract exists, not that it is written before the code. Always use "Specified contracts" on the site.

## Working on the site

- `npm start` runs the site locally with live reload.
- `npm run build` has to succeed before work counts as done. The build fails on broken links, which matters here because the deep dives link to each other instead of repeating content.
