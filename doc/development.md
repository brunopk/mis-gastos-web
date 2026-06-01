# TODO: explain how to use Google authentication (set corresponding environment variables VITE_GOOGLE_CLIENT_ID etc.) and how to modify PrivateRoute.tsx

# Claude

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec/) with Claude. The most important folders are these:

- `.claude`
- `openspec`

To install OpenSpec follow instructions in the [Quick Start](https://github.com/Fission-AI/OpenSpec/#quick-start) section of the [OpenSpec](https://github.com/Fission-AI/OpenSpec/) GitHub repository.

**Important:**

Configure Claude Code with a custom API key to use prompt caching :

1. Generate the API key in https://platform.claude.com/settings/workspaces/default/keys
2. Set the `ANTHROPIC_API_KEY` the environment variable in `~/.zshrc` or the corresponding shell configuration file : 

    ```bash
    export ANTHROPIC_API_KEY="sk-ant-..."  # paste your key from platform.claude.com
    ```

3. Start Claude Code and configure it to use this API key **not** the default login

Also, it's **very useful** to set the status bar to show token usage : 

1. Open Claude Code
2. Invoke the `/statusline` command and tell it to use [`statusline-command.sh`](/.claude/statusline-command.sh) :

    ```bash
    /statusline @.claude/statusline-command.sh use this script 
    ```

# Links

- [Fission-AI OpenSpec](https://github.com/Fission-AI/OpenSpec/)
