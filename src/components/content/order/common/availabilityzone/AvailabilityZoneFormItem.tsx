/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AvailabilityZoneConfig, UserOrderableServiceVo } from '../../../../../xpanse-api/generated';
import { Form } from 'antd';
import React from 'react';
import { AvailabilityZoneButton } from './AvailabilityZoneButton';
import useGetAvailabilityZonesForRegionQuery from '../utils/useGetAvailabilityZonesForRegionQuery';
import { AvailabilityZoneLoading } from './AvailabilityZoneLoading';
import { AvailabilityZoneError } from './AvailabilityZoneError';

export function AvailabilityZoneFormItem({
    availabilityZoneConfig,
    selectRegion,
    onAvailabilityZoneChange,
    selectAvailabilityZones,
    selectCsp,
}: {
    availabilityZoneConfig: AvailabilityZoneConfig;
    selectRegion: string;
    onAvailabilityZoneChange: (varName: string, availabilityZone: string | undefined) => void;
    selectAvailabilityZones: Record<string, string | undefined>;
    selectCsp: UserOrderableServiceVo.csp;
}): React.JSX.Element {
    const availabilityZonesVariableRequest = useGetAvailabilityZonesForRegionQuery(selectCsp, selectRegion);

    function getFormContent() {
        if (availabilityZonesVariableRequest.isLoading || availabilityZonesVariableRequest.isFetching) {
            return <AvailabilityZoneLoading key={availabilityZoneConfig.varName} />;
        }
        if (availabilityZonesVariableRequest.isError) {
            return (
                <AvailabilityZoneError
                    error={availabilityZonesVariableRequest.error}
                    key={availabilityZoneConfig.varName}
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
        <Form.Item
            key={availabilityZoneConfig.varName}
            label={<p style={{ fontWeight: 'bold' }}>{availabilityZoneConfig.displayName}</p>}
            required={availabilityZoneConfig.mandatory}
            rules={[
                {
                    required: availabilityZoneConfig.mandatory,
                    message: availabilityZoneConfig.displayName + 'is required',
                },
                { type: 'string' },
            ]}
        >
            {getFormContent()}
        </Form.Item>
    );
}
