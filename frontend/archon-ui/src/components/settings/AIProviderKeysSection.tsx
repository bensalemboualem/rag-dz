/**
 * AI Provider Keys Section
 * Displays and manages API keys for AI providers (OpenAI, Anthropic, Groq, etc.)
 */

import { useState, useEffect } from 'react';
import { Key, Save, Eye, EyeOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import {
  providerCredentialsService,
  ProviderCredential
} from '../../services/providerCredentialsService';
import { useToast } from '../../features/shared/hooks/useToast';

interface ProviderKeyRow {
  provider: string;
  displayName: string;
  apiKey: string;
  apiKeyPreview: string;
  hasKey: boolean;
  showValue: boolean;
  hasChanges: boolean;
  originalKey: string;
}

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic (Claude)',
  groq: 'Groq',
  deepseek: 'DeepSeek',
  google: 'Google (Gemini)',
  mistral: 'Mistral AI',
  cohere: 'Cohere',
  together: 'Together AI',
  openrouter: 'OpenRouter',
};

export const AIProviderKeysSection = () => {
  const [providers, setProviders] = useState<ProviderKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { showToast } = useToast();

  // Load providers on mount
  useEffect(() => {
    loadProviders();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = providers.some(p => p.hasChanges);
    setHasUnsavedChanges(hasChanges);
  }, [providers]);

  const loadProviders = async () => {
    try {
      setLoading(true);

      const data = await providerCredentialsService.listProviders();

      const providerRows: ProviderKeyRow[] = data.map(p => ({
        provider: p.provider,
        displayName: PROVIDER_DISPLAY_NAMES[p.provider] || p.provider,
        apiKey: '', // Don't expose actual key from backend
        apiKeyPreview: p.api_key_preview,
        hasKey: p.has_key,
        showValue: false,
        hasChanges: false,
        originalKey: '',
      }));

      setProviders(providerRows);
    } catch (err) {
      console.error('Failed to load provider credentials:', err);
      showToast('Failed to load AI provider keys', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProvider = (provider: string, apiKey: string) => {
    setProviders(providers.map(p => {
      if (p.provider === provider) {
        return {
          ...p,
          apiKey,
          hasChanges: apiKey !== p.originalKey,
        };
      }
      return p;
    }));
  };

  const toggleValueVisibility = (provider: string) => {
    setProviders(providers.map(p => {
      if (p.provider === provider) {
        // Can't show value if it hasn't been entered yet
        if (!p.apiKey && p.hasKey) {
          showToast('Enter a new key to edit this provider', 'warning');
          return p;
        }
        return { ...p, showValue: !p.showValue };
      }
      return p;
    }));
  };

  const saveChanges = async () => {
    setSaving(true);
    let hasErrors = false;

    for (const provider of providers) {
      if (provider.hasChanges) {
        if (!provider.apiKey || provider.apiKey.trim().length === 0) {
          showToast(`${provider.displayName}: API key cannot be empty`, 'error');
          hasErrors = true;
          continue;
        }

        try {
          await providerCredentialsService.createOrUpdateProvider({
            provider: provider.provider,
            api_key: provider.apiKey,
            is_encrypted: false,
          });
        } catch (err) {
          console.error(`Failed to save ${provider.displayName}:`, err);
          showToast(`Failed to save ${provider.displayName}`, 'error');
          hasErrors = true;
        }
      }
    }

    if (!hasErrors) {
      showToast('All provider keys saved successfully!', 'success');
      await loadProviders(); // Reload to get fresh masked data
    }

    setSaving(false);
  };

  const cancelChanges = () => {
    loadProviders();
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <Card accentColor="blue" className="space-y-5">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card accentColor="blue" className="p-8">
      <div className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
          Manage API keys for AI providers used by IAFactory services (Backend, BMAD, Bolt).
        </p>

        {/* Info Banner */}
        <div className="p-3 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Stored Keys Are Masked</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Existing keys are displayed masked for security. Enter a new key to update a provider.
            </p>
          </div>
        </div>

        {/* Providers list */}
        <div className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-[180px_1fr_80px] gap-4 px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div>Provider</div>
            <div>API Key</div>
            <div>Status</div>
          </div>

          {/* Provider rows */}
          {providers.map((provider) => (
            <div
              key={provider.provider}
              className="grid grid-cols-[180px_1fr_80px] gap-4 items-center"
            >
              {/* Provider name column */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {provider.displayName}
                </span>
              </div>

              {/* API Key input column */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  {/* Show preview if has key and no changes */}
                  {provider.hasKey && !provider.hasChanges ? (
                    <div className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-mono text-gray-500 dark:text-gray-400">
                      {provider.apiKeyPreview}
                    </div>
                  ) : (
                    <input
                      type={provider.showValue ? 'text' : 'password'}
                      value={provider.apiKey}
                      onChange={(e) => updateProvider(provider.provider, e.target.value)}
                      placeholder={provider.hasKey ? 'Enter new key to update...' : 'Enter API key...'}
                      className="w-full px-3 py-2 pr-10 rounded-md border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-sm font-mono"
                    />
                  )}

                  {/* Show/Hide button - only for editable fields */}
                  {(!provider.hasKey || provider.hasChanges) && (
                    <button
                      type="button"
                      onClick={() => toggleValueVisibility(provider.provider)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title={provider.showValue ? 'Hide value' : 'Show value'}
                    >
                      {provider.showValue ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Status column */}
              <div className="flex items-center justify-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    provider.hasKey
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {provider.hasKey ? '✓ Set' : 'Empty'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {hasUnsavedChanges && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-2">
            <Button
              variant="ghost"
              onClick={cancelChanges}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={saveChanges}
              accentColor="blue"
              disabled={saving}
              className="shadow-blue-500/20 shadow-sm"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}

        {/* Refresh button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={loadProviders}
            disabled={loading}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
    </Card>
  );
};
