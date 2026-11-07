#!/usr/bin/env sh
# Chapter 20 scorecard: the foundations and the flow of one repository, read-only.
# Usage: sh foundations.sh OWNER/REPO   (needs the GitHub CLI, signed in)
set -eu
REPO="${1:?usage: sh foundations.sh OWNER/REPO}"
api() { gh api "$@" 2>/dev/null; }
have() { if api "repos/$REPO/contents/$1" --silent; then echo yes; else echo no; fi; }
median() { sort -n | awk '{a[NR]=$1} END {if (NR==0) print "n/a"; else if (NR%2) print a[(NR+1)/2]; else print (a[NR/2]+a[NR/2+1])/2}'; }

DEFAULT=$(api "repos/$REPO" --jq .default_branch)
RULES=$(api "repos/$REPO/rules/branches/$DEFAULT" --jq length || echo "not visible")
WORKFLOWS=$(api "repos/$REPO/actions/workflows" --jq '[.workflows[] | select(.path | startswith(".github/workflows/"))] | length')
TESTS=$(api "repos/$REPO/contents/tests" --jq '[.[] | select(.name | endswith(".test.ts"))] | length' || echo 0)
E2E=$(api "repos/$REPO/contents/e2e" --jq '[.[] | select(.name | endswith(".spec.ts"))] | length' || echo 0)
SCANNING=$(api "repos/$REPO/code-scanning/default-setup" --jq .state || echo "not visible")
PUSHPROT=$(api "repos/$REPO" --jq '.security_and_analysis.secret_scanning_push_protection.status // "not visible"')
ENVS=$(api "repos/$REPO/environments" --jq .total_count)
DISC=$(api "repos/$REPO" --jq .has_discussions)

echo "## Foundations of $REPO (default branch: $DEFAULT)"
echo
echo "| Foundation | In this repository | Chapter |"
echo "| --- | --- | --- |"
echo "| Rules active on the default branch | $RULES | 12 |"
echo "| Workflow files | $WORKFLOWS | 11 |"
echo "| Unit and API test files; browser test files | $TESTS; $E2E | 13 |"
echo "| Code scanning default setup | $SCANNING | 15 |"
echo "| Secret scanning push protection | $PUSHPROT | 15 |"
echo "| Dependabot configuration (.github/dependabot.yml) | $(have .github/dependabot.yml) | 15 |"
echo "| Code owners (.github/CODEOWNERS) | $(have .github/CODEOWNERS) | 3 |"
echo "| Repository instructions for assistants (.github/copilot-instructions.md) | $(have .github/copilot-instructions.md) | 7 |"
echo "| Agents file (AGENTS.md) | $(have AGENTS.md) | 8 |"
echo "| Feature flag registry (server/flags.ts) | $(have server/flags.ts) | 12 |"
echo "| Deployment environments | $ENVS | 11 |"
echo "| Discussions enabled | $DISC | 4 |"
echo

LIST=$(api --paginate "repos/$REPO/pulls?state=closed&per_page=100" --jq '.[] | "\(.number) \(if .user.login == "Copilot" then "agent" elif .user.type == "Bot" then "automation" else "person" end) \(if .merged_at != null then ((((.merged_at | fromdateiso8601) - (.created_at | fromdateiso8601)) / 360 | round) / 10 | tostring) else "-" end)"' | head -30)
ROWS=$(printf '%s\n' "$LIST" | while read -r n kind hours; do
  [ -z "$n" ] && continue
  lines=$(api "repos/$REPO/pulls/$n" --jq '.additions + .deletions')
  reviewed=$(api "repos/$REPO/pulls/$n/reviews" --jq 'if ([.[] | select(.user.type == "User")] | length) > 0 then 1 else 0 end')
  echo "$n $kind $hours $lines $reviewed"
done)
COUNT=$(printf '%s\n' "$ROWS" | grep -c . || true)
RUNS=$(api "repos/$REPO/actions/runs?branch=$DEFAULT&per_page=30" --jq '.workflow_runs[] | "\(.conclusion // "none") \((((.updated_at | fromdateiso8601) - (.run_started_at | fromdateiso8601)) / 6 | round) / 10)"')
RUNCOUNT=$(printf '%s\n' "$RUNS" | grep -c . || true)
echo "## Flow of the last $COUNT closed pull requests, by who opened them"
echo
if [ "$COUNT" -eq 0 ]; then
  echo "No closed pull requests yet. The table appears once the repository has some; Chapter 3's review exercise opens the first."
else
  echo "| Opened by | Closed | Merged | Median hours to merge | Median changed lines | Reviewed by a person |"
  echo "| --- | --- | --- | --- | --- | --- |"
  for kind in person agent automation; do
    SUB=$(printf '%s\n' "$ROWS" | awk -v k="$kind" '$2==k')
    N=$(printf '%s\n' "$SUB" | grep -c . || true)
    [ "$N" -eq 0 ] && continue
    case $kind in person) LABEL="People";; agent) LABEL="The Copilot agent";; automation) LABEL="Other automation (Dependabot and apps)";; esac
    echo "| $LABEL | $N | $(printf '%s\n' "$SUB" | awk '$3!="-"' | wc -l | tr -d ' ') | $(printf '%s\n' "$SUB" | awk '$3!="-" {print $3}' | median) | $(printf '%s\n' "$SUB" | awk '{print $4}' | median) | $(printf '%s\n' "$SUB" | awk '{s+=$5} END {print s+0}') of $N |"
  done
fi
echo
echo "## Workflow runs on $DEFAULT (last $RUNCOUNT)"
echo
if [ "$RUNCOUNT" -eq 0 ]; then
  echo "No workflow runs on $DEFAULT yet; Chapter 11 enables the workflow."
else
  echo "| Measure | Value |"
  echo "| --- | --- |"
  echo "| Runs that succeeded | $(printf '%s\n' "$RUNS" | awk '$1=="success"' | wc -l | tr -d ' ') of $RUNCOUNT |"
  echo "| Median minutes per run | $(printf '%s\n' "$RUNS" | awk '{print $2}' | median) |"
fi
echo
echo "Numbers describe this repository's history, not a person. Compare them with your own earlier baseline, not with another team's; a pull request the agent opened and a person merged is the person's responsibility either way."
