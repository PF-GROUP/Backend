# Módulo de Personalización (Customization)

Este módulo se encarga de gestionar la identidad visual y el branding de las agencias en el sistema, permitiendo configurar colores y logos.

---

## 🚀 Funcionalidades Clave

### 🎨 Gestión de Personalización por Agencia (Customization)

La funcionalidad de Customization permite a cada agencia que utiliza la plataforma definir su propia identidad visual y ciertos aspectos de información, asegurando una experiencia de usuario única y con la marca de cada cliente.

**Historias de Usuario Agente en Customization:**

* **Configuración Inicial de Branding:**
    * Como un **Agente (Utilizando Customization)**, puedo **asignar los colores y el logo de la marca** a una agencia. Esto permite que cada agencia tenga una identidad visual única desde el momento en que se integra a la plataforma. El sistema utiliza los `mainColors`, `navbarColor`, `buttonColor`, `backgroundColor`, `secondaryColor` definidos, así como el `logoImage` y el `banner` proporcionados. **Solo el agente propietario de la agencia o un administrador pueden realizar esta acción.**

* **Actualización de la Identidad Visual:**
    * Como un **Agente (Utilizando Customization)**, puedo **modificar la configuración de personalización de la agencia**. Esto es crucial para actualizar el logo, los colores o la información de contacto cuando la marca de la agencia evoluciona, asegurando que la plataforma siempre refleje la identidad más actual. **Solo el agente propietario de la agencia o un administrador pueden realizar esta acción.**

* **Experiencia de Usuario Personalizada:**
    * Como un **Usuario Final** que interactúa con una agencia específica, experimentaré una **interfaz de usuario que refleje la marca de esa agencia**. Esto crea una experiencia más cohesiva, profesional y personalizada, donde cada agencia se siente como un entorno propio dentro de la plataforma.

**Endpoints Principales:**

* `POST /agencies/:agencyId/customization`: Crea la configuración de personalización para una agencia. **Protegido por `AuthGuard`, `RolesGuard` y `AgencyOwnershipGuard`.**
* `GET /agencies/:agencyId/customization`: Recupera la configuración de personalización de una agencia. **Este endpoint es de acceso público.**
* `PATCH /agencies/:agencyId/customization`: Actualiza la configuración de personalización de una agencia. **Protegido por `AuthGuard`, `RolesGuard` y `AgencyOwnershipGuard`.**

---

## 🛡️ Guardias de Seguridad Implementados

Para garantizar la seguridad y el control de acceso a las funcionalidades de personalización, se utilizan los siguientes guardias de NestJS:

### `AuthGuard`

* **Propósito**: Este guardia asegura que solo los usuarios **autenticados** puedan interactuar con las rutas que requieren identificación.
* **Funcionamiento**: Valida el token JWT presente en las cookies de la solicitud. Si

### `RolesGuard`

* **Propósito**: Después de la autenticación, este guardia verifica que el usuario autenticado posea los **roles necesarios** para acceder a una ruta específica. Trabaja en conjunto con el decorador `@Roles()` definido en los controladores.
* **Funcionamiento**: Lee los roles permitidos para la ruta desde los metadatos de la ruta y los compara con los roles del usuario obtenidos de `request.user`. Si el usuario no tiene al menos uno de los roles autorizados, la solicitud es denegada con un error `403 Forbidden`.
* **Aplicación**: Utilizado en los endpoints `POST` y `PATCH` de `customization`, requiriendo los roles `User` (para agentes) o `Admin`.

### `AgencyOwnershipGuard`

* **Propósito**: Este es un guardia de **autorización granular** que garantiza que un agente solo pueda modificar o crear la personalización para **su propia agencia**. Un administrador, sin embargo, tiene acceso total a la personalización de cualquier agencia.
* **Funcionamiento**:
    1.  Primero, verifica si el usuario autenticado tiene el rol `Admin`. Si es así, se le otorga acceso inmediatamente (un administrador puede gestionar la personalización de cualquier agencia).
    2.  Si el usuario no es `Admin`, obtiene el `agencyId` de los parámetros de la URL de la solicitud.
    3.  Luego, utiliza el `AgencyService` (específicamente, el método `findOne`) para recuperar los detalles de la agencia, asegurándose de que la relación con su `user` (el propietario) esté cargada.
    4.  Finalmente, compara el `id` del usuario autenticado (`request.user.id`) con el `id` del propietario de la agencia (`agency.user.id`). Si coinciden, el acceso es permitido; de lo contrario, la solicitud es rechazada con un error `403 Forbidden`.
* **Aplicación**: Esencial para proteger los endpoints `POST` y `PATCH` de `customization`, asegurando que los agentes solo puedan configurar o actualizar la marca de sus propias agencias.