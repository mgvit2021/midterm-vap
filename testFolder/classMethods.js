const fs=require('fs');
const updateJsonFile=require('update-json-file');
const shortId = require('shortid');
const _=require('lodash');
class Student{
    constructor(name,email,password){
        this.id=shortId.generate();
        this.name=name;
        this.email=email;
        this.password=password;
        this.courses=[]; //Initially zero courses registered by student.
    }
    async registerStudent(Student){
        await updateJson("./testFile.json",data=>{
            data.push(Student);
            return data;
        });
        console.log("Data added successfully!");
    }
    subscribeCourse(sid,course_id){
        updateJsonFile("./testFile.json", data => {
            data.forEach((student)=>{
              if(student.id==sid){
                student.courses.push(course_id);
              }
            })
            return data;
          })
    }
    getCourseList(sid){
        return new Promise((resolve,reject)=>{
            fs.readFile('./testFile.json',(err,data)=>{
                var parsed=JSON.parse(data);
                var list=_.find(parsed,{id:sid});
                if(typeof list!='undefined'){
                    resolve(list.courses);
                }
                else{
                    reject("Not found");
                }
            })
        })
    }
}