// Esperar a que cargue toda la página
document.addEventListener('DOMContentLoaded', function() {
    
    // Seleccionar elementos
    const selectorMes = document.getElementById('selector-mes');
    const selectorAno = document.getElementById('selector-ano');
    const cuadriculaDias = document.getElementById('cuadricula-dias');
    const formularioNota = document.getElementById('formulario-nota');
    const tituloNota = document.getElementById('titulo-nota');
    const textoNota = document.getElementById('texto-nota');
    const subirImagen = document.getElementById('subir-imagen');
    const subirVideo = document.getElementById('subir-video');
    const botonGuardar = document.getElementById('guardar-nota');
    const notasGuardadas = document.getElementById('notas-guardadas');
    
    let mesActual = 9; // Octubre (0 = Enero)
    let anoActual = 2025;
    let diaSeleccionado = null;
    let imagenURL = null;
    let videoURL = null;
    
    // Objeto para guardar notas: formato "año-mes-dia": [notas]
    let notasPorDia = {};
    
    // Generar el calendario al cargar
    generarCalendario(mesActual, anoActual);
    
    // Cuando cambias el mes
    selectorMes.addEventListener('change', function() {
        mesActual = parseInt(this.value);
        generarCalendario(mesActual, anoActual);
    });
    
    // Cuando cambias el año
    selectorAno.addEventListener('change', function() {
        anoActual = parseInt(this.value);
        generarCalendario(mesActual, anoActual);
    });
    
    // Función para generar el calendario
    function generarCalendario(mes, ano) {
        cuadriculaDias.innerHTML = '';
        
        // Obtener primer día del mes y total de días
        const primerDia = new Date(ano, mes, 1).getDay();
        const diasEnMes = new Date(ano, mes + 1, 0).getDate();
        
        // Ajustar para que Lunes sea el primer día (0)
        const ajustePrimerDia = primerDia === 0 ? 6 : primerDia - 1;
        
        // Agregar espacios vacíos antes del primer día
        for (let i = 0; i < ajustePrimerDia; i++) {
            const espacioVacio = document.createElement('div');
            espacioVacio.className = 'dia-vacio';
            cuadriculaDias.appendChild(espacioVacio);
        }
        
        // Agregar los días del mes
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const diaDiv = document.createElement('div');
            diaDiv.className = 'dia';
            diaDiv.textContent = dia;
            
            // Verificar si este día tiene notas
            const claveNota = `${ano}-${mes}-${dia}`;
            if (notasPorDia[claveNota] && notasPorDia[claveNota].length > 0) {
                diaDiv.classList.add('tiene-nota');
            }
            
            // Agregar evento click
            diaDiv.addEventListener('click', function() {
                seleccionarDia(dia, mes, ano, this);
            });
            
            cuadriculaDias.appendChild(diaDiv);
        }
    }
    
    // Función cuando seleccionas un día
    function seleccionarDia(dia, mes, ano, elemento) {
        // Remover selección anterior
        document.querySelectorAll('.dia').forEach(d => d.classList.remove('seleccionado'));
        elemento.classList.add('seleccionado');
        
        diaSeleccionado = `${ano}-${mes}-${dia}`;
        
        const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                             'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        tituloNota.textContent = `Nota para ${dia} de ${nombresMeses[mes]} ${ano}`;
        formularioNota.style.display = 'block';
        
        // Limpiar el formulario
        textoNota.value = '';
        imagenURL = null;
        videoURL = null;
        subirImagen.value = '';
        subirVideo.value = '';
        
        // Mostrar notas existentes de este día
        mostrarNotasDelDia(diaSeleccionado);
    }
    
    // Cuando subes una imagen
    subirImagen.addEventListener('change', function(e) {
        const archivo = e.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagenURL = event.target.result;
                alert('✅ Imagen cargada');
            };
            reader.readAsDataURL(archivo);
        }
    });
    
    // Cuando subes un video
    subirVideo.addEventListener('change', function(e) {
        const archivo = e.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = function(event) {
                videoURL = event.target.result;
                alert('✅ Video cargado');
            };
            reader.readAsDataURL(archivo);
        }
    });
    
    // Cuando haces click en Guardar
    botonGuardar.addEventListener('click', function() {
        const texto = textoNota.value;
        
        if (!texto && !imagenURL && !videoURL) {
            alert('⚠️ Escribe algo o agrega una imagen/video');
            return;
        }
        
        // Si no existe array para este día, crearlo
        if (!notasPorDia[diaSeleccionado]) {
            notasPorDia[diaSeleccionado] = [];
        }
        
        // Crear y guardar la nota
        const nota = {
            texto: texto,
            imagen: imagenURL,
            video: videoURL
        };
        
        notasPorDia[diaSeleccionado].push(nota);
        
        alert('✅ Nota guardada');
        
        // Limpiar formulario
        textoNota.value = '';
        imagenURL = null;
        videoURL = null;
        subirImagen.value = '';
        subirVideo.value = '';
        
        // Actualizar indicador visual en el calendario
        generarCalendario(mesActual, anoActual);
        
        // Mostrar las notas actualizadas
        mostrarNotasDelDia(diaSeleccionado);
    });
    
    // Función para mostrar notas de un día
    function mostrarNotasDelDia(claveNota) {
        notasGuardadas.innerHTML = '';
        
        if (!notasPorDia[claveNota] || notasPorDia[claveNota].length === 0) {
            notasGuardadas.innerHTML = '<p style="color: #999; margin-top: 20px;">No hay notas guardadas para este día</p>';
            return;
        }
        
        notasGuardadas.innerHTML = '<h3 style="margin-top: 30px; color: #333;">📝 Notas guardadas:</h3>';
        
        notasPorDia[claveNota].forEach(function(nota) {
            const notaDiv = document.createElement('div');
            notaDiv.className = 'nota-item';
            
            if (nota.texto) {
                const textoP = document.createElement('p');
                textoP.className = 'nota-texto';
                textoP.textContent = nota.texto;
                notaDiv.appendChild(textoP);
            }
            
            const mediaDiv = document.createElement('div');
            mediaDiv.className = 'nota-media';
            
            if (nota.imagen) {
                const img = document.createElement('img');
                img.src = nota.imagen;
                img.alt = 'Imagen de nota';
                mediaDiv.appendChild(img);
            }
            
            if (nota.video) {
                const video = document.createElement('video');
                video.src = nota.video;
                video.controls = true;
                mediaDiv.appendChild(video);
            }
            
            notaDiv.appendChild(mediaDiv);
            notasGuardadas.appendChild(notaDiv);
        });
    }
    
});