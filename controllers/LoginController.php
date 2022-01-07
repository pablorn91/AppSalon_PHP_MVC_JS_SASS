<?php
namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController {
    public static function login (Router $router) {
        $router->render('auth/login');
    }

    public static function logout () {
        echo 'Desde Logout';
    }

    public static function olvide (Router $router) {
        $router->render('auth/olvide-password', [

        ]);
    }

    public static function recuperar () {
        echo 'Desde Recuperar';
    }

    public static function crear (Router $router) {

        $usuario = new Usuario;
        $alertas = [];
        
        if( $_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            if (empty($alertas)){

               $resultado = $usuario->existeUsuario();
                if ($resultado->num_rows){
                    $alertas = Usuario::getAlertas();
                } else {
                /*No está registrado*/

                    //Hashear el password
                    $usuario->hashPassword();
                    //Generar un token único
                    $usuario->crearToken();
                    //Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarConfirmacion();

                    //Crear el Usuario
                    $resultado = $usuario->guardar();

                    if ($resultado){
                        header('Location: /mensaje');
                    }

                    // debuguear($usuario);
                }
            }

        }

        $router->render('auth/crear-cuenta',[
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function mensaje (Router $router) {
        $router->render('auth/mensaje');
    }

    public static function confirmar (Router $router) {

        $alertas = [];
        $token = s($_GET['token']);
        $usuario = Usuario::where('token', $token);

        if (empty($usuario)){
            //mostrar mensaje de error
            Usuario::setAlerta('error', 'Token no válido');
        } else {
            //modificar al usuario confirmado
            $usuario->confirmado =  '1';
            $usuario->token = null;
            $usuario->guardar();
            Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
        }

        //Obtener alertas
        $alertas = Usuario::getAlertas();

        //Renderizar la vista
        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }

}