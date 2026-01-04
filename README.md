
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.


## How to Fix Your Git Repository Connection

Your local machine is pointed to the wrong Git repository. To fix this, please run the following two commands in your terminal.

**Step 1: Remove the old, incorrect remote address.**

```bash
git remote remove origin
```

**Step 2: Add the correct remote address for "Fractionalize".**

You must replace `<YOUR_CORRECT_URL>` with the actual URL from your `Fractionalize` repository page on GitHub.

```bash
git remote add origin <YOUR_CORRECT_URL>
```

After running these two commands, your local project will be correctly linked to your `Fractionalize` repository. You can then push your code using `git push --set-upstream origin master` (or `main`).
