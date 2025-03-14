/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Row } from 'antd';
import React from 'react';
import myServicesStyles from '../../../../styles/my-services.module.css';
import { Option } from './myServiceProps.tsx';

export const SelectMyServicesColumns = ({
    checkedValues,
    columnOptions,
    handleColumnChange,
    handleColumnsSelectAll,
    handleColumnsSelectNone,
}: {
    checkedValues: string[];
    columnOptions: Option[];
    handleColumnChange: (checkedValues: string[]) => void;
    handleColumnsSelectAll: () => void;
    handleColumnsSelectNone: () => void;
}): React.JSX.Element => {
    return (
        <div>
            <div className={myServicesStyles.selectColumnsButton}>
                <Button type='primary' onClick={handleColumnsSelectAll}>
                    <CheckCircleOutlined />
                    Select All
                </Button>
                &nbsp;&nbsp;
                <Button type='default' onClick={handleColumnsSelectNone}>
                    <CloseCircleOutlined /> Clear Selection
                </Button>
            </div>
            <div className={myServicesStyles.columnsContainer}>
                <Checkbox.Group
                    className={myServicesStyles.selectColumns}
                    onChange={handleColumnChange}
                    value={checkedValues}
                >
                    <Row gutter={[16, 0]}>
                        {columnOptions.map((option, index) => (
                            <Col xs={12} md={8} key={index}>
                                <Checkbox value={option.value}>{option.label}</Checkbox>
                            </Col>
                        ))}
                    </Row>
                </Checkbox.Group>
            </div>
        </div>
    );
};
