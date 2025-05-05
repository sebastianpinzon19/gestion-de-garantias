// Función simple para codificar datos en base64
function encodeBase64(data) {
  if (typeof window !== 'undefined') {
    return btoa(JSON.stringify(data));
  }
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

// Función simple para decodificar datos de base64
function decodeBase64(str) {
  try {
    if (typeof window !== 'undefined') {
      return JSON.parse(atob(str));
    }
    return JSON.parse(Buffer.from(str, 'base64').toString());
  } catch (error) {
    return null;
  }
}

// Función para generar un token simple
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };
  return encodeBase64(payload);
}

// Función para verificar un token simple
export function verifyToken(token) {
  try {
    const payload = decodeBase64(token);
    if (!payload || !payload.exp) return null;
    
    // Verificar si el token ha expirado
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

// Función para el servidor (API routes)
export function setTokenCookie(token, response) {
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 horas
    path: '/'
  });
  return response;
}

// Función para el servidor (API routes)
export function clearTokenCookie(response) {
  response.cookies.delete('token');
  return response;
}

// Función para el cliente
export function getTokenFromCookie() {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

// Función para el cliente
export function removeTokenCookie() {
  if (typeof window === 'undefined') return;
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
} 