/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { FormOutlined } from '@ant-design/icons';
import '../../../styles/service_order.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createServicePageRoute } from '../../utils/constants';
import { serviceVendorApi } from '../../../xpanse-api/xpanseRestApiClient';
import { Col, Empty, Row } from 'antd';
import { Badge, Space } from 'antd';
import sortVersion from '../../utils/Sort';
import { VersionOclVo } from '../../../xpanse-api/generated';

function Services(): JSX.Element {
    const [services, setServices] = useState<{ name: string; content: string; icon: string; latestVersion: string }[]>(
        []
    );
    const navigate = useNavigate();
    const location = useLocation();

    const onClicked = function (cfg: string, latestVersion: string) {
        navigate(
            createServicePageRoute
                .concat('?serviceName=', location.hash.split('#')[1])
                .concat('&name=', cfg.replace(' ', ''))
                .concat('&latestVersion=', latestVersion.replace(' ', ''))
        );
    };

    function getVersions(versionVos: VersionOclVo[]) {
        let versionList: string[] = [];
        versionVos.forEach((versionOclVo) => {
            versionList.push(versionOclVo.version);
        });
        return versionList;
    }

    useEffect(() => {
        const categoryName = location.hash.split('#')[1];
        if (!categoryName) {
            return;
        }
        serviceVendorApi.listRegisteredServicesTree(categoryName).then((rsp) => {
            let serviceList: { name: string; content: string; icon: string; latestVersion: string }[] = [];
            if (rsp.length > 0) {
                rsp.forEach((item) => {
                    let serviceItem = {
                        name: item.name || '',
                        content: item.versions[0].cloudProvider[0].details[0].description,
                        icon: item.versions[0].cloudProvider[0].details[0].icon,
                        latestVersion: sortVersion(getVersions(item.versions))[0],
                    };
                    serviceList.push(serviceItem);
                });
                setServices(serviceList);
            } else {
                setServices(serviceList);
            }
        });
    }, [location]);

    return (
        <>
            {services.length > 0 ? (
                <div className={'services-content'}>
                    <div className={'content-title'}>
                        <FormOutlined />
                        &nbsp;Select Service
                    </div>

                    <div className={'services-content-body'}>
                        {services.map((item, index) => {
                            return (
                                <Row>
                                    <Col span={8} className={'services-content-body-col'}>
                                        <Space
                                            direction='vertical'
                                            size='middle'
                                            className={'services-content-body-space'}
                                        >
                                            <Badge.Ribbon text={item.latestVersion}>
                                                <div
                                                    key={index}
                                                    className={'service-type-option-detail'}
                                                    onClick={() => onClicked(item.name, item.latestVersion)}
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
            )}
        </>
    );
}

export default Services;
