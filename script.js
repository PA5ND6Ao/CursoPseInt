// Toggle menú
document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('active');
});

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Botón scroll top
const scrollTop = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('show');
    } else {
        scrollTop.classList.remove('show');
    }
});
scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Procesar el formulario de inscripción
function procesarFormulario() {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const edad = parseInt(document.getElementById("edad").value);
    const lenguaje = document.getElementById("lenguaje").value;
    const horario = document.getElementById("horario").value;
    const modalidadSeleccionada = document.querySelector('input[name="modalidad"]:checked');
    const comentarios = document.getElementById("comentarios").value;

    if (nombre === "" || correo === "" || isNaN(edad) || lenguaje === "" || horario === "" || !modalidadSeleccionada) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    if (edad < 12) {
        alert("Debes tener al menos 12 años para inscribirte.");
        return;
    }

    let saludo;
    const hora = new Date().getHours();
    if (hora < 12) {
        saludo = "¡Buenos días!";
    } else if (hora < 18) {
        saludo = "¡Buenas tardes!";
    } else {
        saludo = "¡Buenas noches!";
    }

    const esMayorEdad = (edad >= 18) ? "Sí" : "No";

    let mensajeLenguaje;
    switch (lenguaje) {
        case "JavaScript":
            mensajeLenguaje = "¡Excelente elección para desarrollo web!";
            break;
        case "Python":
            mensajeLenguaje = "¡Ideal para inteligencia artificial y ciencia de datos!";
            break;
        case "C++":
            mensajeLenguaje = "¡Perfecto para videojuegos y sistemas!";
            break;
        case "Java":
            mensajeLenguaje = "¡Muy usado en empresas y aplicaciones móviles!";
            break;
        default:
            mensajeLenguaje = "Lenguaje no reconocido.";
    }

    const modalidad = modalidadSeleccionada.value;

    alert(`${saludo}\nGracias, ${nombre}, por inscribirte al curso.\nLenguaje elegido: ${lenguaje}\nModalidad: ${modalidad}\nHorario: ${horario}\n¿Mayor de edad?: ${esMayorEdad}\n${mensajeLenguaje}`);
}
