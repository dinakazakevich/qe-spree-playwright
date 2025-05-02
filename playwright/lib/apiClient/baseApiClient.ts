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
    console.log('📤 Sending GET request');
    console.log('URL:', url);
    console.log('Headers:', options.headers);
    const response = await this.request.get(url, options);
    // expect(response.ok()).toBeTruthy();
    const responseJson = await response.json();
    console.log('ResponseJson:', responseJson);
    return response;
  }

  async post(url: string, data: any, headers?: Record<string, string>): Promise<APIResponse> {
    console.log('📤 Sending POST request');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Body:', JSON.stringify(data, null, 2));

    const response = await this.request.post(url, {
      data,
      headers,
    });

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
