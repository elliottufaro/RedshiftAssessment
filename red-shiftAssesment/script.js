"use strict";

const btnEnter = document.querySelector(".enterButton");
const log = document.querySelector(".logInput");
const usersIDs = new Set(); // initialize variables
const pageCodes = new Set();
const userPages = new Map();
const twoPgUsers = new Set();
const pageVisits = new Map();
const pageVisitsArr = [];
const earlyUsers = new Set();

const processLog = function (logStr) {
  const logArr = logStr.split(","); //split each log into it's 4 components
  const UID = logArr[0].trim(); // set each component to a variable and trim any whitespace
  const email = logArr[1].trim();
  const dateTime = logArr[2].trim();
  const hour = parseInt(dateTime[11] + dateTime[12]); // extract the hr portion of the string of the time
  const PID = logArr[3].trim();
  usersIDs.add(UID + " - " + email);
  pageCodes.add(PID);
  userPages.has(email) // if the email is present then simply add the PID to the set otherwise create the set
    ? userPages.get(email).add(PID)
    : userPages.set(email, new Set([PID]));

  pageVisits.has(PID)
    ? pageVisits.set(PID, pageVisits.get(PID) + 1) // if the page is present in the map then simply the increment it's val otherwise add it to the map
    : pageVisits.set(PID, 1);
  if (hour < 8 && hour >= 1) earlyUsers.add(email); // check to see if the user is accessing the page betweeen 1 AM and 8 AM.
};

btnEnter.addEventListener("click", function (e) {
  //Listen for click on the enter button
  e.preventDefault();

  const logs = document.querySelector(".logInput").value; //Load in the inputted logs
  const logsRaw = logs.split("|"); //Split by the pipe dividing each log
  usersIDs.clear(); // Clear out all the sets and maps so that inputs don't carry over to subsequent Enter clicks
  pageCodes.clear();
  userPages.clear();
  twoPgUsers.clear();
  pageVisits.clear();
  pageVisitsArr.length = 0;
  earlyUsers.clear();
  logsRaw.forEach(function (logStr) {
    //process each log
    processLog(logStr);
  });
  userPages.forEach((val, key) => {
    // if a user has accessed 2 or more pages add them to the list
    if (val.size >= 2) {
      twoPgUsers.add(key);
    }
  });

  pageVisits.forEach((val, key) => {
    // create an array of arrays from the map of pages and their number of visits for sorting
    pageVisitsArr.push([key, val]);
  });
  pageVisitsArr.sort((b, a) => a[1] - b[1]); // sort each page by it's number of visits descending order
  const outputPageVisits = [];
  for (let i = 0; i < pageVisitsArr.length && i < 10; i++) {
    // format the pages
    outputPageVisits.push(
      `${i + 1}. ${pageVisitsArr[i][0]} - ${pageVisitsArr[i][1]}`
    );
  }
  document.getElementById("unique_User_IDs").textContent = [...usersIDs].join(
    //update all the html boxes with the contents of the output arrays
    "\n"
  );
  document.getElementById("unique_Page_Codes").textContent = [
    ...pageCodes,
  ].join("\n");
  document.getElementById("two_Page_Users").textContent = [...twoPgUsers].join(
    "\n"
  );
  document.getElementById("top_Ten").textContent = [...outputPageVisits].join(
    "\n"
  );
  document.getElementById("early_Birds").textContent = [...earlyUsers].join(
    "\n"
  );
});
