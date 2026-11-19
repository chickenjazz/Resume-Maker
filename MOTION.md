---
archetype: functional
accent: scenic
intensity: quiet
engine: motion
loop_budget: 1
signature: "Dither background around the resume preview"
---

# Resume workspace motion

The resume editor remains the primary task. The user-selected React Bits Dither
component supplies a restrained decorative background outside the document.
The supplied source and usage settings are the approved direction for this integration.

## Dither settings

- Orange `#f97316` on cream `#efeae0`, halftone, four levels, two-pixel cells.
- Wave speed 0.05, frequency 3, amplitude 0.3, contrast 1.3.
- Pointer reveal radius 0.3; source intro 1.8 seconds and click ripple 1.6 seconds.
- Background opacity 0.4 on desktop and 0.2 on small screens.
- Existing UI animation timings remain as implemented; this is a scoped addition.

## Performance and accessibility

- One WebGL canvas, with DPR limited to 1 at this usage site.
- Pause the loop while off screen or while the document is hidden.
- Reduced motion shows a static field with no intro, pointer motion, or ripples.
- Keep the canvas out of the accessibility tree and the pointer hit-testing path.
- Hide the background in print/PDF output; retain the cream CSS fallback without WebGL2.

## Exceptions

The responsive header uses a 200ms transition for its background, border, shadow,
and desktop maximum width after the resume pane passes 10px of scroll. The menu
icon uses a 300ms transform transition. Both disable transitions with reduced
motion. Radix Dialog handles mobile focus trapping, Escape, and scroll-lock cleanup.

The supplied WebGL/rAF effect is an explicit user request and requires per-frame
shader rendering. It adds no animation library. Existing GSAP/Motion dependencies
and unrelated UI effects are outside this integration's scope.

## Job sticker background

The six job stickers reuse the user's selected orange-and-white comic artwork,
with warm charcoal outlines, halftone shading, glints, and action marks.
The atlas is `public/stickers/job-stickers-comic.png`, a three-column, two-row sheet.
Stickers sit above Dither and below the resume, with distinct sizes, positions,
angles, and stacking order. The stethoscope and laptop are larger anchors, while
the wrench, chef's hat, hard hat, and paintbrush vary in size and vertical position.
Below 1000px workspace width, all six form a staggered arrangement above the
document. Phones retain all six at smaller, individually chosen sizes.

- Engine: the already-installed GSAP and ScrollTrigger, explicitly requested for this effect.
- Native preview-panel scrolling drives one timeline with 0.85-second scrub smoothing.
- Transform-only travel: up to 178px and 14 degrees on wide workspaces, at most
  28px and 5 degrees in the narrow layout. No autonomous sticker loops.
- ResizeObserver refreshes the range when the document or workspace changes size.
- GSAP matchMedia reverts the timeline on reduced motion and unmount; stickers stay visible.
- Decorative, pointer-transparent, hidden from accessibility and print/PDF output.
- This scoped GSAP addition leaves the existing Motion-driven UI intact.
