import { useMutation, useMutationState } from '@tanstack/react-query';
import { reRegisterServiceTemplate, type ReRegisterServiceTemplateData } from '../../../../../xpanse-api/generated';

const reRegisterKey: string = 're-register';

export function useReRegisterRequest(serviceTemplateId: string) {
    return useMutation({
        mutationKey: [serviceTemplateId, reRegisterKey],
        mutationFn: () => {
            const data: ReRegisterServiceTemplateData = {
                serviceTemplateId: serviceTemplateId,
            };
            return reRegisterServiceTemplate(data);
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
