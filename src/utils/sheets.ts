/**
 * Google Sheets Integration via Google Apps Script Web App
 *
 * ========== HƯỚNG DẪN CÀI ĐẶT ==========
 *
 * 1. Mở Google Sheet -> Extensions -> Apps Script
 * 2. XÓA HẾT code cũ, rồi PASTE TOÀN BỘ đoạn code dưới đây:
 *
 * ---- BẮT ĐẦU CODE APPS SCRIPT ----

function setup() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Thời gian', 'Tên người chơi', 'Kiểu người yêu',
      'Ước nguyện', 'Phần quà đã chọn', 'Phần quà trúng',
      'Lượt thả tim', 'Loại dữ liệu'
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    sheet.setColumnWidths(1, 8, 160);
  }
  Logger.log('Setup done! Giờ hãy Deploy -> New Deployment -> Web App');
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    if (data.type === 'game_result') {
      sheet.appendRow([
        new Date().toLocaleString('vi-VN'),
        data.playerName || '',
        data.loverChoice || '',
        data.wishes || '',
        data.selectedPrizes || '',
        data.wonPrize || '',
        data.heartCount || 0,
        'game_result'
      ]);
    } else if (data.type === 'heart_update') {
      var rows = sheet.getDataRange().getValues();
      for (var i = rows.length - 1; i >= 0; i--) {
        if (rows[i][1] === data.playerName && rows[i][7] === 'game_result') {
          sheet.getRange(i + 1, 7).setValue(data.heartCount);
          break;
        }
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Love Spin API is running!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

 * ---- KẾT THÚC CODE APPS SCRIPT ----
 *
 * 3. Chọn hàm "setup" từ dropdown -> bấm Run (1 lần để tạo header)
 * 4. Deploy -> New Deployment:
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone (QUAN TRỌNG: chọn "Anyone", KHÔNG phải "Anyone within fpt.edu.vn")
 * 5. Copy Web App URL -> paste vào biến GOOGLE_SHEET_URL bên dưới
 * 6. Test: mở URL đó trên trình duyệt -> thấy {"status":"ok","message":"Love Spin API is running!"}
 *
 * LƯU Ý: Nếu sửa code Apps Script, phải Deploy lại (New Deployment) mới có hiệu lực!
 */

// Paste Web App URL vào đây
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzG8ET-pD2FMun6G1kCKSZgpu7Aer8fD_sERN7ihoI6WHWNw2z6reRZk0XcYJ2JbHke/exec';

const isConfigured = () =>
  GOOGLE_SHEET_URL.length > 10 && !GOOGLE_SHEET_URL.includes('YOUR_');

interface GameResultPayload {
  type: 'game_result';
  playerName: string;
  loverChoice: string;
  wishes: string;
  selectedPrizes: string;
  wonPrize: string;
  heartCount: number;
}

interface HeartUpdatePayload {
  type: 'heart_update';
  playerName: string;
  heartCount: number;
}

type SheetPayload = GameResultPayload | HeartUpdatePayload;

export async function sendToSheet(payload: SheetPayload): Promise<boolean> {
  if (!isConfigured()) {
    console.log('[Sheets] Not configured, skipping:', payload);
    return false;
  }

  try {
    // QUAN TRỌNG: Dùng text/plain thay vì application/json
    // vì application/json + no-cors sẽ trigger preflight OPTIONS
    // mà Google Apps Script không hỗ trợ -> request bị chặn
    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });
    console.log('[Sheets] Sent successfully:', payload.type);
    return true;
  } catch (err) {
    console.warn('[Sheets] Failed to send:', err);
    return false;
  }
}

export function sendGameResult(data: {
  playerName: string;
  loverChoice: string;
  wishes: string;
  selectedPrizes: string[];
  wonPrize: string;
}) {
  return sendToSheet({
    type: 'game_result',
    playerName: data.playerName,
    loverChoice: data.loverChoice,
    wishes: data.wishes,
    selectedPrizes: data.selectedPrizes.join(', '),
    wonPrize: data.wonPrize,
    heartCount: 0,
  });
}

export function sendHeartUpdate(playerName: string, heartCount: number) {
  return sendToSheet({
    type: 'heart_update',
    playerName,
    heartCount,
  });
}
