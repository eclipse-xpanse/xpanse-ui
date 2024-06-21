import { useMutation, useMutationState } from '@tanstack/react-query';
import { ReRegisterServiceTemplateData, reRegisterServiceTemplate } from '../../../../../xpanse-api/generated';

const reRegisterKey: string = 're-register';

export function useReRegisterRequest(id: string) {
    return useMutation({
        mutationKey: [id, reRegisterKey],
        mutationFn: () => {
            const data: ReRegisterServiceTemplateData = {
                id: id,
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
