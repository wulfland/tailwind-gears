---
description: Investigates a failed CI run and reports the cause in one issue.
on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: [main, "practice/**"]
    conclusion: [failure]
permissions:
  actions: read
  contents: read
  issues: read
  pull-requests: read
safe-outputs:
  create-issue:
    max: 1
    title-prefix: "[CI failure] "
timeout-minutes: 10
---

# Investigate the failed CI run

Run ${{ github.event.workflow_run.id }} of the CI workflow in
${{ github.repository }} failed: ${{ github.event.workflow_run.html_url }}.

1. Read the run's jobs and the logs of the failed jobs, starting with the
   earliest failure.
2. Compare the failing step with the changes at
   ${{ github.event.workflow_run.head_sha }} and with the workflow file.
3. If an open issue already reports the same cause, create nothing.
4. Otherwise create one issue with the failing job and step, the evidence
   from the log, the most likely cause, and the smallest change that would
   fix it. Do not propose code. A person decides the fix.
