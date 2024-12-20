import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './product.service';
import { Producto } from '../models/product.model';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  const mockProductos: Producto[] = [
    {
      _id: '1',
      tipo:"cabeza",
      nombre: 'Producto 1',
      precio: 100,
      images: ['img1.jpg'],
      descripcionOne: 'Descripción 1',
      descripcionTwo: 'Descripción 2',
      categoriaId: 'cat1',
      stock: 10,
      shippingTime: '1-2 días',
      marca: 'Marca 1',
      fechaDeLanzamiento: new Date(),
    },
    {
      _id: '2',
      tipo:"pierna",
      nombre: 'Producto 2',
      precio: 200,
      images: ['img2.jpg'],
      descripcionOne: 'Descripción 1',
      descripcionTwo: 'Descripción 2',
      categoriaId: 'cat2',
      stock: 20,
      shippingTime: '3-4 días',
      marca: 'Marca 2',
      fechaDeLanzamiento: new Date(),
    }
  ];

  const mockProducto: Producto = {
    _id: '1',
    tipo: "brazo",
    nombre: 'Producto 1',
    precio: 100,
    images: ['img1.jpg'],
    descripcionOne: 'Descripción 1',
    descripcionTwo: 'Descripción 2',
    categoriaId: 'cat1',
    stock: 10,
    shippingTime: '1-2 días',
    marca: 'Marca 1',
    fechaDeLanzamiento: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService],
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes HTTP pendientes
  });

  it('debería obtener todos los productos', () => {
    service.obtenerProductos().subscribe((productos) => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(mockProductos);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos); // Simula la respuesta exitosa del servidor
  });

  it('debería obtener un producto por su ID', () => {
    const productoId = '1';
    service.obtenerProductoPorId(productoId).subscribe((producto) => {
      expect(producto).toEqual(mockProducto);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/products/${productoId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducto); // Simula la respuesta exitosa del servidor
  });

  it('debería obtener productos por categoría', () => {
    const categoriaId = 'cat1';
    service.obtenerProductosPorCategoria(categoriaId).subscribe((productos) => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(mockProductos);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/products/categoria/${categoriaId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos); // Simula la respuesta exitosa del servidor
  });

  it('debería manejar un error al obtener todos los productos', () => {
    const errorMessage = 'Error al obtener productos';

    service.obtenerProductos().subscribe({
      next: () => fail('Se esperaba un error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/products');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' }); // Simula el error 500
  });

  it('debería manejar un error al obtener un producto por su ID', () => {
    const productoId = '1';
    const errorMessage = 'Producto no encontrado';

    service.obtenerProductoPorId(productoId).subscribe({
      next: () => fail('Se esperaba un error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/products/${productoId}`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' }); // Simula el error 404
  });

  it('debería manejar un error al obtener productos por categoría', () => {
    const categoriaId = 'cat1';
    const errorMessage = 'Error al obtener productos por categoría';

    service.obtenerProductosPorCategoria(categoriaId).subscribe({
      next: () => fail('Se esperaba un error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/products/categoria/${categoriaId}`);
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' }); // Simula el error 500
  });
});