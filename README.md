# 🎥 Zoom Auto-Launcher — Chrome Extension

> Never miss a meeting again. Schedule your Zoom links and let the extension open them automatically at meeting time.

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![Manifest](https://img.shields.io/badge/manifest-v3-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-orange?style=flat-square)

---

## ✨ Features

- **Auto-open Zoom tabs** — the extension opens your meeting in a new tab exactly when it's time
- **Reminder offset** — choose to open the tab 2, 5, 10, or 15 minutes *before* the meeting starts
- **Weekly recurring meetings** — schedule once, fire every week automatically
- **Desktop notifications** — get a system notification when your meeting tab opens
- **Persistent storage** — alarms survive browser restarts; meetings are saved to Chrome storage
- **Clean popup UI** — add, view, and delete meetings in one click

---

## 📁 Project Structure

```
zoom-launcher/
├── manifest.json        # Chrome Extension Manifest V3
├── background.js        # Service worker — handles alarms & opens tabs
├── popup.html           # Extension popup UI
├── popup.js             # Popup logic (add/delete/list meetings)
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── generate_icons.py    # Script to regenerate PNG icons
```

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/zoom-auto-launcher.git
cd zoom-auto-launcher
```

### 2. Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. Select the `zoom-launcher/` folder

The extension icon will appear in your Chrome toolbar.

### 3. Use it

1. Click the extension icon
2. Enter your meeting name, Zoom link, date, and time
3. Choose how many minutes early to open the tab
4. Hit **Schedule Meeting**
5. At the scheduled time, Chrome will open your Zoom link automatically 🎉

---

## 🔧 How It Works

| Component | Role |
|---|---|
| `manifest.json` | Declares permissions: `alarms`, `storage`, `tabs`, `notifications` |
| `background.js` | Service worker. Listens for `chrome.alarms`, opens tabs, shows notifications |
| `popup.html/js` | The UI. Sends `SCHEDULE_MEETING` / `DELETE_MEETING` messages to the background worker |
| `chrome.storage.local` | Persists meetings across sessions and browser restarts |

**Alarm flow:**
```
User clicks "Schedule" → popup.js sends message → background.js creates chrome.alarm
                                                          ↓ (at fire time)
                                               chrome.tabs.create opens Zoom URL
                                               chrome.notifications.create fires
```

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Ideas for future features:**
- [ ] Google Calendar sync — import meetings automatically
- [ ] Multiple Zoom accounts support
- [ ] Sound alert option
- [ ] Dark/light theme toggle
- [ ] Export/import meeting list
- [ ] Support for Teams, Meet, and other video platforms

To contribute:
1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 🏪 Publishing to the Chrome Web Store

See the full publishing guide in [PUBLISHING.md](PUBLISHING.md).

**Quick summary:**
1. Zip the extension folder (excluding dev files)
2. Create a [Chrome Web Store Developer account](https://chrome.google.com/webstore/devconsole) ($5 one-time fee)
3. Upload the zip, fill in store listing details
4. Submit for review (~1–3 business days)

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

## 🙋 Author

Built by **[Your Name]** — [GitHub](https://github.com/YOUR_USERNAME)

If this helps you, give it a ⭐ and share it!
