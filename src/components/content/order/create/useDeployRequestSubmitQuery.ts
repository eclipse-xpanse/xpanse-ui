import { useMutation } from '@tanstack/react-query';
import { CreateRequest, ServiceService } from '../../../../xpanse-api/generated';

export function useDeployRequestSubmitQuery() {
    return useMutation({
        mutationFn: (createRequest: CreateRequest) => {
            return ServiceService.deploy(createRequest);
        },
    });
}
