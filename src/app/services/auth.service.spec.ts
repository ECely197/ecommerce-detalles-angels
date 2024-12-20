import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service'; // Asegúrate de que la ruta es correcta

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa el módulo de pruebas HTTP
      providers: [AuthService], // Proveedor del servicio a testear
    });
    service = TestBed.inject(AuthService); // Inyectar el servicio
    httpMock = TestBed.inject(HttpTestingController); // Inyectar HttpTestingController para interceptar peticiones
  });

  afterEach(() => {
    // Verifica que no haya solicitudes HTTP pendientes
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Verifica que el servicio haya sido creado correctamente
  });

  it('should login and store token in localStorage', () => {
    const mockResponse = {
      token: 'fake-token',
      user: {
        _id: '123',
        avatar: 'fake-avatar.png',
      },
    };

    const email = 'test@example.com';
    const password = 'password';

    // Llamamos al método de login
    service.login(email, password).subscribe((response) => {
      expect(response.token).toBe(mockResponse.token);
      expect(localStorage.getItem('user_token')).toBe(mockResponse.token);
      expect(localStorage.getItem('userId')).toBe(mockResponse.user._id);
      expect(localStorage.getItem('userAvatar')).toBe(mockResponse.user.avatar);
    });

    // Verificar que la solicitud HTTP fue realizada correctamente
    const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
    req.flush(mockResponse); // Simula la respuesta de la API
  });

  it('should return false when token is not available', () => {
    // El token no está presente en localStorage
    localStorage.removeItem('user_token');
    expect(service.isLogged()).toBeFalse();
  });

  it('should return true when token is available', () => {
    // El token está presente en localStorage
    localStorage.setItem('user_token', 'fake-token');
    expect(service.isLogged()).toBeTrue();
  });

  it('should call removeToken and clear localStorage', () => {
    // Establecer un token para verificar que se borra correctamente
    localStorage.setItem('user_token', 'fake-token');
    localStorage.setItem('userId', '123');
    localStorage.setItem('userAvatar', 'fake-avatar.png');

    // Llamar al método removeToken
    service.removeToken();

    // Verificar que los elementos se han eliminado de localStorage
    expect(localStorage.getItem('user_token')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(localStorage.getItem('userAvatar')).toBeNull();
  });
});
