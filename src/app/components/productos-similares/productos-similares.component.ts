import { Component, inject, Input, OnInit } from '@angular/core';
import { ProductoService } from '../../services/product.service';
import { Producto } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule

@Component({
  selector: 'app-productos-similares',
  standalone: true,
  templateUrl: './productos-similares.component.html',
  styleUrls: ['./productos-similares.component.css'],
  imports: [CommonModule, RouterModule], // Agrega RouterModule aquí
})
export class ProductosSimilaresComponent implements OnInit {
  @Input() categoriaId?: string; // Propiedad opcional
  productosSimilares: Producto[] = [];

  private productoService = inject(ProductoService);
  private router = inject(Router);

  ngOnInit(): void {
    this.obtenerProductosRelacionados();
  }
  
  obtenerProductosRelacionados() {
    if (!this.categoriaId) {
      console.log(this.categoriaId);
      return; // Manejar el caso si no hay categoriaId
    }
  
    this.productoService.obtenerProductosPorCategoria(this.categoriaId).subscribe(
      (productos: Producto[]) => {
        console.log('Productos relacionados:', productos); // Verifica aquí
        this.productosSimilares = productos;
      },
      (error) => {
        console.error('Error fetching related products:', error);
      }
    );
  }

  navegarAlProducto(productId: string) {
    this.router.navigate(['/products', productId]);
  }
}
