//ファイルダウンロード押下時
//引数：newFlg: true or false 在庫最新にするか
//      flg13： 1or3コードのみか
export function GetFile(options) {
    $('#cmd_dl').prop('disabled', true);
    fetch('php/create_xlsx.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
    })
        // .then(res => res.text())
        // .then(res2 => console.log(res2));

        .then(res => {
            // console.log(res);
            return res.blob();
        })
        .then(blob => {
            // console.log(blob);
            let a = document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = "hoge.xlsx";
            a.click();
        })
        .then(() => {
            $('#cmd_dl').prop('disabled', false);
        });
}