/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { AvailabilityZoneConfig } from '../../../../../xpanse-api/generated';
import { Alert, Flex, Radio } from 'antd';
import React from 'react';

export function AvailabilityZoneButton({
    availabilityZoneConfig,
    availabilityZones,
    selectRegion,
    onAvailabilityZoneChange,
    selectAvailabilityZones,
}: {
    availabilityZoneConfig: AvailabilityZoneConfig;
    availabilityZones: string[] | undefined;
    selectRegion: string;
    onAvailabilityZoneChange: (varName: string, availabilityZone: string | undefined) => void;
    selectAvailabilityZones: Record<string, string | undefined>;
}) {
    const DEFAULT_OPTIONAL_AZ = 'Not Selected';
    function onChange(varName: string, availabilityZone: string) {
        onAvailabilityZoneChange(varName, availabilityZone !== DEFAULT_OPTIONAL_AZ ? availabilityZone : undefined);
    }

    return (
        <>
            <Flex vertical gap='middle'>
                {availabilityZoneConfig.mandatory ? (
                    availabilityZones && availabilityZones.length > 0 ? (
                        <Radio.Group
                            buttonStyle='solid'
                            onChange={(e) => {
                                onChange(availabilityZoneConfig.varName, e.target.value as string);
                            }}
                            value={selectAvailabilityZones[availabilityZoneConfig.varName]}
                        >
                            {availabilityZones.map((availabilityZonesVariable) => (
                                <Radio.Button
                                    name={availabilityZoneConfig.displayName}
                                    key={availabilityZonesVariable}
                                    value={availabilityZonesVariable}
                                >
                                    {availabilityZonesVariable}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    ) : (
                        <Alert
                            message={'No availability zones found for region ' + selectRegion}
                            description={'Mandatory field. Cannot proceed.'}
                            type={'error'}
                            closable={false}
                        />
                    )
                ) : (
                    <Radio.Group
                        buttonStyle='solid'
                        onChange={(e) => {
                            onChange(availabilityZoneConfig.varName, e.target.value as string);
                        }}
                        value={selectAvailabilityZones[availabilityZoneConfig.varName] ?? DEFAULT_OPTIONAL_AZ}
                    >
                        {availabilityZones && availabilityZones.length > 0 ? (
                            <>
                                <Radio.Button name={availabilityZoneConfig.displayName} value={DEFAULT_OPTIONAL_AZ}>
                                    {DEFAULT_OPTIONAL_AZ}
                                </Radio.Button>
                                {availabilityZones.map((availabilityZonesVariable) => (
                                    <Radio.Button
                                        name={availabilityZoneConfig.displayName}
                                        key={availabilityZonesVariable}
                                        value={availabilityZonesVariable}
                                    >
                                        {availabilityZonesVariable}
                                    </Radio.Button>
                                ))}
                                ;
                            </>
                        ) : (
                            <Alert
                                message={'No availability zones found for region ' + selectRegion}
                                description={'Optional field. Can proceed.'}
                                type={'success'}
                                closable={false}
                            />
                        )}
                    </Radio.Group>
                )}
            </Flex>
        </>
    );
}
