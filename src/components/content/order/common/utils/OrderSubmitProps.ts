import { DeployRequest, ServiceProviderContactDetails } from '../../../../../xpanse-api/generated';
import { DeployParam } from '../../types/DeployParam';

export interface OrderSubmitProps {
    id: string;
    category: DeployRequest.category;
    name: string;
    version: string;
    region: string;
    area: string;
    csp: DeployRequest.csp;
    flavor: string;
    params: DeployParam[];
    serviceHostingType: DeployRequest.serviceHostingType;
    contactServiceDetails: ServiceProviderContactDetails | undefined;
    availabilityZones?: Record<string, string>;
    eula: string | undefined;
}
