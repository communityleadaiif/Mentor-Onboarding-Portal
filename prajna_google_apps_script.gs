/**
 * PRAJNA 2026 Database Sync - Google Apps Script
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open Google Drive.
 * 2. Go to the shared folder or open https://script.google.com
 * 3. Click "New Project" (or create a new Apps Script project).
 * 4. Delete any code in the editor and paste this entire script.
 * 5. Click Save (disk icon).
 * 6. Click Deploy > New deployment.
 * 7. Configure:
 *    - Type: "Web app"
 *    - Description: Prajna 2026 DB Sync API
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"
 * 8. Click Deploy. Authorize the required permissions (access to Google Drive).
 * 9. Copy the "Web app URL" (it starts with https://script.google.com/macros/s/...)
 * 10. Update the `CLOUD_API_URL` variable in `src/services/cloudSync.ts` with this URL, then run `npm run deploy` to publish.
 */

// This is the Google Drive Folder ID from your link:
// https://drive.google.com/drive/folders/11_a2poPbp1-djB69ewu-fNOdMfmtybyr
const FOLDER_ID = "11_a2poPbp1-djB69ewu-fNOdMfmtybyr";
const FILE_NAME = "submissions.json";

// 1. GET request handler: Reads and returns the submissions list from Google Drive
function doGet() {
  try {
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var files = folder.getFilesByName(FILE_NAME);
    var content = "[]"; // default empty list
    
    if (files.hasNext()) {
      var file = files.next();
      content = file.getAs("text/plain").getDataAsString();
    }
    
    return ContentService.createTextOutput(content)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. POST request handler: Receives the updated submissions list and overwrites submissions.json
function doPost(e) {
  try {
    var rawJson = e.postData.contents;
    
    // Safety check: parse and make sure it is a valid JSON array
    var parsed = JSON.parse(rawJson);
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid data format: Submissions must be sent as a JSON array.");
    }
    
    var folder = DriveApp.getFolderById(FOLDER_ID);
    var files = folder.getFilesByName(FILE_NAME);
    var file;
    
    if (files.hasNext()) {
      file = files.next();
      file.setContent(rawJson);
    } else {
      file = folder.createFile(FILE_NAME, rawJson, "application/json");
    }
    
    // Set file visibility to Anyone with Link can View (optional, makes sharing/debugging easier)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      count: parsed.length 
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
