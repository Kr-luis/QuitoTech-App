import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.page.html',
  styleUrls: ['./verificacion.page.css'],
})
export class VerificacionPage implements OnInit {

  // Propiedades para manejar los datos del formulario
  token: string = '';
  id_usuario: string | null = '';
  
  // Mensajes de éxito o error
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Obtener el id_usuario desde localStorage
    this.id_usuario = localStorage.getItem('id_usuario');
    if (!this.id_usuario) {
      this.errorMessage = 'No se ha encontrado el ID de usuario. Por favor, inicie sesión nuevamente.';
      this.despuesDe2Segundos(() => this.errorMessage = ''); // Limpiar el mensaje de error después de 2 segundos
    }
  }

  // Método para verificar el token ingresado por el usuario
  async verificarCuenta() {
    if (!this.token) {
      this.errorMessage = 'Por favor, ingrese el código que recibió en su correo electrónico.';
      this.despuesDe2Segundos(() => this.errorMessage = ''); // Limpiar el mensaje de error después de 2 segundos
      return;
    }

    // Verificar que el id_usuario y el token estén disponibles
    if (!this.id_usuario) {
      this.errorMessage = 'El ID del usuario no está disponible.';
      this.despuesDe2Segundos(() => this.errorMessage = ''); // Limpiar el mensaje de error después de 2 segundos
      return;
    }

    // Preparar el cuerpo de la solicitud con el id_usuario y el token
    const body = {
      id_usuario: this.id_usuario,
      token: this.token
    };

    // Realizar la solicitud HTTP para verificar el token
    try {
      const response: any = await this.http.post('https://backend-qt.onrender.com/quitotech/usuario/verificar', body).toPromise();

      // Verificar si la respuesta contiene el mensaje de éxito
      if (response && response['msg']) {
        this.successMessage = response['msg'];
        this.errorMessage = '';  // Limpiar mensaje de error si la verificación fue exitosa

        // Mostrar alerta de éxito
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: response['msg'],  // El mensaje de éxito recibido del servidor
          buttons: [
            {
              text: 'OK',
              handler: () => {
                // Redirigir al login después de hacer clic en "OK"
                this.router.navigate(['/login']);
              }
            }
          ]
        });

        // Mostrar la alerta
        await alert.present();
        localStorage.clear();

        // Limpiar mensaje de éxito después de 2 segundos
        this.despuesDe2Segundos(() => this.successMessage = '');
      } else {
        this.errorMessage = 'No se pudo obtener una respuesta válida del servidor';
        this.successMessage = '';  // Limpiar mensaje de éxito si hubo un error
        this.despuesDe2Segundos(() => this.errorMessage = ''); // Limpiar el mensaje de error después de 2 segundos
      }
    } catch (error: any) {
      // Manejo de errores en caso de que falle la solicitud
      this.errorMessage = error.error?.msg || 'Hubo un error al verificar el token';
      this.successMessage = '';  // Limpiar mensaje de éxito si hubo un error
      this.despuesDe2Segundos(() => this.errorMessage = ''); // Limpiar el mensaje de error después de 2 segundos
    }
  }

  reenviarCodigo() {
    const id_usuario = localStorage.getItem('id_usuario');  // Obtener el ID del usuario desde localStorage
    const token = localStorage.getItem('token');  // Obtener el token actual
  
    if (!id_usuario || !token) {
      this.errorMessage = 'Faltan datos para realizar la verificación.';
      this.despuesDe2Segundos(() => this.errorMessage = ''); // Limpiar el mensaje de error después de 2 segundos
      return;
    }
  
    // Preparar el cuerpo de la solicitud
    const body = {
      id_usuario: id_usuario,
      token: token,
      email: localStorage.getItem('email')  // Obtener el email desde localStorage
    };
  
    // Hacer la solicitud al backend para reenviar el token
    this.http.post('https://backend-qt.onrender.com/quitotech/usuario/retoken', body)
      .subscribe(
        (response: any) => {
          this.successMessage = response.msg;  // Mostrar mensaje de éxito
          this.despuesDe2Segundos(() => this.successMessage = ''); // Limpiar el mensaje de éxito después de 2 segundos
        },
        (error: any) => {
          this.errorMessage = error.error?.msg || 'Hubo un error al reenviar el token';
          this.despuesDe2Segundos(() => this.errorMessage = ''); // Limpiar el mensaje de error después de 2 segundos
        }
      );
  }
  
  // Método para redirigir al login
  redirigirLogin() {
    this.router.navigate(['/login']);
  }

  // Función para limpiar mensajes después de 2 segundos
  private despuesDe2Segundos(callback: Function) {
    setTimeout(callback, 2000);
  }
}
