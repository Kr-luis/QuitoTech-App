// favoritos.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private favoritosSubject = new BehaviorSubject<any[]>([]);  // BehaviorSubject para emitir el estado de favoritos
  favoritos$ = this.favoritosSubject.asObservable();  // Observable para escuchar los cambios

  constructor() {}

  setFavoritos(favoritos: any[]) {
    this.favoritosSubject.next(favoritos);  // Actualiza el estado de favoritos
  }

  getFavoritos() {
    return this.favoritosSubject.value;  // Devuelve el estado actual de favoritos
  }
}
