/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useCallback, useEffect, useState } from 'react';
import { Flavor, Ocl, RegisterServiceEntity } from '../../../../xpanse-api/generated';
import { Select, Space } from 'antd';

interface FlavorItem {
    value: string;
    label: string;
    price: string;
}

export default function FlavorSelect({
    selectVersion,
    selectCsp,
    versionMapper,
    onChangeHandler,
}: {
    selectVersion: string;
    selectCsp: string;
    versionMapper: Map<string, RegisterServiceEntity[]>;
    onChangeHandler: (value: string) => void;
}): JSX.Element {
    const [flavorMapper, setFlavorMapper] = useState<Map<string, Flavor[]>>(new Map<string, Flavor[]>());
    const [flavorOptions, setFlavorOptions] = useState<FlavorItem[]>([]);
    const [selectFlavor, setSelectFlavor] = useState<string>('');

    const onChangeFlavor = useCallback(
        (flavors: FlavorItem[], value: string) => {
            setSelectFlavor(value);
            onChangeHandler(value);
        },
        [onChangeHandler]
    );

    useEffect(() => {
        let oclList: Ocl[] = [];
        versionMapper.forEach((v, k) => {
            if (k === selectVersion) {
                for (let registerServiceEntity of v) {
                    if (registerServiceEntity.ocl instanceof Ocl) {
                        oclList.push(registerServiceEntity.ocl);
                    }
                }
            }
        });
        let flavors = new Map<string, Flavor[]>();
        oclList
            .filter((v) => (v as Ocl).serviceVersion === selectVersion)
            .forEach((v) => {
                flavors.set(v.serviceVersion || '', v.flavors || []);
            });
        setFlavorMapper(flavors);
    }, [selectVersion, versionMapper, selectCsp]);

    useEffect(() => {
        const flavorList: Flavor[] = flavorMapper.get(selectVersion) || [];
        let flavors: { value: string; label: string; price: string }[] = [];
        if (flavorList.length > 0) {
            for (let flavor of flavorList) {
                let flavorItem = { value: flavor.name, label: flavor.name, price: flavor.fixedPrice.toString() };
                flavors.push(flavorItem);
            }
            setFlavorOptions(flavors);
            onChangeFlavor(flavors, flavors[0].value);
        }
    }, [selectVersion, flavorMapper, onChangeFlavor]);

    return (
        <>
            <div className={'cloud-provider-tab-class region-flavor-content'}>Flavor:</div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <Space wrap>
                    <Select
                        className={'select-box-class'}
                        value={selectFlavor}
                        style={{ width: 450 }}
                        onChange={(value) => {
                            onChangeFlavor(flavorOptions, value);
                        }}
                        options={flavorOptions}
                    />
                </Space>
            </div>
        </>
    );
}
