/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ChangeEvent } from 'react';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import {
    Billing,
    CloudServiceProvider,
    CreateRequest,
    DeployVariable,
    Region,
    UserAvailableServiceVo,
} from '../../../../xpanse-api/generated';
import { Area } from '../../../utils/Area';
import { OrderSubmitProps } from '../create/OrderSubmit';
import { getUserName } from '../../../oidc/OidcConfig';
import { OidcIdToken } from '@axa-fr/react-oidc/dist/ReactOidc';

export type TextInputEventHandler = (event: ChangeEvent<HTMLInputElement>) => void;
export type NumberInputEventHandler = (value: number | string | null) => void;
export type CheckBoxOnChangeHandler = (e: CheckboxChangeEvent) => void;
export type SwitchOnChangeHandler = (checked: boolean) => void;
export type ParamOnChangeHandler =
    | TextInputEventHandler
    | NumberInputEventHandler
    | CheckBoxOnChangeHandler
    | SwitchOnChangeHandler;

export interface DeployParam {
    name: string;
    kind: string;
    type: string;
    example: string;
    description: string;
    value: string;
    mandatory: boolean;
    validator: string;
    sensitiveScope: DeployVariable.sensitiveScope;
}

export const getFlavorList = (rsp: UserAvailableServiceVo[]): { value: string; label: string; price: string }[] => {
    const flavorList = rsp[0].flavors;
    const flavors: { value: string; label: string; price: string }[] = [];
    if (flavorList.length > 0) {
        for (const flavor of flavorList) {
            const flavorItem = { value: flavor.name, label: flavor.name, price: flavor.fixedPrice.toString() };
            flavors.push(flavorItem);
        }
    }
    return flavors;
};

export const getBilling = (rsp: UserAvailableServiceVo[], csp: string): Billing => {
    let billing: Billing = {
        model: '' as string,
        period: 'daily' as Billing.period,
        currency: 'euro' as Billing.currency,
    };
    rsp.forEach((userAvailableServiceVo) => {
        if (csp === userAvailableServiceVo.csp.valueOf()) {
            billing = userAvailableServiceVo.billing;
        }
    });
    return billing;
};

export const filterAreaList = (rsp: UserAvailableServiceVo[], selectCsp: string): Area[] => {
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    rsp.forEach((userAvailableServiceVo) => {
        if (userAvailableServiceVo.csp.valueOf() === selectCsp) {
            const areaRegions: Map<string, Region[]> = new Map<string, Region[]>();
            for (const region of userAvailableServiceVo.regions) {
                if (region.area && !areaRegions.has(region.area)) {
                    areaRegions.set(
                        region.area,
                        userAvailableServiceVo.regions.filter((data) => data.area === region.area)
                    );
                }
            }
            const areas: Area[] = [];
            areaRegions.forEach((areaRegions, area) => {
                const regionNames: string[] = [];
                areaRegions.forEach((region) => {
                    if (region.name) {
                        regionNames.push(region.name);
                    }
                });
                areas.push({ name: area, regions: regionNames });
            });
            areaMapper.set(userAvailableServiceVo.csp, areas);
        }
    });
    return areaMapper.get(selectCsp) ?? [];
};

export const getRegionList = (
    rsp: UserAvailableServiceVo[],
    selectCsp: string,
    selectArea: string
): { value: string; label: string }[] => {
    const areas: Area[] = filterAreaList(rsp, selectCsp);
    let regions: { value: string; label: string }[] = [];
    if (areas.length > 0) {
        regions = areas
            .filter((v) => v.name === selectArea)
            .flatMap((v) => {
                return v.regions.map((region) => {
                    if (!region) {
                        return { value: '', label: '' };
                    }
                    return {
                        value: region,
                        label: region,
                    };
                });
            });
    }
    return regions;
};

export const getDeployParams = (
    userAvailableServiceVoList: UserAvailableServiceVo[],
    selectCsp: CloudServiceProvider.name | undefined,
    selectArea: string,
    selectRegion: string,
    selectFlavor: string
): OrderSubmitProps => {
    let service: UserAvailableServiceVo | undefined;
    let registeredServiceId = '';

    userAvailableServiceVoList.forEach((userAvailableServiceVo) => {
        if (userAvailableServiceVo.csp.toString() === selectCsp?.toString()) {
            registeredServiceId = userAvailableServiceVo.id;
            service = userAvailableServiceVo;
        }
    });

    const props: OrderSubmitProps = {
        id: registeredServiceId,
        category: service?.category as CreateRequest.category,
        name: service?.name ?? '',
        version: service?.version ?? '',
        region: selectRegion,
        area: selectArea,
        csp: service?.csp as CreateRequest.csp,
        flavor: selectFlavor,
        params: new Array<DeployParam>(),
    };

    if (service !== undefined) {
        for (const param of service.variables) {
            props.params.push({
                name: param.name,
                kind: param.kind,
                type: param.dataType,
                example: param.example === undefined ? '' : param.example,
                description: param.description,
                value: param.value === undefined ? '' : param.value,
                mandatory: param.mandatory,
                validator: param.validator === undefined ? '' : param.validator,
                sensitiveScope:
                    param.sensitiveScope === undefined ? DeployVariable.sensitiveScope.NONE : param.sensitiveScope,
            });
        }
    }

    return props;
};

export const getCreateRequest = (
    props: OrderSubmitProps,
    customerServiceName: string,
    oidcIdToken: OidcIdToken
): CreateRequest => {
    const createRequest: CreateRequest = {
        category: props.category,
        csp: props.csp,
        flavor: props.flavor,
        region: props.region,
        serviceName: props.name,
        version: props.version,
        customerServiceName: customerServiceName,
        userName: getUserName(oidcIdToken.idTokenPayload as object),
    };

    const serviceRequestProperties: Record<string, string> = {};
    for (const item of props.params) {
        if (item.kind === 'variable' || item.kind === 'env') {
            serviceRequestProperties[item.name] = item.value;
        }
    }

    createRequest.serviceRequestProperties = serviceRequestProperties;
    return createRequest;
};

export enum OperationType {
    Deploy = 'deploy',
    Destroy = 'destroy',
}

export enum MigrationSteps {
    ExportServiceData = 0,
    SelectADestination = 1,
    DeployServiceOnTheNewDestination = 2,
    ImportServiceData = 3,
    DestroyTheOldService = 4,
}

export enum MigrationStatus {
    Processing = 'process',
    Finished = 'finish',
    Failed = 'error',
}
