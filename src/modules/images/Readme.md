1. Subir Imagen de Galería de una Propiedad
Este endpoint permite añadir una nueva imagen a la galería de una propiedad específica.

URL: POST /images/property/:propertyId/gallery

Parámetros de URL:

propertyId (UUID): El ID único de la propiedad a la que se desea añadir la imagen.

Seguridad:

AuthGuard: Requiere que el usuario esté autenticado.

PropertyOwnershipGuard: Asegura que el usuario autenticado sea el propietario de la propiedad (o un administrador) para poder subir imágenes a su galería.

Cuerpo de la Solicitud (FormData):

file: El archivo de imagen (requerido).


2. Subir o Actualizar Foto de Perfil de Usuario
Este endpoint permite actualizar la foto de perfil de un usuario.

URL: POST /images/profile/:userId

Parámetros de URL:

userId (UUID): El ID único del usuario cuya foto de perfil se desea actualizar.

Seguridad:

AuthGuard: Requiere que el usuario esté autenticado.

IsOwnerOrAdminGuard: Asegura que el usuario autenticado sea el propietario del perfil (o un administrador) para poder cambiar la foto.

Cuerpo de la Solicitud (FormData):

file: El archivo de imagen (requerido).

3. Subir o Actualizar Logo de Personalización (Customization)
Este endpoint permite subir o actualizar el logo de una entidad de personalización.

URL: POST /images/customization/:customizationId/logo

Parámetros de URL:

customizationId (UUID): El ID único de la personalización cuyo logo se desea actualizar.

Seguridad:
# Gestión de Imágenes en la API

Este documento explica cómo interactuar con los endpoints de gestión de imágenes de la API. Utilizamos **Cloudinary** para el almacenamiento, y todas las subidas de imágenes requieren el envío de archivos como `multipart/form-data`.

---

## Cómo Enviar Imágenes desde el Frontend

Para subir cualquier imagen, tu frontend debe enviar una solicitud `POST` con el encabezado `Content-Type` establecido automáticamente por `FormData`. El archivo de imagen debe adjuntarse al campo del formulario llamado **`file`**.

---

### 1. Subir Imagen de Galería de una Propiedad

Este endpoint te permite agregar una nueva imagen a la galería de una propiedad específica.

* **URL:** `POST /images/property/:propertyId/gallery`
* **Parámetros de URL:**
    * `propertyId` (UUID): El ID único de la propiedad.
* **Seguridad:**
    * **`AuthGuard`**: Requiere que el usuario esté **autenticado**.
    * **`PropertyOwnershipGuard`**: Asegura que el usuario autenticado sea el **propietario** de la propiedad (o un administrador) para poder subir imágenes a su galería.
* **Cuerpo de la Solicitud (FormData):**
    * `file`: El archivo de imagen **(requerido)**.

---

### 2. Subir o Actualizar Foto de Perfil de Usuario

Utiliza este endpoint para actualizar la foto de perfil de un usuario existente.

* **URL:** `POST /images/profile/:userId`
* **Parámetros de URL:**
    * `userId` (UUID): El ID único del usuario cuya foto de perfil quieres actualizar.
* **Seguridad:**
    * **`AuthGuard`**: Requiere que el usuario esté **autenticado**.
    * **`IsOwnerOrAdminGuard`**: Asegura que el usuario autenticado sea el **dueño** del perfil (o un administrador) para cambiar la foto.
* **Cuerpo de la Solicitud (FormData):**
    * `file`: El archivo de imagen **(requerido)**.

---

### 3. Subir o Actualizar Logo de Personalización (Customization)

Este endpoint te permite subir o actualizar el logo de una entidad de personalización.

* **URL:** `POST /images/customization/:customizationId/logo`
* **Parámetros de URL:**
    * `customizationId` (UUID): El ID único de la personalización cuyo logo quieres actualizar.
* **Seguridad:**
    * **`AuthGuard`**: Requiere que el usuario esté **autenticado**.
    * **`CustomizationOwnershipGuard`**: Asegura que el usuario autenticado sea el **propietario** de la personalización (o un administrador) para cambiar el logo.
* **Cuerpo de la Solicitud (FormData):**
    * `file`: El archivo de imagen **(requerido)**.

---

### 4. Subir o Actualizar Banner de Personalización (Customization)

De manera similar al logo, este endpoint es para subir o actualizar el banner de una entidad de personalización.

* **URL:** `POST /images/customization/:customizationId/banner`
* **Parámetros de URL:**
    * `customizationId` (UUID): El ID único de la personalización cuyo banner quieres actualizar.
* **Seguridad:**
    * **`AuthGuard`**: Requiere que el usuario esté **autenticado**.
    * **`CustomizationOwnershipGuard`**: Asegura que el usuario autenticado sea el **propietario** de la personalización (o un administrador) para cambiar el banner.
* **Cuerpo de la Solicitud (FormData):**
    * `file`: El archivo de imagen **(requerido)**.

---

### 5. Eliminar Imagen de Galería de una Propiedad

Usa este endpoint para eliminar una imagen específica de la galería de una propiedad.

* **URL:** `DELETE /images/property/:propertyId/gallery/:imageId`
* **Parámetros de URL:**
AuthGuard: Requiere que el usuario esté autenticado.

CustomizationOwnershipGuard: Asegura que el usuario autenticado sea el propietario de la personalización (o un administrador) para poder cambiar el logo.

Cuerpo de la Solicitud (FormData):

file: El archivo de imagen (requerido).

4. Subir o Actualizar Banner de Personalización (Customization)
Similar al logo, este endpoint permite subir o actualizar el banner de una entidad de personalización.

URL: POST /images/customization/:customizationId/banner

Parámetros de URL:

customizationId (UUID): El ID único de la personalización cuyo banner se desea actualizar.

Seguridad:

AuthGuard: Requiere que el usuario esté autenticado.

CustomizationOwnershipGuard: Asegura que el usuario autenticado sea el propietario de la personalización (o un administrador) para poder cambiar el banner.

Cuerpo de la Solicitud (FormData):

file: El archivo de imagen (requerido).

5. Eliminar Imagen de Galería de una Propiedad
Este endpoint permite eliminar una imagen específica de la galería de una propiedad.

URL: DELETE /images/property/:propertyId/gallery/:imageId

Parámetros de URL:

propertyId (UUID): El ID único de la propiedad de la que se desea eliminar la imagen.

imageId (UUID): El ID único de la imagen a eliminar de la galería.

Seguridad:

AuthGuard: Requiere que el usuario esté autenticado.

PropertyOwnershipGuard: Asegura que el usuario autenticado sea el propietario de la propiedad (o un administrador) para poder eliminar imágenes de su galería.