import toast from 'react-hot-toast';

export function useToast() {
  return {
    success: (msg) => toast.success(msg),
    error: (msg) =>
      toast.error(msg, {
        style: {
          background: 'rgba(15,15,26,0.95)',
          color: '#fff',
          border: '1px solid rgba(239,68,68,0.4)',
        },
      }),
    info: (msg) =>
      toast(msg, {
        icon: 'ℹ️',
        style: {
          background: 'rgba(15,15,26,0.95)',
          color: '#fff',
          border: '1px solid rgba(179,68,255,0.3)',
        },
      }),
    loading: (msg) => toast.loading(msg),
    dismiss: (id) => toast.dismiss(id),
  };
}

export default useToast;
