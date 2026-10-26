---
applyTo: "server/**,src/**"
---
Security rules for changes to the catalog's server and browser code:

- Treat every request value (query, path parameter, header, body) as hostile until validated. Validate type, length, and allowed values before use, and answer invalid input with the existing 400 JSON error.
- Never build a file system path, a shell command, a URL, or HTML from request data. Look the record up in the catalog and use the catalog's own value.
- Escape everything rendered into HTML with the existing `escapeHtml` helper. Do not use `innerHTML` with raw data.
- Do not add a dependency, an external service, authentication, or persistence; the catalog is read-only and has no accounts.
- Never add a secret, a token, or a real hostname to the code, the tests, or the instructions.
- Every security-relevant change comes with an abuse-case test in `tests/` that would fail without it.
- Report what you could not verify. Do not claim that a change is secure; show the test that checks it.
