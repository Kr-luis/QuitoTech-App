import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { terminosPage } from '../terminos/terminos.page'; 

@Component({
  selector: 'app-registro',
  templateUrl: './Registro.page.html',
  styleUrls: ['./Registro.page.css'],
})
export class RegistroPage {

  nombre: string = '';
  email: string = '';
  password: string = '';
  aceptaTerminos: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  haLeidoTerminos: boolean = false;
  showPassword: boolean = false

  constructor(private http: HttpClient, 
    private router: Router,
    private modalCtrl: ModalController,
    private navCtrl: NavController) {}

  // Función para manejar el envío del formulario
  async registrarUsuario() {
    if (!this.aceptaTerminos) {
      this.errorMessage = 'Para continuar debe aceptar nuestros términos y condiciones';
      return;
    }

    this.aceptaTerminos = JSON.parse(localStorage.getItem('acepta_terminos') || 'false');
    
    // Validar que todos los campos estén completos
    if (!this.nombre || !this.email || !this.password || !this.aceptaTerminos) {
      this.errorMessage = 'Lo sentimos, debes llenar todos los campos';
      return;
    }

    const body = {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      acepta_terminos: this.aceptaTerminos
    };

    try {
      const response: any = await this.http.post('https://backend-qt.onrender.com/quitotech/usuario/registro', body).toPromise();

      // Verifica que la respuesta tenga la propiedad 'msg' y los datos necesarios
      if (response && response['msg']) {
        this.successMessage = response['msg'];

        // Guardar el id_usuario y el token en localStorage
        localStorage.setItem('id_usuario', response.id_usuario);
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', this.email);

        // Redirigir a la página de verificación
        this.router.navigate(['/verificacion']);
      } else {
        this.errorMessage = 'No se pudo obtener una respuesta válida del servidor';
      }
    } catch (error: any) {
      this.errorMessage = error.error?.msg || 'Hubo un error al registrar el usuario';
    }
}

  irALogin() {
    this.router.navigate(['/']); // Navegar a la página de registro
  }
  aceptarTerminos() {
    localStorage.setItem('acepta_terminos', JSON.stringify(true))
    console.log('Términos aceptados guardados en localStorage');
  }
  async mostrarTerminos() {
    // Crea y presenta el modal
    const modal = await this.modalCtrl.create({
      component: terminosPage, // Componente del modal
    });

    await modal.present();

    // Escucha el cierre del modal
    const { data } = await modal.onDidDismiss();
    if (data?.acepta) {
      this.haLeidoTerminos = true; // Permite marcar el checkbox
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Alterna entre true y false
  }
  
}
