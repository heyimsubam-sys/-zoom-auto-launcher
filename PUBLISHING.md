# Publishing to the Chrome Web Store

A step-by-step guide to publishing Zoom Auto-Launcher.

---

## Step 1 — Create a Developer Account

1. Go to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay the **one-time $5 registration fee**
4. Accept the Developer Agreement

---

## Step 2 — Prepare Your Extension ZIP

Only include the files Chrome needs. Run this from the project root:

```bash
zip -r zoom-auto-launcher.zip zoom-launcher/ \
  --exclude "*.py" \
  --exclude "*.md" \
  --exclude ".git/*" \
  --exclude ".github/*" \
  --exclude "*.DS_Store"
```

Your zip should contain:
```
zoom-launcher/
  manifest.json
  background.js
  popup.html
  popup.js
  icons/
    icon16.png
    icon32.png
    icon48.png
    icon128.png
```

---

## Step 3 — Create a New Item

1. In the Developer Console, click **"New Item"**
2. Upload your `zoom-auto-launcher.zip`
3. The console will parse your manifest and show a preview

---

## Step 4 — Fill in Store Listing Details

### Required fields

| Field | Suggested Content |
|---|---|
| **Name** | Zoom Auto-Launcher |
| **Short description** (132 chars) | Automatically opens your Zoom meeting tabs at scheduled times. Never miss a meeting again. |
| **Detailed description** | See template below |
| **Category** | Productivity |
| **Language** | English |
| **Screenshots** | At least 1–5 (1280×800 or 640×400 px) |
| **Small promo tile** | 440×280 px (optional but recommended) |

### Suggested detailed description

```
Zoom Auto-Launcher automatically opens your Zoom meeting tab at the scheduled time — no more scrambling to find your invite link.

HOW IT WORKS:
• Add a meeting name, Zoom link, date & time
• Choose to open the tab at meeting time, or 2/5/10/15 minutes early
• The extension fires an alarm and opens your tab automatically
• Get a desktop notification when your meeting opens

FEATURES:
✓ One-time and weekly recurring meetings
✓ Reminder offset (open early)
✓ Desktop notifications
✓ Persistent — alarms survive browser restarts
✓ Clean, minimal popup interface
✓ No accounts or sign-in required

PRIVACY:
All data is stored locally on your device using Chrome's built-in storage. No data is sent to any server.
```

---

## Step 5 — Privacy Practices

In the "Privacy" tab:
- **Data collection**: Select "This extension does not collect or use user data"
- **Permissions justification**: You'll need to explain each permission:
  - `alarms` — Schedule meeting reminders
  - `storage` — Save meetings locally on device
  - `tabs` — Open the Zoom URL in a new tab
  - `notifications` — Alert user when meeting opens

---

## Step 6 — Submit for Review

1. Click **"Submit for Review"**
2. Chrome reviews typically take **1–3 business days**
3. You'll receive an email when approved (or if there are issues to fix)

---

## Step 7 — After Approval

- Share your Chrome Web Store link!
- Add the link to your README badge
- For updates: bump the `version` in `manifest.json`, re-zip, and upload to the console

---

## Tips

- Use real screenshots — the store listing is your first impression
- Respond to user reviews to build trust
- Monitor the "Stats" tab for installs and crashes
