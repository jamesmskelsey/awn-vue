const { db } = require('./db.js');


/*
const wcRef = db.collection('work_centers');

// Database is now loaded with these work centers, leaving for reference.

const wcs = ["CE06", "ES01", "ER09", "SS08", "EM01", "EA01", "DA01", "DB01", "ER03", "CE05", "SS05", "CE01", "MH01", "EA05", "HE01", "EA02", "ER04", "WG03", "NN01", "V101", "SS06", "WG01", "CC03", "EE01", "IM03", "OI01", "OT01", "SERV", "EM02", "EE03", "SS03", "CC01", "AS01", "ER01", "CSF3", "IM02", "SS02", "EE02", "IM01", "CC02", "EA03", "CSF4", "SS01", "MD01", "IM04", "V402", "CH01", "EX04", "V401", "EE04", "CE02", "AS02", "EX01", "CSF1", "EB14", "EXSA", "OC01", "OZ01", "OE01", "V301", "CE07", "OD01", "V102", "WG02", "CSF2", "CSE1", "CE03", "VI01", "EM03", "NECC", "OW02", "CS02", "CE04"];

wcs.forEach(wc => {
    wcRef.doc(wc).set({
        wc
    })
})
*/

const wnRef = db.collection('wns');

function uploadJobsFromArray(jobs) {
    console.log("Uploading: ", jobs.length, " jobs.")
    Promise.all(jobs.map(job => uploadJob(job))).then((values) => {
        console.log("uploaded all jobs");
    })
}

function uploadJob(job) {
    return wnRef.doc(job.id).set(job);
}

const {csvParse} = require('d3-dsv');
const moment = require('moment');

function parseReport(e) {
    function parseDateStringToMoment(str) {
        return str != "" ? moment(str.split('').filter(i => i != '=' && i != '"').join(''), "MM/DD/YYYY") : "";
    }
    function formatDateString(str) {
        return parseDateStringToMoment(str) != "" ? parseDateStringToMoment(str).format('DD MMM YY') : "";
    }
    function reviewDate(str, wd) {
        const dateDiscovered = parseDateStringToMoment(wd);
        // Strip the last date that looks like a review date out
        var arr = [...str.matchAll(/((?:\d|\d\d)\/\d\d\/\d\d\d\d).*\n.*(?:R.*V.*W(?:ED|D))/g)]
        // return that as the last actual day reviewed... as a moment object.
        if (arr.length == 0) {
            return dateDiscovered;
        } else {
            return moment(arr[arr.length - 1][1], "MM/DD/YYYY");
        }
    }
    function actualReviewDate(str, wd) {
        return reviewDate(str, wd).format('DD MMM YY');
    }
    function expiredReviewDate(str, wd) {
        return reviewDate(str, wd).isBefore(new moment().subtract(90, 'days'))
    }
    function lastReviewedBy(str) {
        var arr = [...str.matchAll(/([A-Z]+,\s[A-Z]).*\n.*(?:R.*V.*W(?:ED|D))/g)];
        if (arr.length == 0) {
            return "originator"
        } else {
            return arr[arr.length - 1][1];
        }
    }
    // 'data' becomes a collection of rows from the awn report
    let result = csvParse(e, function(d) {
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
            ships_force_comments: d.SHIPS_FORCE_COMMENTS.split('').filter(l => l != '*').join(''),
            equip_status: d.EQUIP_STATUS_CODE,
            status: d.JOB_STATUS,
            priority_code: d.PRIORITY_CODE,
            act_taken: d.ACTION_TAKEN_CODE,
            avail: d.AVAIL_ID,
            type_avail: d.TYPE_AVAILABILITY_CODE.split('').filter(i => i != '=' && i != '"').join(''),
            port_eng_comments: d.MAINTENANCE_TEAM_COMMENTS,
            safety_code: d.SAFETY_CODE,
            problem_mentions_safety: d.PROBLEM.toLowerCase().search(/safety|unsafe/g) > -1,
            recommendation_mentions_safety: d.RECOMMENDATION.toLowerCase().search(/safety|unsafe/g) > -1,
            completion_date: formatDateString(d.COMPLETION_DATE),
            date_discovered: formatDateString(d.WHEN_DISCOVERED_DATE),
            deferral_date: formatDateString(d.DEFERRAL_DATE),
            deferral_reason: d.DEFERRAL_REASON_CODE.split('').filter(i => i != '=' && i != '"').join(''),
            actual_solution: d.ACTUAL_SOLUTION,
            should_have_parts: d.RECOMMENDATION.toLowerCase().search(/part|order|requisition|open purchase/g) > -1,
            parts: d.PARTS_ORDERED,
            routing_level: d.ROUTING_LEVEL,
            block_10: d.BLOCK_10,
            days_old: d.DAYS_OLD.split('').filter(i => i != '=' && i != '"').join(''),
            days_since_update: d.DAYS_SINCE_UPDATE.split('').filter(i => i != '=' && i != '"').join(''),
            actual_reviewed_date: actualReviewDate(d.SHIPS_FORCE_COMMENTS, d.WHEN_DISCOVERED_DATE),
            expired_reviewed_date: expiredReviewDate(d.SHIPS_FORCE_COMMENTS, d.WHEN_DISCOVERED_DATE),
            reviewed_by: lastReviewedBy(d.SHIPS_FORCE_COMMENTS),
        }
    }).filter(i => i.location != "").filter(i => i.id != "");
    // The trailing filter here removes any jobs that AWN returned to me that were garbage.
    
    // Dispatch with the result array. That pushes all the jobs to firebase.
    
    uploadJobsFromArray(result);
}


const fs = require('fs');
const fileName = "./WN_ADHOC.csv";

fs.readFile(fileName, 'utf8', (err, contents) => {
    if (err) throw err;
    parseReport(contents);
})