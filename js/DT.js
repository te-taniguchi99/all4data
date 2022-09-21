/* 
 * DataTableの設定用
 */

export default function(fun){
        fun.DataTable({
            lengthChange: true,  //件数切替機能
            paging: true,           //ページング
            processing: true,       //処理中表示
            autoWidth: false,       //自動横幅(動いてる？)
            deferRender: false,      //遅延レンダー
            pageLength: 100,        //初期ページ数   
            scrollX: true,
            scrollY: 400,
            
            columnDefs: [
                {type: 'num', targets: [6, 24]}
            ],
            
            //幅指定
            
            //ソート初期設定
            order: [
                [20, 'asc'],[24, 'asc']
            ],
            
            //処理完了時処理
            initComplete: function(a,b){
                Init(a,b);
            },
            //固定列
            fixedColumns :{leftColumns: 2},
            //カラム非表示
            columnDefs: [   
                {targets: [2,3,16,18], visible: false}
            ],
            //日本語
            language: {
                url: "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json"
            }
        });
}

//初期化処理完了(テーブル描画後の整形）
function Init(setting, json){
    console.log('DT table write END');
}