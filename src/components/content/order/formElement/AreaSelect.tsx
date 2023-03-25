/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { Area } from '../../../utils/Area';
import { Tab } from 'rc-tabs/lib/interface';
import { RegisterServiceEntity } from '../../../../xpanse-api/generated';
import { filterAreaList } from './Common';

export default function AreaSelect({
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
    const [selectArea, setSelectArea] = useState<string>('');
    const [items, setItems] = useState<Tab[]>([]);

    const onChangeAreaValue = (key: string) => {
        setSelectArea(key);
        onChangeHandler(key);
    };

    useEffect(() => {
        const areaList: Area[] = filterAreaList(selectVersion, selectCsp, versionMapper);
        if (areaList.length > 0) {
            const areaItems: Tab[] = areaList.map((area: Area) => {
                if (!area.name) {
                    return { key: '', label: '' };
                }
                const name = area.name;
                return {
                    label: name,
                    key: name,
                    children: [],
                };
            });

            setItems(areaItems);
            onChangeAreaValue(areaList[0].name);
        } else {
            return;
        }
    }, [selectCsp, selectVersion, versionMapper]);

    return (
        <>
            <div className={'cloud-provider-tab-class content-title'}>
                <Tabs
                    type='card'
                    size='middle'
                    activeKey={selectArea}
                    tabPosition={'top'}
                    items={items}
                    onChange={onChangeAreaValue}
                />
            </div>
        </>
    );
}
