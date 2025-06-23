# Módulo de Usuario (User)

Este módulo gestiona la lógica relacionada con los usuarios de la aplicación, incluyendo la autenticación, la gestión de perfiles y la interacción con fotos de perfil alojadas en Cloudinary.

## Estructura y Componentes Clave

* **`UserController`**: Define los endpoints de la API para las operaciones CRUD sobre usuarios y la gestión de la foto de perfil.
* **`UserService`**: Contiene la lógica de negocio para las operaciones de usuario, incluyendo la interacción con la base de datos y Cloudinary.
* **`UserEntity`**: La definición de la tabla de usuarios en la base de datos.
* **`CreateUserDto` / `UpdateUserDto`**: Data Transfer Objects para la validación de entrada.
* **`AuthGuard`**: Guard de NestJS que verifica la autenticación del usuario mediante JWT.
* **`RolesGuard`**: Guard de NestJS que verifica los roles del usuario (ej. Admin).
* **`IsOwnerOrAdminGuard`**: Guard de NestJS personalizado para controlar el acceso a recursos específicos del usuario, permitiendo el acceso solo al propio usuario o a un administrador.
* **`CloudinaryService`**: Servicio para interactuar con la API de Cloudinary para la subida y eliminación de imágenes.

---

## **`IsOwnerOrAdminGuard`**

### Propósito

Este `Guard` es fundamental para implementar una capa de autorización fina en los endpoints de usuario. Su función principal es asegurar que:

1.  **Solo el propietario del recurso** puede acceder o modificarlo.
2.  **Un usuario con rol de `Admin`** también puede acceder o modificar cualquier recurso, independientemente de la propiedad.

### ¿Cómo funciona?

1.  **Recupera el ID del usuario** del token JWT autenticado (generalmente de `req.user.id`).
2.  **Recupera el ID del recurso** de los parámetros de la solicitud (ej. `:id` en `/users/:id`).
3.  **Compara ambos IDs**: Si coinciden, el usuario es el propietario y se concede el acceso.
4.  **Verifica el rol**: Si los IDs no coinciden, verifica si el usuario autenticado tiene el rol `Admin`. Si lo tiene, se concede el acceso.
5.  **Deniega el acceso**: Si ninguna de las condiciones anteriores se cumple, se deniega el acceso (generalmente con un error `403 Forbidden`).

