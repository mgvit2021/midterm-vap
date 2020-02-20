var express = require('express');
var router = express.Router();
const updateJsonFile = require("update-json-file");
const shortid = require('shortid');
const _=require('lodash');


const student_db='./data/users.json';
const professor_db='./data/professors.json';
const course_db='./data/courses.json';

//Initializing the class
const FileDataOperations=require('../FileDataOperations');
const db=new FileDataOperations();


//-------------------------PROFESSOR DASBOARD-----------------------//

router.get('/professor/edit/:pid&:cid',(req,res)=>{
    let pid=req.params.pid.replace(':','');
    let cid=req.params.cid;
    db.searchById(cid,course_db)
    .then((course)=>{
      let details=course.details;
      res.render('edit_course',{pid,details})
    })
})


router.get('/professor/:pid',(req,res)=>{
  let pid=req.params.pid.replace(':','');
    db.searchById(pid,professor_db)
    .then((professor)=>{
      setTimeout(()=>{
        res.render('prof_dashboard',{professor})
      },500)                                              //Time to write file completely
    })
})

router.post('/professor/:pid',(req,res)=>{
let pid=req.params.pid.replace(':','');
const course_id=req.body.remv;
updateJsonFile(professor_db, data => {
  data.forEach((prof)=>{
    if(prof.id==pid){
      const index = prof.courses.indexOf(_.find(prof.courses,{id:course_id}))
      prof.courses.splice(index, 1)
    }
  })
  return data;
})
.then(()=>{
    res.redirect(`/dashboard/professor/:${pid}`);
})

})


router.get('/professor/add/:pid',(req,res)=>{
let pid=req.params.pid.replace(':','');
db.searchById(pid,professor_db)
.then((professor)=>{
  res.render('add_course',{professor})
})
});


router.post('/professor/add/:pid',(req,res)=>{
let pid=req.params.pid.replace(':','');
const title=req.body.title;
const summary=req.body.summary;
const domain=req.body.domain;
const duration=req.body.duration;
const fees=req.body.fees;
const certification=req.body.certification;
var errors=[]
if(title=='' || summary==''||domain=='' || duration==''||fees==''||certification==''){
  errors.push({msg:"All fields are required"})
  professor={id:pid};
  res.render('add_course',{errors,professor})
}
else{
db.searchById(pid,professor_db)
.then((professor)=>{
  var newCourse={
    id:shortid.generate(),
    title:title,
    t_id:professor.id,
    offered_by:professor.name,
    summary:summary,
    domain:domain,
    details:{
      duration:duration,
      fees:fees,
      certification:certification
    }
  }
  updateJsonFile(course_db, data => {
    data.push(newCourse);
    return data;
  })
  return newCourse;
})
.then((newCourse)=>{
  updateJsonFile(professor_db, data => {
    let id=newCourse.id;
    data.forEach((prof)=>{
      if(prof.id==pid){
        prof.courses.push({
          id:id,
          title:newCourse.title,
          summary:newCourse.summary})
      }
    });
    return data;
  });
})
.then(()=>{res.redirect(`/dashboard/professor/:${pid}`)})
}
});

//-------------------------STUDENT DASHBOARD-----------------------//

router.get('/student/:sid',function(req,res){
  var ret={};
  let sid=(req.params.sid).replace(':','');
  db.searchById(sid,student_db)
  .then((student)=>{
    ret.name=student.name;
    if(typeof student.details.courses !='undefined'){
      let clist=student.details.courses;
      if(clist.length>0)
      {
        db.getCoursesRegisteredByStudent(clist,course_db)
        .then((data)=>{
          ret.course=data;
        })
        .then(()=>{
          let name=ret.name;
          let courses=ret.course;
          res.render('stud_dashboard',{sid,name,courses})
        })
        .catch((err_data)=>{
          let courses=0;
          let name=ret.name; 
          console.log(err_data)
          res.render('stud_dashboard',{sid,name,courses})
        })
      }
      else
      {
        let courses=0;
        let name=ret.name; 
        res.render('stud_dashboard',{sid,name,courses})
      }
    }
  }).catch((err)=>console.log(err));
  
});


router.post('/student/:sid',function(req,res){

const sid=(req.params.sid).replace(':','');
const course_id=req.body.unsub
updateJsonFile(student_db, data => {
  data.forEach((student)=>{
    if(student.id==sid){
      const index = (student.details.courses).indexOf(course_id);
      student.details.courses.splice(index, 1)
    }
  })
  return data;
})
.then(()=>res.redirect(`/dashboard/student/:${sid}`))

});



module.exports = router;
