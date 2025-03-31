const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  github_url: string;
  demo_url?: string;
  creator: number;
  creator_name: string;
  created_at: string;
  upvotes_count: number;
  downvotes_count: number;
  sdgs: string[];
  authors: Array<{
    first_name: string;
    last_name: string;
  }>;
  thumbnail?: string;
  rating?: number;
}

export interface Testimonial {
  id: number;
  content: string;
  author: {
    first_name: string;
    last_name: string;
  };
  role: string;
  avatar: string;
  created_at: string;
  rating: number;
}

export interface LeaderboardEntry {
  id: number;
  project: {
    id: number;
    title: string;
    authors: Array<{
      first_name: string;
      last_name: string;
    }>;
  };
  team: string;
  score: number;
  badge: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiClient {
  getProjects(): Promise<PaginatedResponse<Project>>;
  getTestimonials(): Promise<PaginatedResponse<Testimonial>>;
  getTopProjects(): Promise<LeaderboardEntry[]>;
}

class ApiClientImpl implements ApiClient {
  private token: string | null = null;
  private baseUrl = API_BASE_URL;

  constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Token ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.fetch<{ token: string }>('/auth/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    
    // Get user details
    const user = await this.getCurrentUser();
    return { token: response.token, user };
  }

  async register(userData: Omit<User, 'id'> & { password: string }): Promise<User> {
    return this.fetch<User>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.fetch<User>('/auth/user/');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Projects
  async getProjects(): Promise<PaginatedResponse<Project>> {
    return this.fetch<PaginatedResponse<Project>>('/projects/');
  }

  async getProject(id: number): Promise<Project> {
    return this.fetch<Project>(`/projects/${id}/`);
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    return this.fetch<Project>('/projects/', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    return this.fetch<Project>(`/projects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: number): Promise<void> {
    await this.fetch(`/projects/${id}/`, {
      method: 'DELETE',
    });
  }

  // Testimonials
  async getTestimonials(): Promise<PaginatedResponse<Testimonial>> {
    return this.fetch<PaginatedResponse<Testimonial>>('/testimonials/');
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
    return this.fetch<Testimonial>('/testimonials/', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    });
  }

  // Leaderboard
  async getTopProjects(): Promise<LeaderboardEntry[]> {
    return this.fetch<LeaderboardEntry[]>('/leaderboard/top_projects/');
  }
}

const api = new ApiClientImpl();
export default api; 