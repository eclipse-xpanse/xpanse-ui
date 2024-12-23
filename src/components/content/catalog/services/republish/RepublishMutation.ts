import { useMutation, useMutationState } from '@tanstack/react-query';
import { republish, type RepublishData } from '../../../../../xpanse-api/generated';

const republishKey: string = 'republish';

export function useRepublishRequest(serviceTemplateId: string) {
    return useMutation({
        mutationKey: [serviceTemplateId, republishKey],
        mutationFn: () => {
            const data: RepublishData = {
                serviceTemplateId: serviceTemplateId,
            };
            return republish(data);
        },
        gcTime: 0,
    });
}

export function useGetRepublishMutationState(serviceTemplateId: string) {
    return useMutationState({
        filters: { mutationKey: [serviceTemplateId, republishKey], exact: true },
        select: (mutation) => mutation.state,
    });
}
