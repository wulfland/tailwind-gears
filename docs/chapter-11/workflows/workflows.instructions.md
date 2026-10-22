---
applyTo: ".github/workflows/**"
---
Workflows in this repository follow these rules:
- Start with `permissions: contents: read` and raise permissions per job.
- Set `timeout-minutes` on every job.
- Reference actions from GitHub or verified creators by major version tag.
- Pass event data through `env`, never directly into `run`.
- Do not add secrets, environments, or deploy steps without saying so.
