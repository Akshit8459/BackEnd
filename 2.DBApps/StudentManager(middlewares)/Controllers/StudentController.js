const { json } = require("express");
const student=require("../Schemas/StudentSchema");

exports.getAllStudents= async (req,res)=>{
    try{
        const studentList=await student.find({});
        if(!studentList) return res.send("No STUDENT Found :(");
        const item=studentList.map(s=>{
            return `<div>
                <li><strong>Student's Name:</strong>${s.name}</li>
                <li><strong>Age:</strong>${s.age ?? 'Not Specified'}</li>
                <li><strong>Email:</strong>${s.email}</li>
                <li><strong>Contact info:</strong>${s.phoneNumber ?? 'Not Specified'}</li>
            </div><br>`
        }).join(`${'\n \n'}`)
        res.render("students",{students:studentList});
    }
    catch(err){
        console.log(`Error while getting students detail :${err.message}`);
        res.status(404).send(`error while getting students detail: ${err.message}`);
    }
}

exports.getStudents= async (req,res)=>{
    try{
        const name = decodeURIComponent(req.params.name);
        const child = await student.findOne({ name: new RegExp(`^${name}$`, 'i') });
        if(!child) return res.send("Student Not Found");
        res.render("student",{student:child})
    }
    catch(err){
        console.log(`Error while getting student :${err.message}`);
        res.status(404).send(`error while getting student: ${err.message}`);
    }
}

exports.search=async (req,res)=>{
    try{
        res.render("search")
    }
    catch(err){
        console.log(`Error while getting student :${err.message}`);
        res.status(404).send(`error while getting student: ${err.message}`);
    }
}

exports.createStudent= async (req,res)=>{
    try{
        const data=req.body;
        const child=await student.create(data);
        res.status(201).json({ message: "Student Created Successfully", student: child });

    }
    catch(err){
        console.log(`Error while Creating student :${err.message}`);
        res.status(404).send(`error while Creating student: ${err.message}`);
    }
}

exports.deleteStudent= async (req,res)=>{
    try{
        const child=await student.findByIdAndDelete(req.params.id);
        if(!child) return res.send("No Such Student found");
        res.send("Student Details Deleted Successfully")
    }
    catch(err){
        console.log(`Error while Deleting Student's Details :${err.message}`);
        res.status(404).send(`error while Deleting Student's Details: ${err.message}`);
    }
}

exports.updateStudent= async (req,res)=>{
    try{
        const data=req.body;
        const child=await student.findByIdAndUpdate(req.params.id,data);
        res.send(`Student Updated Successfully:${child}`);
    }
    catch(err){
        console.log(`Error while Updating Student Details :${err.message}`);
        res.status(404).send(`error while Updating Student Details: ${err.message}`);
    }
}