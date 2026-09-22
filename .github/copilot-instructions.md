# Tailwind Gears working agreement

- This is a small teaching catalog, not a production shop. Preserve its simple architecture.
- The case-sensitive search in `server/catalog.ts` is intentional on the Chapter 2 baseline. Fix it only when the assigned issue explicitly asks for case-insensitive search.
- `npm run test:exercise` deliberately fails until that fix. Do not delete or weaken it. Add regression coverage to `tests/catalog.test.ts` when fixing search.
- Category filtering is an independent unimplemented feature. Do not combine it with the search fix.
- Read the issue and linked evidence before changing behavior. Ask for clarification when requirements conflict or a product decision is unresolved.
- Keep changes scoped. Do not add accounts, checkout, databases, new dependencies, or external services without an explicit requirement.
- Use integer cents for prices, validate API queries, and escape data rendered into HTML. Preserve keyboard access, focus management, mobile layouts, and error states.
- Run `npm run check`. For UI changes, install Chromium with `npx playwright install chromium` and run `npm run test:e2e` after building.
- Report tests run, results, and anything unverified. Do not claim deployment, approval, or acceptance on behalf of a person.
- Product data and transcript dialogue are synthetic. Never add real customer information or credentials.