<?php

/*
 * ALL4DATA
 * SELECT結果データファイル作成用 POST受け
 * http://localhost/all4data/php/create_xlsx.php
 * リクエスト：POST
 *  {"newFlg":true or false} true時、中間jsonファイルがあっても新規で作成しなおす
 *      html上では「在庫最新にする」のチェックボックス
 *  {"flg13":true or false} true時、1,3コードのみを出力する
 *  {"catecode"true or false} true時、分類コード及び商品英字を出力しない
 */

set_time_limit(120);
header("Content-Type: text/plain; charset=utf-8");
// header('Content-Type: application/force-download'); //ファイルを強制的にDLさせる
// header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

require_once $_SERVER['DOCUMENT_ROOT'] . "/vendor/autoload.php";

$outFilePath = '../data/'; //作成したExcelの保存先
$outFileName = 'alldata.xlsx';  //作成Excelファイル名
$outFullPath = $outFilePath . $outFileName;

//POSTで引数　{"newFlg":true, "flg13":true}　
//newFlgは、create_base_json.phpで使用する
$arg = json_decode(file_get_contents("php://input"), true);

//falseは何故か空になるので、文字列falseに変換
$newFlg = $arg['newFlg'] === true ? "true" : "false";
$flg13 = $arg['flg13'] === true ? "true" : "false";
$catecode = $arg['catecode'] === true ? "true" : "false";

/**
 * JSONファイル作成
 * create_base_json.php側でファイルの新旧判定もしている
 */
require_once 'create_base_json.php';

/**
 * Excelファイル作成
 */

use PhpOffice\PhpSpreadsheet\Spreadsheet as Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

//作成したJSONファイル読み込み
$jsonFilePath = "../data/data.json";
$tempData = json_decode(file_get_contents($jsonFilePath), true);
$fixData;

//1or3コード、分類コード比出力分岐
if ($flg13 === "false" && $catecode === "false") {
    $fixData = $tempData;
} else {
    $fixData = FilterData($tempData, $flg13, $catecode);
}

$arrayHeaders = array_keys($fixData[0]);   //ヘッダのみ配列で取得

// print_r(json_encode($fixData, JSON_UNESCAPED_UNICODE));
// exit();

try {

    //スプレッドシート作成
    $spreadsheet  = new Spreadsheet();
    $spreadsheet->getDefaultStyle()->getFont()->setName('ＭＳ ゴシック');   //初期フォント
    //シート作成
    $sheet = $spreadsheet->getActiveSheet();

    //ヘッダ描画
    $i = 1;
    foreach ($arrayHeaders as $value) {
        $sheet->setCellValueByColumnAndRow($i, 1, $value);
        ++$i;
    }
    //ボディ描画
    $sheet->fromArray($fixData, null, 'A2');
    $max_col = $sheet -> getHighestColumn();    //最終列の取得
    $sheet->setAutoFilter($sheet -> calculateWorksheetDimension()); //autoFilter
    
    $sheet->getColumnDimension('A')->setAutoSize(true); // A列の幅を自動調整
    $sheet->getColumnDimension('B')->setAutoSize(true); // A列の幅を自動調整
    $sheet->getColumnDimension('C')->setAutoSize(true); // A列の幅を自動調整
    // $sheet->getColumnDimension('G')->getNumberFormat()->setFormatCode('#,##0');

    $writer = new Xlsx($spreadsheet);
    ob_end_clean();
    $writer->save($outFullPath);
} catch (\Throwable $th) {
    print_r($th);
    exit();
}



//ファイルサイズ
header('Content-Length: ' . filesize($outFullPath));
//ファイルのダウンロード及びリネーム指定
header('Content-disposition: attachment; filename="' . $outFileName . '"');

//出力用バッファを消去し、出力のバッファリングをオフに
//環境によってはob_end_cleanが必要になる。
// ob_end_clean();
readfile($outFullPath);
exit();


/**
 * 渡されたオブジェクト形式にフィルターを掛けて返す
 * $flg13：1番3番コードのみ
 * $catecode：分類コード非表示(英語表記も)
 *
 * @param [object] $data
 * @return void
 */
function FilterData($data, $flg13, $catecode)
{
    $resArray = [];

    //配列LOOOOOOOP
    foreach ($data as $row) {
        //分類コード及び商品英表記、trueは出力しない
        if ($catecode === "true") {
            //以下を非出力とする
            unset($row['大分類']);
            unset($row['中分類']);
            unset($row['小分類']);
            unset($row['シリーズコード']);
            unset($row['英字名']);
        }
        //13flgがtrue－＞1,3コードのみの時
        if ($flg13 === "true") {
            $firstCode = substr($row['商品コード'], 0, 1);
            if ($firstCode == 1 || $firstCode == 3) {
                $resArray[] = $row;
            }
        } else {
            $resArray[] = $row;
        }
    }
    // print_r($resArray);

    return $resArray;
}
