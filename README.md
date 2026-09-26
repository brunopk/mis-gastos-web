# Mis Gastos Web

Frontend for [Mis Gastos Backend](https://github.com/brunopk/mis-gastos-backend). The scaffolding code for this project was created with `npm create vite@latest mis-gastos-web --template react-ts`, for more information about Vite, refer to [`/doc/vite.md`](/doc/vite.md).

## Installation

1. Set the corresponding values for environment variables in `.env.production`
2. Build the project with Vite :

    ```bash
    yarn build
    ```

    > By default, the output of yarn build will be placed in the dist/ folder (it will be created automatically if it does not exist).
3. Deploy the building output with a web server such as Nginx.

## Development

To run in development mode with HMR (hot module reloading):

```bash
yarn dev
```

To use [OpenSpec](https://github.com/Fission-AI/OpenSpec/) install `@fission-ai/openspec@latest` globally with `npm` :

```bash
npm install -g @fission-ai/openspec@latest
```

To install the OpenSpec skills in `.claude` directory: 

```bash
openspec init
```

To update OpenSpec skills :

Update the `@fission-ai/openspec` module :

```bash
npm install -g @fission-ai/openspec@latest
```

And then refresh the generated skills :

```bash
openspec update
```

For more information about how to install OpenSpec refer to the [Quick Start](https://github.com/Fission-AI/openspec#quick-start) of the official documentation.

## Documentation

- [`/doc/development.md`](/doc/development.md)
  
## Links

- [OpenSpec](https://github.com/Fission-AI/OpenSpec/)
