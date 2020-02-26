/*
    SINGLE CLASS TO HANDLE ALL THE FILE SEARCH AND OTHER OPERATIONS 
*/
const fs=require('fs');
const updateJsonFile = require("update-json-file");
const _=require('lodash');

class FileDataOperations {

    getCoursesRegisteredByStudent(id_list,file){ 
        return new Promise((resolve,reject)=>{
            fs.readFile(file,(err,data)=>{
                var details=[];
                var json=JSON.parse(data);

                id_list.forEach((cid)=>{
                    var course=_.find(json,{id:cid});
                    if(typeof course!=='undefined'){
                        let title=course.title;
                        let offered_by=course.offered_by;
                        let sum=course.summary;
                        details.push({cid,title,offered_by,sum});
                    }else{
                        let err="Not found in the list";
                        reject(err);
                    }
                });
                resolve(details);
            });
        });
    }

    authenticateUser (email,password,file){

        return new Promise((resolve,reject)=>{
            fs.readFile(file,(err,data)=>{
                var json=JSON.parse(data);
                var user=_.find(json,{email:email,password:password});
                if(typeof user!=='undefined'){
                    var id=user.id;
                    resolve({id});
                }else{
                  let err_data="Invalid Credentials";
                  reject(err_data);
                }
            });
        });
    }

    searchById(id,file){

        return new Promise((resolve,reject)=>{
            fs.readFile(file,(err,data)=>{
                var json=JSON.parse(data);
                var object=_.find(json,{id:id});
                if(typeof object!=='undefined'){
                    resolve(object);
                }else{
                    let err_msg="Not Found in database!"
                    reject(err_msg);
                }
              });
        });
    }

    getAllCoursesList(file){

        return new Promise((resolve,reject)=>{
            fs.readFile(file,(err,data)=>{
                var json=JSON.parse(data);
                if(json.length>0){
                    resolve(json);
                }else{
                    var err="No courses present currently!";
                    reject(err);
                }
            });
        });
    }

}

//CLASS TO SYNCHRONISE TIME TO WRITE THE FILE IN COURSE DATABASE
class UpdateOperations{

    async addCourse(filename,newCourse){
        await updateJsonFile(filename, data =>{
            data.push(newCourse);
            return data;
          });
    }
    
    async addCourseToProf(filename,newCourse,pid){

        await updateJsonFile(filename, data => {
            let id=newCourse.id;
            var professor=_.find(data,{id:pid});
            if(typeof professor!=='undefined'){
                professor.courses.push({
                    id:id,
                    title:newCourse.title,
                    summary:newCourse.summary
                });
            }
            return data;
        });
    }

    async removeCourseFromProfessor(file,courseId,profId){
        await updateJsonFile(file, data =>{
            var professor=_.find(data,{id:profId});
            const courseIndex = professor.courses.indexOf(_.find(professor.courses,{id:courseId}));
            professor.courses.splice(courseIndex, 1);
            return data;
          })
    }

    async removeCourse(file,courseId){
        await updateJsonFile(file, data => {
            var deleteCourse=_.find(data,{id:courseId})
            const courseIndex = data.indexOf(deleteCourse);
            data.splice(courseIndex, 1)
            return data;
          })
    }
}

module.exports={FileDataOperations,UpdateOperations};