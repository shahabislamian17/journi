# GitHub Push Protection - Stripe Keys Detected

GitHub detected Stripe API keys in your git history. You have two options:

## Option 1: Allow the Push (Recommended for Test Keys)

Since these are **test keys** (sk_test_ and pk_test_), you can allow the push:

1. Visit this URL to allow the secret:
   https://github.com/shahabislamian17/journi/security/secret-scanning/unblock-secret/381gKkW57dUJJ7Bc28IvTZ1ClR7

2. Then push again:
   ```bash
   git push origin main
   ```

## Option 2: Remove Keys from History (Complex)

If you want to completely remove the keys from history, you'll need to:
1. Use `git filter-branch` or BFG Repo-Cleaner
2. Force push (requires coordination with team)

**Note:** The keys are already removed from current files and replaced with environment variables. The detection is from old commits in history.

## Current Status

✅ Stripe keys removed from:
- `VERCEL-SETUP.md`
- `components/layouts/inc/layouts/checkout/Checkout.js`
- `components/layouts/inc/layouts/checkout/confirmation/Prompt.js`
- `backend/routes/stripe.js`

⚠️ Keys still in git history (old commits):
- `legacy/inc/classes/stripe/*.php`
- `payment/classes/stripe/*.php`

These are test keys, so Option 1 is safe and easiest.

