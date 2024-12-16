import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

interface ApiResponse {
  msg: string;
}

@Component({
  selector: 'app-Forgetpassword',
  templateUrl: './Forgetpassword.page.html',
  styleUrls: ['./Forgetpassword.page.scss'],
})
export class ForgetpasswordPage {
  email: string = '';
  nuevopassword: string = '';
  confirmarpassword: string = '';
  showpassword: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit() {}

  // Función para navegar al login
  goToLogin() {
    this.router.navigate(['login']);
  }

  // Alternar visibilidad de contraseñas
  toggleForgetpasswordVisibility() {
    this.showpassword = !this.showpassword; // Alterna entre true y false
  }

  // Función para actualizar la contraseña
  async olvidopassword() {
    if (!this.nuevopassword || !this.confirmarpassword || !this.email) {
      // Alerta cuando faltan campos
      await this.showToast('Por favor, complete todos los campos.', 'danger');
      return;
    }

    // Validar que las contraseñas coinciden
    if (this.nuevopassword !== this.confirmarpassword) {
      // Alerta si las contraseñas no coinciden
      await this.showToast('Las contraseñas no coinciden. Por favor, verifícalas.', 'danger');
      return;
    }

    try {
      // Realizamos la petición HTTP para cambiar la contraseña
      const response = await this.http.put<ApiResponse>(
        'https://backend-qt.onrender.com/quitotech/usuario/recuperar',
        {
          nuevopassword: this.nuevopassword,
          confirmarpassword: this.confirmarpassword,
          email: this.email
        }
      ).toPromise();

      if (response) {
        // Alerta de éxito
        await this.showToast('La contraseña ha sido actualizada correctamente.', 'success');
        // Redirigimos al login
        this.router.navigate(['login']);
      }
    } catch (error) {
      // Alerta de error si falla la petición
      console.error('Error al actualizar la contraseña', error);
      await this.showToast('Hubo un problema al actualizar la contraseña. Verifique su email.', 'danger');
    }
  }

  // Función para mostrar toast con mensaje
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color, // 'success', 'danger', etc.
      position: 'top'
    });

    toast.present();
  }
}
