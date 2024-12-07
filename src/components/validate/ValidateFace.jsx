import React, { useState } from "react";
import styles from "./validate.module.css";

const FaceValidationForm = () => {
  const [faceImage, setFaceImage] = useState(null);
  const [dniImage, setDniImage] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  // Manejo del cambio en la imagen del rostro
  const handleFaceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaceImage(file);
    }
  };

  // Manejo del cambio en la imagen del DNI
  const handleDniImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDniImage(file);
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!faceImage || !dniImage) {
      alert("Por favor, sube tanto la imagen del rostro como la del DNI.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", "prueba");             // Nombre del usuario
    formData.append("email", "prueba@example.com"); // Correo del usuario
    formData.append("dni_photo", dniImage);        // Imagen del DNI
    formData.append("webcam_photo", faceImage);    // Imagen del rostro
  
    fetch("http://127.0.0.1:8000/users/register", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al registrar usuario");
        }
        console.log(response);
        return response.json();
      })
      .then((result) => {
        console.log("Usuario registrado exitosamente:", result);
        setValidationResult(result);
      })
      .catch((error) => {
        console.error("Error:", error);
        setValidationResult({ error: "Hubo un problema al registrar el usuario." });
      });
  };
  
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="dniImage" className={styles.label}>
            Subir imagen del DNI
          </label>
          <input
            type="file"
            id="dniImage"
            name="dniImage"
            accept="image/*"
            onChange={handleDniImageChange}
            className={styles.fileInput}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="faceImage" className={styles.label}>
            Subir imagen del rostro
          </label>
          <input
            type="file"
            id="faceImage"
            name="faceImage"
            accept="image/*"
            onChange={handleFaceImageChange}
            className={styles.fileInput}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Validar Rostro
        </button>
      </form>

      {validationResult && (
        <div className={styles.result}>
          <h3>Resultado de Validación:</h3>
          {validationResult.error ? (
            <p className={styles.error}>{validationResult.error}</p>
          ) : (
            <pre>{JSON.stringify(validationResult, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceValidationForm;
