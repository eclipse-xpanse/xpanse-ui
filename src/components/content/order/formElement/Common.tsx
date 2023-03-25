/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ChangeEvent } from 'react';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Ocl, Region, RegisterServiceEntity } from '../../../../xpanse-api/generated';
import { Area } from '../../../utils/Area';

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
}

export interface DeployParamItem {
    item: DeployParam;

    [key: string]: any;
}

export function listToMap(list: any[], key: string): Map<string, any[]> {
    let map: Map<string, any[]> = new Map<string, any[]>();
    list.map((val) => {
        if (!map.has(val[key])) {
            map.set(
                val[key],
                list.filter((data) => data[key] === val[key])
            );
        }
    });
    return map;
}

export function filterAreaList(
    selectVersion: string,
    selectCsp: string,
    versionMapper: Map<string, RegisterServiceEntity[]>
): Area[] {
    let oclList: Ocl[] = [];
    const areaMapper: Map<string, Area[]> = new Map<string, Area[]>();
    versionMapper.forEach((v, k) => {
        if (k === selectVersion) {
            let ocls: Ocl[] = [];
            v.map((registerServiceEntity) => {
                if (registerServiceEntity.ocl instanceof Ocl) {
                    ocls.push(registerServiceEntity.ocl);
                }
            });
            oclList = ocls;
        }
    });
    oclList
        .filter((v) => (v as Ocl).serviceVersion === selectVersion)
        .flatMap((v) => {
            if (!v || !v.cloudServiceProvider) {
                return { key: '', label: '' };
            }
            if (!v.cloudServiceProvider.name) {
                return { key: '', label: '' };
            }
            if (v.cloudServiceProvider.name !== selectCsp) {
                return { key: '', label: '' };
            }
            const result: Map<string, Region[]> = listToMap(v.cloudServiceProvider.regions, 'area');
            let areas: Area[] = [];

            result.forEach((v, k) => {
                let regions: string[] = [];

                v.forEach((region) => {
                    if (region.name != null) {
                        regions.push(region.name);
                    }
                });
                let area: Area = { name: k, regions: regions };
                areas.push(area);
            });
            areaMapper.set(v.cloudServiceProvider.name || '', areas || []);
        });
    return areaMapper.get(selectCsp) || [];
}
