// background.js — Service Worker for Zoom Auto-Launcher

// ─── On Extension Install / Update ───────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  restoreAllAlarms();
});

// Restore alarms after browser restart (service workers don't persist)
chrome.runtime.onStartup.addListener(() => {
  restoreAllAlarms();
});

// ─── Alarm Fired ─────────────────────────────────────────────────────────────
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const { meetings } = await chrome.storage.local.get("meetings");
  if (!meetings) return;

  const meeting = meetings.find((m) => m.id === alarm.name);
  if (!meeting) return;

  // Open the Zoom URL in a new tab
  chrome.tabs.create({ url: meeting.url, active: true });

  // Show a notification
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "🎥 Zoom Meeting Starting!",
    message: `"${meeting.name}" is starting now. Opening your meeting tab…`,
    priority: 2,
  });

  // If it's a one-time meeting, clean it up after it fires
  if (!meeting.recurring) {
    const updated = meetings.filter((m) => m.id !== meeting.id);
    await chrome.storage.local.set({ meetings: updated });
  }
});

// ─── Messages from Popup ──────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SCHEDULE_MEETING") {
    scheduleMeeting(message.meeting).then(() => sendResponse({ ok: true }));
    return true; // Keep channel open for async
  }
  if (message.type === "DELETE_MEETING") {
    deleteMeeting(message.id).then(() => sendResponse({ ok: true }));
    return true;
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Schedule (or reschedule) a single meeting alarm.
 * meeting = { id, name, url, scheduledTime (ISO string), recurring, recurringDays }
 */
async function scheduleMeeting(meeting) {
  const { meetings = [] } = await chrome.storage.local.get("meetings");

  // Upsert
  const index = meetings.findIndex((m) => m.id === meeting.id);
  if (index >= 0) {
    meetings[index] = meeting;
  } else {
    meetings.push(meeting);
  }
  await chrome.storage.local.set({ meetings });

  // Clear any existing alarm with this id
  await chrome.alarms.clear(meeting.id);

  const fireTime = new Date(meeting.scheduledTime).getTime();
  const now = Date.now();

  if (meeting.recurring) {
    // Weekly recurring: fire at the next occurrence of the chosen day+time
    const periodInMinutes = 7 * 24 * 60; // 1 week
    const when = fireTime > now ? fireTime : nextWeeklyOccurrence(meeting);
    chrome.alarms.create(meeting.id, { when, periodInMinutes });
  } else {
    // One-time: only schedule if in the future
    if (fireTime > now) {
      chrome.alarms.create(meeting.id, { when: fireTime });
    }
  }
}

/** Delete a meeting from storage and clear its alarm */
async function deleteMeeting(id) {
  const { meetings = [] } = await chrome.storage.local.get("meetings");
  const updated = meetings.filter((m) => m.id !== id);
  await chrome.storage.local.set({ meetings: updated });
  await chrome.alarms.clear(id);
}

/** Re-register all stored alarms (called on startup) */
async function restoreAllAlarms() {
  const { meetings = [] } = await chrome.storage.local.get("meetings");
  for (const meeting of meetings) {
    await scheduleMeeting(meeting);
  }
}

/**
 * For a recurring meeting whose base scheduledTime may be in the past,
 * calculate the next weekly fire time.
 */
function nextWeeklyOccurrence(meeting) {
  const base = new Date(meeting.scheduledTime);
  const now = new Date();
  const candidate = new Date(now);

  // Set same hours/minutes as original
  candidate.setHours(base.getHours(), base.getMinutes(), 0, 0);

  // Advance to the correct weekday
  const targetDay = base.getDay(); // 0=Sun … 6=Sat
  while (candidate.getDay() !== targetDay || candidate <= now) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate.getTime();
}
