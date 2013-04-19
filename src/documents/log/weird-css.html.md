---
title: Weird CSS
---

----
## CSS3 Animations
1. Using CSS animations on `.head, .foot` will cause sync issues between the involved DOM elements during the animation. On the other hand if you add the same class `.animate-parts` to all the involved DOM elements the sync issues will be reduced.
- Animating `transform` on an element while its children are position absolute and/or have a static transform on their own, will cause animation sync issues.


