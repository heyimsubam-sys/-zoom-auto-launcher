// popup.js — Zoom Auto-Launcher UI Logic

// ─── DOM refs ────────────────────────────────────────────────────────────────
const tabs       = document.querySelectorAll(".tab");
const panels     = document.querySelectorAll(".panel");
const btnSave    = document.getElementById("btnSave");
const listEl     = document.getElementById("meetingsList");
const toast      = document.getElementById("toast");

// Form inputs
const inp = {
  name:     document.getElementById("meetingName"),
  url:      document.getElementById("meetingUrl"),
  date:     document.getElementById("meetingDate"),
  time:     document.getElementById("meetingTime"),
  recur:    document.getElementById("isRecurring"),
  reminder: document.getElementById("reminderOffset"),
};

// ─── Tab switching ────────────────────────────────────────────────────────────
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add("active");
    if (tab.dataset.tab === "meetings") renderMeetings();
  });
});

// ─── Pre-fill today's date ────────────────────────────────────────────────────
inp.date.value = new Date().toISOString().split("T")[0];

// ─── Save Meeting ─────────────────────────────────────────────────────────────
btnSave.addEventListener("click", async () => {
  const name     = inp.name.value.trim();
  const url      = inp.url.value.trim();
  const date     = inp.date.value;
  const time     = inp.time.value;
  const recur    = inp.recur.checked;
  const offset   = parseInt(inp.reminder.value, 10);

  // Validation
  if (!name)             return showToast("Please enter a meeting name.");
  if (!isValidZoomUrl(url)) return showToast("Please enter a valid Zoom link.");
  if (!date || !time)    return showToast("Please choose a date and time.");

  // Compute fire time (subtract reminder offset)
  const scheduledTime = new Date(`${date}T${time}`);
  scheduledTime.setMinutes(scheduledTime.getMinutes() - offset);

  if (!recur && scheduledTime <= new Date()) {
    return showToast("That time has already passed.");
  }

  const meeting = {
    id:            crypto.randomUUID(),
    name,
    url,
    scheduledTime: scheduledTime.toISOString(),
    recurring:     recur,
    reminderOffset: offset,
    createdAt:     new Date().toISOString(),
  };

  chrome.runtime.sendMessage({ type: "SCHEDULE_MEETING", meeting }, () => {
    showToast("Meeting scheduled! ✓", "success");
    resetForm();
  });
});

// ─── Render Meetings List ─────────────────────────────────────────────────────
async function renderMeetings() {
  const { meetings = [] } = await chrome.storage.local.get("meetings");
  listEl.innerHTML = "";

  if (meetings.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="big">📅</div>
        <p>No meetings scheduled yet.<br>Head to "Add Meeting" to get started.</p>
      </div>`;
    return;
  }

  // Sort soonest first
  const sorted = [...meetings].sort(
    (a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)
  );

  sorted.forEach((m) => {
    const isPast = !m.recurring && new Date(m.scheduledTime) < new Date();
    const card = document.createElement("div");
    card.className = "meeting-card";
    card.innerHTML = `
      <div class="meeting-dot ${isPast ? "past" : ""}"></div>
      <div class="meeting-info">
        <div class="meeting-name">
          ${escHtml(m.name)}
          ${m.recurring ? '<span class="meeting-badge">Weekly</span>' : ""}
        </div>
        <div class="meeting-meta">${formatTime(m.scheduledTime, m.reminderOffset)}</div>
        <div class="meeting-meta" style="margin-top:2px;opacity:.6;font-size:10px;">${escHtml(m.url)}</div>
      </div>
      <button class="btn-icon" data-id="${m.id}" title="Delete">✕</button>
    `;
    card.querySelector(".btn-icon").addEventListener("click", (e) => {
      deleteMeeting(e.currentTarget.dataset.id);
    });
    listEl.appendChild(card);
  });
}

async function deleteMeeting(id) {
  chrome.runtime.sendMessage({ type: "DELETE_MEETING", id }, () => {
    showToast("Meeting removed.");
    renderMeetings();
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isValidZoomUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.includes("zoom.us") || u.hostname.includes("zoom.com");
  } catch { return false; }
}

function formatTime(isoString, offset = 0) {
  const d = new Date(isoString);
  const actual = new Date(d.getTime() + offset * 60 * 1000); // display meeting time
  return actual.toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  }) + (offset > 0 ? ` (opens ${offset}m early)` : "");
}

function escHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function resetForm() {
  inp.name.value = "";
  inp.url.value  = "";
  inp.time.value = "";
  inp.recur.checked = false;
  inp.reminder.value = "5";
  inp.date.value = new Date().toISOString().split("T")[0];
}

let toastTimer;
function showToast(msg, type = "") {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove("show"); }, 2600);
}
