# Development Practices

## External Bounding Box Pattern

When building panel-based layouts (e.g., character sheets, dashboards), panels should size according to external bounding boxes defined by parent containers, not hardcoded dimensions within each panel.

### Rationale

- **Separation of concerns**: Panels focus on content, parents control layout
- **Flexibility**: Change layout proportions without touching panel components
- **Consistency**: All panels use the same sizing contract (`w-full h-full`)
- **Maintainability**: Layout changes are centralized in one place

### Implementation

1. **Panel components** use `w-full h-full` on their root element
2. **Parent component** wraps each panel in a `div` with explicit width/height
3. **Use flex utilities** for non-standard fractions

### Example: 12-Column Character Sheet Layout

See `src/pages/CharacterView.tsx` for a concrete example:

| Section | Width | Height |
|---------|-------|--------|
| Ability Scores | `w-1/12` | `h-full` |
| Saving Throws | `flex-3` | `h-[30%]` |
| Skills | `flex-3` | `h-[50%]` |
| Passives | `flex-3` | `h-[20%]` |
| Combat/Status | `w-1/2` | `h-1/6` |
| Placeholder | `w-[29.17%]` | `h-full` |

### Flex Utility Reference

For non-standard fractions in a 12-column system:

| Desired | Flex Approach | Arbitrary Value |
|---------|---------------|-----------------|
| 1/12 | `w-1/12` | — |
| 1.5/12 | `flex-3` (3/24) | — |
| 3/10 | — | `h-[30%]` |
| 5/10 | — | `h-[50%]` |
| 2/10 | — | `h-[20%]` |
| 6/12 | `w-1/2` | — |
| 3.5/12 | — | `w-[29.17%]` |

### When to Use This Pattern

- Multi-panel layouts where panels share a common container
- When proportions need to be consistent across different viewports
- When layout may need to change without modifying panel internals

### When NOT to Use This Pattern

- Standalone components with intrinsic sizing needs
- Components that must maintain aspect ratios
- Nested panels with their own independent sizing
