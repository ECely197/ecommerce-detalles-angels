import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { Producto } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
  });
//total
  it('debería calcular correctamente el total del carrito', () => {
    const mockProducts = new Map<string, Producto & { quantity: number }>([
        ['1', { _id: '1', tipo: 'A', nombre: 'Producto 1', precio: 100, quantity: 2, images: [], descripcionOne: '', descripcionTwo: '' }],
        ['2', { _id: '2', tipo: 'B', nombre: 'Producto 2', precio: 50, quantity: 3, images: [], descripcionOne: '', descripcionTwo: '' }],
      ]);
    service.products.set(mockProducts);

    const totalValue = service.total();
    expect(totalValue).toEqual(350); // Total esperado: 100*2 + 50*3 = 350
  });
  it('debería devolver 0 si no hay productos', () => {
    service.products.set(new Map());
    const totalValue = service.total();
    expect(totalValue).toBe(0);
  });

  it('debería manejar productos con precio 0', () => {
    const mockProducts = new Map<string, Producto & { quantity: number }>([
      ['1', { _id: '1', tipo: 'A', nombre: 'Producto 1', precio: 0, quantity: 5, images: [], descripcionOne: '', descripcionTwo: '' }],
    ]);

    service.products.set(mockProducts);
    const totalValue = service.total();
    expect(totalValue).toBe(0);
  });

  it('debería manejar cantidades negativas', () => {
    const mockProducts = new Map<string, Producto & { quantity: number }>([
      ['1', { _id: '1', tipo: 'A', nombre: 'Producto 1', precio: 100, quantity: -3, images: [], descripcionOne: '', descripcionTwo: '' }],
    ]);

    service.products.set(mockProducts);
    const totalValue = service.total();
    expect(totalValue).toBe(-300); // 100 * -3 = -300
  });
//toggleCartVisibility
it('debería alternar la visibilidad del carrito de falso a verdadero', () => {
    // Valor inicial esperado: false
    expect(service.cartVisibility()).toBe(false);

    // Ejecutar toggle
    service.toggleCartVisibility();

    // Verificar cambio a true
    expect(service.cartVisibility()).toBe(true);
  });

  it('debería alternar la visibilidad del carrito de verdadero a falso', () => {
    // Configurar valor inicial como true
    service.cartVisibility.set(true);

    // Verificar valor inicial
    expect(service.cartVisibility()).toBe(true);

    // Ejecutar toggle
    service.toggleCartVisibility();

    // Verificar cambio a false
    expect(service.cartVisibility()).toBe(false);
  });
//addCart
it('debería agregar un producto nuevo al carrito con cantidad inicial 1', () => {
    const product: Producto = {
      _id: '1',
      tipo: 'Electrónica',
      nombre: 'Producto 1',
      precio: 100,
      images: [],
      descripcionOne: 'Descripción corta',
      descripcionTwo: 'Descripción larga',
    };

    service.addToCart(product);

    const productsInCart = service.products();
    expect(productsInCart.size).toBe(1);
    expect(productsInCart.get('1')?.quantity).toBe(1);
    expect(productsInCart.get('1')?.nombre).toBe('Producto 1');
  });

  it('debería incrementar la cantidad de un producto existente', () => {
    const product: Producto = {
      _id: '1',
      tipo: 'Electrónica',
      nombre: 'Producto 1',
      precio: 100,
      images: [],
      descripcionOne: 'Descripción corta',
      descripcionTwo: 'Descripción larga',
    };

    service.addToCart(product); // Agregar por primera vez
    service.addToCart(product); // Agregar nuevamente

    const productsInCart = service.products();
    expect(productsInCart.size).toBe(1); // Solo un producto
    expect(productsInCart.get('1')?.quantity).toBe(2); // Cantidad incrementada
  });

  it('debería mantener la información del producto al agregar más cantidades', () => {
    const product: Producto = {
      _id: '1',
      tipo: 'Electrónica',
      nombre: 'Producto 1',
      precio: 100,
      images: ['image1.jpg'],
      descripcionOne: 'Descripción corta',
      descripcionTwo: 'Descripción larga',
    };

    service.addToCart(product); // Agregar por primera vez

    const productsInCart = service.products();
    const productInCart = productsInCart.get('1');
    expect(productInCart).toEqual({
      ...product,
      quantity: 1,
    });
  });
//incrementQuantity
it('debería incrementar la cantidad de un producto existente en el carrito', () => {
    const product: Producto = {
      _id: '1',
      tipo: 'Electrónica',
      nombre: 'Producto 1',
      precio: 100,
      images: [],
      descripcionOne: 'Descripción corta',
      descripcionTwo: 'Descripción larga',
    };

    // Agregar el producto inicialmente
    service.addToCart(product);

    // Incrementar la cantidad del producto
    service.incrementQuantity('1');

    const productsInCart = service.products();
    const productInCart = productsInCart.get('1');

    expect(productInCart?.quantity).toBe(2); // La cantidad debería ser 2
  });

  it('no debería hacer nada si el producto no existe en el carrito', () => {
    // Intentar incrementar un producto que no existe
    service.incrementQuantity('999');

    const productsInCart = service.products();
    expect(productsInCart.size).toBe(0); // El carrito debería seguir vacío
  });
//decrementQuantity
it('debería decrementar la cantidad de un producto existente en el carrito', () => {
    const product: Producto = {
      _id: '1',
      tipo: 'Electrónica',
      nombre: 'Producto 1',
      precio: 100,
      images: [],
      descripcionOne: 'Descripción corta',
      descripcionTwo: 'Descripción larga',
    };

    // Agregar el producto inicialmente con una cantidad de 2
    service.addToCart(product);
    service.incrementQuantity('1'); // Cantidad ahora es 2

    // Decrementar la cantidad del producto
    service.decrementQuantity('1');

    const productsInCart = service.products();
    const productInCart = productsInCart.get('1');

    expect(productInCart?.quantity).toBe(1); // La cantidad debería ser 1
  });

  it('debería eliminar un producto si la cantidad llega a 0 al decrementar', () => {
    const product: Producto = {
      _id: '1',
      tipo: 'Electrónica',
      nombre: 'Producto 1',
      precio: 100,
      images: [],
      descripcionOne: 'Descripción corta',
      descripcionTwo: 'Descripción larga',
    };

    // Agregar el producto inicialmente con una cantidad de 1
    service.addToCart(product);

    // Decrementar la cantidad del producto (debería eliminarlo)
    service.decrementQuantity('1');

    const productsInCart = service.products();
    expect(productsInCart.size).toBe(0); // El carrito debería estar vacío
  });

  it('no debería hacer nada si el producto no existe en el carrito', () => {
    // Intentar decrementar un producto que no existe
    service.decrementQuantity('999');

    const productsInCart = service.products();
    expect(productsInCart.size).toBe(0); // El carrito debería seguir vacío
  });
});

  