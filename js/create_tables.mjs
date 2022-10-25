/**
 * TABEL描画用　2022/10/17　te-taniguchi
 * 
 */

import set_dt_optcol from "./set_dt_optcol.mjs";

export function CreateTable(data) {
    $('#mainTable').DataTable({
        dom: '<"shbox"f><t><ip>',  //検索ボックスを上、ページ移動を下に
        data: data,
        columns: set_dt_optcol(),
        order: [[0, "asc"]],     //日付列で初期ソート
        fixedHeader: true,      //ヘッダ行の固定
        paging: true,           //ページング機能有効
        pageLength: 50,        //1ページ行
        responsive: true,

    });

}

/**
 * HTMLテーブルのth部を描画する
 * @param {*} objData 
 */
export function SetTh(objData) {

    //key名取得
    let keyNameArr = Object.keys(objData[0]);
    // console.log(keyNameArr);
    let $target = $('#mainTable').find('tr');
    // console.log(keyNameArr);
    keyNameArr.map(e => {
        $target.append('<th>' + e + '</th>');
    })


}

