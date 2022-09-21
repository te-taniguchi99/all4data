<?php

/* 
 * all4data JSONファイルの存在確認及び更新日を返す
 * 2022/09/20 te-taniguchi 
 * 戻り値：code 0->ファイル存在同日、msgにdateTimeが返る
 *  code 1 -> ファイルは存在するが同日では無い
 *  code 2 -> ファイルは存在しない
 * http://localhost/all4data/php/file_existence_check.php
 */

const DATA_FILE_NAME = 'data.json';
const DATA_DIR = '../data/';

header("Content-Type: text/plain; charset=utf-8");
date_default_timezone_set('Asia/Tokyo');

//ファイル存在及び日付確認
$fileExeists  = 0;   //ファイル存在フラグ　0->ない　1->ある
$targetFile = DATA_DIR . DATA_FILE_NAME;
if (file_exists($targetFile)) {

    //存在する->日付の確認
    $fileExeists = 1;
    $today = date("Y-m-d");    //今日を設定
    $targetDate = date('Y-m-d', filemtime($targetFile)); //ファイルの更新日を取得

    //日付判定
    if ($today !== $targetDate) { //同日では無い
        $res = ["code" => "1", "msg"=>"not on same day...."];
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
    } else {
        //ファイル存在し、同日ファイル
        $targetDateTime = date('Y-m-d H:i:s', filemtime($targetFile));
        $res = ["code" => "0", "msg" => $targetDateTime];
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
    }

} else {
    $res = ["code" => "2", "msg" => "not exists...."];
    echo json_encode($res, JSON_UNESCAPED_UNICODE);
}
