/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form, Select, Space } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';

export default function VersionSelect({
    selectVersion,
    versionList,
    onChangeVersion,
}: {
    selectVersion: string;
    versionList: { value: string; label: string }[];
    onChangeVersion: (version: string) => void;
}): React.JSX.Element {
    return (
        <div className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Form.Item
                name='Version'
                label={
                    <p
                        className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                    >
                        {'Version'}
                    </p>
                }
                labelCol={{ span: 2, style: { textAlign: 'left' } }}
            >
                <Space wrap>
                    <Select
                        value={selectVersion}
                        className={serviceOrderStyles.versionDropDown}
                        onChange={onChangeVersion}
                        options={versionList}
                    />
                </Space>
            </Form.Item>
        </div>
    );
}
