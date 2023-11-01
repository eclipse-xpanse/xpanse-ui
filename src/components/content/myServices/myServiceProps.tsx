import { DeployResource } from '../../../xpanse-api/generated';
import React from 'react';

export interface DeployResourceDataType {
    key: React.Key;
    resourceType: DeployResource.kind;
    resourceId: string;
    name: React.JSX.Element;
}
