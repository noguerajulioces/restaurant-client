import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebase';

const Menu = () => {
    const [platillos, savePlatillos] = useState([])
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const obtenerPlatillos = () => {
            const resultado = firebase.db.collection('productos').onSnapshot(handleSnapshot)
        }
        obtenerPlatillos();
    }, []);

    //Snapshot realtime
    function handleSnapshot(snapshot){
        const platillos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });

        savePlatillos(platillos);
        console.log(platillos)
    }

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Menu</h1>

            <Link to="/nuevo-platillo" className="ml-3 bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase hover:text-gray-900 hover:bg-yellow-100">
                Agregar Platillo
            </Link>
        </>
    );
}

export default Menu;