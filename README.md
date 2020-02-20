# Coursify :books: - VAP Midterm

Coursify is a course management NodeJS-application that offers an interface for students to subscribe to multiple courses available online.  
Provides professors with facility to add their own courses online.

## Getting Started

Clone or download zip file of the project into your local machine.

### Dependencies

```
node v12.14.1
express v4.16.1
nodemon v2.0.2
ejs v2.6.1
update-json-file v1.1.1
shortid v2.2.15
morgan v1.9.1
lodash v4.17.15
```  

---

## Features
- Registration and Login
- Course Add/Drop
- Explore course catalog
- Course details
- Publish new courses  

#### Database Files -data/
- Users : *Student details database*
- Professor : *Professor details database*
- courses : *Course details database*  

#### There are 4 main routes:
- **Index:**
  * ***/*** : Home page 
- **Users:**
  * ***/users/login*** : Login Page
  * ***/users/register*** : Register Page 
- **Dashboard:**
  * ***/dashboard/student/*** : Student dashboard consisting of registered courses.
  * ***/dashboard/professor/*** : Professor dashboard consisting of published  courses.
  * ***/dashboard/professor/add/*** : Creating and publishing a course.
  * ***/dashboard/professor/edit/*** : Editing a previously published course 
- **ExploreCourses:**
  * ***/dashboard/explore/*** : Explore all courses available in the catalog.
  * ***/dashboard/explore/detail*** : Gets details of the particular course.
  * ***/dashboard/explore/filter*** : Displays the filtered list of courses w.r.t domain.


>[Mridul Gupta](https://www.linkedin.com/in/mridul-gupta2021/)
