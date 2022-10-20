<?php

/* 
 * all4data JSONファイルを作成する
 * 実行時の日付と同じなら実行しない
 * phpからrequierされる場合と、fetchされる場合とで処理分岐
 * fetchの時、戻り値は'today'と'create'となる。todayは既にファイルがある。
 * createは新規で作成された。
 * 2020/09/28 te-taniguchi 
 */

const DATA_FILE_NAME = 'data.json';
const DATA_DIR = '../data/';

header("Content-Type: text/plain; charset=utf-8");

//TABLE表示の場合、jsonファイル作成のみ
$arg2 = json_decode(file_get_contents("php://input"), true);
$interimOnly = $arg2['interimOnly'] === true ? "true" : "false";    //中間ファイルのみか？
$newFlg2 = $arg2['newFlg'] === true ? "true" : "false"; //中間ファイルを無視して新規で作成するか

//中間ファイルのみの場合(基本的にはTABLE表示の時のみ)
if ($interimOnly === 'true') {
    JsonFileProc($newFlg2);
    //作成したJSONファイル読み込み
    $jsonFilePath = "../data/data.json";
    $returnJson = file_get_contents($jsonFilePath,true);
    echo $returnJson;
}

function JsonFileProc($newFlg)
{

    //DSN情報取得
    require_once '../../common/.htpass';
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
}
