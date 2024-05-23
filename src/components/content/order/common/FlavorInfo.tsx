/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Select, Space } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { Flavor } from '../types/Flavor';

export const FlavorInfo = ({
    selectFlavor,
    flavorList,
    disabled,
    onChangeFlavor,
}: {
    selectFlavor: string;
    flavorList?: Flavor[];
    disabled?: boolean;
    onChangeFlavor?: (newFlavor: string) => void;
}): React.JSX.Element => {
    return (
        <>
            <div className={serviceOrderStyles.orderFormSelectionStyle}>
                <Form.Item
                    name='selectFlavor'
                    label='Flavor'
                    rules={[{ required: true, message: 'Flavor is required' }]}
                >
                    <Space wrap>
                        <Select
                            className={serviceOrderStyles.selectBoxClass}
                            value={selectFlavor}
                            style={{ width: 450 }}
                            onChange={(newFlavor) => {
                                if (onChangeFlavor) {
                                    onChangeFlavor(newFlavor);
                                }
                            }}
                            options={flavorList && flavorList.length > 0 ? flavorList : []}
                            disabled={disabled !== undefined}
                        />
                    </Space>
                </Form.Item>
            </div>
        </>
    );
};
