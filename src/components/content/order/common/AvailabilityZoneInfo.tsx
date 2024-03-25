/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React, { Dispatch, SetStateAction } from 'react';
import { Flex, Form, Radio, RadioChangeEvent } from 'antd';
import '../../../../styles/service_order.css';
import { AvailabilityZoneConfig } from '../../../../xpanse-api/generated';

export const AvailabilityZoneInfo = ({
    availabilityZones,
    availabilityZoneConfigs,
    selectAvailabilityZones,
    setSelectAvailabilityZones,
}: {
    availabilityZones: string[];
    availabilityZoneConfigs: AvailabilityZoneConfig[] | undefined;
    selectAvailabilityZones: Record<string, string>;
    setSelectAvailabilityZones: Dispatch<SetStateAction<Record<string, string>>>;
}): React.JSX.Element => {
    function onAvailabilityZoneChange(varName: string, e: RadioChangeEvent) {
        setSelectAvailabilityZones((prevState: Record<string, string>) => ({
            ...prevState,
            [varName]: e.target.value as string,
        }));
    }

    return (
        <>
            {availabilityZoneConfigs
                ? availabilityZoneConfigs.map((availabilityZone) => (
                      <Form.Item
                          key={availabilityZone.varName}
                          name={availabilityZone.displayName}
                          label={availabilityZone.displayName}
                          rules={[
                              {
                                  required: availabilityZone.mandatory,
                                  message: availabilityZone.displayName + 'is required',
                              },
                              { type: 'string' },
                          ]}
                      >
                          <Flex vertical gap='middle'>
                              {availabilityZone.mandatory ? (
                                  availabilityZones.length > 0 ? (
                                      <Radio.Group
                                          buttonStyle='solid'
                                          onChange={(e) => {
                                              onAvailabilityZoneChange(availabilityZone.varName, e);
                                          }}
                                          value={selectAvailabilityZones[availabilityZone.varName]}
                                      >
                                          {availabilityZones.map((availabilityZonesVariable) => (
                                              <Radio.Button
                                                  name={availabilityZone.displayName}
                                                  key={availabilityZone.varName}
                                                  value={availabilityZonesVariable}
                                              >
                                                  {availabilityZonesVariable}
                                              </Radio.Button>
                                          ))}
                                      </Radio.Group>
                                  ) : undefined
                              ) : (
                                  <Radio.Group
                                      buttonStyle='solid'
                                      onChange={(e) => {
                                          onAvailabilityZoneChange(availabilityZone.varName, e);
                                      }}
                                      value={selectAvailabilityZones[availabilityZone.varName]}
                                  >
                                      <Radio.Button name={availabilityZone.displayName} value={''}>
                                          {'Not Selected'}
                                      </Radio.Button>
                                      {availabilityZones.length > 0
                                          ? availabilityZones.map((availabilityZonesVariable) => (
                                                <Radio.Button
                                                    name={availabilityZone.displayName}
                                                    key={availabilityZone.varName}
                                                    value={availabilityZonesVariable}
                                                >
                                                    {availabilityZonesVariable}
                                                </Radio.Button>
                                            ))
                                          : undefined}
                                  </Radio.Group>
                              )}
                          </Flex>
                      </Form.Item>
                  ))
                : undefined}
        </>
    );
};
