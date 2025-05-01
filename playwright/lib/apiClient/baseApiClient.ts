/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class BaseApiClient {
  constructor(protected request: APIRequestContext) {}

  async get(url: string, options = {}): Promise<APIResponse> {
    const response = await this.request.get(url, options);
    expect(response.ok()).toBeTruthy();
    return response;
  }

  async post(url: string, data: any, headers?: Record<string, string>): Promise<APIResponse> {
    const response = await this.request.post(url, {
      data,
      headers,
    });
    // expect(response.ok()).toBeTruthy();
    return response;
  }

  async patch(url: string, data: any, headers?: Record<string, string>): Promise<APIResponse> {
    const response = await this.request.patch(url, {
      data,
      headers,
    });
    expect(response.ok()).toBeTruthy();
    return response;
  }

  async delete(url: string, headers?: Record<string, string>): Promise<APIResponse> {
    const response = await this.request.delete(url, { headers });
    expect(response.ok()).toBeTruthy();
    return response;
  }
}
