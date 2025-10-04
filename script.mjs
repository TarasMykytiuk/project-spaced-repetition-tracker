// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

// Hook up to provided modules
import { getUserIds } from "./common.mjs";

const userSelect = document.getElementById("userSelect");

// When the page loads, show all users in the dropdown
window.onload = () => {
  const users = getUserIds(); // ["Salah","Amani","Omar","Fatma","Yousef"]
  userSelect.innerHTML =
    '<option value="">Choose a user…</option>' +
    users.map((u) => `<option value="${u}">${u}</option>`).join("");
};

// When a user is chosen, send an event for later features
userSelect.addEventListener("change", (e) => {
  const userId = e.target.value;
  document.dispatchEvent(new CustomEvent("user:selected", { detail: { userId } }));
});