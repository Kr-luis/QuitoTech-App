import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../modelos/Productos.model'; // Importamos el modelo

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private baseUrl = 'https://quitotech.onrender.com/quitotech/productos'; // Cambia esto por tu URL base

  constructor(private http: HttpClient) {}

  // Obtener producto por ID
  getProductosById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  // Obtener productos por categoría
  getProductosByCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/categoria/${categoria}`);
  }
}
