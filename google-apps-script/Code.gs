/**
 * Bernadete Leite Costura — recebe os leads da LP e grava na planilha.
 *
 * COMO USAR (passo a passo no README.md):
 *  1. Crie uma planilha no Google Sheets.
 *  2. Extensões > Apps Script e cole este código.
 *  3. Implantar > Nova implantação > Tipo "App da Web".
 *     - Executar como: Eu
 *     - Quem pode acessar: Qualquer pessoa
 *  4. Copie a URL /exec gerada e cole em assets/js/config.js
 *     (campo GOOGLE_SHEETS_ENDPOINT).
 */

// Planilha de leads (https://docs.google.com/spreadsheets/d/<ID>/edit)
var SPREADSHEET_ID = '1Uclqgd6oPCpejexiQjSKkY0MlHKdlpIp6CylrSPisqg';
var SHEET_NAME = 'Leads';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = (e && e.parameter) || {};
      }
    } else {
      data = (e && e.parameter) || {};
    }

    var ss = SPREADSHEET_ID
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/Hora', 'E-mail', 'WhatsApp', 'Origem']);
    }

    sheet.appendRow([
      new Date(),
      data.email || '',
      data.tel || '',
      data.origem || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('Bernadete Leite Costura — endpoint ativo.');
}
