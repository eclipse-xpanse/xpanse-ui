import { useMutation, useMutationState } from '@tanstack/react-query';
import { deleteServiceTemplate } from '../../../../../xpanse-api/generated';

const deleteKey: string = 'delete';

export function useDeleteRequest(id: string) {
    return useMutation({
        mutationKey: [id, deleteKey],
        mutationFn: () => {
            return deleteServiceTemplate({
                path: {
                    serviceTemplateId: id,
                },
            });
        },
        gcTime: 0,
    });
}

export function useGetDeleteMutationState(id: string) {
    return useMutationState({
        filters: { mutationKey: [id, deleteKey], exact: true },
        select: (mutation) => mutation.state,
    });
}
