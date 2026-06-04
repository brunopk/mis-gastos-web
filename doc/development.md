<!-- TODO: explain how to use Google authentication (set corresponding environment variables VITE_GOOGLE_CLIENT_ID etc.) and how to modify PrivateRoute.tsx -->

# Code conventions

## Sections

All files (TSX and TS files) are organized in **sections** and each section should be **labeled**.

**Interfaces**

```ts
/**************************************************************************************************/
/*                                          INTERFACES                                            */
/**************************************************************************************************/
```

**Types**

```ts
/**************************************************************************************************/
/*                                              TYPES                                             */
/**************************************************************************************************/
```

**Constants**

```ts
/**************************************************************************************************/
/*                                            CONSTANTS                                           */
/**************************************************************************************************/
```

**Functions**

```ts
/**************************************************************************************************/
/*                                           FUNCTIONS                                            */
/**************************************************************************************************/
```

**Main component**

```ts
/**************************************************************************************************/
/*                                         MAIN COMPONENT                                         */
/**************************************************************************************************/
```

**Hook (function)**

```ts
/**************************************************************************************************/
/*                                              HOOK                                              */
/**************************************************************************************************/
```

**Exports**

```ts
/**************************************************************************************************/
/*                                           EXPORTS                                              */
/**************************************************************************************************/
```

## TSX file ordering convention
  
1. Imports
2. Interfaces
3. Types (type aliases)
4. Other constants
5. Constants (Mui.styled(...) components)
6. Helper functions
7. Main component
8. Exports

Notes:

- Use `interface` instead of `type` if possible.
- Use `function` for the main component.
- If some `interface` must be exported, declare it and export it at the end of the file, before the `export default ...`.

## TS (hooks) file ordering convention
  
1. Imports
2. Interfaces
3. Types
4. Constants
5. Helper functions
6. Hook (function)
7. Exports

# Claude Code

## OpenSpec

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec/) with Claude. The most important folders are these:

- `.claude`
- `openspec`

To install OpenSpec follow instructions in the [Quick Start](https://github.com/Fission-AI/OpenSpec/#quick-start) section of the [OpenSpec](https://github.com/Fission-AI/OpenSpec/) GitHub repository.

## Configure Claude Code with a custom API key

1. Generate the API key in https://platform.claude.com/settings/workspaces/default/keys
2. Set the `ANTHROPIC_API_KEY` the environment variable in `~/.zshrc` or the corresponding shell configuration file : 

    ```bash
    export ANTHROPIC_API_KEY="sk-ant-..."  # paste your key from platform.claude.com
    ```

3. Start Claude Code and configure it to use this API key **not** the default login

<br>

> **This is important to use prompt caching to reduce cost.**

## Configuring Claude Code status line to show token usage

1. Open Claude Code
2. Invoke the `/statusline` command and tell it to use [`statusline-command.sh`](/.claude/statusline-command.sh) :

    ```bash
    /statusline @.claude/statusline-command.sh use this script 
    ```

## Troubleshooting

### Status line shows all 0

- Check if `jq` is installed

# Links

- [Fission-AI OpenSpec](https://github.com/Fission-AI/OpenSpec/)
