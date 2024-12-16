import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ToastController, ModalController } from '@ionic/angular';
import { VerProductosPage } from '../VerProductos/VerProductos.component'; // Importa el modal

@Component({
  selector: 'app-Carrito',
  templateUrl: 'carrito.page.html',
  styleUrls: ['carrito.page.scss']
})
export class CarritoPage {
  reservas: any[] = []; // Array para almacenar las reservas
  errorMessage: string = ''; // Mensaje de error
  autorizacion: string = '';
  estrellas: any[] = [];
  estrellasVacias: any[] = [];
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    this.autorizacion = localStorage.getItem('autorizacion') || 'Invitado';
  }

  ngOnInit() {
    //this.obtenerReserva();
  }
  ionViewWillEnter() {
    this.obtenerReserva();
  }

  obtenerEstrellas(calificacion: number) {
    // Redondea la calificación hacia abajo para obtener el número entero de estrellas llenas
    const estrellasLlenas = Math.floor(calificacion);
    const estrellasVacias = 5 - estrellasLlenas; // El resto son estrellas vacías
    return { estrellasLlenas, estrellasVacias };
  }
  // Función para obtener las reservas de un usuario
  obtenerReserva() {
    const idUsuario = localStorage.getItem('userId'); // Recuperamos el id del usuario desde localStorage
    if (!idUsuario) {
      console.log('Usuario no autenticado');
      return;
    }

    this.http
      .get<any[]>(`https://backend-qt.onrender.com/quitotech/reserva/${idUsuario}`)
      .subscribe(
        (respuesta) => {
          console.log('Respuesta completa del backend:', respuesta);
  
          // Filtrar las reservas que coinciden con el idUsuario
          const reservasFiltradas = respuesta.filter(reserva => reserva.id_usuario === idUsuario);
  
          if (Array.isArray(reservasFiltradas)) {
            this.reservas = reservasFiltradas;  // Asignamos las reservas filtradas a la propiedad
            console.log('Array de reservas filtradas:', this.reservas);  // Mostrar el array de reservas filtradas
          } else {
            console.error('La respuesta no contiene un array de reservas');
          }
        },
        (error) => {
          console.error('Error al obtener las reservas:', error);
          this.toast('Aqui aparecerá sus productos reservados', 'success');

        }
      );
  }
    // Función para mostrar un toast en la parte superior de la pantalla
    async toast(message: string, color: string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        color: color,
        position: 'top' // Posición en la parte superior de la pantalla
      });
      toast.present();
    }
  
  async verProducto(productoId: string) {
    const modal = await this.modalCtrl.create({
      component: VerProductosPage, // Especificamos el componente del modal
      componentProps: { id: productoId }, // Pasamos el ID del producto al modal
    });

    await modal.present(); // Abre el modal
  }
  irARegistro() {
    this.router.navigate(['/registro']); // Navegar a la página de registro
  }
  eliminarReserva(reserva: any) {
    const reservaId = reserva._id;
  
    this.http.delete(`https://backend-qt.onrender.com/quitotech/reserva/eliminar/${reservaId}`).subscribe(
      async (response: any) => {
        const toast = await this.toastController.create({
          message: response.msg,
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        toast.present();
  
        // Actualizar el array local eliminando la reserva
        this.reservas = this.reservas.filter(r => r._id !== reservaId);
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: error.error.msg || 'Hubo un error al eliminar la reserva',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
        toast.present();
      }
    );
  }
  contactarProducto(producto: any) {
    if (!producto || !producto.id_propietario || !producto.id_propietario.Numero) {
      console.error("No se puede contactar, falta el número de teléfono del propietario");
      return;
    }
  
    const mensaje = `Ey!! este producto me interesa. Mira el link para verlo: https://backend-qt.onrender.com/producto/${producto.id_producto._id}`;
    const numeroTelefono = producto.id_propietario.Numero;
    const url = `https://api.whatsapp.com/send?phone=+593${numeroTelefono}&text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(url, "_blank");
  }
  
}
