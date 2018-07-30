const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(question) {
    return new Promise(function (res, rej) {
        rl.question(question, (answer) => {
            res(answer);
        });
    });
}

function printBaton(nb) {
    for (let i = 0; i < nb; i++) {
        process.stdout.write("| ");
    }
    console.log("");
}
const {
    NUMBER_MAX_LOOPS_BEFORE_QUIT,
    NUMBER_OF_DASH,
    MAX_DASH_REMOVE,
    PHASE,
    greetings,
    CANCEL_COLORS,
    COLORS
} = require('./constant');

async function run() {
    const numberP = await preGamePhase();
    const {winner, looser} = await gamePhase(numberP, NUMBER_OF_DASH);
    console.log(`Félicitations à ${COLORS.get('Green')+winner+CANCEL_COLORS} pour avoir battu ${COLORS.get('Red')+looser+CANCEL_COLORS}!! =D`)
    console.log("See ya !");
    rl.close();
}

run();

async function preGamePhase() { // should return number of player
    greetings.forEach(line => console.log('\x1b[36m%s\x1b[0m', line));
    return new Promise(async (res, rej) => {
        let numberPlayer;
        do {
            let input = await question('Vous voulez jouer à 1 ou à 2?\n');
            numberPlayer = Number(input);
            if (!numberPlayer){
                console.log("OMG si tu veux jouer écris 1 ou 2!!!");
                continue;
            }
        } while (numberPlayer !== 1 && numberPlayer !== 2);
        res(numberPlayer);
    })
}

async function gamePhase(nbPlayer, nbDash){
    let isFirstTurn = true;
    let secondPlayer;
    const firstPlayer = await question(`Joueur n°1, quel est ton nom?\n`);
    if (nbPlayer === 1){
        // const secondPlayer = await chooseAIPlayers();
    } else {
        secondPlayer = await question(`Et toi joueur n°2?\n`);
    }
    rl.pause();
    return new Promise(async (res, rej) => {
        let currentNbDash = nbDash;
        let numberDashRemoved;
        do {
            console.log("");
            console.log(`C'est à ton tour ${isFirstTurn? firstPlayer: secondPlayer}`)
            printBaton(currentNbDash);
            do {
                rl.resume();
                let input = await question(`Combien de baton voulez vous returer? (Max: ${MAX_DASH_REMOVE})\n`);
                rl.pause();
                numberDashRemoved = Number(input);
            } while (numberDashRemoved < 1 || numberDashRemoved > MAX_DASH_REMOVE);
            currentNbDash -= numberDashRemoved
            isFirstTurn = !isFirstTurn
        } while (currentNbDash > 0);
        res({
            winner: isFirstTurn? firstPlayer: secondPlayer,
            looser: isFirstTurn? secondPlayer: firstPlayer
        });
    })
}
