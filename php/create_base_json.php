<?php

/* 
 * all4data JSONファイルを作成する
 * 実行時の日付と同じなら実行しない
 * 2020/09/28 te-taniguchi 
 */

const DATA_FILE_NAME = 'data.json';
const DATA_DIR = '../data/';

header("Content-Type: text/plain; charset=utf-8");

//DSN情報取得
require_once '../../common/.htpass';
//require_once $_SERVER['DOCUMENT_ROOT'] . '/dsn.php';
date_default_timezone_set('Asia/Tokyo');

//ファイル存在及び日付確認
$fileExeists  = 0;   //ファイル存在フラグ　0->ない　1->ある
$targetFile = DATA_DIR . DATA_FILE_NAME;

//newFileフラグ($arg)1の時、ファイルを削除する
if ($newFlg == "true") {
    unlink($targetFile);
}

if (file_exists($targetFile)) {

    //存在する->日付の確認
    $fileExeists = 1;
    $today = date("Y-m-d");    //今日を設定
    $targetDate = date('Y-m-d', filemtime($targetFile)); //ファイルの更新日を取得
    //日付判定
    if ($today === $targetDate) { //同日
        return 'today';
    }
}

//DB接続
try {
    //    $pdo = new PDO(GRA_SC_DSN, GA_USER_NAME, GA_PASSWD);
    $pdo = new PDO(SDB_DB_PARAM['DSN_SC'], SDB_DB_PARAM['DB_USER'], SDB_DB_PARAM['DB_PASS']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $ex) {
    print($ex->getMessage());
    exit;
}

//クエリファイル読み込み
$query = file_get_contents('../query/商品データ.sql');

$result = $pdo->query($query)->fetchAll(PDO::FETCH_ASSOC);

//既存ファイルの削除
if ($fileExeists === 1) {
    unlink($targetFile);
}

//ファイル書込
file_put_contents($targetFile, json_encode($result, JSON_UNESCAPED_UNICODE));
return 'create';

//print(json_encode($result, JSON_UNESCAPED_UNICODE));
