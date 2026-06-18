import toast from 'react-hot-toast';

export function useToast() {
  return {
    success: (msg) => toast.success(msg),
    error: (msg) =>
      toast.error(msg, {
        style: {
          background: 'rgba(11,12,13,0.95)',
          color: '#fff',
          border: '1px solid rgba(239,68,68,0.4)',
        },
      }),
    info: (msg) =>
      toast(msg, {
        icon: 'ℹ️',
        style: {
          background: 'rgba(11,12,13,0.95)',
          color: '#fff',
          border: '1px solid rgba(201,206,212,0.3)',
        },
      }),
    loading: (msg) => toast.loading(msg),
    dismiss: (id) => toast.dismiss(id),
  };
}

export default useToast;
