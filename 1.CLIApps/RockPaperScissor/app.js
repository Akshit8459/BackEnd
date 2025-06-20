const fs=require('fs');
const readline=require('readline');
const http=require('http');

async function main(){
    await fs.writeFileSync('game_log.txt', '', 'utf8'); 
    const server = http.createServer((req, res) => {
        try {
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache'  // Prevent browser caching
            });
            
            const logData = fs.readFileSync('game_log.txt', 'utf8');
            res.end(`
                <html>
                <head>
                    <title>Rock Paper Scissors Game</title>
                    <meta http-equiv="refresh" content="1">
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <h1>Game History</h1>
                    <pre>${logData || 'No game data yet...'}</pre>
                </body>
                </html>
            `);
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Error loading game log');
        }
    });

    server.listen(8080, () => {
        console.log('Server is running on http://localhost:8080');
    });


    while(true){    
        //1 take user Input 
        const userInput=await new Promise((resolve)=>{
            const rl=readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const inputPrompt="Enter your choice (rock, paper, scissors,exit): ";
            rl.question(inputPrompt, (answer) => {
                rl.close();
                resolve(answer.trim().toLowerCase());
            });
        });
        if(userInput.toLowerCase() === 'exit'){
            console.log('Exiting the game.');
            return;
        }


        // generate computer choice
        const choices=['rock', 'paper', 'scissors'];
        if(!choices.includes(userInput)) { console.log("Invalid Input"); continue;}
        const computerChoice=choices[Math.floor(Math.random() * choices.length)];
        console.log(`Computer chose: ${computerChoice}`);
        // determine winner
        let result;
        if(userInput === computerChoice){
            result='It\'s a tie!';
        } else if(
            (userInput === 'rock' && computerChoice === 'scissors') ||
            (userInput === 'paper' && computerChoice === 'rock') ||
            (userInput === 'scissors' && computerChoice === 'paper')
        ){
            result='You win!';
        } else {
            result='You lose!';
        }
        console.log(result);

        // write result to file
        const logEntry=`User: ${userInput}, Computer: ${computerChoice}, Result: ${result}\n`;
        await fs.appendFileSync('game_log.txt', logEntry, 'utf8');
        console.log('Game result logged to game_log.txt');
    }
}
    
main();