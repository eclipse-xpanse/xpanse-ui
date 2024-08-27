/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Col, Form, Row, Select, Space } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { Region } from '../../../../xpanse-api/generated';
import { formatRegionInfo, parseRegionInfo } from '../formDataHelpers/regionHelper';
import { RegionDropDownInfo } from '../types/RegionDropDownInfo';

export const RegionSelection = ({
    selectArea,
    selectRegion,
    onChangeRegion,
    regionList,
    disabled,
}: {
    selectArea: string;
    selectRegion: Region;
    onChangeRegion?: (newRegion: Region) => void;
    regionList?: RegionDropDownInfo[];
    disabled?: boolean;
}): React.JSX.Element => {
    const shownRegion = formatRegionInfo(selectRegion, false);
    return (
        <Row className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Col className={serviceOrderStyles.orderFormLabel}>
                <Form.Item
                    name='selectRegion'
                    label={
                        <p
                            className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                        >
                            {'Region'}
                        </p>
                    }
                    labelCol={{ style: { textAlign: 'left' } }}
                    rules={[{ required: true, message: 'Region is required' }]}
                ></Form.Item>
            </Col>
            <Col>
                <Space wrap>
                    <Select
                        className={serviceOrderStyles.selectBoxClass}
                        defaultValue={shownRegion}
                        value={shownRegion}
                        onChange={(newRegion) => {
                            if (onChangeRegion) {
                                const newRegionObj = parseRegionInfo(newRegion);
                                newRegionObj.area = selectArea;
                                onChangeRegion(newRegionObj);
                            }
                        }}
                        options={regionList && regionList.length > 0 ? regionList : []}
                        disabled={disabled}
                    />
                </Space>
            </Col>
        </Row>
    );
};
