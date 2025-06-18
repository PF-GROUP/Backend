Módulo typeof-property
Este módulo fundamental se encarga de la administración de los tipos de propiedades disponibles en el sistema (ej., "Casa", "Departamento", "Terreno"). Actúa como una tabla de catálogo o referencia, asegurando la consistencia y la integridad de los datos de tipos de propiedades en toda la aplicación.

🎯 ¿Qué hace este módulo?
El propósito principal de este módulo es ofrecer operaciones CRUD para los tipos de propiedades, permitiendo:

Crear nuevos tipos.
Leer (recuperar todos o uno específico por ID) los tipos existentes.
Actualizar la información de tipos ya registrados.
Importante: Este módulo no implementa una funcionalidad de eliminación para los tipos de propiedades, ya que se consideran datos de catálogo esenciales y estables que no deberían ser removidos del sistema.

📄 Métodos Implementados
El módulo expone los siguientes métodos a través de su controlador y servicio:

create: Permite registrar un nuevo tipo de propiedad.
findAll: Recupera todos los tipos de propiedades activos.
findOne: Obtiene los detalles de un tipo de propiedad específico por su identificador único (ID).
update: Actualiza la información de un tipo de propiedad existente.