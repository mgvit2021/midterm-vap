const fs=require('fs');

class FileDataOperations {


    getCoursesRegisteredByStudent(id_list,file)    //FOR GET_COURSE_BY_ID FILE
    
    {
        return new Promise((resolve,reject)=>{
            fs.readFile(file,(err,data)=>{
                var details=[];
                var js=JSON.parse(data);
                var notFound=true;
                id_list.forEach((cid)=>{
                    js.forEach((obj)=>{
                        if(obj.id==cid){
                            let title=obj.title;
                            let offered_by=obj.offered_by;
                            let sum=obj.summary;
                            details.push({cid,title,offered_by,sum})
                            notFound=false;
                        }
                    })
                })
                if(notFound){
                    let err="Not found in the list"
                    reject(err);
                }
                else{
                    resolve(details);
                }
              })
        })
    }
    authenticateUser (email,password,file)
    {
        return new Promise((resolve,reject)=>{
            fs.readFile(file,(err,data)=>{
                var notFound=true;
                var details;
                var js=JSON.parse(data);
                js.forEach((obj)=>{
                  if(obj.email==email && obj.password==password){
                      notFound=false;
                      details=obj.details;
                      var id=obj.id;
                      resolve({id,notFound,details});
                  }
                })
                if(notFound){
                  let err="Invalid Credentials";
                  reject({notFound,err});
                }
              })
        })
    }

    searchById(id,file)
    {
        return new Promise((resolve,reject)=>{
            fs.readFile(file,(err,data)=>{
                var notFound=true;
                var js=JSON.parse(data);
                js.forEach((obj)=>{
                  if(obj.id==id){
                      notFound=false;
                      resolve(obj);
                  }
                })
                if(notFound){
                    let err_msg="Not Found in database!"
                    reject(err_msg);
                }
              })
        })
    }
    getAllCoursesList(file)
    {
        return new Promise((resolve,reject)=>{
            fs.readFile(file,(err,data)=>{
                var js=JSON.parse(data);
                resolve(js);
            })
        })
    }

}

module.exports=FileDataOperations;