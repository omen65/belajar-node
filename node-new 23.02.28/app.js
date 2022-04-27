const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const {body,validationResult,check}=require('express-validator');
const methodOverride = require('method-override');

const session= require('express-session')
const cookieParser= require('cookie-parser')
const flash= require('connect-flash')

require('./utils/db');
const Contact=require('./model/contact');
const { findOne } = require('./model/contact');

const app = express();
const port = 3000;

//setup method override
app.use(methodOverride('_method'));

//gunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.use(cookieParser('secret'))
app.use(session({
  cookie: { maxAge: 60000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    
}))
app.use(flash())

//home
app.get('/', (req, res) => {
 res.render('index',{
  layout:'layouts/main-layout',
  title:'Home Page',
  nama :'Feri Anggriawan'
  });
})

//about
app.get('/about', (req, res) => {
 res.render('about',{
   layout:'layouts/main-layout',
   title:'About Page'
  });
})

app.get('/contact', async (req, res) => {
  const contacts = await Contact.find();
  res.render('contact',{
    layout:'layouts/main-layout',
    title:'Contact Page',
    contacts,
    msg:req.flash('msg')
  });
});

//halaman tambah data
app.get('/contact/add', (req, res) => {
  res.render('add-contact',{
    layout:'layouts/main-layout',
    title:'Add New Contact'
  })
});

//proses tambah data
app.post('/contact',
[
body('nama').custom(async (value)=>{
 const duplikat = await Contact.findOne({nama:value});
 if(duplikat){
  throw new Error ('Nama sudah ada');
 }
 return true;
}),
check('email','Email Tidal Valid').isEmail(), 
check('nohp','Nomor HP Tidak Valid').isMobilePhone('id-ID'), 
],
(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render('add-contact',{
      layout:'layouts/main-layout',
      title:'Add New Contact',
      errors:errors.array()
    })
  }else{
    Contact.insertMany(req.body,(err,result)=>{
      //add flash message
      req.flash('msg','Contact Berhasil Ditambahkan');
      res.redirect('/contact');
    });
  }
});

//hapus data
app.delete('/contact', (req,res)=>{
  Contact.deleteOne({_id:req.body._id}).then((result)=>{
      req.flash('msg','Contact Berhasil di hapus');
      res.redirect('/contact');
    });
});

//edit data
app.get('/contact/edit/:nama',async (req, res) => {
  const contact =  await Contact.findOne({nama:req.params.nama});
  res.render('edit-contact',{
    layout:'layouts/main-layout',
    title:'Update Contact',
    contact
  })
});

//update data
app.put('/contact',
[
body('nama').custom(async (value,{req})=>{
 const duplikat = await Contact.findOne({nama:value});
 if(value !== req.body.oldNama && duplikat){
  throw new Error ('Nama sudah ada');
 }
 return true;
}),
check('email','Email Tidak Valid').isEmail(), 
check('nohp','Nomor HP Tidak Valid').isMobilePhone('id-ID'), 
],
(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render('edit-contact',{
      layout:'layouts/main-layout',
      title:'Update Contact',
      errors:errors.array(),
      contact:req.body
    })
  }else{
    Contact.updateOne(
      {_id:req.body._id},
      {
        $set:{
          nama:req.body.nama,
          email:req.body.email,
          nohp:req.body.nohp
        }
      }
    ).then((result)=>{
      //add flash message
      req.flash('msg','Contact Berhasil update');
      res.redirect('/contact');
    });
  }
});

//halaman detail contact
app.get('/contact/:nama',async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render('detail',{
    layout:'layouts/main-layout',
    title:'Detail Contact',
    contact
  });
});



app.listen(port, () => console.log(`Contact App || listening on port ${port}!`));