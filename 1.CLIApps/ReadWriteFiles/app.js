const http=require('http');
const fs=require('fs');
const { resolve } = require('path');
const readline=require('readline');


async function main() {
    //1
    fs.writeFileSync('file.txt','This file is written using fs module in Node.js . \n');
    console.log('File written successfully.');
    const data=fs.readFileSync('file.txt','utf-8');
    console.log('File content:', data);

    //2
    const name=await new Promise((resolve)=>{
        const rl=readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Enter your name: ", (answer) => {
            rl.close();
            resolve(answer);
        });
    })

    //append name to file
    fs.appendFileSync('file.txt', name+' has written this file.\n');
    console.log('Name appended to file successfully.');
    const updatedData=fs.readFileSync('file.txt','utf-8');
    console.log('Updated file content:', updatedData);

    //3
    const server=http.createServer((req,res)=>{
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(updatedData);
    });
    server.listen(8080, ()=>{
        console.log('Server is listening on port 8080');
    });
}

main();