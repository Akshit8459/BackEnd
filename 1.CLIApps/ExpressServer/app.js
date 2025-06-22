const express=require('express');
const app=express();
app.use(express.json());
const port=8080;

let users=[
    {name:"Akshit",id:"1",age:21},
    {name:"Akhil",id:"2",age:22},
    {name:"Pokhriyal",id:"3",age:23},
]

app.get('/',(req,res)=>{
    res.send(`<html>
        <head>
        <title>Express Server</title>
        </head>
        <body>
        <h1>Welcome to the Express Server!</h1>
        <p>This is a simple Express server running on port ${port}.</p>
        </body>
        
        </html>`);
    });
    
app.get('/about',(req,res)=>{
    const userList=users.map(user=>{
        return `<li>${user.name} has id: ${user.id}</li>`
    }).join('');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Expires', '0');
    res.send(`<html>
        <head>
            <title>About Us</title>
            <meta http-equiv="refresh" content="5">
            </head>
            <body>
             <section>
            <h2>USERS:</h2>
            <ol>
            ${userList}
            </ol>
            </section>
            </body>
            </html>`);
});

app.get("/about/:id",(req,res)=>{
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Expires', '0');
    const user=users.find(u=> u.id==req.params.id);
    user?
    res.end(`
        <html>
        <head>
            <title>About Us</title>
            <meta http-equiv="refresh" content="5">
            </head>
            <body>
             <section>
            <h2>USERS:</h2>
            <ol>
                <li>User Name:${user.name}</li>
                <li>User ID:${user.id}</li>
                <li>User Age:${user.age}</li>
            </ol>
            </section>
            </body>
            </html>`
        )
    :res.status(404).end("USER NOT FOUND");
})

app.post("/about",(req,res)=>{
    const id=(users.length+1).toString();
    const user={id,...req.body};
    users.push(user);
    res.status(201).end(`Success: User ${user.name} created with ID ${user.id}`);
})

app.put("/about/:id",(req,res)=>{
    const user=users.find(u=>u.id==req.params.id);
    if(!user) return res.status(404).end("User Not Found");
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.age !== undefined) user.age = req.body.age;
    res.status(201).send(`Updated user:${JSON.stringify(user)}`);
})

app.delete("/:id",(req,res)=>{
    const user=users.findIndex(u=>u.id==req.params.id);
    if(!user) return res.status(404).end("User Not Found");
    const deletedUser=users.splice(user,1);
    res.status(200).send(`Deleted user: ${JSON.stringify(deletedUser[0])}`);
})
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});