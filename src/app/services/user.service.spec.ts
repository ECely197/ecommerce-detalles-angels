import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User, RegisterResponse, LoginResponse } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['setToken', 'isLogged']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería registrar un usuario', () => {
    const mockRegisterResponse: RegisterResponse = {
      user: { _id: '1', firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', password: 'password123' },
      token: 'fake-jwt-token'
    };

    const registerData = new FormData();
    registerData.append('email', 'john.doe@example.com');
    registerData.append('password', 'password123');
    registerData.append('firstname', 'John');
    registerData.append('lastname', 'Doe');

    service.register(registerData).subscribe((response) => {
      expect(response).toEqual(mockRegisterResponse);
      expect(localStorage.getItem('userId')).toBe(mockRegisterResponse.user._id);
      expect(authService.setToken).toHaveBeenCalledWith(mockRegisterResponse.token);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRegisterResponse);
  });

  it('debería subir el avatar', () => {
    const mockResponse = { success: true };
    const formData = new FormData();
    formData.append('avatar', 'avatar.png');

    service.uploadAvatar('1', formData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users/avatar/1`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debería iniciar sesión', () => {
    const mockLoginResponse: LoginResponse = {
      user: { _id: '1', firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', password: 'password123' },
      token: 'fake-jwt-token'
    };

    const credentials = { email: 'john.doe@example.com', password: 'password123' };

    service.login(credentials).subscribe((response) => {
      expect(response).toEqual(mockLoginResponse);
      expect(authService.setToken).toHaveBeenCalledWith(mockLoginResponse.token);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);
  });

  it('debería obtener el perfil del usuario', () => {
    const mockUser: User = { _id: '1', firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', password: 'password123' };

    service.fetchUserProfile('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/user/profile/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('debería comprobar si el usuario está logueado', () => {
    authService.isLogged.and.returnValue(true);
    expect(service.isLogged()).toBeTrue();
  });

  it('debería manejar errores correctamente', () => {
    const errorMessage = 'Error al registrar el usuario';
    const registerData = new FormData();
    registerData.append('email', 'john.doe@example.com');
    registerData.append('password', 'password123');
    registerData.append('firstname', 'John');
    registerData.append('lastname', 'Doe');

    service.register(registerData).subscribe(
      () => fail('Debería haber fallado con el error 500'),
      (error: any) => {
        expect(error.message).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(`${service.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
  });
});
