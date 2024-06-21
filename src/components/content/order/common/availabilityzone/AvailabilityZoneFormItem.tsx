/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Form } from 'antd';
import React from 'react';
import serviceOrderStyles from '../../../../../styles/service-order.module.css';
import { AvailabilityZoneConfig, UserOrderableServiceVo } from '../../../../../xpanse-api/generated';
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
}: {
    availabilityZoneConfig: AvailabilityZoneConfig;
    selectRegion: string;
    onAvailabilityZoneChange: (varName: string, availabilityZone: string | undefined) => void;
    selectAvailabilityZones: Record<string, string | undefined>;
    selectCsp: UserOrderableServiceVo['csp'];
}): React.JSX.Element {
    const availabilityZonesVariableRequest = useGetAvailabilityZonesForRegionQuery(selectCsp, selectRegion);
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
            return <AvailabilityZoneError retryRequest={retryRequest} error={availabilityZonesVariableRequest.error} />;
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
            label={<p className={serviceOrderStyles.orderFormItemName}>{availabilityZoneConfig.displayName}</p>}
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
