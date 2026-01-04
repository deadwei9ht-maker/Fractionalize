# Joshi's Share - GitHub Deployment Guide

You are seeing an "Auth fail" error because GitHub requires a Personal Access Token (PAT) for command-line operations, not your regular password.

**Follow these steps exactly to create and use your token. This is the only way to fix the authentication error.**

---

### Step 1: Create the Personal Access Token on GitHub

1.  **Go to GitHub Settings:**
    *   Log in to [github.com](https://github.com).
    *   Click your profile picture in the top-right corner, then click **Settings**.

2.  **Go to Developer Settings:**
    *   In the left sidebar, scroll to the bottom and click **Developer settings**.

3.  **Go to Personal Access Tokens:**
    *   In the new left sidebar, click **Personal access tokens**, then select **Tokens (classic)**.

4.  **Generate New Token:**
    *   Click **Generate new token**, then **Generate new token (classic)**.

5.  **Configure the Token:**
    *   **Note (Name):** Give the token a name, like `Joshi-Share-CLI`.
    *   **Expiration:** Set an expiration. `30 days` is a good choice.
    *   **Select scopes:** This is the most important part. **Check the box next to `repo`**. This gives the token all the repository permissions it needs.

6.  **Generate and COPY the Token:**
    *   Scroll to the bottom and click **Generate token**.
    *   **CRITICAL:** GitHub will now show you your token. **This is the only time you will ever see it.** Copy the token immediately and save it somewhere safe.

---

### Step 2: Use the Token in Your Terminal

Now that you have the token, you must run the commands to push your code.

1.  **Initialize Git (if you haven't already):**
    ```bash
    git init -b main
    ```

2.  **Add and Commit Code:**
    ```bash
    git add .
    git commit -m "Initial commit of Joshi's Share application"
    ```

3.  **Connect to your GitHub Repo:**
    ```bash
    git remote add origin https://github.com/deadwei9ht-maker/Fractionalize.git
    ```

4.  **Push Your Code (The Final Step):**
    ```bash
    git push -u origin main
    ```
    *   The terminal will ask for your `Username`. Type your GitHub username and press Enter.
    *   The terminal will ask for your `Password`. **PASTE the Personal Access Token you just copied.** Do NOT use your normal GitHub password.

After you do this, your code will be on GitHub, the `main` branch will be available, and you will be able to create a rollout.