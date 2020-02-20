var express = require('express');
var router = express.Router();
const shortid = require('shortid');
const _=require('lodash');
const updateJsonFile = require("update-json-file");


//All database file paths
const student_db='./data/users.json';
const professor_db='./data/professors.json';
const course_db='./data/courses.json';

//Initializing the class
const FileDataOperations=require('../FileDataOperationsClass');
const db=new FileDataOperations();


/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

// --------------------------------------LOGIN-----------------------------------

router.get('/login', function(req, res) {
  res.render('login');
});
router.post('/login', function(req, res) {
  let user=req.body.email;
  let pass=req.body.password;
  let who=req.body.prof;
  var dbPath="";
  if(who=='student'){
    dbPath=student_db;
  }
  else{
    dbPath=professor_db;
  }
  let errors=[];
  db.authenticateUser(user,pass,dbPath)
  .then((data)=>{
      let id=data.id;
      res.redirect(`/dashboard/${who}/:${id}`)
    })
    .catch((err_data)=>{
      let err=err_data.err;
      errors.push({msg:err});
      res.render('login',{errors})
  })
});

// --------------------------------------REGISTRATION-----------------------------------

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register',function(req,res){
  const{name,email,password,password2,prof}=req.body;
  var filePath;
  if(prof=="student"){
    filePath=student_db;
  }
  else{
    filePath=professor_db;
  }
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
  if(errors.length>0){
    res.render('register',{
      errors,
      name,
      email,
      password,
      password2
    });
  }
  else{
    db.authenticateUser(email,password,filePath)  //Resolves if user is already registered and sends warning
    .then((data)=>{
      //let auth=data.auth;
      //if(auth){
        errors.push({msg:"User already Exists!"})
        res.render('register',{
          errors,
          name,
          email,
          password,
          password2
        });
      //}
      //else{
        //}
      })
      .catch((err_data)=>{
              var newUser={
                id:shortid.generate(),
                name:name,
                email:email,
                password:password,
                details:{
                  courses:[]
                }
              }
              updateJsonFile(filePath, data => {
                data.push(newUser);
                return data;
            });
            res.redirect('/users/login');
    })
  }

});

module.exports = router;
