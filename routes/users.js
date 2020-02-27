var express = require('express');
var router = express.Router();
const shortid = require('shortid');
const _=require('lodash');
const updateJsonFile = require("update-json-file");
const ValidationClass= require('../ValidationClass');

const validateData=new ValidationClass();

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
  let email=req.body.email;
  let password=req.body.password;
  let who=req.body.type;
  var dbPath="";
  //SET DATABASE PATH ACCORDING TO LOGIN
  if(who==='student'){
    dbPath=studentData;
  }else{
    dbPath=professorData;
  }

  //  joi validation
  let errors=[];

  var {error}=validateData.loginValidation({email,password});
  if(error){
    var errMessage=error.details[0].message;
    errors.push({msg:errMessage});
  }

  if(errors.length>0){
    res.render('login',{errors});
  }else{

    db.authenticateUser(email,password,dbPath)
    .then((data)=>{
      let id=data.id;
      res.redirect(`/dashboard/${who}/:${id}`)
    })
    .catch((err_data)=>{
      errors.push({msg:err_data});
      res.render('login',{errors})
    });

  }
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
  }else{
    filePath=professorData;
  }

  //  joi validation
  var errors=[];
  var {error}=validateData.registerValidation(req.body);

  if(error){
    var errMessage=error.details[0].message;
    if(errMessage.includes('[ref:password]')){
      errors.push({msg:"Passwords do not match!"});
    }else{
      errors.push({msg:errMessage});
    }
  }
  //IF SOME ERROR EXISTS
  if(errors.length>0){
    res.render('register',{errors,name,email,password,password2});
  }else{
    //authenticate user
    db.authenticateUser(email,password,filePath)  //Resolves if user is already registered and sends warning
    .then((data)=>{
        errors.push({msg:"User already Exists!"});
        res.render('register',{errors,name,email,password,password2});
    })
    .catch((err_data)=>{
        var newUser={
          id:shortid.generate(),
          name:name,
          email:email,
          password:password,
          courses:[]
        };
        //  add user
        updateJsonFile(filePath, data => {
          data.push(newUser);
          return data;
      });
      res.redirect('/users/login');
    });
  }
});
module.exports = router;
