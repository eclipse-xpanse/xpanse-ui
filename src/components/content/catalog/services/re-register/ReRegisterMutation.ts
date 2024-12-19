import { useMutation, useMutationState } from '@tanstack/react-query';
import { reAddToCatalog, type ReAddToCatalogData } from '../../../../../xpanse-api/generated';

const reRegisterKey: string = 're-register';

export function useReRegisterRequest(serviceTemplateId: string) {
    return useMutation({
        mutationKey: [serviceTemplateId, reRegisterKey],
        mutationFn: () => {
            const data: ReAddToCatalogData = {
                serviceTemplateId: serviceTemplateId,
            };
            return reAddToCatalog(data);
        },
        gcTime: 0,
    });
}

export function useGetReRegisterMutationState(serviceTemplateId: string) {
    return useMutationState({
        filters: { mutationKey: [serviceTemplateId, reRegisterKey], exact: true },
        select: (mutation) => mutation.state,
    });
}
