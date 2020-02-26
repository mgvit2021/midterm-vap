const express = require('express');
const router = express.Router();
const updateJsonFile = require("update-json-file");
const shortid = require('shortid');
const _=require('lodash');

const {FileDataOperations,UpdateOperations}=require('../FileDataOperationsClass');

//Initializing the classes
const db=new FileDataOperations();
const update=new UpdateOperations();

//Database paths
const studentData='./data/users.json';
const professorData='./data/professors.json';
const coursesData='./data/courses.json';



//PROFESSOR DASBOARD

//display professor dashboard
router.get('/professor/:pid',(req,res)=>{
  let pid=req.params.pid.replace(':','');
    db.searchById(pid,professorData)
    .then((professor)=>res.render('prof_dashboard',{professor}))
    .catch((err)=>console.log(err));
});

//delete published courses
router.post('/professor/:pid',(req,res)=>{
  let pid=req.params.pid.replace(':','');
  const courseId=req.body.remv;

  update.removeCourseFromProfessor(professorData,courseId,pid);

  update.removeCourse(coursesData,courseId)
  .then(()=>{res.redirect(`/dashboard/professor/:${pid}`)})
  .catch((err)=>console.log(err));

});

//create course
router.get('/professor/add/:pid',(req,res)=>{
  let pid=req.params.pid.replace(':','');

  db.searchById(pid,professorData)
  .then((professor)=>{
    res.render('add_course',{professor})
  })
  .catch((err)=>console.log(err));

});
  //publishing course
router.post('/professor/add/:pid',(req,res)=>{

  let pid=req.params.pid.replace(':','');
  const {title,summary,domain,duration,fees,certification} = req.body;
  var errors=[];
  //-----Joi schema to be used
  if(title=='' || summary==''||domain=='' || duration==''||fees==''||certification==''){
    errors.push({msg:"All fields are required"})
    professor={id:pid};
    res.render('add_course',{errors,professor})
  }else{
    db.searchById(pid,professorData)
    .then((professor)=>{
      //new course details
      const newCourse={
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
      };

      update.addCourse(coursesData,newCourse);

      update.addCourseToProf(professorData,newCourse,pid)
      .then(()=>{res.redirect(`/dashboard/professor/:${pid}`)});

    })
    .catch((err)=>console.log(err));
  }

});

//editing course
router.get('/professor/edit/:pid&:cid',(req,res)=>{
    let pid=req.params.pid.replace(':','');
    let cid=req.params.cid;
    db.searchById(cid,coursesData)
    .then((course)=>{
      let details=course.details;
      res.render('edit_course',{pid,details});
    })
    .catch((err)=>console.log(err));
});

router.post('/professor/edit/:pid&:cid',(req,res)=>{

  let pid=req.params.pid.replace(':','');
  let cid=req.params.cid;
  const {duration,fees,certification}=req.body;

    updateJsonFile(coursesData, data => {
      var course=_.find(data,{id:cid});
      if(typeof course !=='undefined'){
        course.details.duration = duration;
        course.details.fees = fees;
        course.details.certification = certification;
      }
      return data;
    })
    .then(()=>res.redirect(`/dashboard/professor/:${pid}`));

});


//student dashboard

//display dashboard
router.get('/student/:sid',function(req,res){
  var studentDetails={};
  let sid=(req.params.sid).replace(':','');

  db.searchById(sid,studentData)
  .then((student)=>{
    studentDetails.name=student.name;

    if(typeof student.courses !=='undefined'){
      let courseList=student.courses;

      if(courseList.length>0){

        db.getCoursesRegisteredByStudent(courseList,coursesData)
        .then((data)=>{
          studentDetails.course=data;
          let name=studentDetails.name;
          let courses=studentDetails.course;
          res.render('stud_dashboard',{sid,name,courses});
        })
        .catch((err_data)=>{
          let courses=0;
          let name=studentDetails.name; 
          console.log(err_data);
          res.render('stud_dashboard',{sid,name,courses});
        });

      }else{
        let courses=0;
        let name=studentDetails.name; 
        res.render('stud_dashboard',{sid,name,courses});
      }

    }
  })
  .catch((err)=>console.log(err));

});

router.post('/student/:sid',function(req,res){

  const sid=(req.params.sid).replace(':','');
  const courseId=req.body.unsub;

  updateJsonFile(studentData, data => {
    var student=_.find(data,{id:sid});
    const courseIndex = (student.courses).indexOf(courseId);
    student.courses.splice(courseIndex, 1)//delete
    return data;
  })
  .then(()=>res.redirect(`/dashboard/student/:${sid}`))

  .catch((err)=>console.log('Some error has occurred'));

});

module.exports = router;
