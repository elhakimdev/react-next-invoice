export async function apiClient<T>(url: string, method: 'POST' | 'GET' | 'PUT' | 'DELETE', body?: unknown): Promise<T> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${error}`);
    throw error;
  }
}
