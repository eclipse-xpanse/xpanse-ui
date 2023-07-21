/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Descriptions, Divider, Space, Tag } from 'antd';
import { CloudUploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { UserAvailableServiceVo } from '../../../../xpanse-api/generated';
import { Area } from '../../../utils/Area';
import { ApiDoc } from '../../order/ApiDoc';
import { convertStringArrayToUnorderedList } from '../../../utils/generateUnorderedList';

function ServiceDetail({
    serviceDetails,
    serviceAreas,
}: {
    serviceDetails: UserAvailableServiceVo;
    serviceAreas: Area[];
}): JSX.Element {
    return (
        <>
            <div className={'catalog-detail-class'}>
                <h3>
                    <CloudUploadOutlined />
                    &nbsp;Available Regions
                </h3>
                <Space size={[0, 8]} wrap>
                    {serviceAreas.map((area) => (
                        <Tag color='orange'>
                            {area.name}:&nbsp;{area.regions.join(', ')}
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
                <Descriptions.Item label='Category'>{serviceDetails.category}</Descriptions.Item>
                <Descriptions.Item label='Provider'>{serviceDetails.csp}</Descriptions.Item>
                <Descriptions.Item label='Service Version'>{serviceDetails.version}</Descriptions.Item>
                <Descriptions.Item label='Billing Mode'>{serviceDetails.billing.model}</Descriptions.Item>
                <Descriptions.Item label='Register Time'>{serviceDetails.createTime}</Descriptions.Item>
                <Descriptions.Item label='Update Time'>{serviceDetails.lastModifiedTime}</Descriptions.Item>
                <Descriptions.Item label='Status'>{serviceDetails.serviceRegistrationState}</Descriptions.Item>
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                <Descriptions.Item label='CredentialType'>{serviceDetails.deployment.credentialType}</Descriptions.Item>
                <Descriptions.Item label='Flavors'>
                    {convertStringArrayToUnorderedList(
                        serviceDetails.flavors.map((flavor) => {
                            return flavor.name;
                        })
                    )}
                </Descriptions.Item>
                <Descriptions.Item label={'Service API'}>
                    <ApiDoc id={serviceDetails.id} styleClass={'service-api-doc-link'} />
                </Descriptions.Item>
            </Descriptions>
        </>
    );
}

export default ServiceDetail;
