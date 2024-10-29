/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Col, Empty, Form, Input, Row, Tooltip } from 'antd';
import React from 'react';
import '../../../../styles/app.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { ServiceConfigurationDetails, UserOrderableServiceVo } from '../../../../xpanse-api/generated';

export const CurrentServiceConfigurationDetails = ({
    userOrderableServiceVo,
    serviceConfigurationDetails,
}: {
    userOrderableServiceVo: UserOrderableServiceVo | undefined;
    serviceConfigurationDetails: ServiceConfigurationDetails | undefined;
}): React.JSX.Element => {
    const getDescriptionForKey = (key: string): string | undefined => {
        const param = userOrderableServiceVo?.configurationParameters?.find((param) => param.name === key);
        return param?.description ?? 'No description available';
    };

    return (
        <>
            {userOrderableServiceVo && serviceConfigurationDetails ? (
                <Form
                    key='currentConfig'
                    layout='inline'
                    disabled={true}
                    className={serviceOrderStyles.orderFormInlineDisplay}
                >
                    <Row className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
                        <Col span={6} className={serviceOrderStyles.orderFormLabel}>
                            <Form.Item
                                label={
                                    <p
                                        className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                                    >
                                        {'Config Last Updated At'}
                                    </p>
                                }
                                labelCol={{ style: { textAlign: 'left' } }}
                            ></Form.Item>
                        </Col>
                        <Col span={18}>
                            <Input value={serviceConfigurationDetails.updatedTime} />
                        </Col>
                    </Row>
                    {serviceConfigurationDetails.configuration &&
                        Object.entries(serviceConfigurationDetails.configuration).map(([key, value]) => (
                            <Row key={key} className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
                                <Col span={6} className={serviceOrderStyles.orderFormLabel}>
                                    <Form.Item
                                        key={key}
                                        label={
                                            <p
                                                className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                                            >
                                                <Tooltip placement='rightTop' title={getDescriptionForKey(key)}>
                                                    {key}&nbsp;
                                                    <QuestionCircleOutlined />
                                                </Tooltip>
                                            </p>
                                        }
                                        labelCol={{ style: { textAlign: 'left' } }}
                                    ></Form.Item>
                                </Col>
                                <Col span={18}>
                                    <Input value={String(value)} />
                                </Col>
                            </Row>
                        ))}
                </Form>
            ) : (
                <Empty />
            )}
        </>
    );
};
