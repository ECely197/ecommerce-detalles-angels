import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Producto} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/products'; // Cambia esto según tu configuración


  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl)
      .pipe(catchError(error => {
        console.error('Error al obtener productos:', error);
        return throwError(error);
      }));
  }

  // Obtener un producto por su ID
  obtenerProductoPorId(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`)
      .pipe(catchError(error => {
        console.error('Error al obtener producto:', error);
        return throwError(error);
      }));
  }

  // Obtener productos por categoría
  obtenerProductosPorCategoria(categoriaId: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${categoriaId}`)
      .pipe(
        tap((productos: Producto[]) => console.log('Productos recibidos:', productos)),
        catchError(error => {
          console.error('Error al obtener productos por categoría:', error);
          return throwError(error);
        })
      );
  }

 

list() {
  return this.http.get("http://localhost:3000/api/products")
}
}