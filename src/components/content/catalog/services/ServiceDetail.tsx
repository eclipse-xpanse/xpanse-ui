/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Descriptions, Divider, Space, Tag } from 'antd';
import { CloudUploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Area, OclDetailVo } from '../../../../xpanse-api/generated';

function ServiceDetail({
    serviceDetails,
    serviceAreas,
}: {
    serviceDetails: OclDetailVo;
    serviceAreas: Area[];
}): JSX.Element {
    const PLACE_HOLDER_UNKNOWN_VALUE: string = 'NOT PROVIDED';
    return (
        <>
            <div className={'catalog-detail-class'}>
                <h3>
                    <CloudUploadOutlined />
                    &nbsp;Available Regions
                </h3>
                <Space size={[0, 8]} wrap>
                    {serviceAreas.map((area, index) => (
                        <Tag color='orange'>
                            {area.name}:&nbsp;{area.regions ? area.regions.join(', ') : PLACE_HOLDER_UNKNOWN_VALUE}
                        </Tag>
                    ))}
                </Space>
                <Divider />
            </div>
            <h3>
                <InfoCircleOutlined />
                &nbsp;Basic Information
            </h3>
            <Descriptions bordered column={1}>
                <Descriptions.Item label='Description' labelStyle={{ width: '230px' }}>
                    {serviceDetails.description}
                </Descriptions.Item>
                <Descriptions.Item label='Category'>{serviceDetails ? serviceDetails.category : ''}</Descriptions.Item>
                <Descriptions.Item label='Provider'>
                    {serviceDetails && serviceDetails.cloudServiceProvider
                        ? serviceDetails.cloudServiceProvider.name
                        : ''}
                </Descriptions.Item>
                <Descriptions.Item label='Service Version'>
                    {serviceDetails ? serviceDetails.serviceVersion : ''}
                </Descriptions.Item>
                <Descriptions.Item label='Billing Mode'>
                    {serviceDetails && serviceDetails.billing ? serviceDetails.billing.model : ''}
                </Descriptions.Item>
                <Descriptions.Item label='Register Time'>
                    {serviceDetails ? serviceDetails.createTime?.toUTCString() : ''}
                </Descriptions.Item>
                <Descriptions.Item label='Update Time'>
                    {serviceDetails ? serviceDetails.lastModifiedTime?.toUTCString() : ''}
                </Descriptions.Item>
                <Descriptions.Item label='Status'>
                    {serviceDetails ? serviceDetails.serviceState : ''}
                </Descriptions.Item>
                <Descriptions.Item label='Flavors'>
                    {serviceDetails && serviceDetails.flavors
                        ? serviceDetails.flavors
                              .map((flavor) => {
                                  return flavor.name;
                              })
                              .join(',')
                        : ''}
                </Descriptions.Item>
            </Descriptions>
        </>
    );
}

export default ServiceDetail;
