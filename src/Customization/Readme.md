# Customization

...

## 🚀 Funcionalidades Clave

### 🎨 Gestión de Personalización por Agencia (Customization)

La funcionalidad de Customization permite a cada agencia que utiliza la plataforma definir su propia identidad visual y ciertos aspectos de información, asegurando una experiencia de usuario única y con la marca de cada cliente.

**Historias de Usuario Agente en Customization:**

* **Configuración Inicial de Branding:**
    * Como un **Agente (Utilizando Customization)**, puedo **asignar los colores y el logo de la marca** a una nueva agencia. Esto permite que cada agencia tenga una identidad visual única desde el momento en que se integra a la plataforma. El sistema utiliza los `mainColors`, `navbarColor`, `buttonColor`, `backgroundColor`, `secondaryColor` definidos, así como el `logoImage` y el `banner` proporcionados.

* **Actualización de la Identidad Visual:**
    * Como un **Agente (Utilizando Customization)**, puedo **modificar la configuración de personalización de la agencia**. Esto es crucial para actualizar el logo, los colores o la información de contacto cuando la marca de la agencia evoluciona, asegurando que la plataforma siempre refleje la identidad más actual.

* **Experiencia de Usuario Personalizada:**
    * Como un **Usuario Final** que interactúa con una agencia específica, experimentaré una **interfaz de usuario que refleje la marca de esa agencia**. Esto crea una experiencia más cohesiva, profesional y personalizada, donde cada agencia se siente como un entorno propio dentro de la plataforma.

**Endpoints Principales:**

* `POST /agencies/:agencyId/customization`: Crea la configuración de personalización para una agencia.
* `GET /agencies/:agencyId/customization`: Recupera la configuración de personalización de una agencia.
* `PATCH /agencies/:agencyId/customization`: Actualiza la configuración de personalización de una agencia.

…

