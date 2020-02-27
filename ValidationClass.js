const Joi=require('@hapi/joi');

class Validate{

    registerValidation(data){
        const schema= Joi.object({
            name:Joi.string().required(),
            email:Joi.string().email().required(),
            password:Joi.string().min(6).max(100).required(),
            password2:Joi.ref('password')
        });

        return schema.validate(data);
    }

    loginValidation(data){
        const schema= Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().min(6).max(100).required()
        });

        return schema.validate(data);
    }

    createCourseValidation(data){
        const schema= Joi.object({
            title:Joi.string().required(),
            domain:Joi.string().max(100).required(),
            duration:Joi.string().required(),
            fees:Joi.number().integer().required(),
            certification:Joi.string().required(),
            summary:Joi.string().max(200).required()
        });

        return schema.validate(data);
    }
}

module.exports=Validate;
// const check=new Validate();
// console.log(check.registerValidation({name:,email:'mridul108gmail.com',password:'12346'}).error.details[0]);