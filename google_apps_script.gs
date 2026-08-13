/**
 * AIIF Mentor Onboarding Portal - Google Apps Script
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open your Google Sheet where you want to collect mentor data.
 * 2. Click Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this script.
 * 4. Click Save (disk icon).
 * 5. Click Deploy > New deployment.
 * 6. Select type: "Web app".
 * 7. Set:
 *    - Description: AIIF Mentor Onboarding API
 *    - Execute as: "Me" (your account)
 *    - Who has access: "Anyone"
 * 8. Click Deploy. Authorize any required permissions.
 * 9. Copy the "Web app URL" and replace the GOOGLE_SCRIPT_URL in MentorFormSection.tsx.
 */

// POST request handler
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // 1. Get or create the active spreadsheet sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Mentors");
    if (!sheet) {
      sheet = ss.insertSheet("Mentors");
    }
    
    // Define headers
    var headers = [
      "Date", "Full Name", "Email", "Mobile", "LinkedIn Profile", 
      "Designation", "Organization", "Location", "Experience", 
      "Sectors", "Expertise", "Previously Mentored", "Mode", 
      "Engagement", "Areas to Contribute", "Availability", 
      "PDF Agreement Link", "Resume Link", "Consent Given", "Signature Link"
    ];
    
    // Set headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#d1fae5").setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // 2. Handle files and upload to Google Drive
    var folderName = "AIIF Mentorship Form Uploads";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }
    
    // Upload Signed PDF Agreement
    var pdfUrl = "";
    if (data.pdfContent && data.fileName) {
      var pdfBlob = Utilities.newBlob(Utilities.base64Decode(data.pdfContent), "application/pdf", data.fileName);
      var pdfFile = folder.createFile(pdfBlob);
      pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      pdfUrl = pdfFile.getUrl();
    }
    
    // Upload Resume if provided
    var resumeUrl = "";
    if (data.resumeContent && data.resumeName) {
      var contentType = getMimeType(data.resumeName);
      var resumeBlob = Utilities.newBlob(Utilities.base64Decode(data.resumeContent), contentType, data.resumeName);
      var resumeFile = folder.createFile(resumeBlob);
      resumeFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      resumeUrl = resumeFile.getUrl();
    }

    // Upload Signature Image if provided
    var signatureUrl = "";
    if (data.signatureContent && data.signatureName) {
      var signatureBlob = Utilities.newBlob(Utilities.base64Decode(data.signatureContent), "image/png", data.signatureName);
      var signatureFile = folder.createFile(signatureBlob);
      signatureFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      signatureUrl = signatureFile.getUrl();
    }
    
    // 3. Assemble and append row
    var rowData = [
      data.date || new Date().toLocaleDateString(),
      data.fullName || "",
      data.email || "",
      data.mobile || "",
      data.linkedin || "",
      data.designation || "",
      data.organization || "",
      data.location || "",
      data.experience || "",
      data.sector || "",
      data.expertise || "",
      data.mentored || "",
      data.mode || "",
      data.engagement || "",
      data.contribute || "",
      data.availability || "",
      pdfUrl,
      resumeUrl,
      data.consent ? "Yes" : "No",
      signatureUrl
    ];
    
    sheet.appendRow(rowData);
    var lastRow = sheet.getLastRow();
    
    // 4. Programmatically apply Data Validation Rules to the new cells
    applyCellValidations(sheet, lastRow);
    
    // Auto-resize columns
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data recorded successfully",
      pdfUrl: pdfUrl,
      resumeUrl: resumeUrl,
      signatureUrl: signatureUrl
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Map common file extensions to mime-types
function getMimeType(fileName) {
  var ext = fileName.split('.').pop().toLowerCase();
  switch(ext) {
    case 'pdf': return 'application/pdf';
    case 'doc': return 'application/msword';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'png': return 'image/png';
    default: return 'application/octet-stream';
  }
}

// Setup data validation dropdowns for a specific row
function applyCellValidations(sheet, row) {
  // Experience (Col 9)
  var experienceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['< 2 years', '2–5 years', '5–10 years', '10–20 years', '20+ years'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, 9).setDataValidation(experienceRule);

  // Sectors (Col 10) - multi-select validation (allow invalid so comma-separated list doesn't trigger warnings)
  var sectorsRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['AgriTech', 'EdTech', 'HealthTech', 'FinTech', 'CleanTech / GreenTech', 'DeepTech / AI-ML', 'Manufacturing & Industry 4.0', 'Retail & E-commerce', 'Social Impact / NGO', 'Government & Policy', 'Logistics & Supply Chain', 'Media & Entertainment', 'SaaS / B2B Software', 'Cybersecurity', 'SpaceTech', 'FoodTech', 'Real Estate & PropTech', 'Travel & Hospitality', 'HR Tech', 'LegalTech', 'Other'])
    .setAllowInvalid(true)
    .build();
  sheet.getRange(row, 10).setDataValidation(sectorsRule);

  // Expertise (Col 11)
  var expertiseRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Product Development', 'Business Strategy', 'Marketing & Branding', 'Fundraising & Investor Relations', 'Legal & Compliance', 'Technology & Engineering', 'Operations & Scaling', 'Finance & Accounting', 'Sales & BD', 'Design & UX', 'Sustainability', 'Public Policy', 'International Expansion', 'Other'])
    .setAllowInvalid(true)
    .build();
  sheet.getRange(row, 11).setDataValidation(expertiseRule);

  // Previously Mentored (Col 12)
  var mentoredRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Yes', 'No'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, 12).setDataValidation(mentoredRule);

  // Mode (Col 13)
  var modeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Online', 'In-Person', 'Hybrid'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, 13).setDataValidation(modeRule);

  // Engagement (Col 14)
  var engagementRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['One-time', 'Short-term (1–3 months)', 'Long-term (6+ months)'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, 14).setDataValidation(engagementRule);

  // Areas to Contribute (Col 15)
  var contributeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['1:1 Mentoring Sessions', 'Group Workshops', 'Jury / Evaluation Panels', 'Guest Lectures', 'Investor Connects', 'Advisory Board', 'Other'])
    .setAllowInvalid(true)
    .build();
  sheet.getRange(row, 15).setDataValidation(contributeRule);

  // Availability (Col 16)
  var availabilityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['< 2 hrs', '2–5 hrs', '5–10 hrs', '10+ hrs'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, 16).setDataValidation(availabilityRule);
}

/**
 * AUTOMATED MULTI-SELECT DROPDOWN SUPPORT
 * When an option in the validation dropdown of a multi-select column is selected,
 * this function appends/toggles the value rather than overwriting the cell.
 */
function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var oldValue = e.oldValue;
  var newValue = e.value;
  
  // Define multi-select columns: Sectors (Col 10), Expertise (Col 11), Areas to Contribute (Col 15)
  var multiSelectColumns = [10, 11, 15]; 
  
  if (multiSelectColumns.indexOf(range.getColumn()) !== -1 && sheet.getName() === "Mentors") {
    // If the cell was cleared
    if (!newValue) {
      return;
    }
    // If the cell was empty
    if (!oldValue) {
      return;
    }
    
    // Check if the value is already in the list
    var oldValues = oldValue.split(", ").map(function(item) { return item.trim(); });
    var index = oldValues.indexOf(newValue);
    
    if (index > -1) {
      // Toggle off: Value selected again, remove it from the list
      oldValues.splice(index, 1);
    } else {
      // Toggle on: Add new value to the list
      oldValues.push(newValue);
    }
    
    // Save updated list
    range.setValue(oldValues.join(", "));
  }
}
