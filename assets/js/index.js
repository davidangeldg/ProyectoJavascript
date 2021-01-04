
const contenedorProductos = document.querySelector('#container_productos');
const items = document.querySelector('#items');
const footer = document.querySelector('#footer-carrito');
const vaciarCarrito = document.querySelector('#vaciar-carrito');

let carrito = {};


// setTimeout(() => {
//     const resultado = Database
// }, 2000);


// const BaseDatos = [
//     {
//         "id":1,
//         "nombre":"Camiseta",
//         "title":"Blanca",
//         "precio":35000,
//         "color":"blanco",
//         "imagen": "assets/img/camiseta_blanca.png"
//     },
//     {
//         "id":2,
//         "nombre":"Camiseta",
//         "title":"Negra",
//         "precio":35000,
//         "color":"negro",
//         "imagen": "assets/img/camiseta_negra.png"
//     },
//     {
//         "id":3,
//         "nombre":"Camiseta",
//         "title":"Blanca",
//         "precio":35000,
//         "color":"blanco",
//         "imagen": "assets/img/camiseta_blanca.png"
//     },
//     {
//         "id":4,
//         "nombre":"Gorra",
//         "title":"Negra",
//         "precio":20000,
//         "color":"negro",
//         "imagen": "assets/img/gorra_negra.png"
//     },
//     {
//         "id":5,
//         "nombre":"Gorra",
//         "title": "Negro-blanco",
//         "precio":20000,
//         "color":"negro-blanco",
//         "imagen": "assets/img/gorra_negra.png"
//     },
//     {
//         "id":6,
//         "nombre":"Gorra",
//         "title": "Negro-blanco",
//         "precio":20000,
//         "color":"negro-blanco",
//         "imagen": "assets/img/gorra_negra.png"
//     }
// ];

// document.addEventListener('DOMContentLoaded', () => { obtenerProductos() });
document.addEventListener('DOMContentLoaded', () => { 
    carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    pintarCarrito();
});


// const obtenerProductos =  () => {
//         const data = resultado;
//         console.log(data);
//         pintarPoductos(data);
//         identificarBotones(data);
// };

const pintarPoductos = (data) => {
    const template = document.querySelector('#template-camisetas').content;
    const fragment = document.createDocumentFragment();
    // console.log(template)
    data.forEach(producto => {
        // console.log(producto);
        template.querySelector('.product-img').setAttribute('src', producto.imagen);
        template.querySelector('.product-title').textContent = producto.nombre;
        template.querySelector('.negrita').textContent = producto.title;
        template.querySelector('.precio').textContent = producto.precio;
        template.querySelector('button').dataset.id = producto.id;

        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    contenedorProductos.appendChild(fragment);
};

const identificarBotones = (data) => {
    const botones = document.querySelectorAll('.container_tarjeta button') 
    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const producto = data.find (item => item.id === parseInt(btn.dataset.id));
            producto.cantidad = 1;
            if(carrito.hasOwnProperty(producto.id)) {
                producto.cantidad = carrito[producto.id].cantidad + 1
            };
            carrito[producto.id] = { ...producto };
            // console.log(carrito);
            pintarCarrito();

        } )
    });
};

const pintarCarrito = ()=> {

    items.innerHTML = '';

    const template = document.querySelector('#template-carrito').content;
    const fragment = document.createDocumentFragment();
    
    Object.values(carrito).forEach(producto => {
        // console.log(producto);
        template.querySelector('.imagen').setAttribute('src', producto.imagen);
        template.querySelector('.product-title').textContent = producto.nombre;
        template.querySelector('.negrita').textContent = producto.title;
        template.querySelector('span').textContent = producto.precio * producto.cantidad;
        template.querySelectorAll('td')[3].textContent = producto.cantidad;

        // botones + y -
        template.querySelector('.mas').dataset.id = producto.id;
        template.querySelector('.menos').dataset.id = producto.id;

        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    pintarFooter();
    accionBotones();
    guardarStorage();
    
};

const pintarFooter = () => {

    footer.innerHTML = '';
    
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = '<td colspan="5"><p>Carrito vacio</p> </td>';
        return;
    };

    const template = document.querySelector('#template-footer').content;
    const fragment = document.createDocumentFragment();

    const Xcantidad = Object.values(carrito).reduce((a,{cantidad}) => a + cantidad, 0);
    const totalPesos = Object.values(carrito).reduce((a,{cantidad, precio}) => a + cantidad * precio, 0);
    
    
    template.querySelector('span').textContent = totalPesos;
    template.querySelectorAll('td')[1].textContent = Xcantidad;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);

    footer.appendChild(fragment);

}
   
vaciarCarrito.addEventListener('click', () => {
        carrito = {};
        pintarCarrito();
});

const accionBotones = () => {
    const botonAgregar = document.querySelectorAll('#items .mas');
    const botonEliminar = document.querySelectorAll('#items .menos');

    botonAgregar.forEach(btn => {
        btn.addEventListener('click', ()=> {
            const producto = carrito[btn.dataset.id];
            producto.cantidad ++;
            carrito[btn.dataset.id] = {...producto};
            pintarCarrito();
        })
    })

    botonEliminar.forEach(btn => {
        btn.addEventListener('click', ()=> {
            const producto = carrito[btn.dataset.id];
            producto.cantidad --;
            if(producto.cantidad === 0) {
                delete carrito[btn.dataset.id];
            }else{
            carrito[btn.dataset.id] = {...producto};
            }
            pintarCarrito();
        })
    })
};

function guardarStorage () {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

/* JQUERY */

$(function () {
    $('#seccionTienda').on('click', function (e) {
		e.preventDefault();

		$('html, body').animate({
            scrollTop: $("#tienda").offset().top  
        }, 2000);
    });
    $('#seccionContacto').on('click', function (e) {
		e.preventDefault();

		$('html, body').animate({
            scrollTop: $("#contacto").offset().top  
        }, 2000);
    });
    $('#irArriba').on('click', function (e) {
		e.preventDefault();

		$('html, body').animate({
            scrollTop: $("div.header__contenido__logo").offset().top  
        }, 1000);
        console.log('hice click');
    });
    /* obteniendo productos mediante ajax */
    $.ajax({
		url: 'assets/json/api.json',
		success: function (data) {     
            // console.log(data);
            pintarPoductos(data);
            identificarBotones(data);
		},
		error: function (xhr, status, errorThrown) {
			console.log(xhr)
			console.log(status)
			console.log(errorThrown)

		}
    });
})
