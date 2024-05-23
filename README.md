# 2024-gastro

**usage:**

- `❯ git clone https://github.com/hastebrot/2024-gastro`
- `❯ cd 2024-gastro/gastro-app/`
- `❯ bun install`
- `❯ bun run dev --port 5678`
- `❯ open -a safari --url "http://localhost:5678/"`

---

**initial setup:**

vite frontend tooling

- `❯ bun create vite gastro-app --template react-swc-ts`
- `❯ cd gastro-app/`
- `❯ bun install`
- `❯ bun run dev --port 5678`
- `❯ open -a safari --url "http://localhost:5678/"`
- `❯ bunx --bun vite build`
- more: https://bun.sh/guides/ecosystem/vite

tailwind css

- `❯ bun add -d tailwindcss postcss autoprefixer`
- `❯ bunx tailwindcss init --postcss --esm`
- more: https://tailwindcss.com/docs/guides/vite

clsx helper

- `❯ bun add -d clsx`

lucide icons

- `❯ bun add -d lucide-react`

routing

- `❯ bun add -d react-router-dom`
- more: https://reactrouter.com/en/main/start/tutorial

state handling

- `❯ bun add -d zod valtio@1.11.3`

react aria components

- `❯ bun add -d react-aria-components`
- more: https://react-spectrum.adobe.com/react-aria/components.html
- more: https://react-spectrum.adobe.com/react-aria/internationalization.html
