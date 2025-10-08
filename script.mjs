// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

// Hook up to provided modules
import { getUserIds } from "./common.mjs";
import { addData, getData } from "./storage.mjs";

const userSelect   = document.getElementById("userSelect");
const addTopicForm = document.getElementById("addTopicForm");
const agendaList   = document.getElementById("agendaList");

// ---- Helper: escape HTML to prevent injection (allows numbers, emojis, etc.)
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

// When the page loads, show all users in the dropdown
window.onload = () => {
  const users = getUserIds(); // e.g. ["1", "2","3"]
  userSelect.innerHTML =
    '<option value="">Choose a user…</option>' +
    users
      .map((u) => {
        const safeValue = escapeHTML(u);
        const safeLabel = escapeHTML(u);
        return `<option value="${safeValue}">${safeLabel}</option>`;
      })
      .join("");
};

// Default start date = today
document.getElementById("startDate").valueAsDate = new Date();

// When a user is selected, show their agenda
userSelect.addEventListener("change", (e) => {
  const userId = e.target.value;
  document.dispatchEvent(new CustomEvent("user:selected", { detail: { userId } }));
  renderAgenda(userId);
});

// When a new topic is added
addTopicForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userId         = userSelect.value;
  const rawTopicName   = document.getElementById("topicName").value.trim();
  const topicNameSafe  = escapeHTML(rawTopicName); // <-- sanitize; numbers are fine
  const startDate      = document.getElementById("startDate").value;

  if (!userId)       { alert("Please select a user."); return; }
  if (!rawTopicName) { alert("Topic name is required."); return; }
  if (!isValidDate(startDate)) { alert("Valid start date is required."); return; }

  // Calculate spaced repetition dates (+1 week, +1 month, +3 months, +6 months, +1 year)
  const dates = [
    addDays(new Date(startDate), 7),
    addMonths(new Date(startDate), 1),
    addMonths(new Date(startDate), 3),
    addMonths(new Date(startDate), 6),
    addMonths(new Date(startDate), 12),
  ];

  // Save as [{ topic, date }]
  const payload = dates.map(d => ({ topic: topicNameSafe, date: toISO(d) }));
  addData(userId, payload);

  // Reset form and refresh agenda
  addTopicForm.reset();
  document.getElementById("startDate").valueAsDate = new Date();
  renderAgenda(userId);
});

// ====== Show upcoming agenda items only ======
function renderAgenda(userId) {
  const all = getData(userId) || []; // [{topic, date:"YYYY-MM-DD"}]
  const today = startOfToday();

  const upcoming = all
    .filter(item => {
      const d = new Date(item.date);
      return !Number.isNaN(d.getTime()) && d >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!upcoming.length) {
    agendaList.innerHTML = "";
    return;
  }

  agendaList.innerHTML = upcoming
    .map(it => {
      const safeTopic = escapeHTML(it.topic); // <-- sanitize again on render
      const safeDate  = escapeHTML(it.date);  // (date is ours, but this is cheap insurance)
      return `<li><time datetime="${safeDate}">${safeDate}</time> — ${safeTopic}</li>`;
    })
    .join("");
}

// ====== Helper functions ======
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function addMonths(d, n) {
  const x = new Date(d);
  const day = x.getDate();
  x.setMonth(x.getMonth() + n);
  // Handle end-of-month (e.g., Jan 31 + 1 month → Feb 29 or 28)
  if (x.getDate() < day) x.setDate(0);
  return x;
}

function toISO(d) {
  return new Date(d).toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function isValidDate(str) {
  const d = new Date(str);
  return !Number.isNaN(d.getTime());
}
