import Venta from "../models/Venta.js";
import Producto from "../models/Producto.js";

/* Funciones */

const getProductoStock = (producto, cantidad) => new Promise( (resolve, reject) => {

    if (producto) {
        // console.log("****************");
        // console.log("Nombre: " , producto.nombre);
        // console.log("Stoct: " , producto.stock);
        // console.log("Cantidad solicitada: " , cantidad);
        // console.log("Saldo: ", producto.stock - cantidad);
        if(producto.stock === 0){
            //console.log(`No hay stock del Producto ${producto.nombre}`);
            resolve({
                msg: `No hay stock del Producto ${producto.nombre}`,
                precio: producto.precio,
                cantidad,
                subtotal: producto.precio * 0, 
                cantidadStock: 0,
                cantidadVenta: 0,
                estado: false
            });
        }else{
            if((producto.stock - cantidad) < 0){
                //console.log(`La cantidad solicitada no la hay, solo le vendemos ${producto.stock} `);
                resolve({
                    msg: `La cantidad solicitada no la hay, solo le vendemos ${producto.stock} `,
                    precio: producto.precio,
                    cantidad,
                    subtotal: producto.precio * (producto.stock), 
                    cantidadStock: 0,
                    cantidadVenta: (producto.stock),
                    estado: true
                });
                //await producto.save();
            }else{
                //console.log(`Venta registrada del  ${producto.nombre} - cantidad ${cantidad}`);
                resolve({
                    msg: `Venta registrada del  ${producto.nombre} - cantidad ${cantidad}`,
                    precio: producto.precio,
                    cantidad,
                    subtotal: producto.precio * cantidad, 
                    cantidadStock: (producto.stock - cantidad),
                    cantidadVenta: cantidad,
                    estado: true
                });
                //await producto.save();
            }
        };
    }else{
        reject('No se pudo aplicar el descuento del stock del articulo');
    };

});

const getProducto = async (element, id, cantidad) =>{
   try {
        const producto = await Producto.findById(id);

        setTimeout(()=>{
        getProductoStock(producto, cantidad)
        .then( (resultado) =>{
            // console.log(`El resultado es: ${resultado.msg}`);
            // console.log(`El resultado es: ${resultado.cantidad}`);
            // console.log(`El resultado es: ${resultado.estado}`);
            if(resultado.estado){
                element.estado = resultado;
                element.cantidad = resultado.cantidadVenta;
                element.subtotal = (element.cantidad   * element.inf.precio);
                producto.stock = resultado.cantidadStock;

                console.log("***********************");
                console.log(resultado);

                return element.subtotal
                //await producto.save();
            }else{
                element.estado = resultado;
                element.cantidad = 0;
                element.subtotal = (element.cantidad * element.inf.precio);
                console.log("***********************");
                console.log(resultado);
                producto.stock = resultado.cantidadStock;

            };

        })
        .catch( (error) =>{
            console.log(error.message);
        });
        }, 3000);  

   } catch (error) {
        console.log(error.message);
   }

};

/* Middelware */

const prueba = (req, res)=>{
    res.send({
        msg:"En esta ruta gestionaremos todas las peticiones correspondiente al modelo de Venta"
    })
};

const createVentas = async (req, res)=>{

    try {
        const venta = new Venta(req.body);
        // Generar un proceso que actualice el stock del articulo
        venta.articulos.forEach(element => {
            getProducto(element, element.inf._id, element.cantidad);
        });


        //const ventaGuardado = await venta.save();
        //res.json(ventaGuardado);
        res.json({
            msg: "Procesando.......",
        });
    } catch (error) {
        console.error(error.message);
    }
};

const getVenta = async (req, res)=>{
    try {
        const OneVenta = await Venta.findById(req.params.id);

        if (!OneVenta) {
            return res.sendStatus(404);
        } else {
            return res.json(OneVenta);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getVentas = async (req, res)=>{
    try {
        const ventas = await Venta.find();
        res.send(ventas);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
};

const updateVentas = async (req, res) =>{
    try {
        const estadoVenta = await Venta.findById(req.params.id);
        console.log(estadoVenta);

        if(estadoVenta.estado ==="vigente"){
            estadoVenta.estado="cancelada"
            await estadoVenta.save();
            res.json({
                msg: "Venta cancelada correctamente"
            });
        }else{
            res.json({
                msg: "La venta ya esta cancelada"
            });
        }

    } catch (error) {
        console.log(error.message);
    }
};

export {
    prueba,
    createVentas,
    getVenta,
    getVentas,
    updateVentas
};
