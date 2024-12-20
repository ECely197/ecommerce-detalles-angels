import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { User, RegisterResponse, LoginResponse } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['setToken', 'isLogged']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: spy }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('register', () => {
    it('should register a user and store token and userId', () => {
      const mockResponse: RegisterResponse = {
        user: {
          _id: '123',
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          avatar: 'avatar.png',
        },
        token: 'abc123',
      };

      const registerData = new FormData();
      registerData.append('email', 'john.doe@example.com');
      registerData.append('password', 'password123');
      registerData.append('firstname', 'John');
      registerData.append('lastname', 'Doe');
      registerData.append('avatar', 'avatar.png');

      spyOn(localStorage, 'setItem'); // Espiar localStorage.setItem

      service.register(registerData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        // Verifica que se guarde el token y el userId en el localStorage
        expect(localStorage.setItem).toHaveBeenCalledWith('user_token', 'abc123');
        expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/auth/register');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle error if registration fails', () => {
      const registerData = new FormData();
      registerData.append('email', 'john.doe@example.com');
      registerData.append('password', 'password123');
      registerData.append('firstname', 'John');
      registerData.append('lastname', 'Doe');
      registerData.append('avatar', 'avatar.png');

      const errorMessage = 'Registration failed';
      spyOn(localStorage, 'setItem');

      service.register(registerData).subscribe(
        () => fail('expected error, not a successful response'),
        (error) => {
          expect(error.error).toBe(errorMessage); // Verifica que el error se maneje correctamente
        }
      );

      const req = httpMock.expectOne('http://localhost:3000/api/auth/register');
      expect(req.request.method).toBe('POST');
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('login', () => {
    it('should log in a user and store the token', () => {
      const mockResponse: LoginResponse = {
        token: 'abc123',
        user: {
          _id: '123',
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          avatar: 'avatar.png',
        },
      };

      const credentials = { email: 'test@example.com', password: 'password123' };

      spyOn(localStorage, 'setItem');  // Espiar localStorage.setItem

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.setItem).toHaveBeenCalledWith('user_token', 'abc123'); // Verifica que se guarde el token
        expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123'); // Verifica que se guarde el userId
      });

      const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle error if login fails', () => {
      const credentials = { email: 'test@example.com', password: 'wrongpassword' };

      const errorMessage = 'Invalid credentials';

      spyOn(localStorage, 'setItem');

      service.login(credentials).subscribe(
        () => fail('expected error, not a successful response'),
        (error) => {
          expect(error.error).toBe(errorMessage); // Verifica que el error se maneje correctamente
        }
      );

      const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush({ message: errorMessage }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('fetchUserProfile', () => {
    it('should fetch user profile', () => {
      const mockResponse: User = {
        _id: '123',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        avatar: 'avatar.png',
      };

      const userId = '123';

      service.fetchUserProfile(userId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/user/profile/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error if user profile fetch fails', () => {
      const userId = '123';
      const errorMessage = 'User not found';

      service.fetchUserProfile(userId).subscribe(
        () => fail('expected error, not a successful response'),
        (error) => {
          expect(error.error).toBe(errorMessage); // Verifica que el error se maneje correctamente
        }
      );

      const req = httpMock.expectOne(`http://localhost:3000/api/user/profile/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });
    });
  });
});
