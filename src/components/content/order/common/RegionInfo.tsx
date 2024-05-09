/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import { Form, Select, Space } from 'antd';
import '../../../../styles/service_order.css';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';

export const RegionInfo = ({
    selectRegion,
    onChangeRegion,
    regionList,
    disabled,
}: {
    selectRegion: string;
    onChangeRegion?: (newRegion: string) => void;
    regionList?: RegionDropDownInfo[];
    disabled?: boolean;
}): React.JSX.Element => {
    return (
        <>
            <div className={'cloud-provider-tab-class region-flavor-content'}>
                <Form.Item
                    name='selectRegion'
                    label='Region'
                    rules={[{ required: true, message: 'Region is required' }]}
                >
                    <Space wrap>
                        <Select
                            className={'select-box-class'}
                            defaultValue={selectRegion}
                            value={selectRegion}
                            style={{ width: 450 }}
                            onChange={(newRegion) => {
                                if (onChangeRegion) {
                                    onChangeRegion(newRegion);
                                }
                            }}
                            options={regionList && regionList.length > 0 ? regionList : []}
                            disabled={disabled !== undefined}
                        />
                    </Space>
                </Form.Item>
            </div>
        </>
    );
};
