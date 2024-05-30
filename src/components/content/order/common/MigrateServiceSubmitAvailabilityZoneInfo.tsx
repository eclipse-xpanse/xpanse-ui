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
        <>
            {availabilityZoneConfigs
                ? availabilityZoneConfigs.map((availabilityZone) => (
                      <Form.Item
                          key={availabilityZone.varName}
                          name={availabilityZone.displayName}
                          label={<p className={serviceOrderStyles.orderFormItemName}>{availabilityZone.displayName}</p>}
                          className={serviceOrderStyles.selectCloudProviderClass}
                      >
                          <Flex vertical gap='middle'>
                              <Radio.Group buttonStyle='solid' disabled={true}>
                                  <Radio.Button
                                      name={availabilityZone.displayName}
                                      key={availabilityZone.varName}
                                      value={availabilityZones[availabilityZone.varName]}
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
        </>
    );
};
