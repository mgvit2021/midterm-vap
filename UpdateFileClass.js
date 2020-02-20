/*
    CLASS TO SYNCHRONISE TIME TO WRITE THE FILE IN COURSE DATABASE
*/
const updateJsonFile = require("update-json-file");
//
class UpdateOperations{

    async addCourse(filename,newCourse){
        await updateJsonFile(filename, data => {
            data.push(newCourse);
            return data;
          })
    }
    
    async addCoursetoProf(filename,newCourse,pid){
        await updateJsonFile(filename, data => {
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
    }
}
module.exports=UpdateOperations;
