/**
 * Wayfarer leads → Google Sheet
 *
 * Setup (5 minutes):
 * 1. Create a Google Sheet. Name the first tab "Leads".
 * 2. Extensions → Apps Script. Delete the sample code and paste this file.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as: Me.   Who has access: Anyone.
 * 4. Copy the web app URL (ends in /exec) into LEAD_WEBHOOK_URL in Vercel.
 * 5. Redeploy the website. Submit a test profile check and check the sheet.
 *
 * The website sends one JSON object per lead. New fields become new columns automatically.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
    var headers = sheet.getLastRow() > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    Object.keys(data).forEach(function (k) {
      if (headers.indexOf(k) === -1) {
        headers.push(k);
        sheet.getRange(1, headers.length).setValue(k);
      }
    });
    var row = headers.map(function (h) {
      return data[h] === undefined ? "" : data[h];
    });
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
