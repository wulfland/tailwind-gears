#!/usr/bin/env sh
# Migration inventory for one GitHub repository, read through the GitHub CLI.
# Usage: sh inventory.sh OWNER/REPO   (needs: gh auth login; jq is not required)
# Counts what a Git mirror moves (refs) and what it does not (issues, pull
# requests, workflows, environments, secrets, rulesets, wiki, pages, LFS).
# Every row reads the named repository, never the directory the script runs in.
set -eu
REPO="${1:?usage: sh inventory.sh OWNER/REPO}"
count() { gh api --paginate "$1" --jq "$2" | awk '{s+=$1} END {print s+0}'; }
# Git LFS: the tracking rules (filter=lfs) in every .gitattributes file of the
# default branch. They show whether LFS is in use, not how many objects exist.
lfs_rules() {
  gh api "repos/$REPO/git/trees/HEAD?recursive=1" \
    --jq '.tree[]? | select(.path | test("(^|/)\\.gitattributes$")) | .sha' 2>/dev/null |
    while read -r sha; do
      case "$sha" in *[!0-9a-f]*) continue ;; esac
      gh api -H 'Accept: application/vnd.github.raw' "repos/$REPO/git/blobs/$sha"
    done | grep -c 'filter=lfs' || true
}
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
echo "| Git LFS tracking rules in .gitattributes | $(lfs_rules) | objects only with git lfs push --all |"
