# Documentación de la API de Personalización y Gestión de Archivos

Este documento describe los endpoints clave y el flujo recomendado para la funcionalidad de personalización de la agencia, donde la subida de imágenes (logo y banner) es orquestada por el frontend.

---

## 🚀 Flujo General: Personalización con Imágenes (Frontend Orquesta)

La estrategia para la personalización de la agencia, incluyendo logo y banner, sigue este flujo orquestado por el frontend:

1.  **El Usuario Interactúa**: El usuario selecciona el logo y/o el banner a través de un formulario en el frontend y completa la información textual y de colores de personalización.

2.  **Frontend Prepara la Subida**: Al iniciar la acción de guardado, el JavaScript del frontend obtiene los archivos de imagen seleccionados.

3.  **Frontend Sube el Logo**: Si se seleccionó un logo, el frontend envía el archivo binario del logo en un `FormData` al endpoint **`POST /upload/image`**.
    * El **Backend (`UploadModule`)** recibe el archivo, lo sube a Cloudinary (`UploadService` -> `CloudinaryService`), y devuelve la URL pública del logo.
    * El **Frontend** almacena temporalmente esta URL.

4.  **Frontend Sube el Banner**: Si se seleccionó un banner, el frontend envía el archivo binario del banner en un `FormData` al endpoint **`POST /upload/image`**.
    * El **Backend (`UploadModule`)** recibe el archivo, lo sube a Cloudinary (`UploadService` -> `CloudinaryService`), y devuelve la URL pública del banner.
    * El **Frontend** almacena temporalmente esta URL.

5.  **Frontend Envía la Personalización Completa**: Una vez obtenidas todas las URLs de las imágenes (o `null` si no se subió alguna), el frontend construye un objeto JSON que incluye estas URLs y el resto de la información textual y de colores del formulario.
    * Envía este objeto JSON al endpoint **`POST /agencies/:agencyId/customization`** (para crear) o **`PATCH /agencies/:agencyId/customization`** (para actualizar).
    * El **Backend (`CustomizationModule`)** recibe este JSON (donde `logoImage` y `banner` son las URLs) y guarda/actualiza los datos en la base de datos, asociándolos a la `agencyId` proporcionada en la ruta.

6.  **Respuesta al Usuario**: El frontend recibe la confirmación del guardado de personalización y notifica al usuario.

---

## 📂 Endpoints de Gestión de Archivos (`UploadModule`)

Este módulo proporciona los endpoints para subir y eliminar archivos de imagen en Cloudinary.

### `POST /upload/image`

* **Descripción**: Recibe un archivo de imagen, lo sube a Cloudinary y devuelve su URL pública. Opcionalmente, permite especificar una carpeta en Cloudinary.
* **Método HTTP**: `POST`
* **Ruta**: `/upload/image`
* **Tipo de Contenido Esperado**: `multipart/form-data`
    * **Campo del Archivo**: El archivo debe ser adjuntado bajo el nombre de campo **`file`**.
        *(Ejemplo para `FormData` en JavaScript: `formData.append('file', yourFile);`)*
    * **Parámetros de Query (Opcional)**:
        * `folder` (string): Nombre de la carpeta en Cloudinary donde se almacenará la imagen.
            *(Ejemplo: `GET /upload/image?folder=logos`)*
* **Ejemplo de Request (Frontend)**:
    ```javascript
    const fileInput = document.getElementById('yourFileInput'); // Asume un <input type="file" id="yourFileInput">
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file); // <-- Importante: 'file' es el nombre del campo

    // Opcional: para subir a una carpeta específica
    // const folderName = 'logos-de-agencia';
    // fetch(`http://localhost:3000/upload/image?folder=${folderName}`, {

    fetch('http://localhost:3000/upload/image', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('URL de la imagen subida:', data.url);
      // GUARDAR esta URL para enviarla a /agencies/:agencyId/customization
    })
    .catch(error => console.error('Error al subir imagen:', error));
    ```
* **Ejemplo de Respuesta Exitosa**:
    ```json
    {
      "url": "[https://res.cloudinary.com/tu-cloud-name/image/upload/v1234567890/public_id_del_archivo.jpg](https://res.cloudinary.com/tu-cloud-name/image/upload/v1234567890/public_id_del_archivo.jpg)"
    }
    ```
* **Acción Siguiente (Frontend)**: Una vez obtenida la URL (`response.url`), almacénala temporalmente. Si necesitas subir varios archivos (ej. logo y banner), repite la llamada para cada uno y guarda todas las URLs para el siguiente paso.

### `DELETE /upload/image/:publicId`

* **Descripción**: Elimina una imagen de Cloudinary utilizando su `publicId`.
* **Método HTTP**: `DELETE`
* **Ruta**: `/upload/image/:publicId`
    * `:publicId` (string): El ID público del archivo en Cloudinary (parte de la URL, a veces incluye la carpeta, ej. `folder/image_name`).
        *(Ejemplo: Si la URL es `.../upload/v123/my_logo_123.jpg`, el `publicId` es `my_logo_123` o `folder/my_logo_123` si está en una carpeta).*
* **Ejemplo de Request (Frontend)**:
    ```javascript
    const publicIdToDelete = 'public_id_del_logo_en_cloudinary'; // Debes obtenerlo de la URL o guardarlo
    fetch(`http://localhost:3000/upload/image/${publicIdToDelete}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => console.log(data.message)) // Espera "Imagen eliminada exitosamente"
    .catch(error => console.error('Error al eliminar imagen:', error));
    ```
* **Ejemplo de Respuesta Exitosa**:
    ```json
    {
      "message": "Imagen eliminada exitosamente"
    }
    ```

---

## 🎨 Endpoints de Personalización (`CustomizationModule`)

Este módulo gestiona las configuraciones de personalización (branding) para agencias específicas.

### `POST /agencies/:agencyId/customization`

* **Descripción**: Crea la configuración de personalización (branding) para una agencia específica.
* **Método HTTP**: `POST`
* **Ruta**: `/agencies/:agencyId/customization`
    * `:agencyId` (string): El ID único de la agencia a la que se asociará esta personalización.
* **Tipo de Contenido Esperado**: `application/json`
* **Cuerpo de la Solicitud (Request Body)**: Objeto JSON con los datos de personalización, según `CreateCustomizationDto`.
    * `logoImage` y `banner` deben ser **cadenas de texto (strings) con formato de URL** obtenidas del endpoint `/upload/image`.
    * Todos los campos son opcionales según el DTO, pero se recomienda enviar al menos los datos relevantes.
* **Esquema del Request Body (basado en `CreateCustomizationDto`)**:
    ```json
    {
      "logoImage"?: "string (URL)",
      "information"?: "string",
      "mainColors"?: "string (hexadecimal)",
      "banner"?: "string (URL)",
      "navbarColor"?: "string (hexadecimal)",
      "buttonColor"?: "string (hexadecimal)",
      "backgroundColor"?: "string (hexadecimal)",
      "secondaryColor"?: "string (hexadecimal)"
    }
    ```
* **Ejemplo de Request Body**:
    ```json
    {
      "information": "Descripción de mi agencia de bienes raíces y servicios ofrecidos.",
      "logoImage": "[https://res.cloudinary.com/tu-cloud/image/upload/v123/logo_final.jpg](https://res.cloudinary.com/tu-cloud/image/upload/v123/logo_final.jpg)",
      "banner": "[https://res.cloudinary.com/tu-cloud/image/upload/v456/banner_promo.png](https://res.cloudinary.com/tu-cloud/image/upload/v456/banner_promo.png)",
      "mainColors": "#1A2B3C",
      "navbarColor": "#3D4E5F",
      "buttonColor": "#ABCDEF",
      "backgroundColor": "#FEDCBA",
      "secondaryColor": "#987654"
    }
    ```
* **Acción Siguiente (Backend)**: El servicio creará la personalización, asociándola al `agencyId` proporcionado.

### `GET /agencies/:agencyId/customization`

* **Descripción**: Recupera la configuración de personalización de una agencia específica.
* **Método HTTP**: `GET`
* **Ruta**: `/agencies/:agencyId/customization`
    * `:agencyId` (string): El ID único de la agencia cuya personalización se desea recuperar.
* **Ejemplo de Request (Frontend)**:
    ```javascript
    const agencyId = 'tu_agency_id_aqui';
    fetch(`http://localhost:3000/agencies/${agencyId}/customization`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer TU_TOKEN_JWT' (si usas autenticación, ej. con AuthGuard)
      },
    })
    .then(response => response.json())
    .then(data => console.log('Personalización de la agencia:', data))
    .catch(error => console.error('Error al obtener personalización:', error));
    ```
* **Ejemplo de Respuesta Exitosa**:
    ```json
    {
      "id": "uuid-generado",
      "logoImage": "[https://res.cloudinary.com/tu-cloud/image/upload/v123/logo_final.jpg](https://res.cloudinary.com/tu-cloud/image/upload/v123/logo_final.jpg)",
      "information": "Descripción de mi agencia de bienes raíces y servicios ofrecidos.",
      "mainColors": "#1A2B3C",
      "banner": "[https://res.cloudinary.com/tu-cloud/image/upload/v456/banner_promo.png](https://res.cloudinary.com/tu-cloud/image/upload/v456/banner_promo.png)",
      "navbarColor": "#3D4E5F",
      "buttonColor": "#ABCDEF",
      "backgroundColor": "#FEDCBA",
      "secondaryColor": "#987654",
      "agencyId": "tu_agency_id_aqui",
      "createdAt": "2025-06-25T10:00:00Z",
      "updatedAt": "2025-06-25T10:00:00Z"
    }
    ```

### `PATCH /agencies/:agencyId/customization`

* **Descripción**: Actualiza la configuración de personalización (branding) de una agencia específica.
* **Método HTTP**: `PATCH`
* **Ruta**: `/agencies/:agencyId/customization`
    * `:agencyId` (string): El ID único de la agencia cuya personalización se desea actualizar.
* **Tipo de Contenido Esperado**: `application/json`
* **Cuerpo de la Solicitud (Request Body)**: Objeto JSON con los campos a actualizar, según `UpdateCustomizationDto` (que probablemente herede o sea similar a `CreateCustomizationDto`).
    * Al igual que en `POST`, `logoImage` y `banner` deben ser **cadenas de texto (strings) con formato de URL** si se están actualizando las imágenes.
* **Ejemplo de Request Body**:
    ```json
    {
      "information": "Descripción actualizada de mi agencia.",
      "logoImage": "[https://res.cloudinary.com/tu-cloud/image/upload/v789/nuevo_logo.jpg](https://res.cloudinary.com/tu-cloud/image/upload/v789/nuevo_logo.jpg)",
      "navbarColor": "#00FF00"
      // Si otros campos no cambian, no es necesario incluirlos en el body.
    }
    ```
* **Acción Siguiente (Backend)**: El servicio actualizará la personalización existente, asociándola al `agencyId` proporcionado.