import React from "react";
import { useEffect, useState } from "react";


const Combat = () => {

    /* On set les variables principales */

    const [startButtonState, setStartButtonState] = useState('');
    const [enemy, setEnemy] = useState([]);
    const [player, setPlayer] = useState([]);
    const [hpPlayer, setHpPlayer] = useState(0);
    const [hpEnemy, setHpEnemy] = useState(0);
    const [charactersDisplay, setCharactersDisplay] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(false);
    const [beforeEnemyTurn, setBeforeEnemyTurn] = useState(false);
    const [narrationText, setNarrationText] = useState('');
    const [damageRate, setDamageRate] = useState(1);
    const [isThereACharacter, setIsThereACharacter] = useState(true);
    let charactersDisplayResult = [];

    /* On définit les fonctions d'exécution principale */

    const handleStart = () => {
        setStartButtonState('hidden');
        let charactersList = getItemLocalStorage(); // On récupère la liste des personnages disponibles
        if(!charactersList[2]){
            setIsThereACharacter(false);
            return;
        }
        let enemyChoice = randomNumberInRange(0,1); // On choisit au hasard l'un des deux ennemis
        let enemyTemp = charactersList[enemyChoice];
        let playerTemp = charactersList[2];
        enemy.push(enemyTemp);
        player.push(playerTemp);
        setHpEnemy(enemyTemp.stamina);
        setHpPlayer(playerTemp.stamina);
        setCharactersDisplay(true);
        handleFirstTurn(playerTemp.speed, enemyTemp.speed);
        
    }

    const handleFirstTurn = (playerSpeed, enemySpeed) => {
        console.log(playerSpeed, enemySpeed);
        if(playerSpeed >= enemySpeed){
            handlePlayerTurn();
        } else {
            handleBeforeEnemyTurn();
        }
    }

    const handlePlayerTurn = () => {
        console.log('Player Turn');
        setPlayerTurn(true);
        setNarrationText('Au tour de ' + player[0].name);
    }
    
    const handleBeforeEnemyTurn = () => {
        console.log('Soon enemy turn');
        setNarrationText('Ça va être au tour de ' + enemy[0].name + ' !');
        setBeforeEnemyTurn(true);
    }

    const handleEnemyTurn = () => {
        setBeforeEnemyTurn(false);
        console.log('Enemy Turn')
        setPlayerTurn(false);
        setNarrationText('Au tour de ' + enemy[0].name);
        handleEnemyChoice();
    }

    // On définit les fonctions d'exécution des actions des personnages
    const handlePlayerChoice1 = () => {
        initiatePlayerChoice(); // On initialise le tour du joueur : on désactive les boutons et on définit le multiplicateur de critique
        //On exécute le move sélectionné -> formule de dégâts : (Attaque - Défense) * multiplicateur de critique
        setNarrationText(player[0].name + ' utilise ' + player[0].techniques[0] + ' !'); // On affiche le texte de narration
        let damage = player[0].strenght - enemy[0].defense; // On calcule les dégâts
        damage = checkNegativeDamage(damage); // On vérifie que les dégâts ne sont pas négatifs
        setHpEnemy(Math.round(hpEnemy - damage * damageRate)); // On retire les PV à l'ennemi
        setTimeout(() => { // On attend 2 secondes avant d'afficher le texte de dégâts
            if(damageRate === 2){
                setNarrationText('Coup critique ! ' + enemy[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
            } else {
                setNarrationText(enemy[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
            }
            setTimeout(() => { // On attend 2 secondes avant de vérifier si l'ennemi est mort
                let enemyDead = isEnemyDead(hpEnemy - damage * damageRate);
                console.log('enemyDead = ', enemyDead);
                if(enemyDead){
                    setNarrationText(enemy[0].name + ' est K.O. ! La victoire est à ' + player[0].name + ' !');
                } else { // Si l'ennemi n'est pas mort, on passe au tour de l'ennemi
                    handleBeforeEnemyTurn();
                }
            }, 2000);

        }, 2000);
    }

    const handlePlayerChoice2 = () => {
        initiatePlayerChoice();
        //On exécute le move sélectionné -> formule de dégâts : (Attaque * 1.5 - Défense) * multiplicateur de critique
        setNarrationText(player[0].name + ' utilise sa technique ' + player[0].techniques[1] + ' !');
        let damage = player[0].strenght * 1.5 - enemy[0].defense;
        damage = checkNegativeDamage(damage);
        setHpEnemy(Math.round(hpEnemy - damage * damageRate));
        setTimeout(() => {
            if(damageRate === 2){
                setNarrationText('Coup critique ! ' + enemy[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
            } else {
                setNarrationText(enemy[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
            }
            setTimeout(() => {
                let enemyDead = isEnemyDead(hpEnemy - damage * damageRate);
                console.log('enemyDead = ', enemyDead);
                if(enemyDead){
                    setNarrationText(enemy[0].name + ' est K.O. ! La victoire est à ' + player[0].name + ' !');
                } else {
                    handleBeforeEnemyTurn();
                }
            }, 2000);

        }, 2000);

    }
    const handlePlayerChoice3 = () => {
        initiatePlayerChoice();
        //On exécute le move sélectionné -> formule de dégâts : (Attaque * 3) * multiplicateur de critique. Ignore la défense
        setNarrationText(player[0].name + ' utilise son ultime ' + player[0].techniques[2] + ' ! Ce coup ignore la défense de l\'ennemi !');
        let damage = player[0].strenght * 3;
        setHpEnemy(Math.round(hpEnemy - damage * damageRate));
        console.log('hpEnemy = ', hpEnemy);
        setTimeout(() => {
            if(damageRate === 2){
                setNarrationText('Coup critique ! ' + enemy[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
            } else {
                setNarrationText(enemy[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
            }
            setTimeout(() => {
                let enemyDead = isEnemyDead(hpEnemy - damage * damageRate);
                console.log('enemyDead = ', enemyDead);
                if(enemyDead){
                    setNarrationText(enemy[0].name + ' est K.O. ! La victoire est à ' + player[0].name + ' !');
                } else {
                    handleBeforeEnemyTurn();
                }
            }, 2000);

        }, 2000);

    }
    const handlePlayerChoice4 = () => {
        // On exécute le move sélectionné -> formule de soin : valeur aléatoire entre 10% et 25% des PV max
        initiatePlayerChoice();
        setNarrationText(player[0].name + ' utilise ' + player[0].techniques[3] + ' pour récupérer des PV !');
        let heal = randomNumberInRange(player[0].stamina/10, player[0].stamina/4);
        let healChecked = checkOverheal('player', Math.round(hpPlayer + heal));
        setHpPlayer(healChecked);
        setTimeout(() => {
            setNarrationText(player[0].name + ' régénère ' + Math.round(heal) + ' PV !');
            setTimeout(() => {
                handleBeforeEnemyTurn();
            }, 2000);
        }, 2000);

    }

    const handleEnemyChoice = (cooldown = false) => {
        var enemyChoice = randomNumberInRange(0, 3);
        var damageRate = null;
        var damage = null;
        var heal = null;
        if(enemy[0].id === 1){ // Si l'ennemi est Izuku Midoriya
            //enemyChoice = randomNumberInRange(0, 1);
            switch(enemyChoice){
                case 0: // L'ennemi se heal d'une valeur aléatoire entre 5% et 10% de ses PV max
                    setNarrationText(enemy[0].name + ' utilise ' + enemy[0].techniques[0] + ' pour récupérer des PV !');
                    heal = randomNumberInRange(enemy[0].stamina/20, enemy[0].stamina/10);
                    console.log('heal = ', heal)
                    console.log('hpEnemy = ', hpEnemy)
                    let healChecked = checkOverheal('enemy', Math.round(hpEnemy + heal));
                    console.log('healChecked = ', healChecked)
                    setHpEnemy(healChecked);
                    setTimeout(() => {
                        setNarrationText(enemy[0].name + ' régénère ' + Math.round(heal) + ' PV !');
                        setTimeout(() => {
                            handlePlayerTurn();
                        }, 2000);
                    }, 2000);
                    break;
                case 1: // L'ennemi attaque le joueur avec une attaque normale (dégâts = Attaque - Défense)
                    setNarrationText(enemy[0].name + ' utilise son attaque ' + enemy[0].techniques[1] + ' !');
                    damageRate = isCritical();
                    var damage2 = enemy[0].strenght - player[0].defense;
                    var damage3 = checkNegativeDamage(damage2);
                    setHpPlayer(Math.round(hpPlayer - damage3 * damageRate));
                    setTimeout(() => {
                        if(damageRate === 2){
                            setNarrationText('Coup critique ! ' + player[0].name + ' subit ' + Math.round(damage3 * damageRate) + ' dégâts !');
                        } else {
                            setNarrationText(player[0].name + ' subit ' + Math.round(damage3 * damageRate) + ' dégâts !');
                        }
                        setTimeout(() => {
                            let playerDead = isPlayerDead(hpPlayer - damage3 * damageRate);
                            if(playerDead){
                                setNarrationText(player[0].name + ' est K.O. ! La victoire est à ' + enemy[0].name + ' !');
                            } else {
                                handlePlayerTurn();
                            }
                        }, 2000);
                    }, 2000);
                    break;
                case 2: // L'ennemi attaque le joueur avec une attaque spéciale (dégâts = Attaque * 1.75 - Défense)
                    setNarrationText(enemy[0].name + ' utilise sa technique ' + enemy[0].techniques[2] + ' !');
                    damageRate = isCritical();
                    var damage2 = enemy[0].strenght * 1.75 - player[0].defense;
                    var damage3 = checkNegativeDamage(damage2);
                    setHpPlayer(Math.round(hpPlayer - damage3 * damageRate));
                    setTimeout(() => {
                        if(damageRate === 2){
                            setNarrationText('Coup critique ! ' + player[0].name + ' subit ' + Math.round(damage3 * damageRate) + ' dégâts !');
                        } else {
                            setNarrationText(player[0].name + ' subit ' + Math.round(damage3 * damageRate) + ' dégâts !');
                        }
                        setTimeout(() => {
                            let playerDead = isPlayerDead(hpPlayer - damage3 * damageRate);
                            if(playerDead){
                                setNarrationText(player[0].name + ' est K.O. ! La victoire est à ' + enemy[0].name + ' !');
                            } else {
                                handlePlayerTurn();
                            }
                        }, 2000);
                    }, 2000);
                    break;
                case 3: // L'ennemi attaque le joueur avec une attaque ultime (dégâts = Attaque * 3 - Défense). Ne peut pas réaliser de critique
                    setNarrationText(enemy[0].name + ' utilise son ultime ' + enemy[0].techniques[3] + ' !');
                    let damage = enemy[0].strenght * 3 - player[0].defense;
                    damage = checkNegativeDamage(damage);
                    setHpPlayer(Math.round(hpPlayer - damage));
                    setTimeout(() => {
                        setNarrationText(player[0].name + ' subit ' + Math.round(damage) + ' dégâts !');
                        setTimeout(() => {
                            let playerDead = isPlayerDead(hpPlayer - damage);
                            if(playerDead){
                                setNarrationText(player[0].name + ' est K.O. ! La victoire est à ' + enemy[0].name + ' !');
                            } else {
                                handlePlayerTurn();
                            }
                        }, 2000);
                    }, 2000);
                    break;
            }
        } else { // Si l'ennemi est Katsuki Bakugo
            if(cooldown === true) enemyChoice = randomNumberInRange(1, 3);
            switch(enemyChoice){
                case 0: // L'ennemi attaque le joueur avec une attaque spéciale qui empêche le joueur d'agir au prochain tour (dégâts = (Attaque * 0.8 - Défense) * multiplicateur de critique)
                    setNarrationText(enemy[0].name + ' utilise sa technique ' + enemy[0].techniques[0] + ' ! Le joueur ne peut pas agir au prochain tour !');
                    damageRate = isCritical();
                    damage = enemy[0].strenght * 0.8 - player[0].defense;
                    damage = checkNegativeDamage(damage);
                    setHpPlayer(Math.round(hpPlayer - damage * damageRate));
                    setTimeout(() => {
                        if(damageRate === 2){
                            setNarrationText('Coup critique ! ' + player[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
                        } else {
                            setNarrationText(player[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
                        }
                        setTimeout(() => {
                            let playerDead = isPlayerDead(hpPlayer - damage * damageRate);
                            if(playerDead){
                                setNarrationText(player[0].name + ' est K.O. ! La victoire est à ' + enemy[0].name + ' !');
                            } else {
                                setNarrationText(enemy[0].name + ' attaque à nouveau !');
                                handleEnemyChoice(cooldown = true);
                            }
                        }, 2000);
                    }, 2000);
                    break;
                case 1: // L'ennemi attaque le joueur avec une attaque normale (dégâts = (Attaque * 3 - Défense) * multiplicateur de critique)
                    setNarrationText(enemy[0].name + ' utilise ' + enemy[0].techniques[1] + ' !');
                    damageRate = isCritical();
                    damage = enemy[0].strenght * 3 - player[0].defense;
                    damage = checkNegativeDamage(damage);
                    setHpPlayer(Math.round(hpPlayer - damage * damageRate));
                    setTimeout(() => {
                        if(damageRate === 2){
                            setNarrationText('Coup critique ! ' + player[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
                        } else {
                            setNarrationText(player[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
                        }
                        setTimeout(() => {
                            let playerDead = isPlayerDead(hpPlayer - damage * damageRate);
                            if(playerDead){
                                setNarrationText(player[0].name + ' est K.O. ! La victoire est à ' + enemy[0].name + ' !');
                            } else {
                                handlePlayerTurn();
                            }
                        }, 2000);
                    }, 2000);
                    break;
                case 2: // L'ennemi attaque le joueur avec une attaque spéciale qui ignore la défense (dégâts = Attaque * 1.5 * multiplicateur de critique)
                    setNarrationText(enemy[0].name + ' utilise ' + enemy[0].techniques[2] + ' ! Ce coup ignore la défense du joueur !');
                    damageRate = isCritical();
                    damage = enemy[0].strenght * 1.5;
                    setHpPlayer(Math.round(hpPlayer - damage * damageRate));
                    setTimeout(() => {
                        if(damageRate === 2){
                            setNarrationText('Coup critique ! ' + player[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
                        } else {
                            setNarrationText(player[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts !');
                        }
                        setTimeout(() => {
                            let playerDead = isPlayerDead(hpPlayer - damage * damageRate);
                            if(playerDead){
                                setNarrationText(player[0].name + ' est K.O. ! La victoire est à ' + enemy[0].name + ' !');
                            } else {
                                handlePlayerTurn();
                            }
                        }, 2000);
                    }, 2000);
                    break;
                case 3: // L'ennemi frappe le joueur et se soigne de 50% des dégâts infligés
                    setNarrationText(enemy[0].name + ' utilise ' + enemy[0].techniques[3] + ' ! L\'attaque soigne l\'ennemi de 50% des dégâts infligés !');
                    damageRate = isCritical();
                    damage = enemy[0].strenght * 2 - player[0].defense;
                    damage = checkNegativeDamage(damage);
                    setHpPlayer(Math.round(hpPlayer - damage * damageRate));
                    heal = Math.round(damage * damageRate * 0.5);
                    let healChecked = checkOverheal('enemy', Math.round(hpEnemy + heal));
                    setHpEnemy(healChecked);
                    setHpEnemy(Math.round(hpEnemy + damage * damageRate * 0.5));
                    setTimeout(() => {
                        if(damageRate === 2){
                            setNarrationText('Coup critique ! ' + player[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts ! L\'ennemi récupère ' + Math.round(damage * damageRate * 0.5) + ' PV !');
                        } else {
                            setNarrationText(player[0].name + ' subit ' + Math.round(damage * damageRate) + ' dégâts ! L\'ennemi récupère ' + Math.round(damage * damageRate * 0.5) + ' PV !');
                        }
                        setTimeout(() => {
                            let playerDead = isPlayerDead(hpPlayer - damage * damageRate);
                            if(playerDead){
                                setNarrationText(player[0].name + ' est K.O. ! La victoire est à ' + enemy[0].name + ' !');
                            } else {
                                handlePlayerTurn();
                            }
                        }, 2000);
                    }, 2000);
                    break;
            }
            cooldown = false;
        }
    }

    /* On définit des fonctions secondaires */
    const getItemLocalStorage = () => {
        const data = localStorage.getItem("characters_list");
        const dataParsed = JSON.parse(data);
        return Array.isArray(dataParsed) ? dataParsed : [];
    };

    const initiatePlayerChoice = () => {
        setPlayerTurn(false);
        setDamageRate(isCritical());
    }

    const isCritical = () => {
        // 10% de chances de réaliser un critique (= dégâts x2)
        let rndm = Math.random();
        return rndm <= 0.10 ? 2 : 1; 
    }

    const isEnemyDead = (value) => {
        if (value <= 0){
            setHpEnemy(0);
            return true;
        } else {
            return false;
        }
    }
    
    const isPlayerDead = (value) => {
        if (value <= 0){
            setHpPlayer(0);
            return true;
        } else {
            return false;
        }
    }

    const checkOverheal = (character, healValue) => {
        console.log('healValue = ', healValue)
        console.log('character = ', character)
        if(character === 'player'){
            if(healValue > player[0].stamina){ // On vérifie que les PV du joueur ne dépassent pas le maximum
                return player[0].stamina;
            }
            return healValue;
        } else {
            if(healValue > enemy[0].stamina){ // On vérifie que les PV de l'ennemi ne dépassent pas le maximum
                return enemy[0].stamina;
            }
            return healValue;
        }
    }

    const checkNegativeDamage = (damage) => {
        if(damage < 0){
            return 0;
        }
        return damage;
    }

    const randomNumberInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    return(
        <div>
            <h1>Fight !</h1>

            <button className={"startButton " + startButtonState} onClick={handleStart}>Commencer</button>

            <div className="narration">{narrationText}</div>

            {charactersDisplay ? (
                <div className="characters">
                    <div className="playerDisplay">
                        <h2>{player[0].name}</h2>
                        <img src={player[0].picture} alt="image du joueur" width="200"></img>
                        <p>PV : {hpPlayer} / {player[0].stamina}</p> 
                        <p>Atq : {player[0].strenght} ; Déf : {player[0].defense} ; Vit : {player[0].speed}</p>
                    </div>

                    <div className="vsText">VS</div>

                    <div className="enemyDisplay">
                        <h2>{enemy[0].name}</h2>
                        <img src={enemy[0].picture} alt="image du joueur" width="200"></img>
                        <p>PV : {hpEnemy} / {enemy[0].stamina}</p> 
                        <p>Atq : {enemy[0].strenght} ; Déf : {enemy[0].defense} ; Vit : {enemy[0].speed}</p>
                    </div>
                </div>
            ) : [] }

            {playerTurn ? (
                <div className="playerActions">
                    <button onClick={handlePlayerChoice1}>{player[0].techniques[0]}</button>
                    <button onClick={handlePlayerChoice2}>{player[0].techniques[1]}</button>
                    <button onClick={handlePlayerChoice3}>{player[0].techniques[2]}</button>
                    <button onClick={handlePlayerChoice4}>{player[0].techniques[3]}</button>
                </div>
            ) : []
            }
            {beforeEnemyTurn ? (
                <div className="beforeEnemyInput">
                    <button onClick={handleEnemyTurn}>Ok !</button>
                </div>
            ) : []
            }

            {!isThereACharacter ? (
                <div>
                    <p>Vous n'avez pas ajouté de personnage. Allez sur la page
                        <a href="/preparation"> Préparation</a> pour en créer un. Ensuite vous pourrez l'utiliser en combat.</p>
                </div>
            ) : []
            }
        </div>
    );
}

export default Combat;