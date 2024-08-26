/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Flex, Radio } from 'antd';
import React from 'react';
import { AvailabilityZoneConfig, Region } from '../../../../../xpanse-api/generated';

export function AvailabilityZoneButton({
    availabilityZoneConfig,
    availabilityZones,
    selectRegion,
    onAvailabilityZoneChange,
    selectAvailabilityZones,
}: {
    availabilityZoneConfig: AvailabilityZoneConfig;
    availabilityZones: string[] | undefined;
    selectRegion: Region;
    onAvailabilityZoneChange: (varName: string, availabilityZone: string | undefined) => void;
    selectAvailabilityZones: Record<string, string | undefined>;
}): React.JSX.Element {
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
                            message={'No availability zones found for region ' + selectRegion.name}
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
                                message={'No availability zones found for region ' + selectRegion.name}
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
