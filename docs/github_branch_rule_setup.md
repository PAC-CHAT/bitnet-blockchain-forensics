# GitHub branch rule setup (disabled enforcement)

This note documents how to create a branch rule in GitHub with **disabled enforcement**, matching the URL pattern:

`/settings/rules/new?target=branch&enforcement=disabled`

## Steps

1. Open repository settings and navigate to **Rules**.
2. Select **New ruleset** and choose **Branch** as the target.
3. In **Enforcement status**, choose **Disabled**.
4. Configure the branch name pattern (for example `main`, `release/*`, or `work`).
5. Add any desired protections (pull request requirements, checks, restrictions), keeping enforcement disabled while drafting.
6. Save the ruleset.

## Why use disabled enforcement first?

- Lets maintainers preview and socialize policy changes before activation.
- Prevents immediate disruption for active contributors.
- Makes it easier to iterate on branch patterns and required checks.

## Activation checklist

Before switching enforcement to active, confirm:

- Required CI checks are stable and fast.
- Merge strategy matches release workflows.
- Admin/team bypass behavior is explicitly reviewed.
- Contributors are informed of the policy change.
