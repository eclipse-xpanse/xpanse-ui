/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Select, Space } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';

export const RegionSelection = ({
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
        <div className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Form.Item
                name='selectRegion'
                label={
                    <p
                        className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                    >
                        {'Region'}
                    </p>
                }
                labelCol={{ span: 2, style: { textAlign: 'left' } }}
                rules={[{ required: true, message: 'Region is required' }]}
            >
                <Space wrap>
                    <Select
                        className={serviceOrderStyles.selectBoxClass}
                        defaultValue={selectRegion}
                        value={selectRegion}
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
    );
};
