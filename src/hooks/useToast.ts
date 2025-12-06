import { toast } from 'sonner';

interface Toast {
  type?: 'success' | 'error';
  message: string;
}

export const useToast = ({ type = 'error', message }: Toast) => {
  toast[type](message);
};
