import { BaseApiService } from './base.service';
import { API_CONFIG } from '../../config/api.config';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../types/api.types';

export class AuthService extends BaseApiService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN, 
      credentials
    );
    
    if (response.success && response.data) {
      this.setAuthToken(response.data.access_token);
      console.log('Login successful:', response.data);
    }
    
    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER, 
      userData
    );
    
    if (response.success && response.data) {
      this.setAuthToken(response.data.access_token);
      console.log('Registration successful:', response.data);
    }
    
    return response.data!;
  }

  async logout(): Promise<void> {
    await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    this.removeAuthToken();
  }
}

export const authService = new AuthService();