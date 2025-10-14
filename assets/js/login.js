document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    const btnLogin = document.getElementById('btn-login');
    const btnRegistro = document.getElementById('btn-registro');
    const mostrarRegistro = document.getElementById('mostrar-registro');
    const mostrarLogin = document.getElementById('mostrar-login');
    
    // Inputs
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const registroNombre = document.getElementById('registro-nombre');
    const registroEmail = document.getElementById('registro-email');
    const registroPassword = document.getElementById('registro-password');
    const registroPassword2 = document.getElementById('registro-password2');
    
    // Cambiar entre Login y Registro
    mostrarRegistro.addEventListener('click', function(e) {
        e.preventDefault();
        formLogin.classList.remove('activo');
        formRegistro.classList.add('activo');
    });
    
    mostrarLogin.addEventListener('click', function(e) {
        e.preventDefault();
        formRegistro.classList.remove('activo');
        formLogin.classList.add('activo');
    });
    
    // REGISTRO
    btnRegistro.addEventListener('click', function() {
        const nombre = registroNombre.value.trim();
        const email = registroEmail.value.trim();
        const password = registroPassword.value;
        const password2 = registroPassword2.value;
        
        // Validaciones
        if (!nombre || !email || !password || !password2) {
            alert('⚠️ Por favor completa todos los campos');
            return;
        }
        
        if (!validarEmail(email)) {
            alert('⚠️ Por favor ingresa un correo válido');
            return;
        }
        
        if (password.length < 6) {
            alert('⚠️ La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        if (password !== password2) {
            alert('⚠️ Las contraseñas no coinciden');
            return;
        }
        
        // Verificar si el usuario ya existe
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioExiste = usuarios.find(u => u.email === email);
        
        if (usuarioExiste) {
            alert('⚠️ Este correo ya está registrado');
            return;
        }
        
        // Crear nuevo usuario
        const nuevoUsuario = {
            nombre: nombre,
            email: email,
            password: password, // En producción NUNCA guardes passwords en texto plano
            fechaRegistro: new Date().toISOString()
        };
        
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        alert('✅ ¡Cuenta creada exitosamente! Ya puedes iniciar sesión');
        
        // Limpiar formulario y cambiar a login
        registroNombre.value = '';
        registroEmail.value = '';
        registroPassword.value = '';
        registroPassword2.value = '';
        formRegistro.classList.remove('activo');
        formLogin.classList.add('activo');
    });
    
    // LOGIN
    btnLogin.addEventListener('click', function() {
        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        
        if (!email || !password) {
            alert('⚠️ Por favor completa todos los campos');
            return;
        }
        
        // Buscar usuario
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(u => u.email === email && u.password === password);
        
        if (!usuario) {
            alert('❌ Correo o contraseña incorrectos');
            return;
        }
        
        // Guardar sesión
        localStorage.setItem('usuarioActual', JSON.stringify({
            nombre: usuario.nombre,
            email: usuario.email
        }));
        
        alert('✅ ¡Bienvenido ' + usuario.nombre + '!');
        
        // Redirigir al calendario
        window.location.href = 'index.html';
    });
    
    // Función para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
});
   