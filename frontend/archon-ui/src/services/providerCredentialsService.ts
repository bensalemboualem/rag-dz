/**
 * Service for managing AI Provider Credentials
 * Backend endpoint: /api/credentials/ (provider_credentials table)
 */

import { getApiUrl } from "../config/api";

export interface ProviderCredential {
  id: string;
  provider: string;
  api_key_preview: string;
  is_encrypted: boolean;
  has_key: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProviderCredentialInput {
  provider: string;
  api_key: string;
  is_encrypted?: boolean;
}

class ProviderCredentialsService {
  private baseUrl = getApiUrl();

  /**
   * List all AI provider credentials (keys masked)
   */
  async listProviders(): Promise<ProviderCredential[]> {
    const response = await fetch(`${this.baseUrl}/api/credentials/`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to fetch providers: ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Get a specific provider credential (key masked)
   */
  async getProvider(provider: string): Promise<ProviderCredential> {
    const response = await fetch(
      `${this.baseUrl}/api/credentials/${provider}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Provider ${provider} not found`);
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to fetch provider: ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Create or update a provider credential
   */
  async createOrUpdateProvider(
    data: ProviderCredentialInput
  ): Promise<ProviderCredential> {
    const response = await fetch(`${this.baseUrl}/api/credentials/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to save provider: ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Update a specific provider credential
   */
  async updateProvider(
    provider: string,
    api_key: string,
    is_encrypted: boolean = false
  ): Promise<ProviderCredential> {
    const response = await fetch(
      `${this.baseUrl}/api/credentials/${provider}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ api_key, is_encrypted }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to update provider: ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Delete (clear) a provider credential
   */
  async deleteProvider(provider: string): Promise<{ message: string }> {
    const response = await fetch(
      `${this.baseUrl}/api/credentials/${provider}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to delete provider: ${response.statusText}`
      );
    }
    return response.json();
  }
}

export const providerCredentialsService = new ProviderCredentialsService();
