// Use the vitest-specific entrypoint so jest-dom's matcher types augment
// vitest's `Assertion` interface (same interface vitest-axe augments below) —
// the default `@testing-library/jest-dom` import augments Jest's global
// types instead, which conflicts with vitest-axe's `toHaveNoViolations`.
import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';

// jsdom does not implement these Object URL APIs; FileInput relies on them
// when generating preview URLs for uploaded files.
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: () => 'blob:mock',
});
Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: () => {},
});