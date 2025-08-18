import { useMutation } from '@tanstack/react-query';
import { Options, republish, type RepublishData } from '../../../../../xpanse-api/generated';

const republishKey: string = 'republish';

export function useRepublishRequest(serviceTemplateId: string) {
    return useMutation({
        mutationKey: [serviceTemplateId, republishKey],
        mutationFn: async () => {
            const request: Options<RepublishData> = {
                path: {
                    serviceTemplateId: serviceTemplateId,
                },
            };
            const response = await republish(request);
            return response.data;
        },
        gcTime: 0,
    });
}
