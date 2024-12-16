import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.page.html',
  styleUrls: ['./terminos.page.css'],
})
export class terminosPage {
  constructor(private router: Router,
  private modalCtrl: ModalController
  ) {}
  ngOnInit() {
  }

  cerrarModal(acepta: boolean) {
    // Devuelve la decisión del usuario al cerrar el modal
    this.modalCtrl.dismiss({ acepta });
  }
}
