const express = require('express');
const router = express.Router();
const updateJsonFile = require("update-json-file");
const _=require('lodash');


const student_db='./data/users.json';
const course_db='./data/courses.json';

//Initializing the class
const FileDataOperations=require('../FileDataOperationsClass');
const db=new FileDataOperations();

//OPENS EXPLORE CATALOG
router.get('/:sid',function(req,res){
  let sid=(req.params.sid).replace(':','');
  db.searchById(sid,student_db)
  .then((data)=>{
    const subscribed_courses=data.courses;
    db.getAllCoursesList(course_db)
    .then((courseList)=>{
      var newCourses=[];
        _.forEach(courseList,course=>{
        var isthere=_.includes(subscribed_courses,course.id);
        if(!isthere){
          newCourses.push(course);
        }
      })
      var domains=[]
      newCourses.forEach((course)=>{
        domains.push(course.domain);
      })
      unique_domains=_.uniq(domains)
      res.render('explore',{sid,newCourses,unique_domains,filter:false});
  })
})
.catch((err_data)=>console.log(err_data))
});

//POST REQUEST WHEN COURSE IS SUBSCRIBED
router.post('/:sid',function(req,res){
  const sid=(req.params.sid).replace(':','');
  const course_id=req.body.sub
  updateJsonFile(student_db, data => {
    data.forEach((student)=>{
      if(student.id==sid){
        student.courses.push(course_id);
      }
    })
    return data;
  })
  .then(()=>{
    updateJsonFile('sample.json',data=>{
      data.forEach((course)=>{
        if(course_id==course.id){
          if(typeof course.registered=='undefined'){
              course.registered=1;
          }else{
              course.registered+=1
          }
        }
      });
      return data;
    })
  })
  .then(()=>res.redirect(`/dashboard/student/:${sid}`))
});

//TO DISPLAY THE COURSE DETAILS PAGE
router.get('/detail/:cid&:sid',(req,res)=>{
  let cid=req.params.cid.replace(':','');
  let sid=req.params.sid;
  db.searchById(cid,course_db)
  .then((course)=>{
    let details=course;
    res.render('partials/view_details',{sid,details})
  })
})

//TO FILTER THE COURSES BY DOMAINS
router.get('/filter/:domain&:sid',(req,res)=>{

  const sid=req.params.sid;
  const ctag=req.params.domain.replace(':','');
  db.searchById(sid,student_db)
  .then((data)=>{
    const subscribed_courses=data.courses;
    db.getAllCoursesList(course_db)
    .then((courseList)=>{
      var newCourses=[];
      _.forEach(courseList,course=>{
        var isthere=_.includes(subscribed_courses,course.id);
        if(!isthere && course.domain==ctag){
          newCourses.push(course);
        }
      })
      res.render('explore',{sid,newCourses,filter:true});
  })
})
});

router.post('/filter/:domain&:sid',function(req,res){
  const sid=req.params.sid;
  const course_id=req.body.sub
  updateJsonFile(student_db, data => {
    data.forEach((student)=>{
      if(student.id==sid){
        student.courses.push(course_id);
      }
    })
    return data;
  })
  .then(()=>res.redirect(`/dashboard/student/:${sid}`))
  

});

module.exports=router;