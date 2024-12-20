import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/product.service'; 
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-producto-destacado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-destacado.component.html',
  styleUrls: ['./producto-destacado.component.css']
})
export class ProductoDestacadoComponent implements OnInit {
  productosDestacados: Producto[] = [];
  currentStartIndex: number = 0; 
  productsToShow: Producto[] = []; 
  paginaActual: number = 1;  // Agrega esta propiedad para seguir la página actual

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.obtenerProductosDestacados();
  }

  obtenerProductosDestacados(): void {
    this.productoService.obtenerProductos().subscribe(
      (productos: Producto[]) => {
        console.log('Productos destacados:', productos);
        this.productosDestacados = productos;
        this.updateDisplayedProducts();
      },
      (error: any) => {
        console.error('Error al obtener productos destacados:', error);
      }
    );
  }

  nextProduct(): void {
    if (this.currentStartIndex + 4 < this.productosDestacados.length) {
      this.currentStartIndex += 4;
      this.paginaActual++;  // Incrementamos la página cuando avanzamos
      this.updateDisplayedProducts();
    }
  }

  prevProduct(): void {
    if (this.currentStartIndex - 4 >= 0) {
      this.currentStartIndex -= 4;
      this.paginaActual--;  // Decrementamos la página cuando retrocedemos
      this.updateDisplayedProducts();
    }
  }

  private updateDisplayedProducts(): void {
    this.productsToShow = this.productosDestacados.slice(this.currentStartIndex, this.currentStartIndex + 4);
    console.log('Productos a mostrar:', this.productsToShow);
  }
}
