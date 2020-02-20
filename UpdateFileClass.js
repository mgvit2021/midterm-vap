const updateJsonFile = require("update-json-file");

class UpdateData {

    addCourse(course_db){
        return new Promise((resolve,reject)=>{
            updateJsonFile(course_db, data => {
                data.push(newCourse);
                return data;
            })
            setTimeout(()=>{
                resolve();
            },5000);
        })
        
    }

}

module.exports=UpdateData;