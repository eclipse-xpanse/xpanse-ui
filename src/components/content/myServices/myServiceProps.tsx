import { DeployResource } from '../../../xpanse-api/generated';

export interface DeployResourceDataType {
    key: React.Key;
    resourceType: DeployResource.kind;
    resourceId: string;
    name: string;
}
