<?php

namespace Model;

class Usuario extends ActiveRecord {
    //Base de Datos
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'apellido', 'email','password', 'telefono', 'admin', 'confirmado', 'token'];

    public $id;
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    public $telefono;
    public $admin;
    public $confirmado;
    public $token;

    public function __construct( $args = [] ) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido = $args['apellido'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->admin = $args['admin'] ?? null;
        $this->confirmado = $args['confirmado'] ?? null;
        $this->token = $args['token'] ?? '';
    }

    //Mensajes de Validación para la creación de una cuenta
    public function validarNuevaCuenta () {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre es Obligatorio';
        }
 
        if(!$this->apellido) {
            self::$alertas['error'][] = 'El Apellido es Obligatorio';
        }
 
        if(!$this->email) {
            self::$alertas['error'][] = 'El E-mail es Obligatorio';
        }
 
        if(!$this->password) {
            self::$alertas['error'][] = 'El password es Obligatorio';
        }
        
        if ( strlen($this->password) < 6 ){
            self::$alertas['error'][] = 'El password es debe tener al menos 6 caracteres';
        }

        return self::$alertas;
    }

}