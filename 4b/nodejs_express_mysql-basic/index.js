const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session')

app.use(express.json())
app.use(express.static('express'));


const mysql = require('mysql');

 




const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task_collections'
});
 
const {response} = require('express')

app.use(
    session(
      {
        cookie: {
          maxAge: 1000 * 3600,
          secure: false,
          httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretkey'
      }
    )
  )

  app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})


//connect ke database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connect');
});
 
//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// set folder public sebagai static folder untuk static file
app.use('/public',express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }))

 
//route untuk homepage

let isLogin = false

app.get('/',(req, res) => {
  let sql = "SELECT * FROM collections";
  conn.query(sql, (err, results) => {
    if(err) throw err

    const collections = []

    for (let result of results) {
        collections.push({
            id: result.id,
            name: result.name,
            user_id:result.user_id
        })
    }
    res.render('index',{
    isLogin: req.session.isLogin,
     results: results,
    collections
    });
  });
});

app.get('/register',(req, res) => {
    res.render('register')
});
 
app.post('/register',(req, res) => {
    const {name , email, password} = req.body
    // console.log(data)
    const sql =  `INSERT INTO users (username, email, password) VALUES ("${name}","${email}","${password}")`
    conn.query(sql,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

app.get('/login',(req, res) => {
        res.render('login')
    });
 
app.post('/login',(req, res) => {
    const {email, password} = req.body
    
    const sql =  `SELECT * FROM users where email = "${email}" and password="${password}"`
    conn.query(sql,(err, results) => {

    if(err) throw err;
    req.session.isLogin = true
    
    req.session.user = {
        id : results[0].id,
        name : results[0].username,
        email : results[0].email
    }
    console.log(email)
    console.log(req.session.user)
    res.redirect('/');
  });
});

app.get('/logout',(req, res)=>{
    req.session.destroy()
    res.redirect('/')
  })
  
app.get('/add-collections', (req, res) => {
    res.render('add_collections', {
      isLogin: req.session.isLogin
    });
  });

app.post('/add-collections', (req, res) => {
    const name = req.body.name
    const userId = req.session.user.id
    isLogin: req.session.isLogin
    const sql =  `INSERT INTO collections (name, user_id) VALUES ("${name}", ${userId})`
    conn.query(sql,(err, results) => {
    console.log(userId)
    console.log(name)
    if(err) throw err;

    res.redirect('/');
  });
})

app.get('/task/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM collections WHERE id=${id}`

    conn.query(sql,(err, results) => {
       
        if(err) throw err;

        const collections = {
            id: results[0].id,
            name: results[0].name,
            user_id: results[0].user_id
        }
        console.log(collections)

    
        res.render('task' ,{
        isLogin: req.session.isLogin,
        collections
        });
      });
  });






//route untuk insert data
// app.post('/save',(req, res) => {
//   let data = {product_name: req.body.product_name, product_price: req.body.product_price};
//   let sql = "INSERT INTO product SET ?";
//   let query = conn.query(sql, data,(err, results) => {
//     if(err) throw err;
//     res.redirect('/');
//   });
// });
 
//route untuk update data
// app.post('/update',(req, res) => {
//   let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
//   let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//     res.redirect('/');
//   });
// });
 
//route untuk delete data
// app.post('/delete',(req, res) => {
//   let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
//   let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//       res.redirect('/');
//   });
// });
 
//server listening
app.listen(3000, () => {
  console.log('Server running at port 3000');
});