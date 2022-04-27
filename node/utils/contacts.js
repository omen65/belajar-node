const fs= require('fs');
//buat folder jika belum ada
const dirPath = './data';
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

//membuat file json jika belum ada
const filePath = './data/contacts.json';
if(!fs.existsSync(filePath)){
    fs.writeFileSync(filePath, '[]', 'utf8');
}

//load semua data
const loadContact = () => {
    const fileaBuffer = fs.readFileSync('data/contacts.json');
    const contacts = JSON.parse(fileaBuffer);
    return contacts;
}

//cari contact by nama
const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find(contact => contact.nama === nama);
    return contact;
}

//menimpa file json dengan data baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts), 'utf8');
}


//tambah data contact
const addContact = (contact) => {
    const contacts = loadContact(); 
    contacts.push(contact);
    saveContacts(contacts);
}

//cek duplikat
const cekDuplikat = (nama)=>{
    const contacts = loadContact();
    const contact = contacts.find(contact => contact.nama === nama);
    return contact;
}

//hapus contact
const deleteContact=(nama)=>{
    const contacts=loadContact();
    const filteredContacts=contacts.filter((contact)=>contact.nama!==nama);
    saveContacts(filteredContacts);
}

//update data
const updateContacts=(contactBaru)=>{
    const contacts=loadContact();
    const filteredContacts=contacts.filter((contact)=>contact.nama !== contactBaru.oldNama);
    delete contactBaru.oldNama;
    filteredContacts.push(contactBaru);
    saveContacts(filteredContacts);
}
module.exports = {loadContact,findContact,addContact,cekDuplikat,deleteContact,updateContacts};