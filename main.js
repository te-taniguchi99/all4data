/**
 * ALL4DATA main.js
 * @returns {undefined}
 */

import { GetFile } from "./js/download.mjs";
import mod_dt from "./js/DT.js";
import { WriteJsonFileExists } from "./js/various.mjs";

//起動時処理
$(function () {
    AddEvent();
    WriteJsonFileExists();  //中間ファイルの存在表示
});

/**
 * イベント追加処理
 */
function AddEvent() {
    //downloadボタン押下時処理
    $('#cmd_dl').on('click', () => {
        let opt = {
            'newFlg': $('#newfile_chk').prop('checked'),
            'flg13': $('#1or3_chk').prop('checked'),
            'catecode': $('#catecode_chk').prop('checked')
        }
        GetFile(opt);
    });
}


//初期化処理
async function GetData() {

    //get.phpにfetch
    await fetch('get.php')
        .then(res => res.text())
        .then(res => console.log(res));
    await fetch('data/data.json')
        .then(res => res.json())    //jsontメソッドでテキストを返す
        .then(res => WriteTable(res))
        .then(res => console.log(res));
    return 1;
}

//テーブル描画
async function WriteTable(data) {
    let key2, key;
    const formatter = new Intl.NumberFormat(); //カンマ区切りフォーマット
    const zeroPadding = new Intl.NumberFormat('ja', { minimumIntegerDigits: 3 }); //3桁ゼロパディング

    const COMMA = ['旧仕入予定単価', '最新仕入予定単価', '表示用原価', '新表示用原価',
        '販売単価(000)', '新販売単価(000)', '販売単価(001)', '新販売単価(001)', 'スポット数', '重量'];
    //ヘッダ描画
    let strHeader;
    strHeader = '<tr>';
    for (key in data[0]) {
        strHeader += '<th>' + key + '</th>';
    }
    strHeader += '</tr>';
    $('#myThead').append(strHeader);
    //本体部描画
    let strBody;
    //データ繰り返し
    $.each(data, (index, value) => {

        strBody += '<tr>'; //行作成
        //オブジェクトからプロパティを取得(key2が変数、valueがOBJ)
        for (key2 in value) {
            if (COMMA.find(element => element === key2)) {
                strBody += '<td>' + formatter.format(value[key2]) + '</td>';
            } else if (key2 === 'ソート') {
                strBody += '<td>' + zeroPadding.format(value[key2]) + '</td>';
            } else if (key2 === '原価単価改定日' || key2 === '販売単価改定日') {
                let t = moment(value[key2]);
                let hoge = t.format('YYYY/MM/DD');
                strBody += '<td>' + hoge + '</td>';
            } else {
                strBody += '<td>' + value[key2] + '</td>';
            }
        }
        strBody += '</tr>';
    });
    let myMain = document.getElementById('myBody');
    myMain.innerHTML = strBody;
    //    $('#myBody').append(strBody);
    $('#load-gif').hide();
    console.log('hide logo');
    //Datatalbes初期化
    mod_dt($('#myTable')); //DataTable用のモジュール
    return 'WriteTable Comp';
}
