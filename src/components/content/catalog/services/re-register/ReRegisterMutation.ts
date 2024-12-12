import { useMutation, useMutationState, useQuery } from '@tanstack/react-query';
import {
    getServiceTemplateDetailsById,
    type GetServiceTemplateDetailsByIdData,
    reRegisterServiceTemplate,
    type ReRegisterServiceTemplateData,
} from '../../../../../xpanse-api/generated';

const reRegisterKey: string = 're-register';

export function useReRegisterRequest(id: string) {
    return useMutation({
        mutationKey: [id, reRegisterKey],
        mutationFn: () => {
            const data: ReRegisterServiceTemplateData = {
                serviceTemplateId: id,
            };
            return reRegisterServiceTemplate(data);
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

export default function useGetServiceTemplateDetailsById(serviceTemplateId: string | undefined) {
    return useQuery({
        queryKey: ['getServiceTemplateDetailsById', serviceTemplateId],
        queryFn: () => {
            const data: GetServiceTemplateDetailsByIdData = {
                serviceTemplateId: serviceTemplateId ?? '',
            };
            return getServiceTemplateDetailsById(data);
        },
        enabled: serviceTemplateId !== undefined && serviceTemplateId.length > 0,
    });
}
