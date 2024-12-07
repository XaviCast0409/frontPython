import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import styles from "./registerForm.module.css";

const RegisterForm = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    tramiteNumber: "",
    image: null,
  });

  const [model, setModel] = useState(null);

  useEffect(() => {
    // Cargar el modelo BlazeFace de TensorFlow.js
    const loadModel = async () => {
      await tf.ready(); // Asegúrate de que TensorFlow.js esté listo
      const model = await blazeface.load(); // Cargar el modelo
      setModel(model);
      console.log("BlazeFace modelo cargado");
    };
    loadModel();
  }, []);

  // Manejo de cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Manejo del cambio en la imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, image: file }));
    }
  };

  // Procesamiento de la imagen
  const processImage = async () => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Solo procesamos la imagen cuando esté completamente cargada
    image.onload = async () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
      context.drawImage(image, 0, 0, image.width, image.height);

      if (model) {
        const predictions = await model.estimateFaces(image);

        if (predictions.length === 0) {
          console.log('No se detectaron rostros en la imagen.');
        } else {
          predictions.forEach((prediction) => {
            console.log('Rostro detectado:', prediction);
            // Dibujar el rectángulo sobre el rostro
            context.strokeStyle = 'blue';
            context.lineWidth = 2;
            context.strokeRect(
              prediction.topLeft[0],
              prediction.topLeft[1],
              prediction.bottomRight[0] - prediction.topLeft[0],
              prediction.bottomRight[1] - prediction.topLeft[1]
            );
          });
        }
      }
    };
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear un FormData para incluir todos los datos
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("dni", formData.dni);
    data.append("tramiteNumber", formData.tramiteNumber);
    if (formData.image) {
      data.append("image", formData.image);
    }

    // Enviar al servidor
    fetch("http://localhost:4000/ocr", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al enviar el formulario");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Formulario enviado con éxito:", result);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        router.push("/error");
      });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="firstName" className={styles.label}>Nombre</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="lastName" className={styles.label}>Apellido</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="dni" className={styles.label}>Número de DNI</label>
        <input
          type="text"
          id="dni"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="tramiteNumber" className={styles.label}>Número de trámite</label>
        <input
          type="text"
          id="tramiteNumber"
          name="tramiteNumber"
          value={formData.tramiteNumber}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="image" className={styles.label}>Subir imagen</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Registrar
      </button>

      {formData.image && (
        <>
          <img
            ref={imageRef}
            src={URL.createObjectURL(formData.image)}
            alt="Imagen cargada"
            style={{ display: 'none' }}
            onLoad={processImage}
          />
          <canvas ref={canvasRef} style={{ border: '1px solid black', marginTop: '10px' }}></canvas>
        </>
      )}
    </form>
  );
};

export default RegisterForm;
