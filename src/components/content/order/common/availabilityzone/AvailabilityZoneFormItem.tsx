/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Col, Form, Row } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../../styles/service-order.module.css';
import { AvailabilityZoneConfig, csp, Region } from '../../../../../xpanse-api/generated';
import useGetAvailabilityZonesForRegionQuery from '../utils/useGetAvailabilityZonesForRegionQuery';
import { AvailabilityZoneButton } from './AvailabilityZoneButton';
import { AvailabilityZoneError } from './AvailabilityZoneError';
import { AvailabilityZoneLoading } from './AvailabilityZoneLoading';

export function AvailabilityZoneFormItem({
    availabilityZoneConfig,
    selectRegion,
    onAvailabilityZoneChange,
    selectAvailabilityZones,
    selectCsp,
    selectedServiceTemplateId,
}: {
    availabilityZoneConfig: AvailabilityZoneConfig;
    selectRegion: Region;
    onAvailabilityZoneChange: (varName: string, availabilityZone: string | undefined) => void;
    selectAvailabilityZones: Record<string, string | undefined>;
    selectCsp: csp;
    selectedServiceTemplateId: string;
}): React.JSX.Element {
    const availabilityZonesVariableRequest = useGetAvailabilityZonesForRegionQuery(
        selectCsp,
        selectRegion,
        selectedServiceTemplateId
    );
    const retryRequest = () => {
        if (availabilityZonesVariableRequest.isError) {
            void availabilityZonesVariableRequest.refetch();
        }
    };

    function getFormContent() {
        if (availabilityZonesVariableRequest.isLoading || availabilityZonesVariableRequest.isFetching) {
            return <AvailabilityZoneLoading key={availabilityZoneConfig.varName} />;
        }
        if (availabilityZonesVariableRequest.isError) {
            return (
                <AvailabilityZoneError
                    isAvailabilityZoneMandatory={availabilityZoneConfig.mandatory}
                    retryRequest={retryRequest}
                    error={availabilityZonesVariableRequest.error}
                />
            );
        }
        if (availabilityZonesVariableRequest.data) {
            return (
                <AvailabilityZoneButton
                    availabilityZoneConfig={availabilityZoneConfig}
                    selectRegion={selectRegion}
                    availabilityZones={availabilityZonesVariableRequest.data}
                    onAvailabilityZoneChange={onAvailabilityZoneChange}
                    selectAvailabilityZones={selectAvailabilityZones}
                />
            );
        }
        return null;
    }

    return (
        <Row className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            <Col className={serviceOrderStyles.orderFormLabel}>
                <Form.Item
                    key={availabilityZoneConfig.varName}
                    label={
                        <p
                            className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                        >
                            {availabilityZoneConfig.displayName}
                        </p>
                    }
                    labelCol={{ style: { textAlign: 'left' } }}
                    required={availabilityZoneConfig.mandatory}
                    rules={[
                        {
                            required: availabilityZoneConfig.mandatory,
                            message: availabilityZoneConfig.displayName + 'is required',
                        },
                        { type: 'string' },
                    ]}
                ></Form.Item>
            </Col>
            <Col className={serviceOrderStyles.orderFormAzContent}>{getFormContent()}</Col>
        </Row>
    );
}
