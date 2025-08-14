/**
 * Gerencia exibição de toasts evitando duplicação da mesma mensagem+tipo.
 */
import { toast, ToastContent, ToastOptions, Id } from 'react-toastify';

// Mapeia o último toast exibido por chave única (type + content serializado)
const activeToasts: Record<string, Id> = {};

/** Gera chave determinística para um toast pelo conteúdo/tipo */
function getToastKey(content: ToastContent, type: string) {
  return `${type}:${typeof content === 'string' ? content : JSON.stringify(content)}`;
}

/**
 * Exibe um toast (success/error/info/warn) garantindo que não haja duplicado ativo.
 * Ao fechar, remove a referência para permitir novo toast igual no futuro.
 */
export function showToast(type: 'success' | 'error' | 'info' | 'warn', content: ToastContent, options?: ToastOptions) {
  const key = getToastKey(content, type);
  if (activeToasts[key] && toast.isActive(activeToasts[key])) {
    return; // já exibindo
  }
  const id = toast[type](content, {
    ...options,
    onClose: () => {
      delete activeToasts[key];
      if (options && typeof options.onClose === 'function') options.onClose();
    },
  });
  activeToasts[key] = id;
}
