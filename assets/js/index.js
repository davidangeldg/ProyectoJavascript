
const contenedorProductos = document.querySelector('#container_productos');
const items = document.querySelector('#items');
const footer = document.querySelector('#footer-carrito');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const carrritoNotificacion = document.querySelector('#cart_menu_num');

let carrito = {};

document.addEventListener('DOMContentLoaded', () => { obtenerProductos() });

document.addEventListener('DOMContentLoaded', () => { 
    carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    pintarCarrito();
});

const obtenerProductos = async () => {
    try {
        const res = await fetch('assets/json/api.json');
        const data = await res.json(); //con await espero a que el documento me tome la api
        // console.log(data);
        pintarPoductos(data);
        identificarBotones(data);
    } catch (error) {
        console.log (error);
    }
};


//pinto productos obteniendo la info de la variable data
const pintarPoductos = (data) => {
    /*hago el llamado al template desde html */
    const template = document.querySelector('#template-camisetas').content;
    const fragment = document.createDocumentFragment();

    data.forEach(producto => {
        /*recorro el array data para poder ir pintando los datos */
        // console.log(producto);
        let moneda = producto.precio;
        const formatoPrecio = new Intl.NumberFormat().format(moneda);
        
        template.querySelector('.product-img').setAttribute('src', producto.imagen);
        template.querySelector('.product-title').textContent = producto.nombre;
        template.querySelector('.negrita').textContent = producto.title;
        template.querySelector('.product-caption').textContent = producto.estilo;
        template.querySelector('.precio').textContent = formatoPrecio;
        template.querySelector('button').dataset.id = producto.id;
        //doy "el permiso" para que el appendclhild funcione
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
            Toastify({

                text: "Producto agregado",
                
                duration: 2000
                
                }).showToast();
        } )
    });
};

const pintarCarrito = ()=> {

    items.innerHTML = '';

    const template = document.querySelector('#template-carrito').content;
    const fragment = document.createDocumentFragment();
    
    Object.values(carrito).forEach(producto => {
        // console.log(producto);
        let monedaCarrito = producto.precio * producto.cantidad; /* obteniendo valor de perico x cantidad */
        template.querySelector('.imagen').setAttribute('src', producto.imagen);
        template.querySelector('.product-title').textContent = producto.nombre;
        template.querySelector('.negrita').textContent = producto.title;
        // template.querySelector('span').textContent = formatoPrecio * producto.cantidad;
        template.querySelector('span').textContent = new Intl.NumberFormat().format(monedaCarrito); /* Separador decimales */
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
    pintarNotificación();
};

const pintarFooter = () => {

    footer.innerHTML = '';
    
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = '<td colspan="5"><p>Carrito vacio</p></td>';
        return;
    };
    //separador miles footer carrito
    let monedaFooter = Object.values(carrito).reduce((a,{cantidad, precio}) => a + cantidad * precio, 0);
    const formatoPrecioFooter = new Intl.NumberFormat().format(monedaFooter);

    const template = document.querySelector('#template-footer').content;
    const fragment = document.createDocumentFragment();

    const Xcantidad = Object.values(carrito).reduce((a,{cantidad}) => a + cantidad, 0);
    const totalPesos = formatoPrecioFooter;
    
    
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
/* dandole funcionalidad a los botones */
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

function pintarNotificación () {
    const templateNumero = document.querySelector('#cart_menu_num p');
    const fragment = document.createDocumentFragment();
    // console.log(templateNumero)
    const Xcantidad1 = Object.values(JSON.parse(localStorage.getItem('carrito'))).length;
    // console.log(Xcantidad1)

    if (Xcantidad1 === 0){
        document.querySelector('#cart_menu_num').style.display = 'none';
    } else {
        document.querySelector('#cart_menu_num').style.display = 'block';
        templateNumero.textContent = Xcantidad1;
        templateNumero.appendChild(fragment);
    }
};


/* JQUERY */

$(function () {
    //animacion carrito
    $('#carrito').hide();
    $(".submenu").hover(
        function () {
            $('#carrito').slideDown('slow');
            $('#carrito').addClass("desplegar");
        },
        function () {
            $('#carrito').hide();
            $('#carrito').removeClass("desplegar");
        }
    );

    //funcion de llevar a los links
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
    //boton ir arriba
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#irArriba').fadeIn('slow');
        } else {
            $('#irArriba').fadeOut('slow');
        }
    });
    $('#irArriba').on('click', function (e) {
        e.preventDefault();
        
		$('html, body').animate({
            scrollTop: $("div.header__contenido__logo").offset().top  
        }, 1000);
    });


    /* toast notification */
    $('.tst').on('click', function (){
        Toastify({

            text: 'Producto agregado',
            duration: 1000,
            
            }).showToast();
    });
})
