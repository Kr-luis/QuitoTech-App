import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  templateUrl: './VerProductos.page.html',
  styleUrls: ['./VerProductos.page.css'],
})

export class VerProductosPage implements OnInit {
  @Input() id!: string; // Recibimos el ID del producto desde el componente padre
  producto: any = null;
  comentarios: any[] = [];
  comentarioUsuario: any = null; // Comentario del usuario logueado
  nuevoComentario = {
    titulo: '',
    descripcion: '',
    calificacion: null
  };
  autorizacion: string = '';
  comentarioEnEdicion: any = null;

  constructor(private modalCtrl: ModalController,
    private http: HttpClient
  ) {
    this.autorizacion = localStorage.getItem('autorizacion') || 'Invitado';
  }

  ngOnInit() {
    this.cargarProductoYComentarios(); // Cargar producto y comentarios al iniciar el modal
  }

  // Función para cargar el producto y sus comentarios
  cargarProductoYComentarios() {
    this.http.get(`https://backend-qt.onrender.com/quitotech/producto/${this.id}`).subscribe(
      (producto: any) => {
        this.producto = producto;
        this.obtenerComentarios(this.id); // Cargar comentarios una vez el producto esté cargado
      },
      (error) => {
        console.error('Error al cargar el producto:', error);
      }
    );
  }

  // Obtener comentarios del producto desde la API
  obtenerComentarios(id_producto: string) {
    this.http.get<any>(`https://backend-qt.onrender.com/quitotech/usuario/comentarios/${id_producto}`).subscribe(
      (response) => {
        console.log('Comentarios cargados:', response.comentarios); // Verifica que el _id esté presente en los comentarios
        this.comentarios = response.comentarios;
        const userId = localStorage.getItem('userId');
        this.comentarioUsuario = this.comentarios.find((c) => c.id_usuario === userId);
        console.log('Comentario del usuario:', this.comentarioUsuario); // Verifica si contiene el _id
      },
      (error) => {
        console.error('Error al obtener los comentarios:', error);
      }
    );
  }
  // Función para crear un comentario
  crearComentario() {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail');
    const nuevoComentario = {
      id_producto: this.producto._id,
      id_usuario: userId,
      email: email,
      titulo: this.nuevoComentario.titulo,
      calificacion: this.nuevoComentario.calificacion,
      descripcion: this.nuevoComentario.descripcion
    };

    this.http.post('https://backend-qt.onrender.com/quitotech/usuario/comentario/nuevo', nuevoComentario).subscribe(
      (response) => {
        this.obtenerComentarios(this.id); // Volver a cargar los comentarios para ver el nuevo
        this.nuevoComentario = { titulo: '', descripcion: '', calificacion: null }; // Limpiar formulario
      },
      (error) => {
        console.error('Error al crear el comentario:', error);
      }
    );
  }

  // Función para mostrar estrellas según la calificación
  stars(calificacion: number) {
    return Array(calificacion).fill('star');
  }

  // Función para cerrar el modal
  cerrarModal() {
    this.modalCtrl.dismiss(); // Cierra el modal
  }

  // Función para actualizar un comentario
  habilitarEdicion(comentario: any) {
    if (!comentario || typeof comentario !== 'object') {
      console.error('El comentario no es válido:', comentario);
      return;
    }
  
    if (!comentario._id) {
      console.error('El comentario no tiene un _id:', comentario);
      return;
    }
  
    this.comentarioEnEdicion = { ...comentario }; // Crear una copia completa del comentario
    console.log('Comentario habilitado para edición:', this.comentarioEnEdicion);
  }
  
  guardarEdicionComentario() {
    const { _id, titulo, descripcion, calificacion } = this.comentarioEnEdicion;
  
    if (!_id) {
      console.error('El ID del comentario es undefined.');
      return;
    }
  
    const comentarioActualizado = {
      titulo,
      descripcion,
      calificacion,
      email: localStorage.getItem('userEmail'),
    };
  
    this.http.put(`https://backend-qt.onrender.com/quitotech/usuario/comentario/actualizar/${_id}`, comentarioActualizado).subscribe(
      (response: any) => {
        console.log('Comentario actualizado:', response);
        this.obtenerComentarios(this.id); // Recargar los comentarios para reflejar los cambios
        this.comentarioEnEdicion = null; // Limpiar estado de edición
      },
      (error) => {
        console.error('Error al actualizar el comentario:', error);
      }
    );
  }
  

  // Función de eliminar comentario
  eliminarComentario(comentario: any) {
    const userId = localStorage.getItem('userId');
    
    // Verificamos si el usuario que intenta eliminar el comentario es el propietario
    if (comentario.id_usuario === userId) {
      const comentarioId = comentario._id
      this.http.delete(`https://backend-qt.onrender.com/quitotech/usuario/comentario/eliminar/${comentarioId}`, {
        body: { email: localStorage.getItem('userEmail') }
      }).subscribe(
        (response) => {
          console.log('Comentario eliminado', response);
          this.obtenerComentarios(this.id); // Recargamos los comentarios
        },
        (error) => {
          console.error('Error al eliminar comentario:', error);
        }
      );
    } else {
      console.log('No tienes permiso para eliminar este comentario');
    }
  }

}