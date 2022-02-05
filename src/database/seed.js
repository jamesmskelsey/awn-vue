/* 
This file was really only ever used once to do an initial load to make sure I
I had some data to work with. It's really not important.
I did spend some time moving code around before I remembered that, though. :\
*/
const { db } = require("./db.js");

// https://github.com/d3/d3-dsv
const { csvParse } = require("d3-dsv");
// https://momentjs.com/
const moment = require("moment");

const fs = require("fs");
const fileName = "./WN_ADHOC.csv";
/*
const wcRef = db.collection('work_centers');

// Database is now loaded with these work centers, leaving for reference.

const wcs = ["CE06", "ES01", "ER09", "SS08", "EM01", "EA01", "DA01", "DB01", "ER03", "CE05", "SS05", "CE01", "MH01", "EA05", "HE01", "EA02", "ER04", "WG03", "NN01", "V101", "SS06", "WG01", "CC03", "EE01", "IM03", "OI01", "OT01", "SERV", "EM02", "EE03", "SS03", "CC01", "AS01", "ER01", "CSF3", "IM02", "SS02", "EE02", "IM01", "CC02", "EA03", "CSF4", "SS01", "MD01", "IM04", "V402", "CH01", "EX04", "V401", "EE04", "CE02", "AS02", "EX01", "CSF1", "EB14", "EXSA", "OC01", "OZ01", "OE01", "V301", "CE07", "OD01", "V102", "WG02", "CSF2", "CSE1", "CE03", "VI01", "EM03", "NECC", "OW02", "CS02", "CE04"];

*/

// wn means "Work notification" and each one is a "job" that must be completed on the ship
const wnRef = db.collection("wns");

/*
  jobs: an array of 'job' objects, formatted in the csvParse method below
  Uploads the jobs to firebase, which updates each record as necessary.
  This allows a user to download data from "AWN" on the ship and then simply import
  the new data and not worry about overwriting local changes (as in the comments a user might have made)
*/
function uploadJobsFromArray(jobs) {
  console.info(`Uploading: ${jobs.length} jobs.`);
  Promise.all(jobs.map((job) => uploadJob(job))).then(() => {
    // There's no need to actually do anything with them at this point, as I want the user to do their search on the home page
    // to get the information they wanted.
    console.info("Uploaded all jobs");
  });
}

// Upload a single job
function uploadJob(job) {
  return wnRef.doc(job.id).set(job);
}

// Basically a class at this point, to parse reports. When I wrote this,
// I didn't have access to classes because I was in ie11 browser directly.

function parseReport(e) {
  function parseDateStringToMoment(str) {
    return str != ""
      ? moment(
          str
            .split("")
            .filter((i) => i != "=" && i != '"')
            .join(""),
          "MM/DD/YYYY"
        )
      : "";
  }
  function formatDateString(str) {
    return parseDateStringToMoment(str) != ""
      ? parseDateStringToMoment(str).format("DD MMM YY")
      : "";
  }
  function reviewDate(str, wd) {
    const dateDiscovered = parseDateStringToMoment(wd);
    // Strip the last date that looks like a review date out
    const reviewArray = [
      ...str.matchAll(
        /((?:\d|\d\d)\/\d\d\/\d\d\d\d).*(?:\r|\n|\r\n).*(?:R.*V.*W(?:ED|D)*)/g
      ),
    ];

    // return that as the last actual day reviewed... as a moment object.
    if (reviewArray.length == 0) {
      return dateDiscovered;
    } else {
      return moment(reviewArray[reviewArray.length - 1][1], "MM/DD/YYYY");
    }
  }
  function actualReviewDate(str, wd) {
    return reviewDate(str, wd).format("DD MMM YY");
  }
  function expiredReviewDate(str, wd) {
    return reviewDate(str, wd).isBefore(new moment().subtract(90, "days"));
  }
  function lastReviewedBy(str) {
    var arr = [
      ...str.matchAll(
        /([A-Z]+,\s[A-Z]).*(?:\r|\n|\r\n).*(?:R.*V.*W(?:ED|D)?)/g
      ),
    ];
    if (arr.length == 0) {
      return "originator";
    } else {
      return arr[arr.length - 1][1];
    }
  }
  // 'data' becomes a collection of rows from the awn report
  let result = csvParse(e, (d) => {
    return {
      id: d.JCN.substring(5),
      work_center: d.WORKCENTER,
      location: d.LOCATION,
      equipment: d.EQUIPMENT,
      sn: d.SERIAL_NUMBER,
      summary: d.SUMMARY,
      jcn: d.JCN.substring(9),
      problem: d.PROBLEM,
      recommendation: d.RECOMMENDATION,
      ships_force_comments: d.SHIPS_FORCE_COMMENTS.split("")
        .filter((l) => l != "*")
        .join(""),
      equip_status: d.EQUIP_STATUS_CODE,
      status: d.JOB_STATUS,
      priority_code: d.PRIORITY_CODE.split("")
        .filter((i) => i != "=" && i != '"')
        .join(""),
      act_taken: d.ACTION_TAKEN_CODE,
      avail: d.AVAIL_ID,
      type_avail: d.TYPE_AVAILABILITY_CODE.split("")
        .filter((i) => i != "=" && i != '"')
        .join(""),
      port_eng_comments: d.MAINTENANCE_TEAM_COMMENTS,
      safety_code: d.SAFETY_CODE,
      problem_mentions_safety:
        d.PROBLEM.toLowerCase().search(/safety|unsafe/g) > -1,
      recommendation_mentions_safety:
        d.RECOMMENDATION.toLowerCase().search(/safety|unsafe/g) > -1,
      completion_date: formatDateString(d.COMPLETION_DATE),
      date_discovered: formatDateString(d.WHEN_DISCOVERED_DATE),
      deferral_date: formatDateString(d.DEFERRAL_DATE),
      deferral_reason: d.DEFERRAL_REASON_CODE.split("")
        .filter((i) => i != "=" && i != '"')
        .join(""),
      actual_solution: d.ACTUAL_SOLUTION,
      should_have_parts:
        d.RECOMMENDATION.toLowerCase().search(
          /part|order|requisition|open purchase/g
        ) > -1,
      parts: d.PARTS_ORDERED,
      routing_level: d.ROUTING_LEVEL,
      block_10: d.BLOCK_10,
      days_old: d.DAYS_OLD.split("")
        .filter((i) => i != "=" && i != '"')
        .join(""),
      days_since_update: d.DAYS_SINCE_UPDATE.split("")
        .filter((i) => i != "=" && i != '"')
        .join(""),
      actual_reviewed_date: actualReviewDate(
        d.SHIPS_FORCE_COMMENTS,
        d.WHEN_DISCOVERED_DATE
      ),
      expired_reviewed_date: expiredReviewDate(
        d.SHIPS_FORCE_COMMENTS,
        d.WHEN_DISCOVERED_DATE
      ),
      reviewed_by: lastReviewedBy(d.SHIPS_FORCE_COMMENTS),
    };
  }).filter((i) => {
    return i.id != "";
  });
  // The trailing filter here removes any jobs that AWN returned to me that were garbage.
  // AWN had a problem where it gave me empty, dead jobs that should have been removed but... just never were.
  // They ONLY showed up when we did a datapull. Caused quite the alarm, if I recall correctly.

  // Dispatch with the result array. That pushes all the jobs to firebase.
  uploadJobsFromArray(result);
}

fs.readFile(fileName, "utf8", (err, contents) => {
  if (err) throw err;
  parseReport(contents);
});
