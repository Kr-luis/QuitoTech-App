import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonRouterOutlet, ModalController, ToastController } from '@ionic/angular';
import { FavoritosService } from '../service/favoritos/favoritos.service';  // Importar el servicio
import { Router } from '@angular/router';
import { VerProductosPage } from '../VerProductos/VerProductos.component'; // Importa el modal

@Component({
  selector: 'app-favoritos',
  templateUrl: './Favoritos.page.html',
  styleUrls: ['./Favoritos.page.css'],
})
export class FavoritosPage implements OnInit {
  productosFavoritos: any[] = [];
  autorizacion: string = '';
  estrellas: any[] = [];
  estrellasVacias: any[] = [];

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private favoritosService: FavoritosService,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    this.autorizacion = localStorage.getItem('autorizacion') || 'Invitado'; // Inyectar el servicio
  }

  ionViewWillEnter() {
    this.obtenerFavoritos();
  }
  

  ngOnInit() {
    this.verificarAutorizacion();
    //this.obtenerFavoritos();
    this.favoritosService.favoritos$.subscribe((favoritos) => {
      this.productosFavoritos = favoritos;  // Actualizar la lista de productos cuando cambia el servicio
    });
  }

  obtenerEstrellas(calificacion: number) {
    // Redondea la calificación hacia abajo para obtener el número entero de estrellas llenas
    const estrellasLlenas = Math.floor(calificacion);
    const estrellasVacias = 5 - estrellasLlenas; // El resto son estrellas vacías
    return { estrellasLlenas, estrellasVacias };
  }

  verificarAutorizacion() {
    const user = localStorage.getItem('userId');
    if (user) {
      this.autorizacion = 'Registrado';
    } else {
      this.autorizacion = 'Invitado';
    }
  }

  obtenerFavoritos() {
    const idUsuario = localStorage.getItem('userId');
    if (!idUsuario) {
      console.log("Invitado")
      return;
    }
  
    this.http
      .get<any[]>(`https://backend-qt.onrender.com/quitotech/favoritos/${idUsuario}`)
      .subscribe(
        (respuesta) => {
          console.log('Respuesta completa del backend:', respuesta);
  
          // Filtrar los productos favoritos que coinciden con el idUsuario
          const favoritosFiltrados = respuesta.filter(favorito => favorito.id_usuario === idUsuario);
  
          if (Array.isArray(favoritosFiltrados)) {
            if (favoritosFiltrados.length > 0) {
              this.productosFavoritos = favoritosFiltrados;
              this.favoritosService.setFavoritos(favoritosFiltrados);  // Actualizar el servicio con los nuevos favoritos
            } else {
              this.mostrarToast('Aquí aparecerán sus productos favoritos', 'success');
            }
          } else {
            console.error('La respuesta no contiene un array de favoritos');
            this.mostrarToast('Ocurrió un error al obtener sus productos favoritos', 'danger');
          }
        },
        (error) => {
          console.error('Error al obtener favoritos:', error);
          this.mostrarToast('Aquí aparecerán sus productos favoritos', 'success');
        }
      );
  }
  

  // Función para mostrar un toast en la parte superior de la pantalla
  async mostrarToast(message: string, color: string) {
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

  eliminarDeFavoritos(favorito: any) {
    const favoritoId = favorito._id;

    this.http.delete(`http://localhost:3000/quitotech/favorito/eliminar/${favoritoId}`).subscribe(
      async (response: any) => {
        this.mostrarToast(response.msg, 'success');

        // Actualizamos la lista de favoritos
        this.productosFavoritos = this.productosFavoritos.filter(fav => fav._id !== favoritoId);
      },
      async (error) => {
        this.mostrarToast(error.error.msg || 'No se pudo eliminar el producto, intentelo mas tarde', 'danger');
      }
    );
  }

  irARegistro() {
    this.router.navigate(['/registro']); // Navegar a la página de registro
  }

  anadirAReservas(producto: { id_producto: { _id: string, id_tienda: { id_propietario: string } } }) {
    const id_usuario = localStorage.getItem('userId'); // Asegúrate de que el ID esté guardado en localStorage

    if (!id_usuario) {
      this.mostrarToast('Hubo un error al reconocer el usuario, por favor cierre sesion e ingrese nuevamente', 'danger');
      return;
    }

    console.log('Producto:', producto);
    console.log('id_tienda:', producto.id_producto.id_tienda);
    console.log('id_propietario:', producto.id_producto.id_tienda?.id_propietario);

    // Accedemos al id_propietario dentro de id_tienda, que está dentro de id_producto
    const propietario = producto.id_producto.id_tienda?.id_propietario;  // Accedemos a id_tienda y luego a id_propietario
    
    if (!propietario) {
      this.mostrarToast('Hubo un error al reconocer el usuario, por favor cierre sesion e ingrese nuevamente', 'danger');
      return;
    }

    // Preparamos los datos para la reserva
    const reservaData = {
      id_usuario: id_usuario,
      id_producto: producto.id_producto._id,  // Solo enviamos el _id del producto
      id_propietario: propietario,  // Usamos el id_propietario que hemos extraído
    };

    console.log(reservaData);
    // Enviamos la petición para registrar la reserva
    this.http.post('http://localhost:3000/quitotech/reserva/registro', reservaData).subscribe(
      (response: any) => {
        console.log('Reserva exitosa:', response);
        this.mostrarToast('Reserva realizada con éxito', 'success');
      },
      (error) => {
        console.error('Error al reservar el producto:', error);
        this.mostrarToast('Este producto ya se encuentra resgistrado', 'danger');
      }
    );
  }
}
