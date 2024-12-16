import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './Login.page.html',
  styleUrls: ['./Login.page.css'],
})
export class LoginPage {

  autorizacion: string = '';
  token: string | null = '';
  nickname: string | null = '';
  email: string | null = '';
  password: string | null = '';
  showPassword: boolean = false

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Cargar los datos desde localStorage cuando el componente se inicializa
    this.nickname = localStorage.getItem('nickname');
    this.email = localStorage.getItem('email');
    this.password = localStorage.getItem('password');
  }

  // Función de login
  async login() {
    // Verificar si los campos email y password están vacíos
    if (!this.email || !this.password) {
      const alert = await this.alertController.create({
        header: 'Campos Vacíos',
        message: 'Por favor, ingresa tu email y contraseña.',
        buttons: ['OK']
      });
      await alert.present();
      return;  // Detener la ejecución de la función si los campos están vacíos
    }

    // Llamada al backend para verificar email y password
    const body = {
      email: this.email,
      password: this.password
    };

    try {
      const response: any = await this.http.post('https://backend-qt.onrender.com/quitotech/usuario/login', body).toPromise();

      // Verifica si la respuesta contiene el id del usuario
      if (response && response['id']) {
        this.autorizacion = 'Usuario';  // Usuario autenticado con datos del backend
        localStorage.setItem('autorizacion', this.autorizacion);  // Guardar autorización en localStorage
        localStorage.setItem('userId', response.id);  // Guardar el id del usuario en localStorage
        localStorage.setItem('userEmail', response.email);  // Guardar email en localStorage
        localStorage.setItem('userName', response.nombre);  // Guardar nombre en localStorage
        this.router.navigate(['/tabs/Productos']); // Redirige al dashboard tras login exitoso
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Email o contraseña incorrectos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.error?.msg || 'Hubo un error al intentar iniciar sesión.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Función para crear una cuenta
  createAccount() {
    this.token = localStorage.getItem('token');
    if (this.token && this.token.trim() !== '') {
      this.router.navigate(['/verificacion']);
    } else {
      this.router.navigate(['/registro']);
    }
  }
  
  olvidopassword() {
    this.router.navigate(['forget']);
  }
  // Función para login sin cuenta (como invitado)
  loginWithoutAccount() {
    this.autorizacion = 'Invitado';  // Usuario invitado
    localStorage.setItem('autorizacion', this.autorizacion);  // Guardar en localStorage
    this.router.navigate(['/tabs/Productos']); // Redirigir a tab1 sin cuenta
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Alterna entre true y false
  }

}
