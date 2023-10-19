/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ChangeEvent } from 'react';
import {
    Billing,
    DeployRequest,
    CredentialVariables,
    DeployRequest,
    DeployVariable,
    FlavorBasic,
    Region,
    UserOrderableServiceVo,
} from '../../../../xpanse-api/generated';
import { Area } from '../../../utils/Area';
import { OrderSubmitProps } from '../create/OrderSubmit';

export type TextInputEventHandler = (event: ChangeEvent<HTMLInputElement>) => void;
export type NumberInputEventHandler = (value: number | string | null) => void;
export type SwitchOnChangeHandler = (checked: boolean) => void;
export type SelectOnChangeHandler = (selected: CredentialVariables.csp) => void;
export type ParamOnChangeHandler =
    | TextInputEventHandler
    | NumberInputEventHandler
    | SwitchOnChangeHandler
    | SelectOnChangeHandler;

export interface DeployParam {
    name: string;
    kind: string;
    type: string;
    example: string;
    description: string;
    value: string;
    mandatory: boolean;
    sensitiveScope: DeployVariable.sensitiveScope;
    valueSchema: Record<string, Record<string, unknown>> | undefined;
}

export const getFlavorMapper = (rsp: UserOrderableServiceVo[]): Map<string, FlavorBasic[]> => {
    const flavorMapper: Map<string, FlavorBasic[]> = new Map<string, FlavorBasic[]>();
    rsp.forEach((userOrderableServiceVo) => {
        flavorMapper.set(userOrderableServiceVo.csp, userOrderableServiceVo.flavors);
    });
    return flavorMapper;
};

export const getFlavorListByCsp = (
    flavorMapper: Map<string, FlavorBasic[]>,
    csp: string
): { value: string; label: string; price: string }[] => {
    if (csp.length === 0) {
        return [];
    }
    const flavorList: FlavorBasic[] | undefined = flavorMapper.get(csp);
    const flavors: { value: string; label: string; price: string }[] = [];
    if (flavorList !== undefined && flavorList.length > 0) {
        for (const flavor of flavorList) {
            const flavorItem = { value: flavor.name, label: flavor.name, price: flavor.fixedPrice.toString() };
            flavors.push(flavorItem);
        }
    }
    return flavors;
};

export const getBilling = (rsp: UserOrderableServiceVo[], csp: string | undefined): Billing => {
    let billing: Billing = {
        model: '' as string,
        period: 'daily' as Billing.period,
        currency: 'euro' as Billing.currency,
    };
    rsp.forEach((userOrderableServiceVo) => {
        if (csp !== undefined && csp === userOrderableServiceVo.csp.valueOf()) {
            billing = userOrderableServiceVo.billing;
        }
    });
    return billing;
};

export const filterAreaList = (rsp: UserOrderableServiceVo[], selectCsp: string | undefined): Area[] => {
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    if (selectCsp === undefined) {
        return [];
    }
    rsp.forEach((userOrderableServiceVo) => {
        if (userOrderableServiceVo.csp.valueOf() === selectCsp) {
            const areaRegions: Map<string, Region[]> = new Map<string, Region[]>();
            for (const region of userOrderableServiceVo.regions) {
                if (region.area && !areaRegions.has(region.area)) {
                    areaRegions.set(
                        region.area,
                        userOrderableServiceVo.regions.filter((data) => data.area === region.area)
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
            areaMapper.set(userOrderableServiceVo.csp, areas);
        }
    });
    return areaMapper.get(selectCsp) ?? [];
};

export const getRegionList = (
    rsp: UserOrderableServiceVo[],
    selectCsp: string | undefined,
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
    userOrderableServiceVoList: UserOrderableServiceVo[],
    selectCsp: string,
    selectArea: string,
    selectRegion: string,
    selectFlavor: string
): OrderSubmitProps => {
    let service: UserOrderableServiceVo | undefined;
    let registeredServiceId = '';

    userOrderableServiceVoList.forEach((userOrderableServiceVo) => {
        if (userOrderableServiceVo.csp.toString() === selectCsp) {
            registeredServiceId = userOrderableServiceVo.id;
            service = userOrderableServiceVo;
        }
    });

    const props: OrderSubmitProps = {
        id: registeredServiceId,
        category: service?.category as DeployRequest.category,
        name: service?.name ?? '',
        version: service?.version ?? '',
        region: selectRegion,
        area: selectArea,
        csp: service?.csp as DeployRequest.csp,
        flavor: selectFlavor,
        params: new Array<DeployParam>(),
    };

    if (service !== undefined) {
        for (const param of service.variables) {
            props.params.push({
                name: param.name,
                kind: param.kind,
                type: param.dataType,
                example: param.example ?? '',
                description: param.description,
                value: param.value ?? '',
                mandatory: param.mandatory,
                sensitiveScope: param.sensitiveScope ?? DeployVariable.sensitiveScope.NONE,
                valueSchema: param.valueSchema ?? undefined,
            });
        }
    }

    return props;
};

export enum OperationType {
    Deploy = 'deploy',
    Destroy = 'destroy',
    Migrate = 'migrate',
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
export enum DeployJsonSchema {
    MINLENGTH = 'minLength',
    MAXLENGTH = 'maxLength',
    MINIMUM = 'minimum',
    MAXIMUM = 'maximum',
    PATTERN = 'pattern',
    ENUM = 'enum',
}
