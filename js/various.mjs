/**
 * All4Data　雑多なjs群
 */

/**
 *  jsonファイル存在チェックし、domに描画 
 */
export function WriteJsonFileExists(id) {

    fetch("./php/file_existence_check.php", {
    })
        .then(res => res.json())
        .then(res2 => {
            console.log(res2);
            if (res2.code === "0") {
                $('#fileInfo').text('中間ファイル有り：' + res2.msg);
            }
        })
}