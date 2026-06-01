export function getSupabaseUrl() {
  return process.env.SUPABASE_URL || '';
}

export function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_KEY || '';
}

export async function supabaseQuery(table: string, method: string = 'GET', body?: any, filters?: any) {
  const url = new URL(`${getSupabaseUrl()}/rest/v1/${table}`);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const options: any = {
    method,
    headers: {
      'apikey': getSupabaseKey(),
      'Authorization': `Bearer ${getSupabaseKey()}`,
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), options);
    if (!response.ok) {
      const errorData = await response.json();
      return { data: null, error: errorData };
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export const db = null;

export function initializeDatabase() {
  console.log('✓ Database initialized (REST API mode)');
  return Promise.resolve();
}
