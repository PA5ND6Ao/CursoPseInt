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
// Función para procesar el formulario, generar el PDF y enviarlo por correo
async function procesarFormulario() {
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const edad = document.getElementById("edad").value;
  const lenguaje = document.getElementById("lenguaje").value;
  const nivel = document.getElementById("nivel").value;
  const trabajo = document.querySelector('input[name="trabajo"]:checked')?.value;
  const comentarios = document.getElementById("comentarios").value;

  // Verificar si los campos requeridos están completos
  if (!nombre || !correo || !edad || !lenguaje || !nivel || !trabajo) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Crear objeto con los datos del formulario
  const formData = {
    nombre,
    correo,
    edad,
    lenguaje,
    nivel,
    trabajo,
    comentarios
  };

  // Generar el PDF con los datos del formulario
  try {
    const pdfData = await generatePDF(formData); // Llamamos a la función de generar el PDF

    // Descargar el PDF
    pdfData.pdf.save(pdfData.filename);  // El PDF se descargará con este nombre

    // Enviar el PDF por correo electrónico
    await sendEmailWithPDF(formData, pdfData);
    alert("¡Formulario enviado y correo con PDF adjunto enviado correctamente!");

  } catch (error) {
    console.error("Error en el proceso de inscripción o envío de correo: ", error);
    alert("Hubo un error al procesar tu inscripción.");
  }

  // Resetear el formulario
  document.getElementById("formulario").reset();
}

// Función para enviar el correo con el PDF adjunto
async function sendEmailWithPDF(formData, pdfData) {
  if (!emailConfig.serviceId || !emailConfig.templateId || !emailConfig.destinationEmail) {
    throw new Error('Configuración de email incompleta');
  }

  const emailParams = {
    to_email: formData.correo,  // Enviar al correo que el usuario proporcionó
    from_name: formData.nombre,
    from_email: formData.correo,
    subject: 'Nueva inscripción al curso de programación',
    message: `
      Nueva inscripción recibida para el curso de programación:

      Nombre: ${formData.nombre}
      Correo: ${formData.correo}
      Edad: ${formData.edad}
      Lenguaje favorito: ${formData.lenguaje}
      Nivel de experiencia: ${formData.nivel}
      Preferencia de trabajo: ${formData.trabajo}
      Comentarios: ${formData.comentarios}

      Adjunto se encuentra el PDF con los detalles de la inscripción.
    `,
    attachment: {
      filename: pdfData.filename,
      content: pdfData.base64,
      encoding: 'base64'
    }
  };

  // Enviar el correo utilizando EmailJS
  emailjs.send(emailConfig.serviceId, emailConfig.templateId, emailParams)
    .then(function(response) {
      console.log('Email enviado correctamente:', response);
    })
    .catch(function(error) {
      throw new Error('Error al enviar el email: ' + error.text);
    });
}

// Función para generar el PDF
async function generatePDF(formData) {
  const { jsPDF } = window.jspdf;

  // Crear un nuevo documento PDF
  const doc = new jsPDF();

  doc.text("Formulario de Inscripción", 20, 20);
  doc.text(`Nombre: ${formData.nombre}`, 20, 30);
  doc.text(`Correo: ${formData.correo}`, 20, 40);
  doc.text(`Edad: ${formData.edad}`, 20, 50);
  doc.text(`Lenguaje de Programación: ${formData.lenguaje || 'No especificado'}`, 20, 60);
  doc.text(`Nivel de experiencia: ${formData.nivel || 'No especificado'}`, 20, 70);
  doc.text(`Preferencia de trabajo: ${formData.trabajo || 'No especificado'}`, 20, 80);
  doc.text(`Comentarios: ${formData.comentarios || 'No se proporcionó información adicional'}`, 20, 90);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 100);

  // Guardar el PDF como un archivo que se descargará
  const filename = `inscripcion_${formData.nombre.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(filename);

  // Convertir el PDF a base64 para enviarlo por correo
  const pdfBase64 = doc.output('datauristring').split(',')[1];

  return {
    pdf: doc,
    base64: pdfBase64,
    filename: filename
  };
}


