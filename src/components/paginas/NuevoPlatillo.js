import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FirebaseContext } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import FileUploader from 'react-firebase-file-uploader';

const NuevoPlatillo = () => {
    //state para imagenes
    const [upload, saveUpload] = useState(false);
    const [progress, saveProgress] = useState(0);
    const [urlimage, saveUrlImage] = useState('');

    // context with firebase operation
    const { firebase } = useContext(FirebaseContext);

    //Hook para redireccionar
    const navigate = useNavigate();

    //validación y leer datos
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            imagen: '',
            description: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .min(3, 'Los Platillos deben de tener al menos 3 caractrres')
                        .required('El nombre es obligatorio'),
            precio: Yup.number()
                        .min(1, "Debe agregar un numero")
                        .required('El precio es obligatorio'),
            categoria: Yup.string()
                        .required('La categoría es obligatorio'),
            description: Yup.string()
                            .min(20, "debe tener al menos 20 caracteres")
                            .required("Descripción es obligatoria")
        }),
        onSubmit: datos=> {
            try {
                datos.existencia = true;
                datos.imagen = urlimage;
                firebase.db.collection('productos').add(datos)
                navigate('/menu');
            }catch(error){
                console.log(error);
            }
        }
    });

    //upload image
    const handleUploadStart = () => {
        saveProgress(0);
        saveUpload(true);
    }
    //Error when upload image
    const handleUploadError = error => {
        saveUpload(false);
        console.log(error)
    } 
    //when uploadsuccess
    const handleUploadSuccess = async name => {
        saveProgress(100);
        saveUpload(false);

        //almacenar url de destino
        const url = await firebase
                    .storage
                    .ref("productos")
                    .child(name)
                    .getDownloadURL();

        console.log(url);
        saveUrlImage(url);
    }
    // for know the progress
    const handleProgress = progress => {
        saveProgress(progress);
        console.log(progress);
    }

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Agregar Platillo</h1>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="Nombre de platillo"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null }

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                type="number"
                                placeholder="USD 20"
                                min="0"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null }

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">Categoria</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="categoria"
                                value={formik.values.categoria }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Selecione una opción</option>
                                <option value="desayuno">Desayuno</option>
                                <option value="comida">Almuerzo</option>
                                <option value="cena">Cena</option>
                                <option value="bebida">Bebida</option>
                                <option value="Postre">Postre</option>
                                <option value="Ensalada">Ensalada</option>
                            </select>
                        </div>

                        {formik.touched.categoria && formik.errors.categoria ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>{formik.errors.categoria}</p>
                            </div>
                        ) : null }

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagen">Imagen</label>
                            <FileUploader
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                                
                            />
                        </div>

                        { upload && (
                            <div className="h-12 relative w-full border">
                                <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center" style={{width: `${progress}%`}}>
                                    { progress} %
                                </div>
                            </div>
                        )}

                        {urlimage && (
                            <p className="bg-green-500 text-white p-3 text-center my-5">
                                La imagen se subió correctamente
                            </p>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descripcion</label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                id="description"
                                placeholder="Descripción del platillo"
                                value={formik.values.description }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            ></textarea>
                        </div>

                        {formik.touched.description && formik.errors.description ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Hubo un error:</p>
                                <p>{formik.errors.description}</p>
                            </div>
                        ) : null }

                        <input
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase"
                            value="Agregar platillo"
                        />
                    </form>
                </div>

            </div>
        </>
    );
}

export default NuevoPlatillo;