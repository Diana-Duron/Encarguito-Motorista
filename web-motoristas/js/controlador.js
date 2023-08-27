//arreglo de datos de los motoristas
var motoristas = [];

//arreglo de datos de las ordenes
var ordenes = [];

//funcion para verificar si el usuario (motorista) esta en el arreglo de motoristas
async function loginMotorista() {

    //se obtienen los datos de los motoristas
    let respuesta = await fetch('http://localhost:3000/motors');
    motoristas = await respuesta.json();
    console.log(motoristas);

    correo = document.getElementById("txtEmail").value;
    contrasena = document.getElementById("txtPsswrd").value;

    var registrado = false;
    var contrasenaerror = false;

    for (var i = 0; i < motoristas.length; i++) {
        if (motoristas[i].correo == correo && motoristas[i].contrasena == contrasena) {
            registrado = true;

            localStorage.setItem('motoristaActual', String(i+1));
            var motoristaActual = localStorage.getItem('motoristaActual');
            console.log(motoristaActual);

            break;
        }

        if (motoristas[i].correo == correo && motoristas[i].contrasena != contrasena) {
            contrasenaerror = true;
            break;
        }

        else {
            registrado = false;
        }
    }

    //si el usuario esta registrado, se muestra la pagina de ordenes
    if (registrado==true) {
        window.location.href = "ordenes.html";
    }
    if (registrado==false && contrasenaerror==false) {
        var html = `<div id="errorMotorista" class="card text-white bg-danger mb-3" style="max-width: 20rem;">
                <div class="card-header">Error</div>
                <div class="card-body">
                    <h5 class="card-title">Tu cuenta no existe o fue inhabilitada</h5>
                    <p class="card-text">Comuníquese con soporte técnico si cree que esto es un error +504 2233-4455</p>
                </div>
            </div>`;

        var fondoElemento = document.getElementById("logoformcontainer");
        fondoElemento.innerHTML = html;
    }

    if (contrasenaerror==true) {
        var html = `
        <div id="contrasenaerror2">CONTRASEÑA INCORRECTA</div>
      `;
        var fondoElemento = document.getElementById("contrasenaerror");
        fondoElemento.innerHTML = html;
    }
};

function ocultarSesion() {
    var fondoElemento = document.getElementById("logoformcontainer");
    fondoElemento.innerHTML = "";
    fondoElemento.style.display = 'none';
}

function mostrarSesion() {
    location.href = "motoristas.html";
}

function ocultarRegistro() {
    var fondoElemento = document.getElementById("formularioRegistro");
    fondoElemento.innerHTML = "";
    fondoElemento.style.display = 'none';
}

//funcion para mostrar formulario de registro de motorista
function mostrarFormularioRegistro() {

    var fondoElemento = document.getElementById("formularioRegistro");
    fondoElemento.style.display = 'block';
    
  var html = `<div class="container">
    <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 form-container">
        <h1>REGISTRO</h1>
            <br>
            <br>
            <form>
                <div class="form-group">
                    <label for="txtNombre">Nombre</label>
                    <input type="text" class="form-control" id="txtNombre" placeholder="Nombre">
                </div>
                <div class="form-group">
                    <label for="txtApellido">Apellido</label>
                    <input type="text" class="form-control" id="txtApellido" placeholder="Apellido">
                </div>
                <div class="form-group">
                    <label for="txtCorreo">Correo</label>
                    <input type="text" class="form-control" id="txtCorreo" placeholder="Correo">
                </div>
                <div class="form-group">
                    <label for="txtContrasena">Contraseña</label>
                    <input type="password" class="form-control" id="txtContrasena" placeholder="Contraseña">
                </div>
                <div id="botonRegistro">
                    <button type="button" class="btn-login" onclick="registrarMotorista()" href="">Registrarme</button>
                </div>
            </form>
        </div>
    </div>
</div>`;

  fondoElemento.innerHTML = html;
};

async function registrarMotorista() {

    motoristas = await fetch('http://localhost:3000/motors');
    motoristas = await motoristas.json();

    var id = motoristas.length + 1;
    var nombre = document.getElementById("txtNombre").value;
    var apellido = document.getElementById("txtApellido").value;
    var correo = document.getElementById("txtCorreo").value;
    var contrasena = document.getElementById("txtContrasena").value;
    var ordenesPendientes = [];


    resultado = await fetch('http://localhost:3000/motors', {
        method: 'POST',
        body: JSON.stringify({
            id: id,
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            contrasena: contrasena,
            ordenesPendientes: ordenesPendientes
        }),
        headers: {
            "Content-type": "application/json"
        },
    }).then(function (response) {
        if (response.ok) {
            console.log("Motorista registrado");
            mostrarSesion();
        }
        else {
            console.log("Error al registrar motorista");
        }
    });

}


//Ordenes


//funcion para ocultar la pagina de ordenes
function ocultarOrdenes() {
    var fondoElemento = document.getElementById("ordenesContainer");
    fondoElemento.innerHTML = "";
    fondoElemento.style.display = 'none';
}

//funcion para regresar a la pagina de ordenes sin recargar la pagina
function regresarOrdenes() {
    var html = `<div class="circle-container">
    <img src="img/logo.png" alt="Logo" class="logoOrdenes">
  </div>

<div class="button-container">
    <button onclick="mostrarOrdenesdisponibles()" class="order-button">
      <i class="fas fa-box"></i> Ordenes disponibles
    </button>
</div>

<div class="button-container">
    <button onclick="mostrarPendientes()" class="order-button">
        <i class="fas fa-truck"></i> Ordenes pendientes
    </button>
</div>

<div class="button-container">
    <button onclick="mostrarFinalizadas()" class="order-button">
        <i class="fas fa-list-ul"></i> Ordenes completadas
      </button>
</div>`
    var fondoElemento = document.getElementById("ordenesContainer");
    fondoElemento.innerHTML = html;
    var fondoElemento2 = document.getElementById("ordenesDisponibles");
    fondoElemento2.innerHTML = "";
    fondoElemento2.style.display = 'none';
    fondoElemento.style.display = 'block';
}

//funcion para mostrar las ordenes en la tabla
async function mostrarOrdenesdisponibles() {

    ordenes = await fetch('http://localhost:3000/ordenes');
    ordenes = await ordenes.json();


    var fondoElemento2 = document.getElementById("ordenesDisponibles");
    fondoElemento2.style.display = 'block';
    ocultarOrdenes();
    var html = `<div class="card-container">
    <div class="return-btn">
      <i class="fas fa-arrow-left" onclick="regresarOrdenes()"></i>
    </div>
    <h5>Ordenes Disponibles<\h5>
      `;
    for (var i = 0; i < ordenes.length; i++) {
        if (ordenes[i].estado == "Pendiente") {
        html += `<div class="card" id="cardOrdendisp">
        <div onclick="detallesOrden(${ordenes[i].id})" class="card-header">
          <h3>Orden #${ordenes[i].id}</h3>
        </div>
        <div class="card-body">
          <table>
            <tr>
              <td><strong>Nombre:</strong></td>
              <td>${ordenes[i].nombre} ${ordenes[i].apellido}</td>
            </tr>
            <tr>
              <td><strong>Teléfono:</strong></td>
              <td>${ordenes[i].telefono}</td>
            </tr>
            <tr>
              <td><strong>Descripción:</strong></td>
              <td>${ordenes[i].descripcion}</td>
            </tr>
            <tr>
              <td><strong>Dirección:</strong></td>
              <td>${ordenes[i].direccion}</td>
            </tr>
            <tr>
              <td><strong>Estado:</strong></td>
              <td>${ordenes[i].estado}</td>
            </tr>
            <tr>
              <td><strong>Fecha:</strong></td>
              <td>${ordenes[i].fecha}</td>
            </tr>
            <tr>
              <td><strong>Hora:</strong></td>
              <td>${ordenes[i].hora}</td>
            </tr>
            <tr>
              <td><strong>Motorista:</strong></td>
              <td>${ordenes[i].motorista}</td>
            </tr>
            <tr>
              <td colspan="2">
                <button type="button" class="btn-login" onclick="aceptarOrden(${ordenes[i].id})">Aceptar</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
      `;
        }
    }

    html += `
  </div>`;

    var fondoElemento = document.getElementById("ordenesDisponibles");
    fondoElemento.innerHTML = html;
}

//aceptar orden
async function aceptarOrden(id) {

    ordenes = await fetch('http://localhost:3000/ordenes');
    ordenes = await ordenes.json();

    motoristas = await fetch('http://localhost:3000/motors');
    motoristas = await motoristas.json();

    var orden = ordenes.find(function (orden) {
        return orden.id == id;
    });

    var motoristaActual = localStorage.getItem('motoristaActual');
    //convertir a entero
    motoristaActual = parseInt(motoristaActual);

    orden.estado = "En proceso";
    orden.motorista = motoristas.find(function (motorista) {
        return motorista.id == motoristaActual;
    }).nombre + " " + motoristas.find(function (motorista) {
        return motorista.id == motoristaActual
        }).apellido;

    mostrarOrdenesdisponibles();

    var html = ` <div class="floating-button">
    <button onclick="mostrarPendientes();">Órdenes Pendientes</button>
  </div>`;
    var fondoElemento = document.getElementById("ordenesDisponibles");
    fondoElemento.innerHTML += html;


    //actualizar orden en el servidor
   await fetch('http://localhost:3000/ordenes/' , {
        method: 'PUT',
        body: JSON.stringify({
            id: orden.id,
            nombre: orden.nombre,
            apellido: orden.apellido,
            telefono: orden.telefono,
            descripcion: orden.descripcion,
            direccion: orden.direccion,
            estado: orden.estado,
            fecha: orden.fecha,
            precio: orden.precio,
            hora: orden.hora,
            productos: orden.productos,
        }),
        headers: {
            "Content-type": "application/json"
        },
    }).then(function (response) {
        if (response.ok) {
            console.log("Orden actualizada");
        }
        else {
            console.log("Error al actualizar orden");
        }
    });

}

//funcion para mostrar las ordenes pendientes
async function mostrarPendientes() {

    ordenes = await fetch('http://localhost:3000/ordenes');
    ordenes = await ordenes.json();


    var fondoElemento2 = document.getElementById("ordenesDisponibles");
    fondoElemento2.style.display = 'block';
    ocultarOrdenes();
    var html = `<div class="card-container">
    <div class="return-btn">
      <i class="fas fa-arrow-left" onclick="regresarOrdenes()"></i>
    </div>
    <h5>Ordenes Pendientes<\h5>
      `;
    for (var i = 0; i < ordenes.length; i++) {
        if (ordenes[i].estado == "En proceso") {
        html += `<div class="card" id="cardOrdendisp">
        <div class="card-header" onclick="detallesOrden(${ordenes[i].id})">
          <h3>Orden #${ordenes[i].id}</h3>
        </div>
        <div class="card-body">
          <table>
            <tr>
              <td><strong>Nombre:</strong></td>
              <td>${ordenes[i].nombre} ${ordenes[i].apellido}</td>
            </tr>
            <tr>
              <td><strong>Teléfono:</strong></td>
              <td>${ordenes[i].telefono}</td>
            </tr>
            <tr>
              <td><strong>Descripción:</strong></td>
              <td>${ordenes[i].descripcion}</td>
            </tr>
            <tr>
              <td><strong>Dirección:</strong></td>
              <td>${ordenes[i].direccion}</td>
            </tr>
            <tr>
              <td><strong>Estado:</strong></td>
              <td>${ordenes[i].estado}</td>
            </tr>
            <tr>
              <td><strong>Fecha:</strong></td>
              <td>${ordenes[i].fecha}</td>
            </tr>
            <tr>
              <td><strong>Hora:</strong></td>
              <td>${ordenes[i].hora}</td>
            </tr>
            <tr>
              <td><strong>Motorista:</strong></td>
              <td>${ordenes[i].motorista}</td>
            </tr>
            <tr>
              <td colspan="2">
                <button type="button" class="btn-login" onclick="finalizarOrden(${ordenes[i].id})">Finalizar</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
      `;
        }
    }

    html += `
  </div>`;

    var fondoElemento = document.getElementById("ordenesDisponibles");
    fondoElemento.innerHTML = html;
}

//funcion para finalizar orden
async function finalizarOrden(id) {
  
    ordenes = await fetch('http://localhost:3000/ordenes');
    ordenes = await ordenes.json();

    var orden = ordenes.find(function (orden) {
        return orden.id == id;
    });

    orden.estado = "Finalizada";

    mostrarPendientes();

    var html = ` <div class="floating-button">
    <button onclick="mostrarFinalizadas();">Órdenes Finalizadas</button>
    </div>`;
    var fondoElemento = document.getElementById("ordenesDisponibles");
    fondoElemento.innerHTML += html;

    //actualizar orden en el servidor
    await fetch('http://localhost:3000/ordenes/' , {
        method: 'PUT',
        body: JSON.stringify({
            id: orden.id,
            nombre: orden.nombre,
            apellido: orden.apellido,
            telefono: orden.telefono,
            descripcion: orden.descripcion,
            direccion: orden.direccion,
            estado: orden.estado,
            fecha: orden.fecha,
            precio: orden.precio,
            hora: orden.hora,
            productos: orden.productos,
        }),
        headers: {
            "Content-type": "application/json"
        },
    }).then(function (response) {
        if (response.ok) {
            console.log("Orden actualizada");
        }
        else {
            console.log("Error al actualizar orden");
        }
    });

}

//funcion para mostrar las ordenes finalizadas
async function mostrarFinalizadas() {

    ordenes = await fetch('http://localhost:3000/ordenes');
    ordenes = await ordenes.json();


    var fondoElemento2 = document.getElementById("ordenesDisponibles");
    fondoElemento2.style.display = 'block';
    ocultarOrdenes();
    var html = `<div class="card-container">
    <div class="return-btn">
      <i class="fas fa-arrow-left" onclick="regresarOrdenes()"></i>
    </div>
    <h5>Ordenes Finalizadas<\h5>
      `;
    for (var i = 0; i < ordenes.length; i++) {
        if (ordenes[i].estado == "Finalizada") {
        html += `<div class="card" id="cardOrdendisp">
        <div class="card-header" onclick="detallesOrden(${ordenes[i].id})">
          <h3>Orden #${ordenes[i].id}</h3>
        </div>
        <div class="card-body">
          <table>
            <tr>
              <td><strong>Nombre:</strong></td>
              <td>${ordenes[i].nombre} ${ordenes[i].apellido}</td>
            </tr>
            <tr>
              <td><strong>Teléfono:</strong></td>
              <td>${ordenes[i].telefono}</td>
            </tr>
            <tr>
              <td><strong>Descripción:</strong></td>
              <td>${ordenes[i].descripcion}</td>
            </tr>
            <tr>
              <td><strong>Dirección:</strong></td>
              <td>${ordenes[i].direccion}</td>
            </tr>
            <tr>
              <td><strong>Estado:</strong></td>
              <td>${ordenes[i].estado}</td>
            </tr>
            <tr>
              <td><strong>Fecha:</strong></td>
              <td>${ordenes[i].fecha}</td>
            </tr>
            <tr>
              <td><strong>Hora:</strong></td>
              <td>${ordenes[i].hora}</td>
            </tr>
            <tr>
              <td><strong>Motorista:</strong></td>
              <td>${ordenes[i].motorista}</td>
            </tr>
          </table>
        </div>
      </div>
      `;
        }
    }

    html += `
  </div>`;

    var fondoElemento = document.getElementById("ordenesDisponibles");
    fondoElemento.innerHTML = html;
}

//funcion para mostrar los detalles de la orden
async function detallesOrden(id) {

    ordenes = await fetch('http://localhost:3000/ordenes');
    ordenes = await ordenes.json();


    ocultarOrdenes();
    var orden = ordenes.find(function (orden) {
        return orden.id == id;
    });

    var html = `<div class="card-container">
    <div class="return-btn">
      <i class="fas fa-arrow-left" onclick="regresarOrdenes()"></i>
    </div>
    <h5>Detalles de la Orden<\h5>
      `;
    html += `<div class="card" id="cardOrdendisp">
        <div class="card-header">
          <h3>Orden #${orden.id}</h3>
        </div>
        <div class="card-body">
          <table>
            <tr>
              <td><strong>Nombre:</strong></td>
              <td>${orden.nombre} ${orden.apellido}</td>
            </tr>
            <tr>
              <td><strong>Teléfono:</strong></td>
              <td>${orden.telefono}</td>
            </tr>
            <tr>
              <td><strong>Descripción:</strong></td>
              <td>${orden.descripcion}</td>
            </tr>
            <tr>
              <td><strong>Dirección:</strong></td>
              <td>${orden.direccion}</td>
            </tr>
            <tr>
              <td><strong>Estado:</strong></td>
              <td>${orden.estado}</td>
            </tr>
            <tr>
              <td><strong>Fecha:</strong></td>
              <td>${orden.fecha}</td>
            </tr>
            <tr>
              <td><strong>Hora:</strong></td>
              <td>${orden.hora}</td>
            </tr>
            <tr>
              <td><strong>Motorista:</strong></td>
              <td>${orden.motorista}</td>
            </tr>
          </table>
        </div>
      </div>
      `;

    html += `
  </div>`;

    var fondoElemento = document.getElementById("ordenesDisponibles");
    fondoElemento.innerHTML = html;
}
    