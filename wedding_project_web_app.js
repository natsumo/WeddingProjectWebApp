////////////////////////////////////////////////////////////////////////////
/* wedding_project_web_app.js                                      */
/* Created by Natsumo Ikeda on 2017/10/09                                 */
/* Copyright 2017 FUJITSU CLOUD TECHNOLOGIES LIMITED All Rights Reserved. */
////////////////////////////////////////////////////////////////////////////

// API KEY
var applicationKey = "YOUR_NCMB_APPLICATION_KEY";
var clientKey      = "YOUR_NCMB_CLIENT_KEY";

// initialize
var ncmb = new NCMB(applicationKey, clientKey);

// User name and Photo name
var name = "";
var photoName = "";

$(function() {
    $.mobile.defaultPageTransition = 'none';
    $("#registBtn").click(onRegistBtn);
    $("#jpBtn").click(onJpBtn);
    $("#vnBtn").click(onVnBtn);
    $("#messageBtn").click(onMessageBtn);
    $('form').on('change', 'input[type="file"]', function(e) {
        file = e.target.files[0],
        reader = new FileReader(),
        t = this;

        fileType = file.type.indexOf("image");

        // 画像ファイル以外の場合は何もしない
        if(fileType < 0){
            alert("Please select an image file.");
            return false;
        }

        // ファイル読み込みが完了した際のイベント登録
        reader.onload = (function(file) {
            return function(e) {
            //既存のプレビューを削除
            $("#preview").empty();
            // .prevewの領域の中にロードした画像を表示するimageタグを追加
            $("#preview").append($('<img id="photo_image">').attr({
                src: e.target.result,
                width: "100%",
                class: "preview",
                title: file.name
            }));
          };
        })(file);

        reader.readAsDataURL(file);
      });
});

//=====================================================
// <img>要素 → Base64形式の文字列に変換
//   img       : HTMLImageElement
//   mime_type : string "image/png", "image/jpeg" など
//=====================================================
function ImageToBase64(img, mime_type) {
    // New Canvas
    var canvas = document.createElement('canvas');
    canvas.width  = img.width;
    canvas.height = img.height;
    // Draw Image
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    // To Base64
    return canvas.toDataURL(mime_type);
}

function toBlob(base64, mime_type) {
    var bin = atob(base64.replace(/^.*,/, ''));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // Blobを作成
    try{
        var blob = new Blob([buffer.buffer], {
            type: mime_type
        });
    }catch (e){
        return false;
    }
    return blob;
}

function onRegistBtn() {
    name = $("#name").val()
    var img = document.getElementById('photo_image');
    var photoType = $("#photo")[0].files[0].type;
    var base64 = ImageToBase64(img, photoType);
    var photoData = toBlob(base64, photoType);
    var photoVal = $("#photo").val();

    // 入力チェック
    if (name == "") {
        alert("Please write your name.");
        return;
    } else if (photoVal == "") {
        alert("Please select your photo.");
        return;
    }

    // loading の表示
    $.mobile.loading('show', {
        text: 'Sending...',
        textVisible: true,
        theme: 'a',
        textonly: false,
        html: ''
    });

    // uuid
    var uuid = makeUUID();
    photoName = "Photo_"+ uuid + $("#photo")[0].files[0].name;

    // 写真アップロード
    ncmb.File.upload(photoName, photoData)
        .then(function(res){
            // アップロード成功時の処理
            alert("Registration success !");
            $("#name").val("");
            $("#photo").val("");
            $("#preview").empty();
            // loading の非表示
            $.mobile.loading('hide');
            // MessagePage
            $.mobile.changePage('#MessagePage');
        })
        .catch(function(err){
            // アップロード失敗時の処理
            alert("Registration Failed...:" + err);
            // loading の非表示
            $.mobile.loading('hide');
        });
}

function onJpBtn() {
    var message = $("#jpBtn").val();
    regMessage(message);
}

function onVnBtn() {
    var message = $("#vnBtn").val();
    regMessage(message);
}

function onMessageBtn() {
    var message = $("#message").val();

    if (message == "") {
        alert("Please write your message.");
        return;
    }

    regMessage(message);
    $("#message").val("");
}

function regMessage(message) {
    // loading の表示
    $.mobile.loading('show', {
        text: 'Sending...',
        textVisible: true,
        theme: 'a',
        textonly: false,
        html: ''
    });

    // encode
    var enc_name = encodeURI(name);
    var enc_message = encodeURI(message);
    var enc_photoName = encodeURI(photoName);

    // Script の呼び出し
    ncmb.Script
        .query({"name": enc_name, "message": enc_message, "photoName": enc_photoName})
        .exec("GET", "wedding_project_web_app_script.js")
        .then(function(res){
            // 実行成功時の処理
            alert("Send Completely !");
            // loading の非表示
            $.mobile.loading('hide');
        })
        .catch(function(error){
            // 実行失敗時の処理
            alert("Sending Failed...:" + error);
            // loading の非表示
            $.mobile.loading('hide');
        });
}

// UUID生成
function makeUUID() {
    var d = + new Date();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
}
