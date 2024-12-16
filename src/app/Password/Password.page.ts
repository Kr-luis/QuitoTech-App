import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

interface ApiResponse {
  msg: string;
}

@Component({
  selector: 'app-Password',
  templateUrl: './Password.page.html',
  styleUrls: ['./Password.page.scss'],
})
export class PasswordPage {
  id: string = '';
  nuevopassword: string = '';
  confirmarpassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit() {
    // Recuperar el id del usuario desde el localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.id = userId;
    } else {
      this.errorMessage = "No se encontró el ID del usuario. Por favor, inicie sesión nuevamente.";
    }
  }

  async actualizarPassword() {
    if (!this.nuevopassword || !this.confirmarpassword || !this.id) {
      this.errorMessage = "Todos los campos son requeridos.";
      return;
    }

    try {
      const response = await this.http.put<ApiResponse>(
        `https://backend-qt.onrender.com/quitotech/usuario/nuevapassword`,
        {
          id: this.id,
          nuevopassword: this.nuevopassword,
          confirmarpassword: this.confirmarpassword,
        }
      ).toPromise();

      if (response) {
        this.successMessage = response.msg; // Mensaje de éxito del backend
        this.errorMessage = '';
        this.router.navigate(['/tabs/configuraciones']);
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña', error);
      this.errorMessage =
        "Error al actualizar la contraseña, por favor intente más tarde.";
    }
  }

  goToLogin() {
    this.router.navigate(['/tabs/configuraciones']);
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Alterna entre true y false
  }
}
