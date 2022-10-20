/**
 * DataTablesのcolumn群
 * HTMLで描画されているカラム名とは紐付いていない。
 * 単純に左から順番で対応している
 */

export default function () {
    let lx = luxon; //日付フォーマット用
    const commaFormat = new Intl.NumberFormat('ja');    //カンマ区切りフォーマット
    const rowFormat = new Intl.NumberFormat('ja', { useGrouping: false});   //カンマ区切らないフォーマット

    let tempCol = [
        { data: "商品コード" },
        { data: "商品名", responsivePriority: 10001 },
        { data: "商品略名" },
        { data: "商品カナ名", visible: false, responsivePriority: 10001 },
        { data: "単位名称" , responsivePriority: 10002},
        { data: "重量", render: (e) => commaFormat.format(e) , responsivePriority: 10002},
        { data: "表示用原価", render: (e) => commaFormat.format(e) },
        { data: "新表示用原価", render: (e) => commaFormat.format(e) },
        {
            data: "原価単価改定日",
            render: (e) => {
                let dt = lx.DateTime.fromSQL(e).toFormat('yyyy/MM/dd');
                if (dt === 'Invalid DateTime') { dt = "" };
                return dt;
            }
        },
        { data: "販売単価(000)", render: (e) => commaFormat.format(e) },
        { data: "新販売単価(000)", render: (e) => commaFormat.format(e) },
        { data: "販売単価(001)", render: (e) => commaFormat.format(e) },
        { data: "新販売単価(001)", render: (e) => commaFormat.format(e) },
        {
            data: "販売単価改定日",
            render: (e) => {
                let dt = lx.DateTime.fromSQL(e).toFormat('yyyy/MM/dd');
                if (dt === 'Invalid DateTime') { dt = "" };
                return dt;
            }
        },
        { data: "大分類" , responsivePriority: 10001},
        { data: "大分類名" , responsivePriority: 10001},
        { data: "中分類" , responsivePriority: 10001},
        { data: "中分類名" , responsivePriority: 10001},
        { data: "小分類" , responsivePriority: 10001},
        { data: "小分類名" , responsivePriority: 10001},
        { data: "シリーズコード" , responsivePriority: 10001},
        { data: "シリーズ名" , responsivePriority: 10001},
        { data: "ソート" , responsivePriority: 10001},
        {
            data: "スポット数",
            responsivePriority: 2,
            render: (e) => {
                // console.log(e);
                if (e === null) {
                    return ""
                } else {
                    return rowFormat.format(e);
                }

            }
        },
        { data: "結束数" ,responsivePriority: 2,},
        { data: "有効在庫" ,render: (e) => commaFormat.format(e) ,responsivePriority: 2,},
        { data: "価格表掲載区分" },
        { data: "EC掲載区分" }
    ]

    return tempCol;

}