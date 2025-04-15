import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Data from "../service/data.json";

// COMPONENT



// ACTIONS
import * as ACTION from "../redux/article";

import React from "react";

const Preparation = () => {

    let store = useSelector(state => state.article.data) // On utilise useSelector pour récupérer les données du store

    let storeApp = [];
    let storeAppAdded = [];

    const randomNumberInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const [storeAdded, setStoreAdded] = useState([]);
    const [prefilledHP, setPrefilledHP] = useState(randomNumberInRange(20000, 25000));
    const [prefilledAtk, setPrefilledAtk] = useState(randomNumberInRange(1100, 1600));
    const [prefilledDef, setPrefilledDef] = useState(randomNumberInRange(750, 950));
    const [prefilledSpd, setPrefilledSpd] = useState(randomNumberInRange(95, 115));


    // Fonction pour sauvegarder le tableau dans le localStorage
    const save = (array) => {
        localStorage.setItem("characters_list", JSON.stringify(array));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStoreAdded([...storeAdded,{
            id: store.length + storeAdded.length + 1,
            name: e.target.name.value,
            picture: e.target.picture.value,
            stamina: e.target.stamina.value,
            strenght: e.target.strenght.value,
            defense: e.target.defense.value,
            speed: e.target.speed.value,
            techniques: [e.target.technique_1.value, e.target.technique_2.value, e.target.technique_3.value, e.target.technique_4.value]
        }]);
    }

    const dispatch = useDispatch(); 

    const handleAddingToStore = () => {
        let storeStock = [...store];
            storeAdded.map((item) => {
                storeStock.push(item);
                //dispatch(ACTION.ADD_CHAR([store, item]));
            })
            save(storeStock);
            console.log(storeStock);
            setStoreAdded([]);
    }

    useEffect(() => {
        dispatch(ACTION.FETCH_START())
        try{
            dispatch(ACTION.FETCH_SUCCESS(Data))
        }catch(err){
            dispatch(ACTION.FETCH_FAILURE(err.message))
        }
    }, [])

    return(
        <div>
            <h1>Préparation</h1>
            <h2>Ajoutez votre personnage (il ne peut y avoir qu'un perso custom à la fois) : </h2>

            <form onSubmit={handleSubmit}>
                <label for="name">Nom : </label>
                <input type="text" id="name" name="name" required></input><br></br>
                <label for="name">Image : </label>
                <input type="text" id="picture" name="picture" placeholder="lien de l'image" required></input><br></br>
                <label for="stamina">PV : </label>
                <input type="number" id="stamina" name="stamina" defaultValue={prefilledHP} required></input><br></br>
                <label for="strenght">Attaque : </label>
                <input type="number" id="strenght" name="strenght" defaultValue={prefilledAtk} required></input><br></br>
                <label for="defense">Défense : </label>
                <input type="number" id="defense" name="defense" defaultValue={prefilledDef} required></input><br></br>
                <label for="speed">Vitesse : </label>
                <input type="number" id="speed" name="speed" defaultValue={prefilledSpd} required></input><br></br><br></br>

                <i>Les statistiques sont générées aléatoirement, mais vous pouvez les modifier.</i><br></br><br></br>

                <div>Stats recommandées :<br></br>
                    PV : Entre 20 000 et 25 000<br></br>
                    Atq : Entre 1100 et 1600<br></br>
                    Déf : Entre 750 et 950<br></br>
                    Vit : Entre 95 et 115<br></br><br></br>
                </div>

                <label for="techniques">Technique 1 (attaque normale): </label>
                <input type="text" id="techniques" name="technique_1" required></input><br></br>
                <label for="techniques">Technique 2 (attaque spéciale): </label>
                <input type="text" id="techniques" name="technique_2" required></input><br></br>
                <label for="techniques">Technique 3 (attaque ultime): </label>
                <input type="text" id="techniques" name="technique_3" required></input><br></br>
                <label for="techniques">Technique 4 (heal) : </label>
                <input type="text" id="techniques" name="technique_4" required></input><br></br><br></br>
                <input type="submit" value="Ajouter"></input>
            </form>

            <h2>Aperçu du personnage ajouté :</h2>

            {storeAdded && Array.isArray(storeAdded) ? storeAppAdded = storeAdded.map((item) => {
                return(
                    <div>
                        <h2>{item.name}</h2>
                        <img src={item.picture} alt="image de l'ennemi" width="200"></img>
                        <p>PV : {item.stamina} ; Atq : {item.strenght} ; Déf : {item.defense} ; Vit : {item.speed}</p>
                        <p>Techniques maîtrisées : {item.techniques.map((element) => <span>{element}, </span>)}</p>
                    </div>
                )
            }
            ) : <div><p>Aucun personnage ajouté.</p></div>}

            <p>
                <i>
                    <ul>
                        <li>- Si plusieurs personnages sont ajoutés en même temps, seul le premier sera utilisable en combat.</li>
                        <li>- Lorsque vous cliquez sur la sauvegarde de votre personnage, vous pouvez aller sur la page Combat (dans la nav tout en haut) pour le jouer contre de formidables adversaires.</li>
                    </ul>
                </i>
            </p>
            <button onClick={handleAddingToStore}>Sauvegarder le personnage ajouté</button>

            <h2>Ennemis potentiels :</h2>

            {Array.isArray(store) ? storeApp = store.map((item) => {
                return(
                    <div>
                        <h2>{item.name}</h2>
                        <img src={item.picture} alt="image de l'ennemi" width="200"></img>
                        <p>PV : {item.stamina} ; Atq : {item.strenght} ; Déf : {item.defense} ; Vit : {item.speed}</p>
                        <p>Techniques maîtrisées : {item.techniques.map((element) => <span>{element}, </span>)}</p>
                    </div>
                )
            }
            ) : [] }
        </div>
    );
}

export default Preparation;