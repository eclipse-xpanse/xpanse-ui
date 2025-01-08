import { useMutation } from '@tanstack/react-query';
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
