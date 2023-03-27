/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { useCallback, useEffect, useState } from 'react';
import { RegisterServiceEntity } from '../../../../xpanse-api/generated';
import { Area } from '../../../utils/Area';
import { filterAreaList } from './AreaSelect';
import { Select, Space } from 'antd';

export default function RegionSelect({
    selectVersion,
    selectCsp,
    selectArea,
    versionMapper,
    onChangeHandler,
}: {
    selectVersion: string;
    selectCsp: string;
    selectArea: string;
    versionMapper: Map<string, RegisterServiceEntity[]>;
    onChangeHandler: (value: string) => void;
}): JSX.Element {
    const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: '' }]);
    const [selectRegion, setSelectRegion] = useState<string>('');

    const handleChangeRegion = useCallback(
        (value: string) => {
            setSelectRegion(value);
            onChangeHandler(value);
        },
        [onChangeHandler]
    );

    useEffect(() => {
        const areaList: Area[] = filterAreaList(selectVersion, selectCsp, versionMapper);
        if (areaList.length > 0) {
            const regions: { value: string; label: string }[] = areaList
                .filter((v) => (v as Area).name === selectArea)
                .flatMap((v) => {
                    if (!v || !v.regions) {
                        return { value: '', label: '' };
                    }
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
            if (regions.length > 0) {
                setRegionOptions(regions);
                handleChangeRegion(regions[0].value);
            }
        } else {
            return;
        }
    }, [handleChangeRegion, selectArea, selectCsp, selectVersion, versionMapper]);

    return (
        <>
            <div className={'cloud-provider-tab-class region-flavor-content'}>Region:</div>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <Space wrap>
                    <Select
                        className={'select-box-class'}
                        defaultValue={selectRegion}
                        value={selectRegion}
                        style={{ width: 450 }}
                        onChange={handleChangeRegion}
                        options={regionOptions}
                    />
                </Space>
            </div>
        </>
    );
}
