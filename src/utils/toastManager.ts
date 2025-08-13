import { toast, ToastContent, ToastOptions, Id } from 'react-toastify';

// Mapeia o último toast exibido por tipo/mensagem
const activeToasts: Record<string, Id> = {};

function getToastKey(content: ToastContent, type: string) {
  // Usa o texto e tipo para identificar o toast
  return `${type}:${typeof content === 'string' ? content : JSON.stringify(content)}`;
}

export function showToast(type: 'success' | 'error' | 'info' | 'warn', content: ToastContent, options?: ToastOptions) {
  const key = getToastKey(content, type);
  // Se já existe um toast ativo desse tipo/mensagem, não mostra outro
  if (activeToasts[key] && toast.isActive(activeToasts[key])) {
    return;
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
