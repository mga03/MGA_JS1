// Array para almacenar los usuarios
let usuarios = [];

// Contador de IDs únicos para cada usuario
let idCounter = 1;

// Estado actual del orden para la tabla de usuarios
let ordenActual = { campo: 'id', ascendente: true };

// Función para calcular la edad del usuario a partir de su fecha de nacimiento
function calcularEdad(fechaNacimiento) {
	const hoy = new Date(); // Fecha actual
	const fechaNac = new Date(fechaNacimiento); // Fecha ingresada
	let edad = hoy.getFullYear() - fechaNac.getFullYear();
	const mes = hoy.getMonth() - fechaNac.getMonth();

	// Ajuste si la fecha actual es anterior al cumpleaños de este año
	if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
		edad--;
	}
	return edad;
}

// Función para agregar un usuario a la lista
function agregarUsuario() {
	const nombre = document.getElementById('nombre').value.trim();
	const fechaNacimiento = document.getElementById('fechaNacimiento').value;

	// Validación: Verificar que todos los campos estén completos
	if (!nombre || !fechaNacimiento) {
		alert("Por favor, complete todos los campos.");
		return;
	}

	// Validación: El nombre debe contener al menos 3 letras sin números ni caracteres especiales
	if (!/^[A-Za-z]{3,}$/.test(nombre)) {
		alert("El nombre debe tener al menos 3 letras y no contener números o caracteres especiales.");
		return;
	}

	// Calcular edad y validar que no sea una fecha futura
	const edad = calcularEdad(fechaNacimiento);
	if (edad < 0) {
		alert("La fecha de nacimiento no puede ser posterior a hoy.");
		return;
	}

	// Crear objeto del usuario y agregarlo al array
	const usuario = { id: idCounter++, nombre, edad, tareas: [] };
	usuarios.push(usuario);
	mostrarUsuarios();

	// Limpiar los campos del formulario
	document.getElementById('nombre').value = "";
	document.getElementById('fechaNacimiento').value = "";
}

// Función para asignar una tarea a un usuario específico
function asignarTarea() {
	const usuarioId = document.getElementById('usuarioId').value.trim();
	const descripcion = document.getElementById('tarea').value.trim();

	// Validar que los campos estén completos
	if (!usuarioId || !descripcion) {
		alert("Por favor, complete ambos campos.");
		return;
	}

	// Buscar usuario por ID o nombre
	const usuario = usuarios.find(u => u.id == usuarioId || u.nombre.toLowerCase() === usuarioId.toLowerCase());

	// Validación: Usuario encontrado o que tenga al menos 18 años
	if (!usuario) {
		alert("Usuario no encontrado.");
		return;
	}

	if (usuario.edad < 18) {
		alert("No se pueden asignar tareas a usuarios menores de 18 años.");
		return;
	}

	// Agregar tarea al usuario y mostrar la lista actualizada
	usuario.tareas.push({ descripcion, estado: "Incompleta" });
	mostrarUsuarios();

	// Limpiar los campos del formulario
	document.getElementById('usuarioId').value = "";
	document.getElementById('tarea').value = "";
}

// Función para mostrar los usuarios en la tabla HTML
function mostrarUsuarios() {
	const tabla = document.getElementById("tablaUsuarios");
	tabla.innerHTML = ""; // Limpiar la tabla antes de actualizarla

	usuarios.forEach(usuario => {
		const fila = document.createElement("tr");

		// Crear una lista de tareas con botones para cambiar el estado
		const tareasHtml = usuario.tareas.map((tarea, index) => `
            <div>
                <span>${tarea.descripcion} - ${tarea.estado}</span>
                <button onclick="cambiarEstadoTarea(${usuario.id}, ${index})">Cambiar Estado</button>
            </div>
        `).join("");

		// Insertar datos del usuario en la fila de la tabla
		fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.edad}</td>
            <td>${tareasHtml || "Sin tareas"}</td>
            <td><button onclick="eliminarUsuario(${usuario.id})">Eliminar</button></td>
        `;
		tabla.appendChild(fila); // Agregar la fila a la tabla
	});
}

// Función para eliminar un usuario de la lista
function eliminarUsuario(id) {
	const usuario = usuarios.find(u => u.id === id);

	// Confirmar la eliminación pidiendo que se escriba "borrar"
	if (usuario) {
		const confirmacion = prompt(`Para eliminar al usuario "${usuario.nombre}", escribe "borrar"`);

		if (confirmacion && confirmacion.toLowerCase() === "borrar") {
			usuarios = usuarios.filter(u => u.id !== id);
			mostrarUsuarios();
			alert(`Usuario "${usuario.nombre}" eliminado correctamente.`);
		}
	}
}

// Función para cambiar el estado de una tarea (Completa/Incompleta)
function cambiarEstadoTarea(userId, tareaIndex) {
	const usuario = usuarios.find(u => u.id === userId);

	if (usuario) {
		const tarea = usuario.tareas[tareaIndex];
		// Cambiar estado de la tarea
		tarea.estado = tarea.estado === "Incompleta" ? "Completa" : "Incompleta";
		mostrarUsuarios();
	}
}

// Función para ordenar la tabla de usuarios
function ordenarUsuarios(campo) {
	// Si se hace clic en la misma columna se  invierte el orden
	if (ordenActual.campo === campo) {
		ordenActual.ascendente = !ordenActual.ascendente;
	} else {
		// Si se hace clic en otra columna, ordena de manera ascendente
		ordenActual.campo = campo;
		ordenActual.ascendente = true;
	}

	// Ordenar el array de usuarios basado en el campo seleccionado
	usuarios.sort((a, b) => {
		if (a[campo] < b[campo]) return ordenActual.ascendente ? -1 : 1;
		if (a[campo] > b[campo]) return ordenActual.ascendente ? 1 : -1;
		return 0;
	});

	mostrarUsuarios(); // Mostrar la lista ordenada
}
