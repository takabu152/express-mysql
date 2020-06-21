const express = require('express');
const mysql = require('mysql');
const app = express();

const bodyParser = require('body-parser');

const cors = require('cors');

//全ルーティングでcorsを有効にする
app.use(cors());
//publicフォルダ内にCSSや画面で使う画像ファイルを設置
//それらを使えるように準備
app.use(express.static('public'));

// フォームから値を受取るために必要な定型文
app.use(express.urlencoded({extended:false}))

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//SQLServerを利用する準備
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'list_app'
  }
);

// ルーティングはapp.get関数で行える。
// 初期表示画面　
// [/]のURLはルートURLという
app.get('/',(req,res)=>{
  res.render('top.ejs');
});

// TOPページの表示
app.get('/top',(req,res)=>{
  res.render('top.ejs');
});

// List画面へのルーティング
// itemsを取得して、画面は渡す
app.get('/index',(req,res) => {

  connection.query(
    'SELECT * FROM items ',(error,results)=>{
      //一覧画面の表示
      res.render('index.ejs',{items : results});
    }
  );

});

// 新規登録画面へのルーティング
app.get('/new',(req,res) => {
  res.render('new.ejs');
});

// 登録処理API
app.post('/create',(req,res) => {
  connection.query(
    ' INSERT INTO items (name) VALUES (?) ',
      [req.body.itemName],
      (error,results)=>{
      //一覧画面の表示
      res.redirect('/index');
    }
  );
});

// 削除処理API
app.post('/delete/:id',(req,res) => {
  connection.query(
    ' DELETE FROM items WHERE id = ? ',
      [req.params.id],
      (error,results)=>{
      //一覧画面の表示
      res.redirect('/index');
    }
  );
});

// 更新画面表示処理
app.get('/edit/:id',(req,res) => {
  connection.query(
    ' SELECT * FROM items WHERE id = ? ',
      [req.params.id],
      (error,results)=>{
      //一覧画面の表示
      res.render('edit.ejs',{item : results[0]});
    }
  );
});

// 更新処理API
app.post('/update/:id',(req,res) => {
  connection.query(
    ' UPDATE items SET name = ? WHERE id = ? ',
      [req.body.itemName,req.params.id],
      (error,results)=>{
        //一覧画面の表示
        res.redirect('/index');
    }
  );
});

// List画面へのルーティング
// itemsを取得して、画面は渡す
app.get('/api/index',(req,res) => {

  connection.query(
    'SELECT * FROM items ',(error,results)=>{
      //一覧画面の表示
      res.send({items : results});
    }
  );
});

// 登録処理API
app.post('/api/create',(req,res) => {

  console.log(req.body.itemName);

  connection.query(
    ' INSERT INTO items (name) VALUES (?) ',
      [req.body.itemName],
      (error,results)=>{
        console.log(results);
        console.log(error);
        //登録後のデータを返す。
        connection.query(
        'SELECT * FROM items ',(error,results)=>{
          //一覧画面の表示
          res.send({items : results});
        }
      );
    }
  );
});

// app.listenで指定したポートに対してWebサービスを開始する。
// node app.jsコマンドでapp.jsを開始
app.listen(3001);