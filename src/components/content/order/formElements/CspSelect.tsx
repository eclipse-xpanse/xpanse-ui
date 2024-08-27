/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Col, Form, Image, Row } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { csp, name } from '../../../../xpanse-api/generated';
import { cspMap } from '../../common/csp/CspLogo';

export default function CspSelect({
    selectCsp,
    cspList,
    onChangeHandler,
}: {
    selectCsp: csp;
    cspList: csp[];
    onChangeHandler: undefined | ((csp: csp) => void);
}): React.JSX.Element {
    return (
        <Row className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Col className={serviceOrderStyles.orderFormLabel}>
                <Form.Item
                    name='Cloud Service Provider'
                    label={
                        <p
                            className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                        >
                            {'Cloud Service Provider'}
                        </p>
                    }
                    labelCol={{ style: { textAlign: 'left' } }}
                ></Form.Item>
            </Col>
            <Col>
                <Row>
                    {onChangeHandler && cspList.length > 0 ? (
                        cspList.map((item, index) => {
                            return (
                                <div
                                    onClick={() => {
                                        onChangeHandler(item);
                                    }}
                                    key={index}
                                    className={
                                        selectCsp.valueOf() === item.valueOf()
                                            ? serviceOrderStyles.cloudProviderSelectHover
                                            : serviceOrderStyles.cloudProviderSelect
                                    }
                                >
                                    <Image
                                        width={200}
                                        height={56}
                                        src={cspMap.get(item as unknown as name)?.logo}
                                        alt={item}
                                        preview={false}
                                        fallback={'https://img.shields.io/badge/-' + item + '-gray'}
                                    />
                                    <div className={serviceOrderStyles.serviceTypeOptionInfo} />
                                </div>
                            );
                        })
                    ) : (
                        <div className={serviceOrderStyles.servicesContentBody}>
                            <div className={serviceOrderStyles.cloudProviderSelectHover}>
                                <Image
                                    width={200}
                                    height={56}
                                    src={cspMap.get(selectCsp as unknown as name)?.logo}
                                    alt={selectCsp}
                                    preview={false}
                                    fallback={
                                        'https://img.shields.io/badge/-' +
                                        (selectCsp.length === 0 ? '' : selectCsp.toString()) +
                                        '-gray'
                                    }
                                />
                                <div className={serviceOrderStyles.serviceTypeOptionInfo} />
                            </div>
                        </div>
                    )}
                </Row>
            </Col>
        </Row>
    );
}
