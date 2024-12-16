import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FavoritosService } from '../service/favoritos/favoritos.service';
import { IonRouterOutlet, ModalController, MenuController, ToastController } from '@ionic/angular';
import { VerProductosPage } from '../VerProductos/VerProductos.component';

@Component({
  selector: 'app-productos',
  templateUrl: './Productos.page.html',
  styleUrls: ['./Productos.page.css'],
})
export class ProductosPage implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = []; // Lista de productos filtrados
  tiendas: { [key: string]: string } = {};
  terminoBusqueda: string = ''; // Término de búsqueda
  categorias: string[] = ['Mandos', 'Consolas', 'Videojuegos', 'Perifericos', 'ComponentesPC', 'Otros'];
  categoriaSeleccionada: string = ''; // Para almacenar la categoría seleccionada
  selectedCategory: string = '';
  estrellas: any[] = [];
  estrellasVacias: any[] = [];

  constructor(
    private http: HttpClient,
    private favoritosService: FavoritosService,
    private routerOutlet: IonRouterOutlet,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController, // Inyectamos el MenuController
    private toastController: ToastController // Inyectamos el ToastController
  ) {}

  ngOnInit() {
    this.obtenerProductos();
  }

  ionViewWillEnter() {
    this.obtenerProductos();
  }

  obtenerEstrellas(calificacion: number) {
    // Redondea la calificación hacia abajo para obtener el número entero de estrellas llenas
    const estrellasLlenas = Math.floor(calificacion);
    const estrellasVacias = 5 - estrellasLlenas; // El resto son estrellas vacías
    return { estrellasLlenas, estrellasVacias };
  }
  abrirTiendaEnMapa(nombreTienda: string, direccion: string) {
    if (nombreTienda && direccion) {
      // Crear la URL de Google Maps con el nombre de la tienda y la dirección
      const urlGoogleMaps = `https://www.google.com/maps?q=${encodeURIComponent(nombreTienda)}+${encodeURIComponent(direccion)}`;
      
      // Redirigir a Google Maps (se abrirá correctamente tanto en móvil como en escritorio)
      window.open(urlGoogleMaps, '_blank');
    } else {
      // Si no se encuentra el nombre o la dirección, muestra un mensaje de error
      this.showToast('No se pudo encontrar la tienda o la dirección', 'danger');
    }
}

  obtenerProductos() {
    this.http
      .get<any[]>('https://backend-qt.onrender.com/quitotech/productos/enStock')
      .subscribe(
        (productos) => {
          this.productos = productos;
          this.productosFiltrados = productos; // Inicialmente, muestra todos los productos
          console.log(productos);

          const idsTiendas: string[] = [
            ...new Set(productos.map((p: any) => p.id_tienda?._id).filter(Boolean)),
          ];

          idsTiendas.forEach((id: string) => {
            this.http
              .get<any>(`https://backend-qt.onrender.com/quitotech/tienda/${id}`)
              .subscribe((tienda) => {
                this.tiendas[id] = tienda.nombre_tienda;
              });
          });
        },
        async (error) => {
          console.error('Error al obtener los productos:', error);
          await this.showToast('Hubo un error al obtener los productos', 'danger');
        }
      );
  }

  filtrarProductos() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter((producto) =>
      producto.Nombre.toLowerCase().includes(termino)
    );
  }

  async verProducto(productoId: string) {
    const modal = await this.modalCtrl.create({
      component: VerProductosPage,
      componentProps: { id: productoId },
    });
    await modal.present();
  }

  async anadirAFavoritos(idProducto: string) {
    const idUsuario = localStorage.getItem('userId');

    if (!idUsuario) {
      console.error('Usuario no encontrado en localStorage');
      return;
    }

    this.http
      .post('https://backend-qt.onrender.com/quitotech/favorito/registro', {
        id_usuario: idUsuario,
        id_producto: idProducto,
      })
      .subscribe(
        async (response: any) => {
          console.log(response.msg);
          await this.showToast('Producto añadido a favoritos', 'success');
        },
        async (error) => {
          console.error('Error al añadir a favoritos', error);
          await this.showToast('El producto ya se encuentra en el apartado de favoritos', 'danger');
        }
      );
  }

  async anadirAReservas(id_producto: string, id_tienda: { id_propietario: string }) {
    const id_usuario = localStorage.getItem('userId');

    if (!id_usuario) {
      console.error('Usuario no autenticado');
      return;
    }

    const reservaData = {
      id_usuario,
      id_producto,
      id_propietario: id_tienda.id_propietario,
    };

    this.http
      .post('https://backend-qt.onrender.com/quitotech/reserva/registro', reservaData)
      .subscribe(
        async (response: any) => {
          console.log('Reserva exitosa:', response);
          await this.showToast('Producto reservado exitosamente', 'success');
        },
        async (error) => {
          console.error('Error al reservar el producto:', error);
          await this.showToast('Este producto ya se encuentra en el apartado de reserva.', 'danger');
        }
      );
  }

  abrirMenuCategorias() {
    this.menuCtrl.open(); // Abre el menú utilizando MenuController
  }

  cerrarMenuCategorias() {
    this.menuCtrl.close(); // Cierra el menú utilizando MenuController
  }

  filtrarPorCategoria(Categoria: string) {
    if (Categoria === 'Todos') {
      this.obtenerProductos();  // Llama a la función para obtener todos los productos
      this.menuCtrl.close();  // Cierra el menú
    } else {
      this.http.get<any>(`https://backend-qt.onrender.com/quitotech/productos/enstock/${Categoria}`).subscribe(
        async (response) => {
          console.log('Respuesta del backend:', response);
          this.productosFiltrados = response.productos; // Accede a la propiedad 'productos' si la respuesta es un objeto
          await this.showToast(`Categoría ${Categoria}`, 'success');
          this.menuCtrl.close(); // Cierra el menú después de seleccionar una categoría
        },
        async (error) => {
          console.error('Error al filtrar productos por categoría:', error);
          await this.showToast('Error al filtrar productos. Intenta más tarde.', 'danger');
        }
      );
    }
  }

  // Función para mostrar toast con mensaje
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color, // 'success', 'danger', etc.
      position: 'top'  // Muestra el mensaje en la parte superior
    });
    toast.present();
  }
}
