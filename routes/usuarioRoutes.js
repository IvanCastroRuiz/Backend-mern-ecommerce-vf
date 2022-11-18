import express from 'express';
import { 
    prueba,
    registrar,
    confirmar,
    auntenticar,
    perfil,
    usuarioRegistrados,
    comprobarToken,
    nuevoPassword 
} from '../controllers/usuarioController.js';

// middleware para validar el token
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router(); 

// Rutas Publicas
router.get('/prueba', prueba);
router.post('/', registrar );
router.get('/confirmar/:token', confirmar);
router.post('/login', auntenticar);


// Rutas Protegidas atraves del middleware checkAuth
// Identificamos el usuario y se identifica para mostrale los datos o funcionalidades que le corresponden.
router.get('/perfil', checkAuth , perfil);
router.get('/lista-usuarios', usuarioRegistrados);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);   


export default router;