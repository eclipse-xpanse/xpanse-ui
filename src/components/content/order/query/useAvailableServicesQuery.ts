import { useQuery } from '@tanstack/react-query';
import { ServiceCatalogService, ServiceVo } from '../../../../xpanse-api/generated';

export default function useAvailableServicesQuery(category: ServiceVo.category, serviceName: string | undefined) {
    return useQuery({
        queryKey: ['availableServices', category, serviceName],
        queryFn: () => ServiceCatalogService.listAvailableServices(category, undefined, serviceName),
        refetchOnWindowFocus: false,
    });
}
