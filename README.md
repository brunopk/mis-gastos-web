# Mis gastos web

TODO: improve documentation explaining how to set nginx in Home Assistant

User interface for Mis gastos. It's built with React. The scaffolding code for this project was created with `npm create vite@latest mis-gastos-web --template react-ts`, for more information see [this](/doc/vite.md) small documentation about Vite.

## Installation

### Requirements to install Mis gastos web in Home Assistant

- [Home Assistant Add-on: NGINX Home Assistant SSL proxy](https://github.com/home-assistant/addons/tree/master/nginx_proxy)

1. Set the corresponding values for environment variables in `.env.production`
2. Build the project with Vite :

    ```bash
    yarn build
    ```

## Development

To run in development mode with HMR (hot module reloading):

```bash
yarn dev
```

## Links

- [Home Assistant Add-on: NGINX Home Assistant SSL proxy](https://github.com/home-assistant/addons/tree/master/nginx_proxy).
