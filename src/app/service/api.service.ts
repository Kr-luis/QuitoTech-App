import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'https://backend-qt.onrender.com/quitotech'; // URL de tu backend

  constructor(private http: HttpClient) {}

  // Método para obtener productos
  getProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`);
  }
}
