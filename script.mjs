// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

// Hook up to provided modules
import { getUserIds } from "./common.mjs";
import { addData, getData } from "./storage.mjs";

const userSelect = document.getElementById("userSelect");
const newTopicForm = document.getElementById("addTopicForm");

// When the page loads, show all users in the dropdown
window.onload = () => {
  const users = getUserIds(); // ["Salah","Amani","Omar","Fatma","Yousef"]
  userSelect.innerHTML =
    '<option value="">Choose a user…</option>' +
    users.map((u) => `<option value="${u}">${u}</option>`).join("");
};

document.getElementById('startDate').valueAsDate = new Date();

// When a user is chosen, send an event for later features
userSelect.addEventListener("change", (e) => {
  const userId = e.target.value;
  document.dispatchEvent(new CustomEvent("user:selected", { detail: { userId } }));
});

newTopicForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userId = document.getElementById("userSelect").value;
  if (userId == "") {
    alert("Select user!");
    newTopicForm.reset();
  } else {
    const topicName = document.getElementById("topicName").value;
    const startDate = document.getElementById("startDate").value;
    addData(userId, [topicName, startDate]);
    newTopicForm.reset();
    // this line added to check if data is stored, it shod be deleted in final version
    alert("User_" + userId + " data is: " + getData(userId));
  }
});