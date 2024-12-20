import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { Producto } from '../../models/product.model';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosSimilaresComponent } from '../../components/productos-similares/productos-similares.component';
import { HttpErrorResponse } from '@angular/common/http'; // Importar para manejar errores
import { CategoriaService } from '../../services/category.service';

@Component({
  selector: 'product',
  standalone: true,
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  imports: [CommonModule, FormsModule, ProductosSimilaresComponent],
})
export class ProductComponent implements OnInit {
  product: Producto | null = null;
  selectedImage: string = '';
  quantity: number = 1;
  categoriaId: string | null = null; // Tipo string o null

  user: User | null = null;
  isLoading: boolean = true; // Estado de carga
  userAvatar: string = ''; // Propiedad para almacenar la URL del avatar

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private userService = inject(UserService);
  private categoriaService = inject(CategoriaService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      console.log('Params:', params);
      console.log('Product ID:', productId);

      if (productId) {
        this.cargarProducto(productId);
      } else {
        console.error('Product ID is invalid.');
      }
    });

 
  }

  

  private cargarProducto(productId: string): void {
    this.isLoading = true;
    this.productoService.obtenerProductoPorId(productId).subscribe(
      (producto: Producto) => {
        this.isLoading = false;
        console.log('Producto recibido:', producto);
        this.product = producto;

        if (producto.categoriaId) {
          this.categoriaId = producto.categoriaId; // Usar directamente el ID o el objeto si está definido
        }

        if (producto.images && producto.images.length > 0) {
          this.selectedImage = producto.images[0];
        } else {
          console.warn('No hay imágenes disponibles para este producto');
        }
      },
      error => {
        this.isLoading = false;
        console.error('Error al obtener el producto:', error);
      }
    );
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }
}

export default ProductComponent;
