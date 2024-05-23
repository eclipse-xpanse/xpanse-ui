/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Badge, Col, Row, Tag } from 'antd';
import React from 'react';
import YAML from 'yaml';
import oclDisplayStyles from '../../../../styles/ocl-display.module.css';
import { Billing } from '../../../../xpanse-api/generated';

export function BillingText({ billing }: { billing: Billing }): React.JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (billing) {
        const yamlDocument = new YAML.Document();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        yamlDocument.contents = billing;
        return (
            <Row>
                {billing.billingModes.map((billingMode) => {
                    if (billingMode === billing.defaultBillingMode) {
                        return (
                            <Col key={billingMode}>
                                <Badge.Ribbon
                                    className={oclDisplayStyles.oclDataDisplayDefaultBillingMode}
                                    text='default'
                                    color={'green'}
                                >
                                    <Tag
                                        className={oclDisplayStyles.oclDataDisplayDefaultBillingModeTag}
                                        color={'blue'}
                                    >
                                        {billingMode}
                                    </Tag>
                                </Badge.Ribbon>
                            </Col>
                        );
                    } else {
                        return (
                            <Col key={billingMode}>
                                <Tag className={oclDisplayStyles.oclDataDisplayDefaultBillingModeTag} color={'blue'}>
                                    {billingMode}
                                </Tag>
                            </Col>
                        );
                    }
                })}
            </Row>
        );
    }
    return <></>;
}
