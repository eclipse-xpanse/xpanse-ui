/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { FormOutlined } from '@ant-design/icons';
import '../../../../styles/service_order.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createServicePageRoute } from '../../../utils/constants';
import { Col, Empty, Row } from 'antd';
import { Badge, Space } from 'antd';
import { sortVersion } from '../../../utils/Sort';
import { ServiceVo, ServiceCatalogService, UserAvailableServiceVo } from '../../../../xpanse-api/generated';
import ServicesSkeleton from './ServicesSkeleton';
import ServicesLoadingError from './ServicesLoadingError';
import { useQuery } from '@tanstack/react-query';
import { getServiceMapper, getVersionMapper } from '../../common/catalog/catalogProps';
import { useOrderFormStore } from '../store/OrderFormStore';

function Services(): React.JSX.Element {
    const [services, setServices] = useState<{ name: string; content: string; icon: string; latestVersion: string }[]>(
        []
    );
    const [isServicesLoaded, setIsServicesLoaded] = useState<boolean>(false);
    const [isServicesLoadSuccessful, setIsServicesLoadSuccessful] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [clearFormVariables] = useOrderFormStore((state) => [state.clearFormVariables]);

    useEffect(() => {
        clearFormVariables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSelectService = function (serviceName: string, latestVersion: string) {
        navigate(
            createServicePageRoute
                .concat('?catalog=', location.hash.split('#')[1])
                .concat('&serviceName=', serviceName)
                .concat('&latestVersion=', latestVersion.replace(' ', ''))
        );
    };

    const availableServicesQuery = useQuery({
        queryKey: ['catalog', location.hash.split('#')[1] as ServiceVo.category],
        queryFn: () => ServiceCatalogService.listAvailableServices(location.hash.split('#')[1] as ServiceVo.category),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setIsServicesLoaded(false);
        const userAvailableServiceList: UserAvailableServiceVo[] | undefined = availableServicesQuery.data;
        const serviceList: { name: string; content: string; icon: string; latestVersion: string }[] = [];
        if (userAvailableServiceList !== undefined && userAvailableServiceList.length > 0) {
            const serviceMapper: Map<string, UserAvailableServiceVo[]> = getServiceMapper(userAvailableServiceList);
            serviceMapper.forEach((availableServicesList, serviceName) => {
                const versionMapper: Map<string, UserAvailableServiceVo[]> = getVersionMapper(
                    serviceName,
                    userAvailableServiceList
                );
                const versionList: string[] = Array.from(versionMapper.keys());
                const serviceItem = {
                    name: serviceName,
                    content: availableServicesList[0].description,
                    icon: availableServicesList[0].icon,
                    latestVersion: sortVersion(versionList)[0],
                };
                serviceList.push(serviceItem);
            });
            setServices(serviceList);
            setIsServicesLoaded(true);
            setIsServicesLoadSuccessful(true);
        } else {
            setServices(serviceList);
            setIsServicesLoaded(true);
            setIsServicesLoadSuccessful(true);
        }
    }, [availableServicesQuery.data, availableServicesQuery.isSuccess]);

    useEffect(() => {
        if (availableServicesQuery.isError) {
            setServices([]);
            setIsServicesLoaded(true);
            setIsServicesLoadSuccessful(false);
        }
    }, [availableServicesQuery.isError]);

    useEffect(() => {
        if (availableServicesQuery.isLoading) {
            setIsServicesLoaded(false);
        }
    }, [availableServicesQuery.isLoading]);

    return (
        <>
            {' '}
            {isServicesLoadSuccessful ? (
                isServicesLoaded ? (
                    services.length > 0 ? (
                        <div className={'services-content'}>
                            <div className={'content-title'}>
                                <FormOutlined />
                                &nbsp;Select Service
                            </div>

                            <div className={'services-content-body'}>
                                {services.map((item, index) => {
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
                                                                <span className='service-type-option'>{item.name}</span>
                                                                <span className='service-type-option-description'>
                                                                    {item.content}
                                                                </span>
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
                    ) : (
                        <div className={'service-blank-class'}>
                            <Empty description={'No services available.'} />
                        </div>
                    )
                ) : (
                    <ServicesSkeleton />
                )
            ) : (
                <ServicesLoadingError />
            )}
        </>
    );
}

export default Services;
