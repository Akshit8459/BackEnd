const todo=require('../Schemas/TodoSchema.js');

exports.getAllTodo=async (req,res)=>{
    try{
        const todos=await todo.find({});
        const item=todos.map(t=>{
            return `<li><strong>${t.name}</strong> - ${t.completed ? '✅ Completed' : '❌ Not Completed'}</li>`;
        }).join('');
        const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Todo List</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            background: #f9f9f9;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                        }
                        li {
                            background: #fff;
                            padding: 10px;
                            margin-bottom: 5px;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        }
                    </style>
                </head>
                <body>
                    <h1>My Todo List</h1>
                    <ul>
                        ${item}
                    </ul>
                </body>
                </html>
            `;
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    catch(e){
        res.status(400).json({ message: e.message });
        console.log(`error while getting all todos: ${e}`);
    }
};

exports.updateTodo=async (req,res)=>{
    try{
        const existing = await todo.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        const updatedData = {
            name: req.body.name ?? existing.name,
            completed: req.body.completed ?? existing.completed
        };
        const updated = await todo.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json({ message: 'Todo updated successfully', data: updated });
        console.log(`✅ todo updated:`, updated);
    }
    catch(e){
        res.status(400).json({ message: e.message });
        console.log(`error while updating todo: ${e}`);
    }
};

exports.deleteTodo=async (req,res)=>{
    try{
        const item=await todo.findByIdAndDelete(req.params.id);
        if(!item)return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted successfully" });
        console.log(`todo deleted successfully: ${item}`);
    }
    catch(e){
        res.status(400).json({ message: e.message });
        console.log(`error while deleting todo: ${e}`);
    }
}

exports.createTodo= async (req,res)=>{
    try{
        const name=req.body.name|| 'New Task';
        const completed=req.body.completed || false;
        const item=await todo.create({name,completed});
        console.log(`todo created successfully: ${item}`);
    }
    catch(e){
        res.status(400).json({ message: e.message });
        console.log(`error while creating todo: ${e}`);
    }
}