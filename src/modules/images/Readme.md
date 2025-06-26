# 📸 Módulo de Gestión de Imágenes (`/src/modules/images`)

¡Bienvenido al **centro visual** de tu plataforma inmobiliaria! Este módulo es el motor que impulsa la gestión de todas las fotografías de tus propiedades, asegurando que cada listado brille con la calidad y seguridad que merece. Aquí desglosamos cómo funciona, quién tiene el control y por qué cada pieza está en su lugar.

---

## 🚀 Funcionalidades Clave

### 🖼️ Gestión de Contenido Visual para Propiedades

La funcionalidad de imágenes es vital para presentar las propiedades de forma atractiva y profesional. Permite a los agentes y administradores subir, organizar y mantener las galerías de fotos de cada listado, mientras que los usuarios finales pueden explorar el contenido visual de forma fluida.

**Historias de Usuario Clave en la Gestión de Imágenes:**

* **Publicación de Propiedades con Impacto Visual:**
    * Como un **Agente Inmobiliario**, puedo **subir múltiples imágenes** a una propiedad recién creada o existente. Esto me permite presentar visualmente mis propiedades de manera atractiva, captando la atención de posibles compradores o arrendatarios.
* **Actualización y Mantenimiento de Galerías:**
    * Como un **Agente Inmobiliario**, puedo **modificar o eliminar imágenes específicas** de mis propiedades. Esto es crucial para mantener actualizada la presentación visual de una propiedad, eliminando fotos obsoletas o subiendo nuevas que reflejen cambios.
* **Exploración Visual para Usuarios Finales:**
    * Como un **Usuario Final (Invitado o Registrado)**, puedo **visualizar todas las imágenes** asociadas a una propiedad. Esto me brinda una experiencia inmersiva y detallada, ayudándome a tomar decisiones informadas sobre la propiedad.

### 🛡️ Seguridad Centralizada: Quién Accede y Por Qué

La seguridad es primordial. Cada operación con imágenes está protegida por una serie de "guardias" que verifican tu identidad, tu rol y, de forma crucial, si tenés la **propiedad del recurso** que intentás modificar.

---

## 2. 🚦 `ImagesController`: Tu Comando de Fotos Digitales

El `ImagesController` es el centro de mando para todas las interacciones HTTP con tus imágenes. Cada "puerta" (endpoint) está diseñada para una tarea específica y protegida con el nivel de seguridad adecuado.

**Ruta Base**: `/images`

---

### 2.1. Puertas y Sus Vigilantes (Endpoints y Guardias)

#### `POST /images` - ¡Añadí tu Nueva Imagen! 📸

* **Propósito**: Permite subir nuevas fotos al sistema, enlazándolas a una propiedad existente. Antes de llamar a este endpoint, el frontend debe haber **subido el archivo de imagen a Cloudinary** a través del endpoint `POST /upload/image` y obtenido su URL. Esa URL es la que se envía en el cuerpo de esta solicitud.
* **Método HTTP**: `POST`
* **Ruta**: `/images`
* **Cuerpo de la Solicitud (`Request Body`)**: Se espera un objeto JSON (`CreateImageDto`) con los siguientes campos:
    * `file`: **(Requerido, string)** La URL pública de la imagen obtenida de Cloudinary.
    * `title`: **(Requerido, string)** Un título para la imagen.
    * `description`: **(Requerido, string)** Una descripción detallada de la imagen.
    * `propertyId`: **(Requerido, string)** El ID (UUID) de la propiedad a la que se asociará esta imagen.
* **Guardias**:
    * **`AuthGuard`**: Verifica que estés **autenticado** (tenés un JWT válido).
    * **`RolesGuard`**: Asegura que solo **Agentes (`Role.User`)** o **Administradores (`Role.Admin`)** pueden crear imágenes.
* **Acceso Permitido**: Agentes Inmobiliarios y Administradores autenticados.

#### `GET /images` - Un Vistazo al Álbum Completo 🌍

* **Propósito**: Obtiene una lista de todas las imágenes disponibles en la plataforma.
* **Método HTTP**: `GET`
* **Ruta**: `/images`
* **Cuerpo de la Solicitud (`Request Body`)**: No requiere.
* **Guardias**: ¡Ninguno! Esta puerta está abierta.
* **Acceso Permitido**: **Público en general**. Cualquiera puede ver las imágenes, lo cual es esencial para mostrar tus propiedades a todos los visitantes.

#### `GET /images/:id` - Detalles de una Foto Específica 🔍

* **Propósito**: Recupera los detalles de una imagen específica por su ID.
* **Método HTTP**: `GET`
* **Ruta**: `/images/:id`
    * `:id` (string, UUID): El ID único de la imagen que querés recuperar.
* **Cuerpo de la Solicitud (`Request Body`)**: No requiere.
* **Guardias**: ¡Ninguno!
* **Acceso Permitido**: **Público en general**. Los visitantes pueden examinar fotos individuales.

#### `PATCH /images/:id` - ¡Editá esa Foto! ✏️

* **Propósito**: Permite modificar la información (título, descripción, archivo) de una imagen existente. Si proporcionás una nueva URL para el campo `file`, el backend se encargará automáticamente de **eliminar la imagen antigua de Cloudinary** antes de guardar la nueva URL en la base de datos.
* **Método HTTP**: `PATCH`
* **Ruta**: `/images/:id`
    * `:id` (string, UUID): El ID único de la imagen que querés actualizar.
* **Cuerpo de la Solicitud (`Request Body`)**: Se espera un objeto JSON (`UpdateImageDto`) con al menos uno de los siguientes campos:
    * `file`: **(Opcional, string)** La nueva URL pública de la imagen obtenida de Cloudinary. Si este campo se envía, se activa el proceso de borrado de la imagen anterior en Cloudinary.
    * `title`: **(Opcional, string)** El nuevo título para la imagen.
    * `description`: **(Opcional, string)** La nueva descripción de la imagen.
    * `propertyId`: **(Opcional, string)** El nuevo ID de la propiedad a la que se asociará esta imagen (UUID).
* **Guardias**:
    * **`AuthGuard`**: Identidad confirmada.
    * **`RolesGuard`**: ¿Sos **Agente** o **Administrador**? Confirmado.
    * **`PropertyOwnershipGuard`**: **(EL GUARDIÁN DEL DUEÑO)** Este guardia verifica que tenés derecho a modificar esta imagen (solo tus propias imágenes o las de tu agencia, o cualquier imagen si sos Administrador).
* **Acceso Permitido**: Agentes Inmobiliarios (solo sobre sus propias imágenes o las de su agencia) y Administradores.

#### `DELETE /images/:id` - ¡Bye Bye Foto! 👋

* **Propósito**: Permite eliminar una imagen específica del sistema. **Este proceso es seguro y eficiente, ya que el backend maneja automáticamente la eliminación del archivo de imagen de Cloudinary y luego realiza un `softRemove` (eliminación lógica) del registro en la base de datos.**
* **Método HTTP**: `DELETE`
* **Ruta**: `/images/:id`
    * `:id` (string, UUID): El ID único de la imagen que querés eliminar.
* **Cuerpo de la Solicitud (`Request Body`)**: No requiere.
* **Guardias**:
    * **`AuthGuard`**: Autenticación obligatoria.
    * **`RolesGuard`**: Solo **Agentes** o **Administradores** tienen el permiso de rol.
    * **`PropertyOwnershipGuard`**: **(EL MISMO GUARDIÁN DEL DUEÑO)** Al igual que en `PATCH`, este guardia es crucial. Se asegura de que solo podés eliminar imágenes asociadas a **propiedades de tu propia agencia** (o cualquier imagen si sos Administrador).
* **Acceso Permitido**: Agentes Inmobiliarios (solo sobre sus propias imágenes o las de su agencia) y Administradores.

---

## 3. 🛡️ Los Guardias: Tus Escuderos de la Seguridad (Profundizando)

Estos son los vigilantes que protegen tu API de imágenes, y cada uno tiene un papel irremplazable.

---

### 3.1. `AuthGuard`: El Bouncer Infalible

* **Su Función Vital**: Es el primer control de seguridad. Su única misión es validar que el usuario que envía una solicitud ha iniciado sesión correctamente y ha proporcionado un **token JWT (JSON Web Token) válido**. Si el token está ausente o es incorrecto, la solicitud es rechazada inmediatamente con un error `401 Unauthorized`. Si es válido, extrae los datos clave del usuario (ID, roles) y los adjunta a la solicitud para que los siguientes guardias puedan usarlos.

### 3.2. `RolesGuard`: El Clasificador de Privilegios

* **Su Función Vital**: Se ejecuta *después* de `AuthGuard`. Una vez que la identidad del usuario está confirmada, `RolesGuard` verifica el **tipo de usuario** que sos. Lee los roles que vos (`@Roles(Role.User, Role.Admin)`) has especificado para un endpoint y compara esto con los roles que el usuario autenticado realmente tiene. Si no tenés el "rango" necesario, te detiene con un `403 Forbidden`.

### 3.3. `PropertyOwnershipGuard` (¡El Guardia Recién Llegado y Esencial!)

* **Su Función Vital**: Este es el **guardia especializado** y la pieza clave de nuestra seguridad avanzada en este módulo. Mientras que `AuthGuard` sabe *quién sos* y `RolesGuard` sabe *qué tipo de usuario sos*, `PropertyOwnershipGuard` va un paso más allá y pregunta: **"¿Tenés derecho a TOCAR este recurso específico (esta imagen)?"**
* **¿Por qué fue indispensable crearlo?**: Los guardias genéricos como `AuthGuard` y `RolesGuard` son excelentes, pero no tienen el concepto de "pertenencia" de un recurso individual. Un `RolesGuard` sabe que un "Agente" puede editar, pero no distingue entre "las propiedades del Agente A" y "las propiedades del Agente B".
    * Sin este guardia, cualquier Agente Inmobiliario autenticado (`Role.User`) podría haber actualizado o eliminado *cualquier imagen* en el sistema si conocía su ID. Esto habría sido un **fallo de seguridad crítico**, permitiendo que los agentes manipulen datos que no les pertenecen, lo que va totalmente en contra de la lógica de negocio de nuestra plataforma.
* **Su Solución**: `PropertyOwnershipGuard` cierra esta brecha de seguridad de forma elegante y efectiva. Cuando una solicitud para `PATCH` o `DELETE` llega:
    1.  Verifica si el usuario es un **Administrador**. Si lo es, permite el paso (los administradores tienen pase libre).
    2.  Si no es administrador, toma el **ID de la imagen** de la URL.
    3.  A través de nuestro `ImagesService`, rastrea la imagen hasta la **propiedad** a la que pertenece, luego a la **agencia** dueña de esa propiedad, y finalmente, al **usuario propietario** de esa agencia.
    4.  Compara el ID del usuario que está haciendo la solicitud con el ID del usuario propietario de la agencia de la imagen.
    5.  Si coinciden, ¡permite la acción! Si no, o si la cadena de propiedad no se puede establecer, lanza un error `403 Forbidden` (`No tenés permisos para realizar esta acción sobre esta imagen.`).

---

## 4. ⚙️ `ImagesModule`: La Orquesta de Dependencias

El `ImagesModule` es el **director de orquesta** que organiza todos los componentes necesarios para que el módulo de imágenes funcione. Es donde NestJS aprende cómo construir cada pieza (servicios, controladores, guardias) y cómo suministrarles todo lo que necesitan mediante la **inyección de dependencias**. Quizás te preguntes por qué ves elementos como `User`, `Agency`, `JwtService`, `UserService`, etc., listados aquí si no los "utilizás directamente" en el código de tu `ImagesController` o `ImagesService` (que residen en esta misma carpeta). Aquí está la explicación detallada:

---

### 4.1. Por qué `TypeOrmModule.forFeature([Images, Property, User, Agency])` en `imports`

Imaginá que tu `ImagesService` es un investigador que necesita entender la historia completa de una imagen, incluyendo quién es su dueño. Para ello, debe seguir una **cadena de relaciones interconectadas** en la base de datos:

1.  Comienza con la **Imagen** (`Images`).
2.  La Imagen está vinculada a una **Propiedad** (`Property`).
3.  La Propiedad, a su vez, está asociada a una **Agencia** (`Agency`).
4.  Finalmente, la Agencia tiene un **Usuario** (`User`) que es su propietario principal.

Para que **TypeORM** (nuestra herramienta ORM que mapea objetos a la base de datos) pueda seguir y cargar eficientemente toda esta cadena de relaciones (especialmente cuando tu `ImagesService` ejecuta `findOneWithPropertyAndOwner` para el `PropertyOwnershipGuard`), **necesita tener un "mapa completo" de todas estas entidades** (`Images`, `Property`, `User`, `Agency`). Al listarlas en `TypeOrmModule.forFeature()`, le estás indicando a NestJS: "Dentro de este `ImagesModule`, TypeORM tiene la información y la capacidad para trabajar con los datos de estas cuatro entidades y sus relaciones, incluso si no voy a inyectar directamente `Repository<User>` o `Repository<Agency>` aquí." Es como darle al investigador un mapa completo de la ciudad, aunque solo le pidas que se enfoque en una calle específica para su caso.

### 4.2. Por qué `JwtService`, `UserService`, `AgencyService`, `AuthGuard`, `RolesGuard` en `providers`

Esta es la esencia de la **inyección de dependencias** en NestJS. Pensá en tu `ImagesModule` como una **línea de ensamblaje en una fábrica**. Para ensamblar las "partes" que se van a utilizar en este módulo (como tu `ImagesController`), esa línea de ensamblaje necesita tener a mano todos los "componentes" y las "herramientas" necesarias.

1.  **Tu `ImagesController` utiliza `AuthGuard`, `RolesGuard` y `PropertyOwnershipGuard`**: Cuando decorás un endpoint del controlador con `@UseGuards(AuthGuard, RolesGuard, PropertyOwnershipGuard)`, le estás diciendo a NestJS: "Antes de ejecutar la lógica de este endpoint, por favor, construí y ejecutá estas tres 'piezas de seguridad' en este orden."

2.  **`AuthGuard` tiene sus propias dependencias (¡sus propias "herramientas" internas!)**: Aquí reside la clave de la confusión inicial. Si observamos el constructor de tu `AuthGuard` (el archivo `auth.guard.ts`), notarás que explícitamente solicita tres "herramientas" para poder operar:
    * **`JwtService`**: La herramienta especializada en verificar y manipular los tokens JWT de autenticación.
    * **`UserService`**: La herramienta para interactuar con los datos de los usuarios (por ejemplo, para buscar un usuario por su ID y obtener sus roles).
    * **`AgencyService`**: La herramienta para interactuar con los datos de las agencias (por ejemplo, para buscar una agencia).

    Para que NestJS pueda "construir" la instancia de `AuthGuard` y luego pasársela a tu `ImagesController`, primero tiene que asegurarse de que esas tres "herramientas" (`JwtService`, `UserService`, `AgencyService`) estén disponibles para `AuthGuard`.

3.  **El `ImagesModule` debe "proveer" esas dependencias para que estén disponibles**:
    * Al incluir `JwtService`, `UserService`, `AgencyService`, `AuthGuard` y `RolesGuard` en el array `providers` de tu `ImagesModule`, le estás indicando a NestJS: "Escuchá, si cualquier parte de este módulo (como el `ImagesController` o cualquiera de sus guardias) necesita una instancia de `JwtService`, `UserService`, `AgencyService`, `AuthGuard` o `RolesGuard`, **yo sé cómo crearlas y las pongo a tu disposición aquí mismo**."
    * Es como si tu `ImagesModule` dijera: "Además de mis propias herramientas para manejar imágenes, he 'importado' o tengo 'prestadas' las herramientas de verificación de tokens (`JwtService`), y las listas de usuarios y agencias (`UserService`, `AgencyService`) para poder ensamblar y ejecutar los guardias de seguridad que mis endpoints necesitan."

En resumen, aunque el código que escribís directamente en `ImagesController` o `ImagesService` dentro de la carpeta `images` no "llame" explícitamente a `UserService` o `JwtService`, los **guardias que sí utiliza el `ImagesController` los requieren como sus propias dependencias internas**. El `ImagesModule` actúa como un orquestador inteligente que garantiza que todas las piezas estén disponibles y correctamente interconectadas, permitiendo que tu sistema de seguridad y tus operaciones de imágenes funcionen de forma impecable.