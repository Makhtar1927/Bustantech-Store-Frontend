import { useAuthStore } from '../store/useAuthStore';

// Utilisation d'une variable d'environnement pour l'API en production (Vercel/Render)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiFetch = async (endpoint, options = {}) => {
  // 1. On récupère le token de manière globale hors d'un composant React
  const token = useAuthStore.getState().token;

  // 2. On prépare les en-têtes par défaut
  const headers = {
    ...options.headers,
  };

  // On n'ajoute 'application/json' que s'il y a un body (POST/PUT) et que ce n'est pas un fichier
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // 3. Si l'admin est connecté, on attache le token sous la norme "Bearer"
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    // 4. On exécute la requête fetch modifiée
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    // Intercepte spécifiquement l'erreur réseau (ex: serveur éteint ou injoignable)
    console.error("Erreur réseau API :", error);
    throw new Error("Serveur injoignable. Vérifiez que le backend est bien lancé sur le port 5000.");
  }

  if (response.status === 401 && !endpoint.includes('/login')) {
    useAuthStore.getState().logout();
  }

  return response;
};

// --- Fonction spécifique pour l'upload de fichiers (XHR) avec progression ---
export const apiUploadWithProgress = (endpoint, formData, onProgress, method = 'POST') => {
  return new Promise((resolve, reject) => {
    const token = useAuthStore.getState().token;
    const xhr = new XMLHttpRequest();

    xhr.open(method, `${BASE_URL}${endpoint}`, true);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    // Écoute de l'événement de progression d'envoi
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    // Résultat de la requête
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        if (xhr.status === 401) {
          useAuthStore.getState().logout();
        }
        reject(new Error(xhr.responseText || "Erreur d'upload"));
      }
    };

    xhr.onerror = () => reject(new Error("Erreur réseau lors de l'upload"));
    xhr.send(formData);
  });
};