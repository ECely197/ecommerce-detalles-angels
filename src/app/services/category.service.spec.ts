import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoriaService } from './category.service';
import { categoria } from '../models/categoy.model';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;

  // Mock de datos para las pruebas
  const mockCategories: categoria[] = [
    {
      _id: '1',
      name: 'Categoría 1',
      description: 'Descripción de la categoría 1',
      imgCategory: ['img1.jpg'],
      isActive: true
    },
    {
      _id: '2',
      name: 'Categoría 2',
      description: 'Descripción de la categoría 2',
      imgCategory: ['img2.jpg'],
      isActive: false
    }
  ];

  const mockCategory: categoria = {
    _id: '1',
    name: 'Categoría 1',
    description: 'Descripción de la categoría 1',
    imgCategory: ['img1.jpg'],
    isActive: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoriaService]
    });
    service = TestBed.inject(CategoriaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya solicitudes pendientes
  });

  it('debería obtener todas las categorías', () => {
    service.obtenerCategoria().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/categories');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories); // Simula la respuesta exitosa del servidor
  });

  it('debería obtener una categoría por su ID', () => {
    const categoryId = '1';
    service.obtenerCategoriaPorId(categoryId).subscribe(category => {
      expect(category).toEqual(mockCategory);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/categories/${categoryId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory); // Simula la respuesta exitosa del servidor
  });

  it('debería manejar un error 404 al obtener una categoría por su ID', () => {
    const categoryId = '1';
    const errorMessage = 'Categoria no encontrada';

    service.obtenerCategoriaPorId(categoryId).subscribe({
      next: () => fail('Se esperaba un error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/categories/${categoryId}`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' }); // Simula el error 404
  });

  it('debería manejar un error 500 al obtener todas las categorías', () => {
    const errorMessage = 'Error al obtener categorías';

    service.obtenerCategoria().subscribe({
      next: () => fail('Se esperaba un error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/categories');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' }); // Simula el error 500
  });
});