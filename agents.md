# Development Practices

## Git operations
Agents are not permitted to use git commands on this project. Human developers must first review the code generated and are the only users permitted to use git commands within the scope of this project.

## Implementation Practices

### Functional Programming
Functions and components should be as close to pure functions as possible. These should be well encapsulated and avoid side effects if possible. If the feature is impossible without side effects, limit the blast radius of these side effects to as many components or functions as possible

## Testing Practices

### Test Driven Development
All code within the project must follow a test-driven development model where tests outlining behavior must be written before implementing any real business logic. Tests should be well encapsulated and should utilize mocks when applicable.

### Running Tests
When working on a feature only run tests that directly test the feature in question. Only run multiple test suites for behavior that spans multiple components. This should be rare as components and other typescript functions should be well encapsulated and avoid side effects

## State Management and Contexts
In order to preserve vite fast refresh we should have separate files for context providers and actual context functions and hooks. Hooks, functions and types should live in a file that ends in Context and the actual provider element should export its own react component.

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
