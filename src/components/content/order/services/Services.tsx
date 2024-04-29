/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { FormOutlined } from '@ant-design/icons';
import '../../../../styles/service_order.css';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createServicePageRoute } from '../../../utils/constants';
import { Col, Empty, Row, Tooltip, Typography } from 'antd';
import { Badge, Space } from 'antd';
import { sortVersion } from '../../../utils/Sort';
import { DeployedService, UserOrderableServiceVo } from '../../../../xpanse-api/generated';
import ServicesSkeleton from './ServicesSkeleton';
import ServicesLoadingError from '../query/ServicesLoadingError';
import { groupServicesByName, groupVersionsForService } from './userServiceHelper';
import { useOrderFormStore } from '../store/OrderFormStore';
import userOrderableServicesQuery from '../query/userOrderableServicesQuery';
import { UserServiceDisplayType } from './UserServiceDisplayType';

function Services(): React.JSX.Element {
    const { Paragraph } = Typography;
    const navigate = useNavigate();
    const location = useLocation();
    const [clearFormVariables] = useOrderFormStore((state) => [state.clearFormVariables]);

    useEffect(() => {
        clearFormVariables();
    }, [clearFormVariables]);

    const onSelectService = function (serviceName: string, latestVersion: string) {
        navigate(
            createServicePageRoute
                .concat('?serviceName=', serviceName)
                .concat('&latestVersion=', latestVersion.replace(' ', ''))
                .concat('#', location.hash.split('#')[1])
        );
    };

    const orderableServicesQuery = userOrderableServicesQuery(
        location.hash.split('#')[1] as DeployedService.category,
        undefined
    );

    if (orderableServicesQuery.isError) {
        return <ServicesLoadingError error={orderableServicesQuery.error} />;
    }

    if (orderableServicesQuery.isLoading || orderableServicesQuery.isFetching) {
        return <ServicesSkeleton />;
    }

    const userOrderableServiceList: UserOrderableServiceVo[] | undefined = orderableServicesQuery.data;
    const serviceList: UserServiceDisplayType[] = [];
    if (userOrderableServiceList !== undefined && userOrderableServiceList.length > 0) {
        const servicesGroupedByName: Map<string, UserOrderableServiceVo[]> =
            groupServicesByName(userOrderableServiceList);
        servicesGroupedByName.forEach((orderableServicesList, _) => {
            const versionMapper: Map<string, UserOrderableServiceVo[]> = groupVersionsForService(orderableServicesList);
            const versionList: string[] = Array.from(versionMapper.keys());
            const latestVersion = sortVersion(versionList)[0];
            if (versionMapper.has(latestVersion) && versionMapper.get(latestVersion)) {
                const serviceItem = {
                    name: versionMapper.get(latestVersion)?.[0].name,
                    content: versionMapper.get(latestVersion)?.[0].description,
                    icon: versionMapper.get(latestVersion)?.[0].icon,
                    latestVersion: latestVersion,
                };
                serviceList.push(serviceItem as UserServiceDisplayType);
            }
        });
    }

    if (serviceList.length === 0) {
        return (
            <div className={'service-blank-class'}>
                <Empty description={'No services available.'} />
            </div>
        );
    }

    return (
        <div className={'generic-table-container'}>
            <div className={'content-title'}>
                <FormOutlined />
                &nbsp;Select Service
            </div>

            <div className={'services-content-body'}>
                {serviceList.map((item, index) => {
                    return (
                        <Row key={index}>
                            <Col span={8} className={'services-content-body-col'}>
                                <Space direction='vertical' size='middle'>
                                    <Badge.Ribbon text={item.latestVersion}>
                                        <div
                                            key={index}
                                            className={'service-type-option-detail'}
                                            onClick={() => {
                                                onSelectService(item.name, item.latestVersion);
                                            }}
                                        >
                                            <div className='service-type-option-image'>
                                                <img
                                                    className='service-type-option-service-icon'
                                                    src={item.icon}
                                                    alt={'App'}
                                                />
                                            </div>
                                            <div className='service-type-option-info'>
                                                <span className='service-type-option'>
                                                    <Tooltip placement='topLeft' title={item.name}>
                                                        <Paragraph
                                                            className={'service-type-option-service-name'}
                                                            ellipsis={true}
                                                        >
                                                            {item.name}
                                                        </Paragraph>
                                                    </Tooltip>
                                                </span>
                                                <span className='service-type-option-description'>{item.content}</span>
                                            </div>
                                        </div>
                                    </Badge.Ribbon>
                                </Space>
                            </Col>
                        </Row>
                    );
                })}
            </div>
        </div>
    );
}

export default Services;
