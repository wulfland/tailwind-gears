#!/usr/bin/env sh
# Migration inventory for one GitHub repository, read through the GitHub CLI.
# Usage: sh inventory.sh OWNER/REPO   (needs: gh auth login; jq is not required)
# Counts what a Git mirror moves (refs) and what it does not (issues, pull
# requests, workflows, environments, secrets, rulesets, wiki, pages, LFS).
set -eu
REPO="${1:?usage: sh inventory.sh OWNER/REPO}"
count() { gh api --paginate "$1" --jq "$2" | awk '{s+=$1} END {print s+0}'; }
echo "| Item | Count or value | Moves with git push --mirror? |"
echo "| --- | --- | --- |"
echo "| Size on GitHub | $(gh api "repos/$REPO" --jq '.size') KB | yes, as Git objects |"
echo "| Branches | $(count "repos/$REPO/branches?per_page=100" 'length') | yes |"
echo "| Tags | $(count "repos/$REPO/tags?per_page=100" 'length') | yes |"
echo "| Releases | $(count "repos/$REPO/releases?per_page=100" 'length') | no, notes and assets stay |"
echo "| Pull requests, all states | $(count "repos/$REPO/pulls?state=all&per_page=100" 'length') | no |"
echo "| Issues without pull requests | $(count "repos/$REPO/issues?state=all&per_page=100" '[.[] | select(.pull_request == null)] | length') | no |"
echo "| Workflow files | $(gh api "repos/$REPO/actions/workflows" --jq '[.workflows[] | select(.path | startswith(".github/workflows/"))] | length') | files yes, run history and secrets no |"
echo "| Environments | $(gh api "repos/$REPO/environments" --jq '.total_count') | no |"
echo "| Actions secrets | $(gh api "repos/$REPO/actions/secrets" --jq '.total_count' 2>/dev/null || echo 'needs admin') | no |"
echo "| Rulesets | $(gh api "repos/$REPO/rulesets" --jq 'length') | no |"
echo "| Wiki enabled | $(gh api "repos/$REPO" --jq '.has_wiki') | separate Git repository |"
echo "| Pages enabled | $(gh api "repos/$REPO" --jq '.has_pages') | no, settings stay |"
echo "| Git LFS objects | $(git lfs ls-files 2>/dev/null | wc -l | tr -d ' ') | only with git lfs push --all |"
