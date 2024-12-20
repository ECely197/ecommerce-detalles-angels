import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './product.service';
import { Producto } from '../models/product.model';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService]
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los productos', () => {
    const mockProductos: Producto[] = [
      { _id: '1', tipo: 'Tipo 1', nombre: 'Producto 1', precio: 100, images: ['image1.jpg'], descripcionOne: 'Descripción 1.1', descripcionTwo: 'Descripción 1.2', categoriaId: '1', stock: 10 },
      { _id: '2', tipo: 'Tipo 2', nombre: 'Producto 2', precio: 200, images: ['image2.jpg'], descripcionOne: 'Descripción 2.1', descripcionTwo: 'Descripción 2.2', categoriaId: '2', stock: 20 }
    ];

    service.obtenerProductos().subscribe((productos: Producto[]) => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(mockProductos);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);
  });

  it('debería obtener un producto por su ID', () => {
    const mockProducto: Producto = { _id: '1', tipo: 'Tipo 1', nombre: 'Producto 1', precio: 100, images: ['image1.jpg'], descripcionOne: 'Descripción 1.1', descripcionTwo: 'Descripción 1.2', categoriaId: '1', stock: 10 };

    service.obtenerProductoPorId('1').subscribe((producto: Producto) => {
      expect(producto).toEqual(mockProducto);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducto);
  });

  it('debería obtener productos por categoría', () => {
    const mockProductos: Producto[] = [
      { _id: '1', tipo: 'Tipo 1', nombre: 'Producto 1', precio: 100, images: ['image1.jpg'], descripcionOne: 'Descripción 1.1', descripcionTwo: 'Descripción 1.2', categoriaId: '1', stock: 10 },
      { _id: '2', tipo: 'Tipo 2', nombre: 'Producto 2', precio: 200, images: ['image2.jpg'], descripcionOne: 'Descripción 2.1', descripcionTwo: 'Descripción 2.2', categoriaId: '1', stock: 20 }
    ];

    service.obtenerProductosPorCategoria('1').subscribe((productos: Producto[]) => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(mockProductos);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/products/categoria/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);
  });

  it('debería manejar errores correctamente', () => {
    const errorMessage = 'Error al obtener productos';

    service.obtenerProductos().subscribe(
      () => fail('Debería haber fallado con el error 500'),
      (error: any) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne('http://localhost:3000/api/products');
    expect(req.request.method).toBe('GET');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
  });

  it('debería listar productos', () => {
    const mockProductos: Producto[] = [
      { _id: '1', tipo: 'Tipo 1', nombre: 'Producto 1', precio: 100, images: ['image1.jpg'], descripcionOne: 'Descripción 1.1', descripcionTwo: 'Descripción 1.2', categoriaId: '1', stock: 10 },
      { _id: '2', tipo: 'Tipo 2', nombre: 'Producto 2', precio: 200, images: ['image2.jpg'], descripcionOne: 'Descripción 2.1', descripcionTwo: 'Descripción 2.2', categoriaId: '2', stock: 20 }
    ];

    service.list().subscribe((productos: Producto[] | any) => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(mockProductos);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);
  });
});
