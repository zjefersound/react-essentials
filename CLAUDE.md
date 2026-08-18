# CLAUDE.md

Guia para trabalhar neste repositório.

## O que é

`react-essentials` é uma biblioteca de componentes React reutilizáveis (formulário + UI), documentada via Storybook e publicada como referência de padrões (`docs/*.md` descreve o uso de `SmartForm`, `SmartField`, `useForm`, `useSmartForm`, `FileInput`).

## Stack

- **Build**: Vite 5 + TypeScript 5 (`tsc -b` em modo project references — `tsconfig.app.json` para `src/`, `tsconfig.node.json` para config de build)
- **UI**: React 18, Tailwind CSS, `clsx` para classes condicionais, componentes headless do Radix UI (`@radix-ui/react-*`) como base de acessibilidade
- **Ícones**: `react-icons`
- **Documentação de componentes**: Storybook 8 (`.storybook/`, `*.stories.tsx` colocados junto ao componente, `src/stories/*.mdx` para hooks)
- **Testes**: Vitest 2 + `@testing-library/react` + `jsdom`

## Comandos

```bash
npm run dev              # servidor de dev (porta 3000)
npm run build             # tsc -b && vite build
npm run lint               # eslint --max-warnings 0
npm run test                # vitest (watch/run conforme flags)
npm run test:coverage    # vitest --coverage (thresholds 85% — ver abaixo)
npm run storybook          # storybook dev (porta 6006)
npm run build-storybook  # storybook build
```

## Estrutura

```
src/
  components/
    form/         # TextInput, Select, Checkbox, RadioGroup, Slider, Textarea,
                   # FileInput, SmartField/, SmartForm/ (hooks, utils, types)
    ui/            # Button, Dialog, Toast, Avatar, Alert, Heading, Text, Loading, Skeleton
  contexts/       # ToastContext
  hooks/           # useToast
  models/         # tipos compartilhados (ISelectOption, IValidationReturn, semanticColor)
  utils/            # helpers puros (toCurrency, printFileSize, getInitials)
  examples/        # páginas de exemplo usadas nas stories, fora do escopo de teste unitário
docs/               # documentação de uso de componentes/hooks (Markdown)
```

Muitos componentes de `form/` seguem o padrão **compound component** (`TextInput.Root`, `TextInput.Icon`, `TextInput.Input`, `FileInput.Root/.Dropzone/.Input/...`) — ao adicionar um subcomponente, exportar via objeto (`export const X = { Root, ... }`) e setar `displayName`.

## Convenções de teste

- Arquivo de teste colocado junto ao fonte: `Componente.tsx` → `Componente.test.tsx` (não há pasta `__tests__/`).
- Framework: Vitest com `globals: true` (não precisa importar `describe`/`it`/`expect`/`vi`).
- Testing Library (`render`, `fireEvent`) — ver [`TextInput.test.tsx`](src/components/form/TextInput.test.tsx) como referência de padrão (`describe` por (sub)componente).
- Preferir `getByRole`/`getByLabelText` a `getByText`/`getByPlaceholderText` quando o elemento tiver role ou label semântica — uma query que falha por falta de role/label já é um sinal de problema de acessibilidade.
- **Acessibilidade**: `vitest-axe` está configurado globalmente (`setupTests.ts` importa `vitest-axe/extend-expect`). Use `import { axe } from 'vitest-axe'` e `expect(await axe(container)).toHaveNoViolations()`.
- **Importante**: `setupTests.ts` importa `@testing-library/jest-dom/vitest` (não o `@testing-library/jest-dom` "puro"). O entrypoint padrão tipa `expect` via `JestMatchers` (de `@types/jest`), o que conflita com a augmentação de tipos do `vitest-axe` na interface `Assertion` do módulo `vitest`. Runtime é idêntico entre os dois — é só uma correção de tipagem.
- `URL.createObjectURL`/`revokeObjectURL` estão mockados globalmente em `setupTests.ts` (jsdom não os implementa; necessário para testes de `FileInput`).
- **Cobertura**: provider `v8`, configurado em `vitest.config.ts`, com `thresholds` de 85% (lines/functions/branches/statements) **globais** — aplicam a todo `src/` exceto o que está em `coverage.exclude` (stories, `examples/`, `models/`, arquivos `.d.ts`/`.config.*`, `.storybook/`, `dist/`, `main.tsx`). `npm run test:coverage` falha (exit ≠ 0) se o total cair abaixo do threshold.

## CI

`.github/workflows/lint-and-test.yml` roda `npm run lint` e `npm run test` em todo Pull Request. O gate de cobertura (`npm run test:coverage` com os thresholds acima) ainda não está no CI — planejado, ver Issues abertas referenciando a Issue #33.
