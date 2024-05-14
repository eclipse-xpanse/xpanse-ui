/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Billing } from '../../../../xpanse-api/generated';
import YAML from 'yaml';
import { Col, Row, Tag } from 'antd';
import React from 'react';

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
                    return (
                        <Col key={billingMode}>
                            <Tag color={'blue'}>{billingMode}</Tag>
                        </Col>
                    );
                })}
            </Row>
        );
    }
    return <></>;
}
