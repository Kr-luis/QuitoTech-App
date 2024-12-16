import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { terminosPage } from '../terminos/terminos.page'; 


@Component({
  selector: 'app-Configuraciones',
  templateUrl: 'Configuraciones.page.html',
  styleUrls: ['Configuraciones.page.scss']
})
export class ConfiguracionesPage {

  autorizacion: string | null = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ){}

  
  ngOnInit() {
    // Cargar los datos desde localStorage cuando el componente se inicializa
    this.autorizacion = localStorage.getItem('autorizacion');
  }

  logout() {
    localStorage.clear();
  }

  async goToPassword() {
    if (this.autorizacion === "Invitado") {
      const alert = await this.alertController.create({
        header: 'Cuenta Requerida',
        message: 'Por favor, ingresa a tu cuenta para cambiar tu contraseña.',
        buttons: ['OK']
      });
      await alert.present();
      return;  // Detener la ejecución de la función si los campos están vacíos
    }else{
      this.router.navigate(['/password']);
    }
  }
  async mostrarTerminos() {
    // Crea y presenta el modal
    const modal = await this.modalCtrl.create({
      component: terminosPage, // Componente del modal
    });
    await modal.present();

    // Escucha el cierre del modal
    const { data } = await modal.onDidDismiss();
  }
}