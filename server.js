const express = require('express');
const app = express();

app.listen(3000 , () => {
    console.log("Server Started....");
});

app.get('/' , (request , response) => {
    response.render('login'); 
});


//Configure body-parser
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}));

//Configure view engine : hbs
var path = require('path');
app.set('views' , path.join(__dirname , 'views')); // Give Location
//console.log(path.join(__dirname , 'views')); //To see path of file view
app.set('view engine', 'hbs'); // Give Extension


const Employee = require('./model/employee');
const Login = require('./model/login');
const URL = "mongodb://localhost:27017/EMSDB";    //For LocalHost
//const URL = "mongodb+srv://shubham:12345@cluster0-hsysq.mongodb.net/test?retryWrites=true&w=majority";
const mongoose = require('mongoose');
mongoose.connect(URL);


app.post('/check',(request,response)=>{
    Login.findOne({userid:request.body.uid, password:request.body.pwd},  (err,result)=>{
        console.log(result);
      if(err) throw err;
      else if(result!=null) 
      {
     //   if(result.userid==request.body.uid && result.password==request.body.pwd)
            response.render('newemp');
      }
      else
        response.render('login',{msg:"Login Fail "});
    });
});


app.get('/checkExistance', (request,response) =>{
    Employee.findOne({eid: request.query.eid},(err, result)=>{
        if(err) throw err;
        else if(result != null)   
            response.send({msg : "Already Exist"});
        else
            response.send({msg : "Available"});
            //response.render('viewemp',{emps : result});
    })
})

app.get('/view', (request,response) =>{
    Employee.find((err, result)=>{
        if(err) throw err;
        else    
            response.render('viewemp',{emps : result});
    })
})


app.get('/Delete',(request,response) => {
    //var id=request.query.id;
    Employee.deleteOne({_id:request.query.id}, (err) => {
        if(err) throw err;
        else{
            Employee.find((err, result)=>{
                if(err) throw err;
                else    
                    response.render('viewemp',{emps : result});
            })
        }
    });
});


app.get('/Update',(request,response) => {
    Employee.findOne({_id:request.query.id}, (err, result) => {
        if(err) throw err;
        else
            response.render('getemp',{emps : result});
    });
});


app.post('/updateAction', (request,response) => {
    Employee.findByIdAndUpdate(request.body.id, 
    {eid:request.body.eid, ename:request.body.ename, salary:request.body.salary},
    (err) => {
        if(err) throw err;
        else{
            Employee.find((err, result)=>{
                if(err) throw err;
                else    
                    response.render('viewemp',{emps : result});
            })
        }
    })
})


app.post('/EmpInsert',(request, response) =>{
    //MongoDB code
    var newEmp = Employee({
        eid:request.body.eid,
        ename:request.body.ename,
        salary:request.body.salary
    });

    //Save function return promises
    newEmp.save().then(data=>{
        console.log("data Inserted");
        response.render('newemp',{msg:'Data Inserted'})
    })
})

// app.get('/add',(request, response) =>{

//     var newLog = new Login ({
//         userid:'admin',
//         password:'12345' });

//     //Save function return promises
//     newLog.save().then(data=>{
//         console.log("data Inserted");
//     })
// })