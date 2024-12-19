import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { categoria } from '../models/categoy.model';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
 private apiUrl = "http://localhost:3000/api/categories" 

  constructor(private http:HttpClient) {}

  obtenerCategoria(): Observable<categoria[]> {
    return this.http.get<categoria[]>(this.apiUrl);
  }
  
}
