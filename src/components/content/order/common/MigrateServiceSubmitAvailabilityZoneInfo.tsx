/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Flex, Form, Radio } from 'antd';
import React from 'react';
import '../../../../styles/service-order.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { AvailabilityZoneConfig } from '../../../../xpanse-api/generated';

export const MigrateServiceSubmitAvailabilityZoneInfo = ({
    availabilityZoneConfigs,
    availabilityZones,
}: {
    availabilityZoneConfigs: AvailabilityZoneConfig[] | undefined;
    availabilityZones: Record<string, string>;
}): React.JSX.Element => {
    return (
        <div className={serviceOrderStyles.orderFormSelectionFirstInGroup}>
            {availabilityZoneConfigs
                ? availabilityZoneConfigs.map((availabilityZone) => (
                      <Form.Item
                          key={availabilityZone.varName}
                          name={availabilityZone.displayName}
                          label={
                              <p
                                  className={`${serviceOrderStyles.orderFormSelectionStyle} ${serviceOrderStyles.orderFormItemName}`}
                              >
                                  {availabilityZone.displayName}
                              </p>
                          }
                          labelCol={{ span: 2, style: { textAlign: 'left' } }}
                      >
                          <Flex vertical gap='middle'>
                              <Radio.Group buttonStyle='solid' disabled={true}>
                                  <Radio.Button
                                      name={availabilityZone.displayName}
                                      key={availabilityZone.varName}
                                      value={
                                          Object.keys(availabilityZones).length > 0
                                              ? availabilityZones[availabilityZone.varName]
                                              : {}
                                      }
                                  >
                                      {availabilityZones[availabilityZone.varName]
                                          ? availabilityZones[availabilityZone.varName]
                                          : 'Not Selected'}
                                  </Radio.Button>
                              </Radio.Group>
                          </Flex>
                      </Form.Item>
                  ))
                : undefined}
        </div>
    );
};
