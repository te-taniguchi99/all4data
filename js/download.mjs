//ファイルダウンロード押下時
//引数：newFlg: true or false 在庫最新にするか
//      flg13： 1or3コードのみか

export async function GetFile(options) {
    console.log(options);

    //TABLE表示ボタン押下か判断　中間ファイルのみ作成FLG
    //基本的に中間ファイルFLGがTrueはテーブル表示ボタン押下時のみ
    if (options.interimOnly) {
        $('#cmd_table').prop('disabled', true);
        let result = await fetch('php/create_base_json.php', {
            method: 'POST',
            headers: { 'Content-Type': 'applicationjson' },
            body: JSON.stringify(options)
        })
            .then(res => res.text());
        //この時点ではparsせずにjsonのまま返している
        return result;

    } else {
        //downloadボタン押下時
        $('#cmd_dl').prop('disabled', true);
        fetch('php/create_xlsx.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        })
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


}