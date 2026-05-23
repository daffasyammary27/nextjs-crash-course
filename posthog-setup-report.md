<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the DevEvent Next.js App Router project. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route analytics requests through `/ingest` for improved reliability. Three components were instrumented with custom event tracking. Environment variables are stored in `.env.local` and referenced via `process.env`.

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" CTA button on the homepage | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks an event card (includes title, slug, location, date properties) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navbar link (includes label property: Home, Events, Create Event) | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1620755)
- [Explore Events Button Clicks](/insights/2sjO3YzI) — trend of CTA clicks over time
- [Event Card Clicks](/insights/UuaZBUdz) — trend of event card clicks over time
- [Nav Link Clicks by Label](/insights/eARNK9zw) — navbar clicks broken down by Home / Events / Create Event
- [Engagement Funnel: Explore → Event Click](/insights/IWkNWtlC) — conversion funnel from CTA click to event card click
- [Unique Users Engaging with Events](/insights/rLEjM24w) — daily unique users clicking event cards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
