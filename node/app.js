const express = require('express')
const expressLayouts= require('express-ejs-layouts')
const {loadContact,findContact,addContact,cekDuplikat,deleteContact,updateContacts}= require('./utils/contacts')
const { body, validationResult,check } = require('express-validator');
const session= require('express-session')
const cookieParser= require('cookie-parser')
const flash= require('connect-flash')


const app = express()
const port = 3000
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

app.get('/', (req, res) => {
 res.render('index',{
  layout:'layouts/main-layout',
  title:'Home Page',
  nama :'Feri Anggriawan'
  });
})
app.get('/about', (req, res) => {
 res.render('about',{
   layout:'layouts/main-layout',
   title:'About Page'
  });
})
app.get('/contact', (req, res) => {
  const contacts = loadContact();
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
body('nama').custom((value)=>{
 const duplikat = cekDuplikat(value);
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
  //  return res.status(400).json({ errors: errors.array() });
    return res.render('add-contact',{
      layout:'layouts/main-layout',
      title:'Add New Contact',
      errors:errors.array()
    })
  }else{
    addContact(req.body);
    //add flash message
    req.flash('msg','Contact Berhasil Ditambahkan');
    res.redirect('/contact');
  }

});

//hapus data
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  if(!contact){
    res.status(404);
    res.send('Contact Not Found');
  }else{
    deleteContact(req.params.nama);
    req.flash('msg','Contact Berhasil di hapus');
    res.redirect('/contact');
  }
});

//edit data
app.get('/contact/edit/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('edit-contact',{
    layout:'layouts/main-layout',
    title:'Update Contact',
    contact
  })
});

//update data
app.post('/contact/update',
[
body('nama').custom((value,{req})=>{
 const duplikat = cekDuplikat(value);
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
  //  return res.status(400).json({ errors: errors.array() });
    return res.render('edit-contact',{
      layout:'layouts/main-layout',
      title:'Update Contact',
      errors:errors.array(),
      contact:req.body
    })
  }else{
    updateContacts(req.body);
    //add flash message
    req.flash('msg','Contact Berhasil update');
    res.redirect('/contact');
    
  }

});

//halaman detail contact
app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('detail',{
    layout:'layouts/main-layout',
    title:'Detail Contact',
    contact
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})