# 🚀 Flujo del Frontend: Actualización de Foto de Perfil de Usuario

Este `README` describe el flujo que tu frontend debe seguir para permitir a los usuarios **subir y actualizar sus fotos de perfil**. El proceso se divide en **dos pasos principales** para asegurar una gestión correcta de la imagen en Cloudinary y su posterior actualización en tu base de datos a través de tu `UserController`.

---

## 📸 Paso 1: Subir la Nueva Foto a Cloudinary y Obtener su URL

El frontend es responsable de tomar el archivo de imagen que el usuario selecciona y enviarlo directamente a tu endpoint de carga de imágenes.

### Acciones del Frontend:

1.  **Capturar el archivo:** El usuario elige una nueva foto mediante un `input` de tipo `file`.
2.  **Preparar la solicitud:** Crea un objeto `FormData`. Este objeto, clave para enviar archivos, debe incluir tu imagen bajo la clave **`file`** (el nombre de campo que espera tu backend).
3.  **Enviar el archivo (POST):** Realiza una solicitud **`POST`** a tu endpoint de carga de imágenes: `/upload/image`.
    * **Ejemplo:** `POST /upload/image`
    * **Importante:** El navegador configurará automáticamente el `Content-Type` adecuado (`multipart/form-data`) para `FormData`.
    * Opcionalmente, puedes añadir un parámetro de query como `?folder=user-profiles` para organizar las imágenes en Cloudinary.
4.  **Recibir la URL:** Si la subida es exitosa, tu backend responderá con un JSON que contiene la **URL pública** de la imagen en Cloudinary (ej., `{"url": "https://res.cloudinary.com/tu-cloud/..."}`). **Almacena esta URL temporalmente** en el frontend.



### 📸 Paso 2: Actualizar el Perfil del Usuario con la Nueva URL

Una vez que el frontend tiene la URL de Cloudinary de la nueva foto, el siguiente paso es enviarla a tu backend para actualizar el registro del usuario. Esto se hará usando tu endpoint existente **`PATCH /user/:id`** en el `UserController`.

#### Acciones del Frontend:

1.  **Construir el `payload`:** Crea un objeto JSON que incluya la propiedad **`profilePictureUrl`** con la URL obtenida en el Paso 1. Puedes añadir otros campos del perfil (`name`, `phone`, etc.) si el usuario los está actualizando al mismo tiempo.
2.  **Enviar la actualización (PATCH):** Realiza una solicitud **`PATCH`** a tu endpoint de actualización de usuario: `/user/:id`.
    * **Ejemplo:** `PATCH /user/ID_DEL_USUARIO` (donde `ID_DEL_USUARIO` es el UUID del usuario).
    * **Tu `UserController` ya tiene este endpoint configurado (`@Patch(':id')`) y está protegido por `AuthGuard` e `IsOwnerOrAdminGuard`.**
