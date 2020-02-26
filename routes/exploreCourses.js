const express = require('express');
const router = express.Router();
const updateJsonFile = require("update-json-file");
const _=require('lodash');

const studentData='./data/users.json';
const courseData='./data/courses.json';
//Initializing the class
const {FileDataOperations,UpdateOperations}=require('../FileDataOperationsClass');
const db=new FileDataOperations();


//OPENS EXPLORE CATALOG
router.get('/:sid',function(req,res){
  let sid=(req.params.sid).replace(':','');
  db.searchById(sid,studentData)
  .then((data)=>{
    const registeredCourses=data.courses;
    db.getAllCoursesList(courseData)
    .then((courseList)=>{

      var newCourses=[];
      _.forEach(courseList,course=>{
        var isthere=_.includes(registeredCourses,course.id);
        if(!isthere){
          newCourses.push(course);
        }
      });

      var domains=[];
      newCourses.forEach((course)=>{
        domains.push(course.domain);
      });

      uniqueDomains=_.uniq(domains);
      res.render('explore',{sid,newCourses,uniqueDomains,filter:false});
    })
  })
  .catch((err)=>console.log(err));

});

//POST REQUEST WHEN COURSE IS SUBSCRIBED
router.post('/:sid',function(req,res){
  const sid=(req.params.sid).replace(':','');
  const courseId=req.body.sub;

  updateJsonFile(studentData, data => {
    var student=_.find(data,{id:sid});
    student.courses.push(courseId);
    return data;
  })
  .then(()=>{
    updateJsonFile(courseData,data=>{

      var course=_.find(data,{id:courseId});
      if(typeof course.registered==='undefined'){
          course.registered=1;
      }else{
          course.registered+=1
      }

      return data;
    });
  })
  .then(()=>res.redirect(`/dashboard/student/:${sid}`))
  .catch((err)=>console.log(err));
});

//TO DISPLAY THE COURSE DETAILS PAGE
router.get('/detail/:cid&:sid',(req,res)=>{
  let cid=req.params.cid.replace(':','');
  let sid=req.params.sid;
  db.searchById(cid,courseData)
  .then((course)=>{
    let details=course;
    res.render('partials/view_details',{sid,details});
  })
  .catch((err)=>console.log(err));
})

//TO FILTER THE COURSES BY DOMAINS
router.get('/filter/:domain&:sid',(req,res)=>{

  const courseDomain=req.params.domain.replace(':','');
  const sid=req.params.sid;

  db.searchById(sid,studentData)
  .then((data)=>{
    const registeredCourses=data.courses;

    db.getAllCoursesList(courseData)
    .then((courseList)=>{
      var newCourses=[];
      _.forEach(courseList,course=>{
        var isThere=_.includes(registeredCourses,course.id); //returns boolean value
        if(!isThere && course.domain==courseDomain){
          newCourses.push(course);
        }
      });
      res.render('explore',{sid,newCourses,filter:true});
    });

  })
  .catch((err)=>console.log(err));

});

router.post('/filter/:domain&:sid',function(req,res){
  const sid=req.params.sid;
  const courseId=req.body.sub;
  updateJsonFile(studentData, data => {
    var student=_.find(data,{id:sid});
    student.courses.push(courseId);
    return data;
  })
  .then(()=>res.redirect(`/dashboard/student/:${sid}`))
  .catch((err)=>console.log(err));
  
});

module.exports=router;