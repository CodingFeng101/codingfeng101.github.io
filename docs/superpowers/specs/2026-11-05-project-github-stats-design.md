# Project GitHub Stats

- Intent: show each GitHub-backed project’s current star and fork counts beside its repository link.
- Scope: UniGraph, CanvasAnvil, and Slide Alchemy; use the public GitHub repository API, refresh at most once per browser every 12 hours, and keep the last cached values visible if a refresh fails or is rate-limited. Projects without a GitHub repository are omitted.
- Approaches considered: direct browser requests on every visit (freshest, but wastes API quota); a scheduled shared data feed (globally rate-limited, but adds workflow/deployment complexity); browser-side 12-hour cache (selected for this static GitHub Pages site, balancing simplicity and low request frequency).
- UI: compact Star and Fork icons with counts in each project heading, matching existing link styling and accessible labels.
- Success: build passes; each of the three repository identifiers maps correctly; cache suppresses requests for 12 hours; failures preserve cached values without breaking the page.
