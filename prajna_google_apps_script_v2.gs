/**
 * PRAJNA 2026 Database Sync & Automated Notifications - Google Apps Script
 * 
 * FEATURES:
 * 1. Excel Report Sync: Automatically creates & updates a clear, formatted Google Sheet ("Prajna 2026 Submissions Report") in Drive for downloading Excel reports.
 * 2. High-Speed API Sync: Stores & updates submissions.json on Google Drive for web app performance.
 * 3. Automated Email Notifications:
 *    - Sends confirmation email to Idea Submitter (Team Lead & Guide Teacher).
 *    - Sends admin alert copy to Personal Email ID.
 *    - Intimates team automatically when Organiser requests a revision.
 * 4. Automated WhatsApp Notification:
 *    - Sends instant alert from official WhatsApp number to Personal WhatsApp number on idea submission.
 * 
 * INSTRUCTIONS FOR DEPLOYMENT / UPDATE:
 * 1. Open https://script.google.com and open your Prajna script project.
 * 2. Replace all code with this updated script.
 * 3. Set ADMIN_PERSONAL_EMAIL and ADMIN_PERSONAL_PHONE below to your actual personal email & WhatsApp number.
 * 4. Click Save (disk icon).
 * 5. Click Deploy > Manage deployments > Edit > New version > Deploy.
 */

// ==================== CONFIGURATION SETTINGS ====================

// Google Drive Storage Config
const FOLDER_ID = "11_a2poPbp1-djB69ewu-fNOdMfmtybyr";
const FILE_NAME = "submissions.json";
const SPREADSHEET_NAME = "Prajna 2026 Submissions Database Report";

// Admin Personal Contact Details (Receives alerts when submitter submits an idea)
const ADMIN_PERSONAL_EMAIL = "ibhaarathi@gmail.com"; // Your personal email ID
const ADMIN_PERSONAL_PHONE = "+918870888634";    // Your personal WhatsApp number with country code (+91...)

// WhatsApp Gateway Provider Configuration
// Options: "META" (Meta Cloud API), "TWILIO" (Twilio WhatsApp API), "CALLMEBOT" (Free CallMeBot API), "LOG_ONLY"
const WHATSAPP_PROVIDER = "META";

// Meta WhatsApp Business API Config (If using Meta Cloud API)
const META_WHATSAPP_TOKEN = "YOUR_META_ACCESS_TOKEN";
const META_PHONE_NUMBER_ID = "YOUR_META_PHONE_NUMBER_ID";

// Twilio WhatsApp Config (If using Twilio)
const TWILIO_ACCOUNT_SID = "YOUR_TWILIO_ACCOUNT_SID";
const TWILIO_AUTH_TOKEN = "YOUR_TWILIO_AUTH_TOKEN";
const TWILIO_FROM_PHONE = "whatsapp:+14155238886";

// CallMeBot Config (If using CallMeBot free API)
const CALLMEBOT_API_KEY = "YOUR_CALLMEBOT_API_KEY";


// ==================== v2 CONFIGURATION (ADDED 2026-09-04) ====================
// Google Drive backup folder (photos + backup sheets)
const PHOTO_BACKUP_FOLDER_ID = "1jQ52mtmYgUi_vNPbYfrAHtitllzhVJBZ";
// Server-side organiser passcodes (no longer exposed in frontend code)
const ORGANISER_PASSCODES = ["ORGANISER2026", "PRAJNA2026", "ADMIN", "ORGANISER", "PRAJNA"];
// ==================== API HANDLERS ====================

const DELETED_IDS_FILE_NAME = "deleted_ids.json";

function getDeletedIdsList(folder) {
  try {
    var files = folder.getFilesByName(DELETED_IDS_FILE_NAME);
    if (files.hasNext()) {
      var content = files.next().getBlob().getDataAsString();
      var parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {}
  return [];
}

function saveDeletedIdsList(folder, deletedIds) {
  try {
    var files = folder.getFilesByName(DELETED_IDS_FILE_NAME);
    var content = JSON.stringify(deletedIds);
    if (files.hasNext()) {
      files.next().setContent(content);
    } else {
      var f = folder.createFile(DELETED_IDS_FILE_NAME, content, "application/json");
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }
  } catch (e) {}
}

// 1. GET request handler: Reads and returns submissions list from Google Drive (filtering out deleted tombstones)
function doGet() {
  try {
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var deletedIds = getDeletedIdsList(folder);
    var files = folder.getFilesByName(FILE_NAME);
    var content = "[]";
    
    if (files.hasNext()) {
      var file = files.next();
      content = file.getBlob().getDataAsString();
    }
    
    var parsed = [];
    try { parsed = JSON.parse(content); } catch(e) { parsed = []; }
    if (!Array.isArray(parsed)) parsed = [];
    
    // Filter out blacklisted deleted IDs
    var cleanList = parsed.filter(function(item) {
      return item && item.id && deletedIds.indexOf(String(item.id)) === -1;
    });
    
    return ContentService.createTextOutput(JSON.stringify(cleanList))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. POST request handler: Saves updated submissions list, handles explicit delete/clear_all, updates Excel Spreadsheet, and triggers automated notifications
function doPost(e) {
  try {
    var rawJson = e.postData.contents;
    var parsed = JSON.parse(rawJson);
    
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var deletedIds = getDeletedIdsList(folder);
    
    // ACTION 1: EXPLICIT CLEAR ALL DATABASE RECORDS
    if (parsed && parsed.action === "clear_all") {
      var files = folder.getFilesByName(FILE_NAME);
      if (files.hasNext()) {
        files.next().setContent("[]");
      }
      saveDeletedIdsList(folder, []);
      syncSubmissionsToGoogleSheet([]);
      
      Logger.log("Clear All triggered: Database and tombstone list emptied.");
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "All database records and deleted tombstones cleared successfully."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // ACTION 2: EXPLICIT DELETE SPECIFIC SUBMISSION (TOMBSTONE BLACKLISTING)
    if (parsed && parsed.action === "delete" && parsed.id) {
      var deleteId = String(parsed.id);
      if (deletedIds.indexOf(deleteId) === -1) {
        deletedIds.push(deleteId);
        saveDeletedIdsList(folder, deletedIds);
      }
      
      // Read current submissions file and filter out deleted ID
      var files = folder.getFilesByName(FILE_NAME);
      var currentSubs = [];
      var fileObj;
      if (files.hasNext()) {
        fileObj = files.next();
        try {
          currentSubs = JSON.parse(fileObj.getBlob().getDataAsString());
        } catch(e) { currentSubs = []; }
      }
      
      var filteredSubs = (Array.isArray(currentSubs) ? currentSubs : []).filter(function(s) {
        return s && String(s.id) !== deleteId;
      });
      
      // Save updated JSON list to Drive
      var outputJson = JSON.stringify(filteredSubs);
      if (fileObj) {
        fileObj.setContent(outputJson);
      } else {
        fileObj = folder.createFile(FILE_NAME, outputJson, "application/json");
        fileObj.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      }
      
      // Sync updated list to Google Sheet report
      syncSubmissionsToGoogleSheet(filteredSubs);
      
      Logger.log("Explicit deletion of entry ID: " + deleteId + ". Recorded in tombstone blacklist.");
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Entry " + deleteId + " permanently deleted and blacklisted.",
        count: filteredSubs.length
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // ==================== v2 ACTIONS (ADDED 2026-09-04) ====================
    // BACKUP DATABASE - create timestamped snapshot before any write
    if (parsed && parsed.action === "backup_database") {
      snapshotDatabase(folder, parsed.label || "MANUAL");
      return ContentService.createTextOutput(JSON.stringify({
        status: "success", message: "Database snapshot created."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // UPLOAD PHOTO TO DRIVE
    if (parsed && parsed.action === "upload_photo") {
      var photoResult = uploadPhotoToDrive(parsed);
      return ContentService.createTextOutput(JSON.stringify(photoResult))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // UPDATE SHEET PHOTO LINKS
    if (parsed && parsed.action === "update_sheet_photo_links") {
      var sheetPhotoResult = updateSheetPhotoLinks(parsed);
      return ContentService.createTextOutput(JSON.stringify(sheetPhotoResult))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // CREATE BACKUP SPREADSHEET
    if (parsed && parsed.action === "create_backup_sheet") {
      var backupResult = createBackupSpreadsheet();
      return ContentService.createTextOutput(JSON.stringify(backupResult))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // AUTHENTICATE ORGANISER (server-side passcode validation)
    if (parsed && parsed.action === "authenticate_organiser") {
      var code = String(parsed.passcode || "").trim().toUpperCase();
      if (ORGANISER_PASSCODES.indexOf(code) !== -1) {
        var token = "ORG_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10000);
        saveOrganiserToken(folder, token);
        return ContentService.createTextOutput(JSON.stringify({
          status: "success", token: token
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error", message: "Invalid passcode."
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // ==================== END v2 ACTIONS ====================
        // ACTION 3: STANDARD PAYLOAD SUBMISSION / SYNC
    // v2: Auto-backup before any standard sync write
    snapshotDatabase(folder, "PRE-SYNC");
    var newSubmissionsList = [];
    if (Array.isArray(parsed)) {
      newSubmissionsList = parsed;
    } else if (parsed && parsed.submissions && Array.isArray(parsed.submissions)) {
      newSubmissionsList = parsed.submissions;
    } else if (parsed && parsed.id && parsed.team) {
      newSubmissionsList = [parsed];
    } else {
      throw new Error("Invalid data format: Submissions must be sent as a JSON array or submission object.");
    }

    // HARD FILTER: Filter out ANY submission whose ID is in deletedIds tombstone blacklist
    var validSubmissionsList = newSubmissionsList.filter(function(sub) {
      if (!sub || !sub.id) return false;
      return deletedIds.indexOf(String(sub.id)) === -1;
    });

    // Get existing submissions from Google Drive
    var files = folder.getFilesByName(FILE_NAME);
    var existingSubmissions = [];
    var file;

    if (files.hasNext()) {
      file = files.next();
      try {
        existingSubmissions = JSON.parse(file.getBlob().getDataAsString());
      } catch (err) {
        existingSubmissions = [];
      }
    }

    if (!Array.isArray(existingSubmissions)) existingSubmissions = [];

    // Trigger automated background notifications ONLY for non-blacklisted valid entries
    processAutomatedNotifications(validSubmissionsList, existingSubmissions);

    // Merge incoming submissions with existing submissions (newer entries take precedence, existing entries preserved)
    var mergedMap = {};
    var finalMergedList = [];
    
    // 1. Add incoming updated submissions
    for (var i = 0; i < validSubmissionsList.length; i++) {
      var sub = validSubmissionsList[i];
      if (sub && sub.id && deletedIds.indexOf(String(sub.id)) === -1) {
        var subIdStr = String(sub.id);
        mergedMap[subIdStr] = sub;
        finalMergedList.push(sub);
      }
    }
    
    // 2. Append any existing submissions that were not in incoming payload and not deleted
    for (var j = 0; j < existingSubmissions.length; j++) {
      var ex = existingSubmissions[j];
      if (ex && ex.id) {
        var exIdStr = String(ex.id);
        if (!mergedMap[exIdStr] && deletedIds.indexOf(exIdStr) === -1) {
          mergedMap[exIdStr] = ex;
          finalMergedList.push(ex);
        }
      }
    }

    // Save updated merged JSON list to Google Drive
    var outputJson = JSON.stringify(finalMergedList);
    if (file) {
      file.setContent(outputJson);
    } else {
      file = folder.createFile(FILE_NAME, outputJson, "application/json");
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }
    
    // Sync structured rows to Google Sheet (Excel Spreadsheet Report)
    syncSubmissionsToGoogleSheet(finalMergedList);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      count: finalMergedList.length 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== EXCEL SPREADSHEET REPORT GENERATOR ====================

function syncSubmissionsToGoogleSheet(submissionsList) {
  try {
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var files = folder.getFilesByName(SPREADSHEET_NAME);
    var ss;
    
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create(SPREADSHEET_NAME);
      var ssFile = DriveApp.getFileById(ss.getId());
      folder.addFile(ssFile);
      try { DriveApp.getRootFolder().removeFile(ssFile); } catch(e) {}
    }
    
    var sheet = ss.getSheetByName("Submissions Report");
    if (!sheet) {
      sheet = ss.getActiveSheet();
      sheet.setName("Submissions Report");
    }
    
    sheet.clear(); // Fresh clear for clean formatted table
    
    var headers = [
      "Submission Date", "Registration ID", "Audit Status", "Organiser Remarks",
      "School Name", "School District", "Team Name", "Team Category",
      "Team Lead Name", "Team Lead Phone", "Team Lead Email",
      "Student Member 2", "Student Member 3",
      "Guide Teacher Name", "Guide Teacher Phone", "Guide Teacher Email",
      "Problem Title", "Location", "Govt Dept Responsible", "Stakeholders Affected", "Why Problem Matters",
      "Close-Up Photo", "Wide-Angle Photo", "Team On-Site Photo", "Video Link",
      "Solution Summary", "Uniqueness", "Resources Required", "Estimated Cost (INR)", "Estimated Timeframe",
      "Startup Viability", "Paying Stakeholders", "Mapped UN SDGs", "Used AI", "AI Tools & Purposes"
    ];
    
    sheet.appendRow(headers);
    
    // Professional Header Formatting (Maroon Background & Gold Text)
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#8B0000"); // Maroon
    headerRange.setFontColor("#FFD700");   // Gold
    headerRange.setHorizontalAlignment("center");
    headerRange.setFontSize(10);
    sheet.setFrozenRows(1);
    
    if (!submissionsList || submissionsList.length === 0) return;
    
    var rows = [];
    for (var i = 0; i < submissionsList.length; i++) {
      var s = submissionsList[i];
      if (!s) continue;
      
      var team = s.team || {};
      var problem = s.problem || {};
      var solution = s.solution || {};
      var sdg = s.sdg || {};
      var ai = s.ai || {};
      var audit = s.auditInfo || {};
      
      var sdgsStr = (sdg.selectedSdgs || []).join(", ");
      var aiToolsStr = ai.usedAI === "Yes" ? ((ai.aiTools || []).join(", ") + " | " + (ai.aiPurposes || []).join(", ")) : "No AI Used";
      var payingStr = (solution.whoWouldPay || []).join(", ");
      
      rows.push([
        s.submissionDate || "",
        s.id || "",
        audit.status || "PENDING_APPROVAL",
        audit.remark || "",
        team.schoolName || "",
        team.schoolDistrict || "",
        team.teamName || "",
        team.teamCategory || "",
        team.teamLeadName || "",
        team.teamLeadPhone || "",
        team.teamLeadEmail || "",
        team.member2Name || "",
        team.member3Name || "",
        team.guideTeacherName || "",
        team.guideTeacherPhone || "",
        team.guideTeacherEmail || "",
        problem.problemTitle || "",
        problem.problemLocation || "",
        problem.responsibleDept || "",
        problem.stakeholdersAffected || "",
        problem.whyItMatters || "",
        problem.photoCloseUp ? "Uploaded" : "Missing",
        problem.photoWideAngle ? "Uploaded" : "Missing",
        problem.photoTeamOnSite ? "Uploaded" : "Missing",
        problem.videoUrl || "N/A",
        solution.solutionSummary || "",
        solution.uniqueness || "",
        solution.resourcesRequired || "",
        solution.estimatedCost || "",
        solution.estimatedTime || "",
        solution.canBecomeStartup || "",
        payingStr,
        sdgsStr,
        ai.usedAI || "No",
        aiToolsStr
      ]);
    }
    
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      sheet.getRange(2, 1, rows.length, headers.length).setWrapText(true);
      
      // Apply status column styling
      for (var r = 0; r < rows.length; r++) {
        var statusCell = sheet.getRange(r + 2, 3);
        var st = rows[r][2];
        if (st === "VERIFIED") {
          statusCell.setBackground("#d1fae5").setFontColor("#065f46").setFontWeight("bold");
        } else if (st === "REVISION_REQUESTED") {
          statusCell.setBackground("#ffedd5").setFontColor("#c2410c").setFontWeight("bold");
        } else if (st === "REJECTED") {
          statusCell.setBackground("#ffe4e6").setFontColor("#9f1239").setFontWeight("bold");
        } else {
          statusCell.setBackground("#fef3c7").setFontColor("#92400e").setFontWeight("bold");
        }
      }
    }
    
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  } catch (err) {
    Logger.log("Error syncing to Google Sheet: " + err.toString());
  }
}

// ==================== AUTOMATED NOTIFICATION CONTROLLER ====================

function processAutomatedNotifications(newList, oldList) {
  if (!newList || !Array.isArray(newList)) {
    Logger.log("processAutomatedNotifications skipped: newList is undefined. (To test manually in Apps Script editor, run 'testSendNewSubmissionEmails' instead).");
    return;
  }
  if (!oldList || !Array.isArray(oldList)) {
    oldList = [];
  }

  // SAFEGUARD: If oldList was empty (e.g. initial script deployment or after database reset/clear),
  // do NOT trigger bulk email alerts for all entries in a batch payload.
  if (oldList.length === 0 && newList.length > 1) {
    Logger.log("Bulk sync / batch payload detected (" + newList.length + " items). Suppressing automated email alerts to prevent notification spam.");
    return;
  }

  var oldMap = {};
  for (var i = 0; i < oldList.length; i++) {
    if (oldList[i] && oldList[i].id) {
      oldMap[oldList[i].id] = oldList[i];
    }
  }

  if (newList.length < oldList.length) {
    Logger.log("Entry deletion processed: previous count " + oldList.length + ", new count " + newList.length);
  }

  for (var j = 0; j < newList.length; j++) {
    var sub = newList[j];
    if (!sub || !sub.id) continue;

    var existing = oldMap[sub.id];

    // Case 1: NEW IDEA SUBMISSION GENERATED
    if (!existing) {
      // Send Email to Submitter & Personal Mail ID
      sendNewSubmissionEmails(sub);
      // Send WhatsApp message from official number to personal WhatsApp number
      sendWhatsAppAlertToPersonalPhone(sub);
    } 
    // Case 2: REVISION REQUESTED BY ORGANISER
    else {
      var oldStatus = existing.auditInfo ? existing.auditInfo.status : "";
      var newStatus = sub.auditInfo ? sub.auditInfo.status : "";
      
      if (newStatus === "REVISION_REQUESTED" && oldStatus !== "REVISION_REQUESTED") {
        sendRevisionRequestedEmailToTeam(sub);
      }
    }
  }
}

// ==================== EMAIL NOTIFICATION HANDLERS ====================

function sendNewSubmissionEmails(sub) {
  try {
    if (!sub) {
      Logger.log("sendNewSubmissionEmails skipped: 'sub' parameter is undefined. (To test manually in Apps Script editor, run 'testSendNewSubmissionEmails' instead).");
      return;
    }

    var teamLeadEmail = sub.team ? sub.team.teamLeadEmail : "";
    var guideEmail = sub.team ? sub.team.guideTeacherEmail : "";
    var teamLeadName = sub.team ? sub.team.teamLeadName : "Team Lead";
    var teamName = sub.team ? sub.team.teamName : "Innovation Team";
    var schoolName = sub.team ? sub.team.schoolName : "School";
    var problemTitle = sub.problem ? sub.problem.problemTitle : "Innovation Proposal";
    var subId = sub.id || "PRJ-2026";
    
    // 1. Email to Submitter (Team Lead & Guide Teacher)
    var submitterRecipients = [teamLeadEmail, guideEmail].filter(Boolean).join(",");
    if (submitterRecipients.length > 0) {
      var submitterSubject = "[PRAJNA 2026] Confirmation: Idea Submission Received (" + subId + ")";
      var submitterHtml = 
        "<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #D4AF37; border-radius: 12px; padding: 20px; background-color: #FAFAFA;'>" +
          "<div style='background-color: #4A0000; padding: 15px; text-align: center; border-radius: 8px; color: #FFD700; font-weight: bold; font-size: 20px;'>" +
            "PRAJNA 2026 INNOVATION PORTAL" +
          "</div>" +
          "<h2 style='color: #4A0000;'>Submission Received Successfully!</h2>" +
          "<p>Dear <strong>" + teamLeadName + "</strong> and Team <strong>" + teamName + "</strong>,</p>" +
          "<p>Thank you for submitting your innovation proposal for <strong>PRAJNA 2026</strong>. Your submission has been securely recorded and sent to the Organiser Audit Panel for verification.</p>" +
          "<div style='background: #FFF; border-left: 4px solid #D4AF37; padding: 12px; margin: 15px 0;'>" +
            "<p style='margin: 4px 0;'><strong>Registration ID:</strong> " + subId + "</p>" +
            "<p style='margin: 4px 0;'><strong>School Name:</strong> " + schoolName + "</p>" +
            "<p style='margin: 4px 0;'><strong>Problem Title:</strong> " + problemTitle + "</p>" +
            "<p style='margin: 4px 0;'><strong>Status:</strong> Pending Organiser Verification</p>" +
          "</div>" +
          "<p>Our panel will inspect field photos and proposal completeness. If any revision is required, you will receive an update here.</p>" +
          "<p style='font-size: 12px; color: #777;'>Team Prajna 2026 Secretariat</p>" +
        "</div>";

      MailApp.sendEmail({
        to: submitterRecipients,
        subject: submitterSubject,
        htmlBody: submitterHtml
      });
      Logger.log("Confirmation email sent to submitters: " + submitterRecipients);
    }

    // 2. Email to Personal Admin Mail ID
    if (ADMIN_PERSONAL_EMAIL && !ADMIN_PERSONAL_EMAIL.includes("personal@aiif.in")) {
      var adminSubject = "🚨 [NEW IDEA SUBMITTED] " + teamName + " - " + problemTitle + " (" + subId + ")";
      var teamLeadPhoneClean = (sub.team ? sub.team.teamLeadPhone : "").replace(/[^0-9]/g, "");
      if (teamLeadPhoneClean.length === 10) teamLeadPhoneClean = "91" + teamLeadPhoneClean;
      var waDirectUrl = "https://wa.me/" + teamLeadPhoneClean + "?text=" + encodeURIComponent("Hello Team " + teamName + " (" + subId + "), we received your Prajna 2026 idea submission for " + problemTitle + ".");

      var adminHtml = 
        "<div style='font-family: Arial, sans-serif; color: #111; max-width: 650px; margin: auto; border: 2px solid #8B0000; border-radius: 12px; padding: 20px; background-color: #FFF8F0;'>" +
          "<div style='background-color: #8B0000; padding: 15px; color: #FFD700; font-weight: bold; font-size: 18px; border-radius: 6px;'>" +
            "🚨 PRAJNA 2026: NEW IDEA SUBMISSION GENERATED" +
          "</div>" +
          "<h3>Submission Dossier (" + subId + ")</h3>" +
          "<ul>" +
            "<li><strong>Team Name:</strong> " + teamName + "</li>" +
            "<li><strong>School:</strong> " + schoolName + " (" + (sub.team ? sub.team.schoolDistrict : "") + ")</li>" +
            "<li><strong>Team Lead:</strong> " + teamLeadName + " (Ph: " + (sub.team ? sub.team.teamLeadPhone : "") + ")</li>" +
            "<li><strong>Guide Teacher:</strong> " + (sub.team ? sub.team.guideTeacherName : "") + " (Ph: " + (sub.team ? sub.team.guideTeacherPhone : "") + ")</li>" +
            "<li><strong>Problem Title:</strong> " + problemTitle + "</li>" +
            "<li><strong>Location:</strong> " + (sub.problem ? sub.problem.problemLocation : "") + "</li>" +
            "<li><strong>Dept:</strong> " + (sub.problem ? sub.problem.responsibleDept : "") + "</li>" +
            "<li><strong>Estimated Cost:</strong> ₹ " + (sub.solution ? sub.solution.estimatedCost : "") + "</li>" +
          "</ul>" +
          "<div style='margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;'>" +
            "<a href='https://communityleadaiif.github.io/Mentor-Onboarding-Portal/' style='background: #8B0000; color: #FFF; padding: 10px 15px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block; margin-right: 10px;'>Open Organiser Desk to Audit</a>" +
            "<a href='" + waDirectUrl + "' style='background: #25D366; color: #FFF; padding: 10px 15px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block;'>💬 Open WhatsApp Chat with Team Lead</a>" +
          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: ADMIN_PERSONAL_EMAIL,
        subject: adminSubject,
        htmlBody: adminHtml
      });
      Logger.log("Admin alert email sent to personal email: " + ADMIN_PERSONAL_EMAIL);
    }
  } catch (err) {
    Logger.log("Error sending new submission emails: " + err.toString());
  }
}

function sendRevisionRequestedEmailToTeam(sub) {
  try {
    if (!sub) {
      Logger.log("sendRevisionRequestedEmailToTeam skipped: 'sub' parameter is undefined.");
      return;
    }

    var teamLeadEmail = sub.team ? sub.team.teamLeadEmail : "";
    var guideEmail = sub.team ? sub.team.guideTeacherEmail : "";
    var recipients = [teamLeadEmail, guideEmail].filter(Boolean).join(",");
    if (!recipients) return;

    var remark = sub.auditInfo ? sub.auditInfo.remark : "Please review and update your uploaded materials.";
    var subId = sub.id || "";
    var teamName = sub.team ? sub.team.teamName : "";

    var subject = "[ACTION REQUIRED] Revision Requested for Prajna Submission: " + subId;
    var htmlBody = 
      "<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 2px solid #E67E22; border-radius: 12px; padding: 20px; background-color: #FFFBF5;'>" +
        "<div style='background-color: #D35400; padding: 15px; text-align: center; border-radius: 8px; color: #FFF; font-weight: bold; font-size: 18px;'>" +
          "PRAJNA 2026: REVISION REQUESTED" +
        "</div>" +
        "<h3 style='color: #D35400;'>Attention Team " + teamName + " (" + subId + ")</h3>" +
        "<p>The Prajna Organiser Audit Panel has reviewed your submission and requested a revision before final approval.</p>" +
        "<div style='background: #FFF; border: 1px solid #E67E22; padding: 15px; border-radius: 8px; margin: 15px 0;'>" +
          "<p style='color: #C0392B; font-weight: bold; margin-top: 0;'>Organiser Feedback / Instructions:</p>" +
          "<p style='font-style: italic;'>\"" + remark + "\"</p>" +
        "</div>" +
        "<p>Please log in to the Prajna portal and update your submission details or photo proof accordingly.</p>" +
        "<p style='font-size: 12px; color: #777;'>Team Prajna 2026 Secretariat</p>" +
      "</div>";

    MailApp.sendEmail({
      to: recipients,
      subject: subject,
      htmlBody: htmlBody
    });
    Logger.log("Revision requested email sent to: " + recipients);
  } catch (err) {
    Logger.log("Error sending revision email: " + err.toString());
  }
}

// ==================== WHATSAPP AUTOMATION HANDLER ====================

function sendWhatsAppAlertToPersonalPhone(sub) {
  try {
    if (!sub) {
      Logger.log("sendWhatsAppAlertToPersonalPhone skipped: 'sub' parameter is undefined. (To test manually in Apps Script editor, run 'testSendWhatsAppAlert' instead).");
      return;
    }

    if (!ADMIN_PERSONAL_PHONE || ADMIN_PERSONAL_PHONE.includes("9876543210")) {
      Logger.log("WhatsApp skipped: ADMIN_PERSONAL_PHONE not configured.");
      return;
    }

    var subId = sub.id || "PRJ-2026";
    var teamName = sub.team ? sub.team.teamName : "";
    var schoolName = sub.team ? sub.team.schoolName : "";
    var district = sub.team ? sub.team.schoolDistrict : "";
    var teamLead = sub.team ? sub.team.teamLeadName : "";
    var phone = sub.team ? sub.team.teamLeadPhone : "";
    var problem = sub.problem ? sub.problem.problemTitle : "";
    var dept = sub.problem ? sub.problem.responsibleDept : "";

    var messageText = 
      "🚨 *NEW PRAJNA 2026 IDEA SUBMITTED!*\n\n" +
      "📌 *ID:* " + subId + "\n" +
      "👥 *Team:* " + teamName + "\n" +
      "🏫 *School:* " + schoolName + " (" + district + ")\n" +
      "👤 *Team Lead:* " + teamLead + " (" + phone + ")\n" +
      "💡 *Problem:* " + problem + "\n" +
      "🏢 *Dept:* " + dept + "\n\n" +
      "Please check Organiser Audit Desk to review.";

    if (WHATSAPP_PROVIDER === "META") {
      if (META_WHATSAPP_TOKEN === "YOUR_META_ACCESS_TOKEN" || META_PHONE_NUMBER_ID === "YOUR_META_PHONE_NUMBER_ID") {
        Logger.log("WhatsApp Notice: Meta API credentials are currently placeholder strings ('YOUR_META_ACCESS_TOKEN'). To activate Meta WhatsApp API, set META_WHATSAPP_TOKEN and META_PHONE_NUMBER_ID. If using CallMeBot free API, change WHATSAPP_PROVIDER to 'CALLMEBOT' and set CALLMEBOT_API_KEY.");
        return;
      }

      var metaUrl = "https://graph.facebook.com/v18.0/" + META_PHONE_NUMBER_ID + "/messages";
      var payload = {
        messaging_product: "whatsapp",
        to: ADMIN_PERSONAL_PHONE.replace(/[^0-9]/g, ""),
        type: "text",
        text: { body: messageText }
      };
      
      var res = UrlFetchApp.fetch(metaUrl, {
        method: "post",
        headers: {
          "Authorization": "Bearer " + META_WHATSAPP_TOKEN,
          "Content-Type": "application/json"
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });
      Logger.log("Meta WhatsApp Response (" + res.getResponseCode() + "): " + res.getContentText());
    } else if (WHATSAPP_PROVIDER === "CALLMEBOT") {
      if (CALLMEBOT_API_KEY === "YOUR_CALLMEBOT_API_KEY") {
        Logger.log("WhatsApp Notice: CallMeBot API key is placeholder ('YOUR_CALLMEBOT_API_KEY'). Send 'I allow callmebot to send me messages' to WhatsApp +34 644 44 20 70 to get your API key.");
        return;
      }

      var callMeBotUrl = "https://api.callmebot.com/whatsapp.php?phone=" + 
        encodeURIComponent(ADMIN_PERSONAL_PHONE.replace(/[^0-9]/g, "")) + 
        "&text=" + encodeURIComponent(messageText) + 
        "&apikey=" + CALLMEBOT_API_KEY;
        
      var res = UrlFetchApp.fetch(callMeBotUrl, { method: "get", muteHttpExceptions: true });
      Logger.log("CallMeBot WhatsApp Response (" + res.getResponseCode() + "): " + res.getContentText());
    } else if (WHATSAPP_PROVIDER === "TWILIO") {
      if (TWILIO_ACCOUNT_SID === "YOUR_TWILIO_ACCOUNT_SID" || TWILIO_AUTH_TOKEN === "YOUR_TWILIO_AUTH_TOKEN") {
        Logger.log("WhatsApp Notice: Twilio credentials are placeholder strings. Update TWILIO_ACCOUNT_SID & TWILIO_AUTH_TOKEN.");
        return;
      }

      var twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/" + TWILIO_ACCOUNT_SID + "/Messages.json";
      var authHeader = "Basic " + Utilities.base64Encode(TWILIO_ACCOUNT_SID + ":" + TWILIO_AUTH_TOKEN);
      var payload = {
        From: TWILIO_FROM_PHONE,
        To: "whatsapp:" + ADMIN_PERSONAL_PHONE.replace(/[^0-9]/g, ""),
        Body: messageText
      };

      var res = UrlFetchApp.fetch(twilioUrl, {
        method: "post",
        headers: { "Authorization": authHeader },
        payload: payload,
        muteHttpExceptions: true
      });
      Logger.log("Twilio WhatsApp Response (" + res.getResponseCode() + "): " + res.getContentText());
    }
  } catch (err) {
    Logger.log("Error sending WhatsApp notification: " + err.toString());
  }
}

// ==================== MANUAL TEST RUNNER FUNCTIONS FOR APPS SCRIPT EDITOR ====================

/**
 * Select this function in the Google Apps Script editor dropdown and click "Run" to test Email sending!
 */
function testSendNewSubmissionEmails() {
  var dummySub = {
    id: "TEST-PRJ-2026-001",
    submissionDate: new Date().toLocaleDateString('en-IN'),
    team: {
      teamName: "Amaravathi Eco Test Team",
      schoolName: "Govt Higher Secondary School",
      schoolDistrict: "Tiruppur",
      teamLeadName: "Test Student Lead",
      teamLeadPhone: "9876543210",
      teamLeadEmail: ADMIN_PERSONAL_EMAIL,
      guideTeacherName: "Test Escort Teacher",
      guideTeacherPhone: "9876543210",
      guideTeacherEmail: ADMIN_PERSONAL_EMAIL
    },
    problem: {
      problemTitle: "Test Agricultural Seepage Issue",
      problemLocation: "Kaniyur Main Road",
      responsibleDept: "Public Works Department (PWD)"
    },
    solution: {
      estimatedCost: "4500"
    }
  };

  Logger.log("Testing Email dispatch to: " + ADMIN_PERSONAL_EMAIL);
  sendNewSubmissionEmails(dummySub);
  Logger.log("Test email execution finished cleanly.");
}

/**
 * Select this function in the Google Apps Script editor dropdown and click "Run" to test WhatsApp sending!
 */
function testSendWhatsAppAlert() {
  var dummySub = {
    id: "TEST-PRJ-2026-001",
    submissionDate: new Date().toLocaleDateString('en-IN'),
    team: {
      teamName: "Amaravathi Eco Test Team",
      schoolName: "Govt Higher Secondary School",
      schoolDistrict: "Tiruppur",
      teamLeadName: "Test Student Lead",
      teamLeadPhone: "9876543210"
    },
    problem: {
      problemTitle: "Test Agricultural Seepage Issue",
      responsibleDept: "Public Works Department (PWD)"
    }
  };

  Logger.log("Testing WhatsApp dispatch to: " + ADMIN_PERSONAL_PHONE);
  sendWhatsAppAlertToPersonalPhone(dummySub);
  Logger.log("Test WhatsApp execution finished.");
}



// ==================== v2 FUNCTIONS (ADDED 2026-09-04) ====================

// Database snapshot/version history
function snapshotDatabase(folder, label) {
  try {
    var files = folder.getFilesByName(FILE_NAME);
    if (!files.hasNext()) return;
    var currentContent = files.next().getBlob().getDataAsString();
    var now = new Date();
    var timestamp = Utilities.formatDate(now, "Asia/Kolkata", "yyyyMMdd_HHmmss");
    var snapshotName = "backups/submissions_" + timestamp + "_" + label + ".json";
    folder.createFile(snapshotName, currentContent, "application/json");
    Logger.log("Snapshot created: " + snapshotName);
  } catch (err) {
    Logger.log("snapshotDatabase error: " + err.toString());
  }
}

// Upload base64 photo to backup Drive folder
function uploadPhotoToDrive(data) {
  try {
    if (!data.base64Data || !data.submissionId || !data.photoType) {
      return { status: "error", message: "Missing base64Data, submissionId, or photoType." };
    }
    
    var decoded = Utilities.base64Decode(data.base64Data);
    var fileName = data.submissionId + "_" + data.photoType + ".jpg";
    var blob = Utilities.newBlob(decoded, "image/jpeg", fileName);
    
    // Create file in root Drive, then move it into the backup folder.
    // This avoids createFolder/createFile-on-folder which needs a broader scope.
    var targetFolder = DriveApp.getFolderById(PHOTO_BACKUP_FOLDER_ID);
    var file = DriveApp.createFile(blob);
    targetFolder.addFile(file);
    try { DriveApp.getRootFolder().removeFile(file); } catch(e) {}
    
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var shareUrl = "https://drive.google.com/file/d/" + file.getId() + "/view?usp=sharing";
    Logger.log("Photo uploaded: " + fileName + " -> " + shareUrl);
    
    return { status: "success", fileId: file.getId(), url: shareUrl, fileName: fileName };
  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}

// Update photo link columns (V, W, X) in the Google Sheet
function updateSheetPhotoLinks(data) {
  try {
    if (!data.submissionId || !data.photoLinks) {
      return { status: "error", message: "Missing submissionId or photoLinks." };
    }
    
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var files = folder.getFilesByName(SPREADSHEET_NAME);
    if (!files.hasNext()) return { status: "error", message: "Spreadsheet not found." };
    
    var ss = SpreadsheetApp.open(files.next());
    var sheet = ss.getSheetByName("Submissions Report");
    if (!sheet) return { status: "error", message: "Sheet not found." };
    
    var values = sheet.getDataRange().getValues();
    var targetRow = -1;
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][1]) === data.submissionId) {
        targetRow = i + 1;
        break;
      }
    }
    if (targetRow === -1) return { status: "error", message: "Submission not found in sheet." };
    
    if (data.photoLinks.closeUp) sheet.getRange(targetRow, 22).setValue(data.photoLinks.closeUp);
    if (data.photoLinks.wideAngle) sheet.getRange(targetRow, 23).setValue(data.photoLinks.wideAngle);
    if (data.photoLinks.teamOnSite) sheet.getRange(targetRow, 24).setValue(data.photoLinks.teamOnSite);
    
    return { status: "success", message: "Photo links updated.", row: targetRow };
  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}

// Create a full backup copy of the database spreadsheet in backup Drive folder
function createBackupSpreadsheet() {
  try {
    var sourceFolder = DriveApp.getFolderById(FOLDER_ID);
    var targetFolder = DriveApp.getFolderById(PHOTO_BACKUP_FOLDER_ID);
    
    var sourceFiles = sourceFolder.getFilesByName(SPREADSHEET_NAME);
    if (!sourceFiles.hasNext()) return { status: "error", message: "Source spreadsheet not found." };
    
    var sourceSs = SpreadsheetApp.open(sourceFiles.next());
    var now = new Date();
    var dateStr = Utilities.formatDate(now, "Asia/Kolkata", "yyyyMMdd_HHmmss");
    var backupName = "Prajna 2026 Backup Database Report_" + dateStr;
    
    var backupSs = SpreadsheetApp.create(backupName);
    var backupFile = DriveApp.getFileById(backupSs.getId());
    targetFolder.addFile(backupFile);
    try { DriveApp.getRootFolder().removeFile(backupFile); } catch(e) {}
    
    var sourceSheet = sourceSs.getSheetByName("Submissions Report");
    if (!sourceSheet) return { status: "error", message: "Source sheet not found." };
    
    var backupSheet = backupSs.getActiveSheet();
    backupSheet.setName("Submissions Report");
    
    var sourceData = sourceSheet.getDataRange().getValues();
    if (sourceData.length > 0) {
      backupSheet.getRange(1, 1, sourceData.length, sourceData[0].length).setValues(sourceData);
      var headerRange = backupSheet.getRange(1, 1, 1, sourceData[0].length);
      headerRange.setFontWeight("bold").setBackground("#8B0000").setFontColor("#FFD700");
      backupSheet.setFrozenRows(1);
    }
    
    var historySheet = backupSs.insertSheet("Version History");
    historySheet.appendRow(["Timestamp", "Action", "Details"]);
    historySheet.appendRow([
      Utilities.formatDate(now, "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
      "BACKUP CREATED",
      "Full snapshot. Rows: " + (sourceData.length - 1)
    ]);
    historySheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#2A0000").setFontColor("#FFD700");
    historySheet.setFrozenRows(1);
    
    return {
      status: "success",
      spreadsheetId: backupSs.getId(),
      url: "https://docs.google.com/spreadsheets/d/" + backupSs.getId() + "/edit?usp=sharing",
      name: backupName,
      rowsCopied: Math.max(0, sourceData.length - 1)
    };
  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}

// Store organiser session tokens (auto-prune older than 8 hours)
function saveOrganiserToken(folder, token) {
  try {
    var tokenFile = "organiser_tokens.json";
    var tokens = [];
    var files = folder.getFilesByName(tokenFile);
    if (files.hasNext()) {
      try { tokens = JSON.parse(files.next().getBlob().getDataAsString()); } catch(e) { tokens = []; }
    }
    tokens.push({ token: token, created: new Date().toISOString() });
    var cutoff = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString();
    tokens = tokens.filter(function(t) { return t.created > cutoff; });
    var content = JSON.stringify(tokens);
    files = folder.getFilesByName(tokenFile);
    if (files.hasNext()) {
      files.next().setContent(content);
    } else {
      var f = folder.createFile(tokenFile, content, "application/json");
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }
  } catch(e) {}
}