import React, { useState } from "react";
import styles from "../validate/validate.module.css";

const DniValidationForm = () => {
  const [dniImage, setDniImage] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

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

    if (!dniImage) {
      alert("Por favor, sube la imagen del DNI.");
      return;
    }

    const formData = new FormData();
    formData.append("dni_photo", dniImage); // Imagen del DNI

    fetch("http://127.0.0.1:8000/users/validate-dni", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al validar el DNI");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Validación exitosa:", result);
        setValidationResult(result);
      })
      .catch((error) => {
        console.error("Error:", error);
        setValidationResult({ error: "Hubo un problema al validar el DNI." });
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
        <button type="submit" className={styles.submitButton}>
          Validar DNI
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

export default DniValidationForm;
