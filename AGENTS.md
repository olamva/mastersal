# Parallel work

A task is done only when its pull request is merged into `main`. If a step is blocked, report the status and the blocker.

Use one T3 thread, one worktree, and one branch for each task. Rename the T3 branch with `git branch -m` if necessary.
If T3 skips the `Setup Worktree` action from `t3.json`, run its command before edits.
Keep edits in the task worktree.

Coordinate changes to shared state with concurrent agents:

- the main checkout and its `.git` directory, including the stash
- the Vite dev server port `5173`
- the production API at `https://mastersal.vercel.app` and the Vinstraff and Online APIs behind it
- the Neon production database, the Vercel project, and GitHub settings

## Pull requests

Run `pnpm format`, `pnpm test`, `pnpm typecheck`, and `pnpm build` before you push.
Merge `origin/main` into the task branch before you push.
Explain the change and the validation in the PR description.
Enable auto-merge with `gh pr merge --auto --merge` after you push. Do not wait for user review when there are no visual changes.
Wait with `gh pr checks --watch --fail-fast`. Then run `gh pr view --json state,mergeStateStatus`.
Fix failed checks and push again. If the state is `BEHIND`, merge `origin/main` and push.
Resolve each review thread.
Do not force-push, bypass branch protection, or use `gh pr merge --admin`.

## Visual review

Get explicit user approval for each visual change that is not a minor correction. When you are not sure, get approval.
Capture before and after screenshots of the running app with `mcp__t3_code__preview_snapshot` and `save: true`. Embed each `screenshotPath`.
Copy other images to `~/.t3/userdata/attachments` before you embed them.
Create the "before" checkout with `git worktree add --detach` under `/tmp`. Remove it with `git worktree remove`.
Enable auto-merge only after approval. Record the approval in the PR description.

## Cleanup

Do not watch the Vercel deployment. Start cleanup when the PR state is `MERGED`.
Run `pnpm worktree:cleanup . <pr-number> --branch-only --apply` in the task worktree.
Stop each dev server and preview process that you started.
Never force worktree removal. Report the cleanup status in the final response.
