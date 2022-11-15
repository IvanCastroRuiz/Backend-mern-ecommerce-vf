import mongoose from 'mongoose';

const ventaShema = mongoose.Schema(
    {

        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        },
        articulos:{
            type: Array,
            required: true 
        },
        total: {
            type: Number,
            required: true,
            trim: true
        },
        confirmado:{
            type: Boolean,
            default: false,
        },
        estado:{
            type: String,
            default: "vigente",
        },
    },
    {
        timestamps: true,
    }    
);


const Venta = mongoose.model('Venta', ventaShema);
export default Venta;