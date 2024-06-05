import { useMutation, useMutationState } from '@tanstack/react-query';
import { ServiceVendorService } from '../../../../../xpanse-api/generated';

const reRegisterKey: string = 're-register';

export function useReRegisterRequest(id: string) {
    return useMutation({
        mutationKey: [id, reRegisterKey],
        mutationFn: () => {
            return ServiceVendorService.reRegisterServiceTemplate(id);
        },
        gcTime: 0,
    });
}

export function useGetReRegisterMutationState(id: string) {
    return useMutationState({
        filters: { mutationKey: [id, reRegisterKey], exact: true },
        select: (mutation) => mutation.state,
    });
}
