/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class BaseApiClient {
  private _tokenData: any;

  constructor(public request: APIRequestContext) {}

  set tokenData(data: any) {
    this._tokenData = data;
  }
  get tokenData() {
    return this._tokenData;
  }
  async get(url: string, options: any = {}): Promise<APIResponse> {
    // Default options with Authorization header
    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${this._tokenData || ''}`,
      },
    };

    // Merge the default options with the provided options
    // This ensures the test-specific options take precedence if there's overlap
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    console.log('📤 Sending GET request');
    console.log('URL:', url);
    console.log('Headers:', mergedOptions.headers);

    const response = await this.request.get(url, mergedOptions);
    expect(response.ok()).toBeTruthy();
    const responseJson = await response.json();
    console.log('ResponseJson:', responseJson);

    return response;
  }

  async post(url: string, options: any = {}): Promise<APIResponse> {
    // Default options with Authorization header
    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${this._tokenData || ''}`,
      },
    };

    // Merge the default options with the provided options
    // This ensures the test-specific options take precedence if there's overlap
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    console.log('📤 Sending POST request');
    console.log('URL:', url);
    console.log('Headers:', mergedOptions.headers);
    console.log('Body:', JSON.stringify(mergedOptions.data, null, 2));

    const response = await this.request.post(url, mergedOptions);
    console.log(response.status());

    return response;
  }

  async patch(url: string, options: any = {}): Promise<APIResponse> {
    // Default options with Authorization header
    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${this._tokenData || ''}`,
      },
      data: options.data!,
    };

    // Merge the default options with the provided options
    // This ensures the test-specific options take precedence if there's overlap
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    console.log('📤 Sending PATCH request');
    console.log('URL:', url);
    console.log('Headers:', mergedOptions.headers);
    console.log('Body:', JSON.stringify(mergedOptions.data, null, 2));
    const response = await this.request.patch(url, mergedOptions);
    // expect(response.ok()).toBeTruthy();
    return response;
  }

  async delete(url: string, options: any = {}): Promise<APIResponse> {
    // Default options with Authorization header
    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${this._tokenData || ''}`,
      },
    };

    // Merge the default options with the provided options
    // This ensures the test-specific options take precedence if there's overlap
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
    const response = await this.request.delete(url, mergedOptions);
    expect(response.ok()).toBeTruthy();
    console.log(response.status());
    return response;
  }
}
