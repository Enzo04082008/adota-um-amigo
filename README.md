# React + Vite

## Publicação

No Netlify, `netlify.toml` configura a compilação com `npm run build` e a publicação da pasta `dist`. Os arquivos JavaScript e as imagens usam o caminho base `/`, pois o site é servido na raiz do domínio.

O workflow existente do GitHub Pages mantém o caminho base `/adota-um-amigo/` quando `GITHUB_ACTIONS=true`. Assim, cada plataforma carrega os arquivos no endereço correto, evitando a tela branca causada por caminhos incompatíveis.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
