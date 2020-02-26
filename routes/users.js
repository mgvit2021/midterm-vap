var express = require('express');
var router = express.Router();
const shortid = require('shortid');
const _=require('lodash');
const updateJsonFile = require("update-json-file");


//All database file paths
const studentData='./data/users.json';
const professorData='./data/professors.json';

//Initializing the class
const {FileDataOperations,UpdateOperations}=require('../FileDataOperationsClass');
const db=new FileDataOperations();

//default
router.get('/', function(req, res) {
  res.redirect('/users/login');
});

// -LOGIN-
router.get('/login', function(req, res) {
  res.render('login');
});


router.post('/login', function(req, res) {
  let user=req.body.email;
  let pass=req.body.password;
  let who=req.body.type;
  var dbPath="";
  //SET DATABASE PATH ACCORDING TO LOGIN
  if(who==='student'){
    dbPath=studentData;
  }
  else{
    dbPath=professorData;
  }

  //CHECK FOR AUTHENTICITY
  let errors=[];
  db.authenticateUser(user,pass,dbPath)
  .then((data)=>{
      let id=data.id;
      res.redirect(`/dashboard/${who}/:${id}`)
    })
    .catch((err_data)=>{
      errors.push({msg:err_data});
      res.render('login',{errors})
  })
});

// --REGISTRATION--

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register',function(req,res){
  const{name,email,password,password2,type}=req.body;
  var filePath;

  //CHECKING REGISTRATION TYPE
  if(type==='student'){
    filePath=studentData;
  }
  else{
    filePath=professorData;
  }

  //CHECKING ERRORS IN REGISTRATION -- to be added JOI VALIDATION
  var errors=[];
  if(!name ||!email ||!password ||!password2){
    errors.push({msg:"All feilds are mandatory"});
  }
  if(password!==password2){
    errors.push({msg:"Passwords does not match!"});
  }
  if(password.length <6){
    errors.push({msg:"Password should be atleast 6 characters!"});
  }
  //IF SOME ERROR EXISTS
  if(errors.length>0){
    res.render('register',{errors,name,email,password,password2});
  }else{
    //AUTHENTICATE USER
    db.authenticateUser(email,password,filePath)  //Resolves if user is already registered and sends warning
    .then((data)=>{
        errors.push({msg:"User already Exists!"})
        res.render('register',{errors,name,email,password,password2});
    })
    .catch((err_data)=>{
        var newUser={
          id:shortid.generate(),
          name:name,
          email:email,
          password:password,
          courses:[]
        }
        //ADD USER TO FILE
        updateJsonFile(filePath, data => {
          data.push(newUser);
          return data;
      });
      res.redirect('/users/login');
    });
  }
});
module.exports = router;
