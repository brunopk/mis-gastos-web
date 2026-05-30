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

For more information read `/doc/development.md`.

