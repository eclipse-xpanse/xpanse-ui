import { useMutation } from '@tanstack/react-query';
import { ServiceService } from '../../../../xpanse-api/generated';

export function useDestroyRequestSubmitQuery() {
    return useMutation({
        mutationFn: (id: string) => {
            return ServiceService.destroy(id);
        },
    });
}
