const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/belajar',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});



// //menambah satu data
// const contact1 = new Contact({
//     nama:'Feri',
//     nohp:'082210182903',
//     email:'feri@vanaroma.com'
// });

// //simpan ke collection
// contact1.save().then((contact)=>{
//     console.log(contact);
// });