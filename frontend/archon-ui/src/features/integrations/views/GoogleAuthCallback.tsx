/**
 * GoogleAuthCallback Component
 * Handles OAuth2 callback from Google
 */

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { exchangeCodeForTokens } from '../services/googleService';

export function GoogleAuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const errorParam = params.get('error');
      const state = params.get('state');

      // Verify state
      const storedState = sessionStorage.getItem('google_oauth_state');
      if (state !== storedState) {
        setError('Invalid state parameter');
        setStatus('error');
        return;
      }

      if (errorParam) {
        setError(errorParam);
        setStatus('error');
        // Send error to parent window
        if (window.opener) {
          window.opener.postMessage(
            { type: 'google-oauth-callback', error: errorParam },
            window.location.origin
          );
          setTimeout(() => window.close(), 2000);
        }
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setStatus('error');
        return;
      }

      try {
        const authState = await exchangeCodeForTokens(code);

        setStatus('success');

        // Send success to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'google-oauth-callback',
              accessToken: authState.accessToken,
              refreshToken: authState.refreshToken,
              expiresAt: authState.expiresAt,
              email: authState.email,
              picture: authState.picture,
            },
            window.location.origin
          );
          setTimeout(() => window.close(), 2000);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMsg);
        setStatus('error');

        if (window.opener) {
          window.opener.postMessage(
            { type: 'google-oauth-callback', error: errorMsg },
            window.location.origin
          );
          setTimeout(() => window.close(), 2000);
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <div className="text-center p-8">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Connexion en cours...
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Veuillez patienter
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Connexion réussie!
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Cette fenêtre va se fermer automatiquement
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Erreur de connexion
            </h1>
            <p className="text-sm text-red-400 mt-2">
              {error}
            </p>
            <button
              onClick={() => window.close()}
              className="mt-4 px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 text-sm hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
            >
              Fermer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
