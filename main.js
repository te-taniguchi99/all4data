/**
 * ALL4DATA main.js
 * @returns {undefined}
 */

import { CreateTable, SetTh } from "./js/create_tables.mjs";
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
            'interimOnly': false,
            'newFlg': $('#newfile_chk').prop('checked'),
            'flg13': $('#1or3_chk').prop('checked'),
            'catecode': $('#catecode_chk').prop('checked')
        }
        GetFile(opt);
    });

    //TABLE描画ボタン押下時処理
    $('#cmd_table').on('click', () => {
        let opt = {
            'interimOnly': true,
            'newFlg': $('#newfile_chk').prop('checked'),
            'flg13': $('#1or3_chk').prop('checked'),
            'catecode': $('#catecode_chk').prop('checked')
        };

        (async () => {
            let jsonData = await GetFile(opt);
            let objData = JSON.parse(jsonData);
            //console.log(objData);
            //不要列の削除　旧仕入予定単価,最新仕入予定単価
            objData = DeleteColItem(objData);
            WriteTable(objData);
        })();

    })
}


//テーブル描画
async function WriteTable(data) {
    SetTh(data);
    CreateTable(data);

}

//jsonファイルの内容から、不要カラムを削除して返す
function DeleteColItem(data) {

    let newData = data.map(e => {
        delete e['旧仕入予定単価'];
        delete e['最新仕入予定単価'];
        delete e['英字名'];
        return e;
    })
    console.log(newData);

    return newData;
}