/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { FormOutlined } from '@ant-design/icons';
import '../../../styles/service_order.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createServicePageRoute } from '../../utils/constants';
import { Col, Empty, Row } from 'antd';
import { Badge, Space } from 'antd';
import { sortVersion } from '../../utils/Sort';
import { ServiceVo, VersionOclVo } from '../../../xpanse-api/generated';
import ServicesSkeleton from './ServicesSkeleton';
import ServicesLoadingError from './ServicesLoadingError';
import { ServicesAvailableService } from '../../../xpanse-api/generated/services/ServicesAvailableService';

function Services(): JSX.Element {
    const [services, setServices] = useState<{ name: string; content: string; icon: string; latestVersion: string }[]>(
        []
    );
    const [isServicesLoaded, setIsServicesLoaded] = useState<boolean>(false);
    const [isServicesLoadSuccessful, setIsServicesLoadSuccessful] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();

    const onSelectService = function (serviceName: string, latestVersion: string) {
        navigate(
            createServicePageRoute
                .concat('?catalog=', location.hash.split('#')[1])
                .concat('&serviceName=', serviceName)
                .concat('&latestVersion=', latestVersion.replace(' ', ''))
        );
    };

    function getVersions(versionVos: VersionOclVo[]) {
        const versionList: string[] = [];
        versionVos.forEach((versionOclVo) => {
            versionList.push(versionOclVo.version);
        });
        return versionList;
    }

    useEffect(() => {
        setIsServicesLoaded(false);
        const categoryName = location.hash.split('#')[1] as ServiceVo.category;
        void ServicesAvailableService.getAvailableServicesTree(categoryName)
            .then((rsp) => {
                const serviceList: { name: string; content: string; icon: string; latestVersion: string }[] = [];
                if (rsp.length > 0) {
                    rsp.forEach((item) => {
                        const serviceItem = {
                            name: item.name || '',
                            content: item.versions[0].cloudProvider[0].details[0].description,
                            icon: item.versions[0].cloudProvider[0].details[0].icon,
                            latestVersion: sortVersion(getVersions(item.versions))[0],
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
            })
            .catch(() => {
                setServices([]);
                setIsServicesLoaded(true);
                setIsServicesLoadSuccessful(false);
            });
    }, [location]);

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
                                                            onClick={() =>
                                                                onSelectService(item.name, item.latestVersion)
                                                            }
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
