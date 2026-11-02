# Release verification — 0.1.0

Verified on 2 November 2026.

## Automated checks

`npm run check` passes. `npm test` passes all 15 tests, covering:

- HTML escaping and validation of malformed stored records.
- Restoring drafts without skipping required learning steps.
- Blocked storage and exhausted storage quota.
- Duplicate-safe saves that preserve existing reflections.
- Completeness of the three curated paths.
- Simulation convergence, overshooting, and finite results across all 729 available control combinations.
- HTTP assets, MIME types, HEAD requests, method rejection, malformed URLs, private-file isolation, and response headers.

## Browser flow

| Step | Check | Result |
| --- | --- | --- |
| 1. Entry | Situation entry, blank-field validation, category filters, help dialog | Passed |
| 2. Explore | All three paths, incorrect and correct feedback, disabled progression, simulation controls | Passed |
| 3. Connect | Mapping fields, navigation, draft restoration after reload | Passed |
| 4. Apply | Action and evidence fields, transfer questions, review screen | Passed |
| 5. Keep learning | Saving, reflections, repeated saves, undo removal, JSON download | Passed |

The university-work, language, and everyday-decisions paths were completed in the browser. Reload preserved mapping text and simulator settings. Re-saving retained the existing reflection and did not increase the note count. The downloaded JSON contained notes and the current draft.

Responsive checks covered desktop and 390px and 320px viewport settings. A navigation overflow at the smallest setting was fixed and rechecked. The inspected home, library, review, and narrow simulation screens reflow without horizontal scrolling. All inspected inputs have labels. The help dialog supports Escape dismissal and returns focus to its opener. No JavaScript errors were captured after the fixes.

## Fixed issues

- Drafts and simulation settings disappeared after reload.
- Repeated saves could create duplicate notes.
- Selecting an incorrect answer after a correct one could leave progression enabled.
- Storage errors were transient and notes lacked an export option.
- Removal had no undo.
- Category filtering discarded keyboard focus.
- Selecting a supplied example did not immediately persist it.
- The smallest mobile navigation overflowed.
- Dialog naming, skip navigation, muted text contrast, and reduced-motion handling needed improvement.
- Third-party font requests created an unnecessary external dependency.
- Source files lacked formatting, regression coverage, and deployment documentation.

## Limits

Browser checks used the desktop Chromium-based browser and viewport overrides, not physical mobile devices. This is not a complete screen-reader or WCAG conformance audit. Storage-error recovery is covered by unit tests; browser-wide storage denial was not injected into the live page. The suite does not establish educational effectiveness or validate user-entered answers. The release remains a curated early-access product, without live AI, accounts, or cloud synchronization.
