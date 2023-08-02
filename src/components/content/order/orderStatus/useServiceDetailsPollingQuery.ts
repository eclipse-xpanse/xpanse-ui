import { useQuery } from '@tanstack/react-query';
import { ServiceDetailVo, ServiceService } from '../../../../xpanse-api/generated';
import { deploymentStatusPollingInterval } from '../../../utils/constants';

export function useServiceDetailsPollingQuery(
    uuid: string,
    refetchUntilStates: ServiceDetailVo.serviceDeploymentState[]
) {
    return useQuery(['getDeployedServiceDetailsById', uuid], () => ServiceService.getDeployedServiceDetailsById(uuid), {
        refetchInterval: (data) =>
            data && refetchUntilStates.includes(data.serviceDeploymentState) ? false : deploymentStatusPollingInterval,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
    });
}
