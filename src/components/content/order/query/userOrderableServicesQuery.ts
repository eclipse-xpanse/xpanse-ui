import { useQuery } from '@tanstack/react-query';
import { ServiceCatalogService, ServiceVo } from '../../../../xpanse-api/generated';

export default function userOrderableServicesQuery(category: ServiceVo.category, serviceName: string | undefined) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery({
        queryKey: ['availableServices', category, serviceName],
        queryFn: () => ServiceCatalogService.listAvailableServices(category, undefined, serviceName),
        refetchOnWindowFocus: false,
    });
}
