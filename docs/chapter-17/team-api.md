# Team API: Catalog API team

A team API example from the Chapter 17 companion guide. The team is constructed for the exercise; replace what does not fit your team. Every promise below should be something another team could check.

Last updated: _(date)_

## Team and focus

The Catalog API team owns the product catalog's data and its HTTP API for the Tailwind Gears shop. Our focus is that any client, the storefront today and others later, can list, search, sort, and filter products through a stable API.

Team type: stream-aligned.

## What we own

- `server/` (the API, the query validation, the product data and search), `shared/product.ts` jointly with the Storefront team, `tests/api.test.ts`, `tests/catalog.test.ts`, and `exercises/`.
- The `/api/*` routes in the deployed catalog and their on-call.
- The `GET /api/products` contract: the query parameters `q`, `sort`, and `inStock`, and the response shape defined by `shared/product.ts`.

## What we provide, and how to call it

| Service | Interface | Service level |
| --- | --- | --- |
| Product listing and search | `GET /api/products?q=&sort=&inStock=` | Responds within 200 ms for the catalog's current size; a breaking change to a parameter or field is announced one release ahead |
| Product details | `GET /api/products/:id` | `404` with a JSON error for an unknown id |
| Health | `GET /api/health` | Used by deployments; answers `{ "status": "ok" }` |

Versioning: fields are added, not renamed or removed, without a new route version. Prices are integer euro cents and stay that way.

## How to request work from us

Open an issue in this repository with the __Request from another team__ form. Say what you need, by when, and which interaction mode you expect. We answer within two working days with one of: scheduled, needs a conversation, or declined with a reason.

## How we communicate, and when we answer

- Issues and pull requests in this repository, in writing, so that anyone can follow later.
- A team channel for questions that need a quick answer; decisions that come out of it are written into the issue.
- Working hours in one time zone; pull requests from other teams get a first review within one working day.

## What we are working on

- _(the current stream items, for example the case-insensitive search and the category filter)_
- _(a cross-team improvement, for example a contract test the Storefront team can run)_

## Teams we interact with

| Team | Mode | Purpose | Until |
| --- | --- | --- | --- |
| Storefront team | Collaboration | Agree the contract and its change rule | The rule is merged, then X-as-a-Service |
| Platform team | X-as-a-Service (we consume) | CI workflow, environments, runners | Ongoing |
| _(enabling team)_ | Facilitation | _(for example agent instructions and the first delegation table)_ | _(one quarter)_ |

## Agents

_(Fill in from the delegation worksheet; see `delegation.md` for the section template.)_
