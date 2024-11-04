"use strict";

const btnEnter = document.querySelector(".enterButton");
const log = document.querySelector(".logInput");
// const UID = document.querySelector();
const usersIDs = new Set();
const pageCodes = new Set();
const userPages = new Map();
const twoPgUsers = new Set();
let pageVisits = new Map();
let pageVisitsArr = [];
const earlyUsers = new Set();

const processLog = function (logStr) {
  const logArr = logStr.split(",");
  const UID = logArr[0].trim();
  const email = logArr[1].trim();
  const dateTime = logArr[2].trim();
  const hour = parseInt(dateTime[11] + dateTime[12]);
  const PID = logArr[3].trim();
  usersIDs.add(UID + " - " + email);
  pageCodes.add(PID);
  userPages.has(email)
    ? userPages.get(email).add(PID)
    : userPages.set(email, new Set([PID]));

  pageVisits.has(PID)
    ? pageVisits.set(PID, pageVisits.get(PID) + 1)
    : pageVisits.set(PID, 1);
  if (hour < 8 && hour >= 1) earlyUsers.add(email);
};

btnEnter.addEventListener("click", function (e) {
  e.preventDefault();
  const logs = document.querySelector(".logInput").value;

  const logsRaw = logs.split("|");
  pageVisits = new Map();
  pageVisitsArr = [];
  logsRaw.forEach(function (logStr) {
    processLog(logStr);
  });
  userPages.forEach((val, key) => {
    if (val.size >= 2) {
      twoPgUsers.add(key);
    }
  });

  pageVisits.forEach((val, key) => {
    pageVisitsArr.push([key, val]);
  });
  pageVisitsArr.sort((b, a) => a[1] - b[1]);
  console.log(pageVisitsArr);
  const outputPageVisits = [];
  for (let i = 0; i < pageVisitsArr.length && i < 10; i++) {
    outputPageVisits.push(
      `${i + 1}. ${pageVisitsArr[i][0]} - ${pageVisitsArr[i][1]}`
    );
  }
  document.getElementById("unique_User_IDs").textContent = [...usersIDs].join(
    "\n"
  );
  document.getElementById(`unique_Page_Codes`).textContent = [
    ...pageCodes,
  ].join("\n");
  document.getElementById(`two_Page_Users`).textContent = [...twoPgUsers].join(
    "\n"
  );
  document.getElementById(`top_Ten`).textContent = [...outputPageVisits].join(
    "\n"
  );
  document.getElementById(`early_Birds`).textContent = [...earlyUsers].join(
    "\n"
  );

  //   console.log(twoPgUsers);
});
