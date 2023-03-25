/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useEffect, useState } from 'react';
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
    const [flavor, setFlavor] = useState<FlavorItem>({ value: '', label: '', price: '0' });

    const onChangeFlavor = (flavors: FlavorItem[], value: string) => {
        setSelectFlavor(value);
        setFlavor(flavors.filter((v) => v.value === value).at(0) as FlavorItem);
        onChangeHandler(value);
    };

    useEffect(() => {
        let oclList: Ocl[] = [];
        versionMapper.forEach((v, k) => {
            if (k === selectVersion) {
                v.map((registerServiceEntity) => {
                    if (registerServiceEntity.ocl instanceof Ocl) {
                        oclList.push(registerServiceEntity.ocl);
                    }
                });
            }
        });
        oclList
            .filter((v) => (v as Ocl).serviceVersion === selectVersion)
            .flatMap((v) => {
                flavorMapper.set(v.serviceVersion || '', v.flavors || []);
            });
        setFlavorMapper(flavorMapper);
    }, [selectVersion, versionMapper, selectCsp]);

    useEffect(() => {
        const flavorList: Flavor[] = flavorMapper.get(selectVersion) || [];
        let flavors: { value: string; label: string; price: string }[] = [];
        if (flavorList.length > 0) {
            flavorList.map((flavor) => {
                let flavorItem = { value: flavor.name, label: flavor.name, price: flavor.fixedPrice.toString() };
                flavors.push(flavorItem);
            });
            setFlavorOptions(flavors);
            onChangeFlavor(flavors, flavors[0].value);
        }
    }, [selectVersion, flavorMapper]);

    return (
        <>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                Flavor:
                <span className={'order-red-font'}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price:&nbsp;&nbsp;{flavor?.price}
                </span>
            </div>
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
