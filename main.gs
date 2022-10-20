var CHANNEL_ACCESS_TOKEN = 'Sg21ZYvinM5fg8zALwgiYx25rwoXj6Z/0oSQJibl7qr0ceAVaKAPqUgeqdlB0le5OWidfXcpDnQXvi45ww+hWTjAx0X15l2Ze0MQq+M/MZn7QdiuxP3uAXBidkhLGWeyyxjYm8038k8PrPaf7xxAtgdB04t89/1O/w1cDnyilFU='; 
var sheet_url = "https://docs.google.com/spreadsheets/d/1Db4Qayo29IITnUVjqfS3A-xMq5RYkg4yGQeihoMo6Pc/edit";

var sheet_name = "ชีต2";
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';


function doPost(e) {
  var json = JSON.parse(e.postData.contents);

  
  var reply_token= json.events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }

 
  var message = json.events[0].message.text;
  var userId = JSON.parse(e.postData.contents).events[0].source.userId;
  var username = getUsername(userId);

  var reply_txt = GetReply(message);

  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': [{
        'type': 'text',
        'text': reply_txt,
      }],
    }),
  });
  

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}


function GetReply(message){
  var spreadsheet = SpreadsheetApp.openByUrl(sheet_url);
  var sheet = spreadsheet.getSheetByName(sheet_name);
  var lr = sheet.getLastRow();

 
  var message_col=1;
  var reply_col=2;
  var start_row=2;

  //Check if จองคิวงาน
  if (message == "จองคิวงาน") {
    var reply_txt="เยี่ยมเลยค่ะ! เอาล่ะลินดาขอให้คุณพิมพ์คำสั่งตามนี้นะคะ 💖\nReg_ชื่อ_อีเมล_วันที่_เวลา\n\nตัวอย่างค่ะ\n Reg_จรณะ_41852@nd.ac.th_10/09/2022_12:00"
    return reply_txt;
  }

  const myArray = message.split("_");
  if (myArray[0]=="Reg"){
    const data = [myArray[1],myArray[2],myArray[3],myArray[4]];
    var sheet2 = spreadsheet.getSheetByName("ชีต1");
    sheet2.appendRow(data);
    var reply_txt="ลินดาทำการจองคิวให้เรียบร้อยค่าาา 💖\nสามารถตรวจสอบคิวงานได้โดยการพิมพ์ ''ตรวจสอบคิวงาน'' นะคะ"
    return reply_txt;
  }

  //ตรวจสอบคิวงาน
  if (message == "ตรวจสอบคิวงาน") {
    var reply_txt="โอเคค่าาา! สามารถเข้าไปตรวจสอบตามลิ้งนี้ได้เลยนะคะ 💖\nhttps://docs.google.com/spreadsheets/d/1Db4Qayo29IITnUVjqfS3A-xMq5RYkg4yGQeihoMo6Pc/edit?usp=sharing"
    return reply_txt;
  }

  var reply_txt="";
  for (var i = start_row; i <= lr+1; i++){
    
   
    if (i == lr+1){
      var reply_txt="ขอโทษด้วยค่ะแต่ลินดา ไม่เข้าใจที่คุณพิมพ์มาค่ะ\nถ้าหากคุณต้องการจองคิวงานสามารถพิมพ์ว่า ''จองคิวงาน'' ได้น้าาา 💖\nหรือพิมพ์ว่า ''ตรวจสอบคิวงาน'' เพื่อตรวจสอบคิวงานได้น้าาา 💖"
    }
    
    var temp_txt = sheet.getRange(i,message_col).getValue();   
    Logger.log(temp_txt);
    if (message == temp_txt){
      var reply_txt = sheet.getRange(i,reply_col).getValue(); 
      break; 
    }
    
  };
  
  return reply_txt;
}

function getUsername(userId) {
  var url = 'https://api.line.me/v2/bot/profile/' + userId;
  var response = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
    }
  });
  return JSON.parse(response.getContentText()).displayName;
}

