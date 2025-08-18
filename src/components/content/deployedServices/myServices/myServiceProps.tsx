/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import type { ColumnsType, ColumnType } from 'antd/es/table';
import { ColumnFilterItem } from 'antd/es/table/interface';
import React from 'react';
import {
    BillingMode,
    Category,
    Csp,
    DeployedService,
    DeployedServiceDetails,
    DeployResourceKind,
    ServiceDeploymentState,
    ServiceHostingType,
    ServiceState,
    VendorHostedDeployedServiceDetails,
} from '../../../../xpanse-api/generated';

export interface DeployResourceDataType {
    key: React.Key;
    resourceKind: DeployResourceKind;
    resourceId: string;
    resourceName: React.JSX.Element;
}

export function updateServiceIdFilters(resp: DeployedService[]): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    const serviceIdSet = new Set<string>('');
    resp.forEach((v) => {
        serviceIdSet.add(v.serviceId);
    });
    serviceIdSet.forEach((id) => {
        const filter = {
            text: id,
            value: id,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateVersionFilters(resp: DeployedService[]): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    const versionSet = new Set<string>('');
    resp.forEach((v) => {
        versionSet.add(v.version);
    });
    versionSet.forEach((version) => {
        const filter = {
            text: version,
            value: version,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateNameFilters(resp: DeployedService[]): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    const nameSet = new Set<string>('');
    resp.forEach((v) => {
        nameSet.add(v.name);
    });
    nameSet.forEach((name) => {
        const filter = {
            text: name,
            value: name,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateCategoryFilters(): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    Object.values(Category).forEach((category) => {
        const filter = {
            text: category,
            value: category,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateCspFilters(): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    Object.values(Csp).forEach((csp) => {
        const filter = {
            text: csp,
            value: csp,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateServiceDeploymentStateFilters(): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    Object.values(ServiceDeploymentState).forEach((serviceStateItem) => {
        const filter = {
            text: serviceStateItem,
            value: serviceStateItem,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateServiceStateFilters(): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    Object.values(ServiceState).forEach((serviceStateItem) => {
        const filter = {
            text: serviceStateItem,
            value: serviceStateItem,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateCustomerServiceNameFilters(resp: DeployedService[]): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    const customerServiceNameSet = new Set<string>('');
    resp.forEach((v) => {
        if (v.customerServiceName) {
            customerServiceNameSet.add(v.customerServiceName);
        }
    });
    customerServiceNameSet.forEach((name) => {
        const filter = {
            text: name,
            value: name,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateServiceHostingFilters(): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    Object.values(ServiceHostingType).forEach((serviceHostingType) => {
        const filter = {
            text: serviceHostingType,
            value: serviceHostingType,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateBillingModeFilters(): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    Object.values(BillingMode).forEach((billingMode) => {
        const filter = {
            text: billingMode,
            value: billingMode,
        };
        filters.push(filter);
    });
    return filters;
}

export function updateRegionFilters(resp: DeployedService[]): ColumnFilterItem[] {
    const filters: ColumnFilterItem[] = [];
    const regionNameSet = new Set<string>('');
    resp.forEach((v) => {
        if (v.region.name) {
            regionNameSet.add(v.region.name);
        }
    });
    regionNameSet.forEach((name) => {
        const filter = {
            text: name,
            value: name,
        };
        filters.push(filter);
    });
    return filters;
}

function isHasDeployedServiceProperties(details: VendorHostedDeployedServiceDetails | DeployedServiceDetails): boolean {
    return !!(details.deployedServiceProperties && Object.keys(details.deployedServiceProperties).length !== 0);
}

function isHasServiceRequestProperties(details: VendorHostedDeployedServiceDetails | DeployedServiceDetails): boolean {
    return !!(details.inputProperties && Object.keys(details.inputProperties).length !== 0);
}

function isHasDeployResources(details: DeployedServiceDetails): boolean {
    return !!details.deployResources && details.deployResources.length > 0;
}

/**
 * Whether the "Details" button should be disabled for the given deployed service record.
 *
 * The button is disabled if and only if the record does not have any deployed service properties,
 * service request properties, or deploy resources.
 *
 * @param record the deployed service record
 * @returns whether the button should be disabled
 */
export const isDisableDetails = (record: DeployedService) => {
    if (record.serviceHostingType === ServiceHostingType.SERVICE_VENDOR) {
        const details = record as VendorHostedDeployedServiceDetails;
        if (isHasDeployedServiceProperties(details) || isHasServiceRequestProperties(details)) {
            return false;
        }
    } else {
        const details = record as DeployedServiceDetails;
        if (
            isHasDeployedServiceProperties(details) ||
            isHasServiceRequestProperties(details) ||
            isHasDeployResources(details)
        ) {
            return false;
        }
    }
    return true;
};

export const isDisableScaleButton = (
    record: DeployedService,
    activeRecord: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined
): boolean => {
    if (
        activeRecord?.serviceId === record.serviceId ||
        record.serviceDeploymentState === ServiceDeploymentState.MODIFYING ||
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_FAILED ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROY_SUCCESSFUL ||
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYING ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROYING
    ) {
        return true;
    }
    return false;
};

export const isDisableModifyButton = (
    record: DeployedService,
    activeRecord: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined
): boolean => {
    if (
        activeRecord?.serviceId === record.serviceId ||
        (record.lockConfig?.modifyLocked !== undefined && record.lockConfig.modifyLocked) ||
        record.serviceDeploymentState === ServiceDeploymentState.MODIFYING ||
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_FAILED ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROY_SUCCESSFUL ||
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYING ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROYING
    ) {
        return true;
    }
    return false;
};

export const isDisableServicePortingButton = (
    record: DeployedService,
    activeRecord: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined
): boolean => {
    if (
        activeRecord?.serviceId === record.serviceId ||
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_FAILED ||
        record.serviceDeploymentState === ServiceDeploymentState.MODIFICATION_FAILED ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROY_SUCCESSFUL ||
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYING ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROYING
    ) {
        return true;
    }
    return false;
};

export const isDisableDestroyButton = (
    record: DeployedService,
    activeRecord: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined
): boolean => {
    if (
        (record.serviceDeploymentState !== ServiceDeploymentState.DESTROY_FAILED &&
            record.serviceDeploymentState !== ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL &&
            record.serviceDeploymentState !== ServiceDeploymentState.MODIFICATION_FAILED &&
            record.serviceDeploymentState !== ServiceDeploymentState.MODIFICATION_SUCCESSFUL) ||
        activeRecord?.serviceId === record.serviceId
    ) {
        return true;
    }
    return false;
};

export const isDisableStartButton = (
    record: DeployedService,
    activeRecord: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined,
    serviceStateStartQueryIsPending: boolean,
    serviceStateStopQueryIsPending: boolean,
    serviceStateRestartQueryIsPending: boolean
) => {
    if (
        record.serviceDeploymentState !== ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL &&
        record.serviceDeploymentState !== ServiceDeploymentState.MODIFICATION_SUCCESSFUL
    ) {
        if (record.serviceDeploymentState !== ServiceDeploymentState.DESTROY_FAILED) {
            return true;
        }
    }

    if (
        activeRecord?.serviceId === record.serviceId &&
        (serviceStateStartQueryIsPending || serviceStateStopQueryIsPending || serviceStateRestartQueryIsPending)
    ) {
        return true;
    }

    if (
        record.serviceState === ServiceState.STARTING ||
        record.serviceState === ServiceState.STOPPING ||
        record.serviceState === ServiceState.RESTARTING
    ) {
        return true;
    }

    return record.serviceState === ServiceState.RUNNING;
};

export const isDisabledStopOrRestartButton = (
    record: DeployedService,
    activeRecord: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined,
    serviceStateStartQueryIsPending: boolean,
    serviceStateStopQueryIsPending: boolean,
    serviceStateRestartQueryIsPending: boolean
) => {
    if (
        record.serviceDeploymentState !== ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL &&
        record.serviceDeploymentState !== ServiceDeploymentState.MODIFICATION_SUCCESSFUL
    ) {
        if (record.serviceDeploymentState !== ServiceDeploymentState.DESTROY_FAILED) {
            return true;
        }
    }

    if (
        activeRecord?.serviceId === record.serviceId &&
        (serviceStateStartQueryIsPending || serviceStateStopQueryIsPending || serviceStateRestartQueryIsPending)
    ) {
        return true;
    }

    if (
        record.serviceState === ServiceState.STARTING ||
        record.serviceState === ServiceState.STOPPING ||
        record.serviceState === ServiceState.RESTARTING
    ) {
        return true;
    }

    return record.serviceState === ServiceState.STOPPED;
};

export const isDisableRetryDeploymentButton = (record: DeployedService) => {
    return record.serviceDeploymentState === ServiceDeploymentState.DEPLOYING;
};

export const isDisableServiceConfigBtn = (record: DeployedService) => {
    if (
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROY_FAILED ||
        record.serviceDeploymentState === ServiceDeploymentState.MODIFICATION_SUCCESSFUL
    ) {
        if (record.serviceConfigurationDetails) {
            return false;
        }
    }
    return true;
};

export const isDisableServiceActionButton = (record: DeployedService) => {
    return !(
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_SUCCESSFUL ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROY_FAILED ||
        record.serviceDeploymentState === ServiceDeploymentState.MODIFICATION_SUCCESSFUL
    );
};

export const isDisableRecreateButton = (
    record: DeployedService,
    activeRecord: DeployedServiceDetails | VendorHostedDeployedServiceDetails | undefined,
    serviceStateStartQueryIsPending: boolean,
    serviceStateStopQueryIsPending: boolean,
    serviceStateRestartQueryIsPending: boolean
) => {
    if (
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYING ||
        record.serviceDeploymentState === ServiceDeploymentState.DEPLOYMENT_FAILED ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROYING ||
        record.serviceDeploymentState === ServiceDeploymentState.DESTROY_SUCCESSFUL ||
        record.serviceDeploymentState === ServiceDeploymentState.MODIFYING
    ) {
        return true;
    }

    if (
        activeRecord?.serviceId === record.serviceId &&
        (serviceStateStartQueryIsPending || serviceStateStopQueryIsPending || serviceStateRestartQueryIsPending)
    ) {
        return true;
    }

    return (
        record.serviceState === ServiceState.STARTING ||
        record.serviceState === ServiceState.STOPPING ||
        record.serviceState === ServiceState.RESTARTING
    );
};

export interface Option {
    label: string;
    value: string;
    disabled?: boolean;
}

export const showForExtraLargeScreenColumn = [
    'serviceId',
    'customerServiceName',
    'name',
    'version',
    'serviceHostingType',
    'billingMode',
    'region',
    'csp',
    'flavor',
    'createdTime',
    'serviceDeploymentState',
    'serviceState',
    'monitor',
    'operation',
];

export const showForLargeScreenColumn = [
    'serviceId',
    'customerServiceName',
    'name',
    'serviceHostingType',
    'billingMode',
    'region',
    'csp',
    'flavor',
    'serviceDeploymentState',
    'serviceState',
    'monitor',
    'operation',
];
export const showForExtraSmallScreenColumn = ['serviceId', 'customerServiceName', 'name', 'monitor', 'operation'];

export const getDefaultColumns = (columns: ColumnsType<DeployedService>): string[] => {
    return columns.map((column) => (column as ColumnType<DeployedService>).dataIndex as string);
};
