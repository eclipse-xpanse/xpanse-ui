import { useMutation } from '@tanstack/react-query';
import { DeployRequest, ServiceService } from '../../../../xpanse-api/generated';

export function useDeployRequestSubmitQuery() {
    return useMutation({
        mutationFn: (createRequest: DeployRequest) => {
            return ServiceService.deploy(createRequest);
        },
    });
}
