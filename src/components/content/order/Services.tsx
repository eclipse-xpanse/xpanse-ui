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
import { Empty } from 'antd';

function Services(): JSX.Element {
    const [services, setServices] = useState<{ name: string; content: string; icon: string }[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    const onClicked = function (cfg: string) {
        navigate(
            createServicePageRoute
                .concat('?serviceName=', location.hash.split('#')[1])
                .concat('&name=', cfg.replace(' ', ''))
        );
    };

    useEffect(() => {
        const categoryName = location.hash.split('#')[1];
        if (!categoryName) {
            return;
        }
        serviceVendorApi.listRegisteredServicesTree(categoryName).then((rsp) => {
            if (rsp.length > 0) {
                let serviceList: { name: string; content: string; icon: string }[] = [];
                rsp.forEach((item) => {
                    let serviceItem = {
                        name: item.name || '',
                        content: item.versions[0].cloudProvider[0].details[0].description,
                        icon: item.versions[0].cloudProvider[0].details[0].icon,
                    };
                    serviceList.push(serviceItem);
                });
                setServices(serviceList);
            } else {
                let serviceList: { name: string; content: string; icon: string }[] = [];
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
                                <div
                                    key={index}
                                    className={'service-type-option-detail'}
                                    onClick={() => onClicked(item.name)}
                                >
                                    <div className='service-type-option-image'>
                                        <img className='service-type-option-service-icon' src={item.icon} alt={'App'} />
                                    </div>
                                    <div className='service-type-option-info'>
                                        <span className='service-type-option'>{item.name}</span>
                                        <span className='service-type-option-description'>{item.content}</span>
                                    </div>
                                </div>
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
