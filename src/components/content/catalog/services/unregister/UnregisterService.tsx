/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Button, Popconfirm } from 'antd';
import { ServiceTemplateDetailVo, ServiceVendorService } from '../../../../../xpanse-api/generated';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { getVersionMapper } from '../../../common/catalog/catalogProps';
import { CloseCircleOutlined } from '@ant-design/icons';

function UnregisterService({
    id,
    currentServiceName,
    categoryOclData,
    onConfirmHandler,
    defaultDisplayedService,
    getServiceKey,
    getCsp,
    getHostType,
}: {
    id: string;
    currentServiceName: string;
    categoryOclData: Map<string, ServiceTemplateDetailVo[]>;
    onConfirmHandler: (message: string | Error, unregisterResult: boolean, id: string) => void;
    defaultDisplayedService: ServiceTemplateDetailVo | undefined;
    getServiceKey: (arg: string) => void;
    getCsp: (arg: string) => void;
    getHostType: (arg: string) => void;
}): React.JSX.Element {
    const unregisterRequest = useMutation({
        mutationFn: () => {
            return ServiceVendorService.unregister(id);
        },
        onSuccess: () => {
            onConfirmHandler('Service Unregistered Successfully', true, id);
        },
        onError: (error: Error) => {
            onConfirmHandler(error, false, id);
        },
    });

    const unregister = () => {
        unregisterRequest.mutate();
    };

    if (unregisterRequest.isSuccess) {
        let refreshedServiceName = '';
        let refreshedServiceCsp = '';
        categoryOclData.forEach((serviceList, serviceName) => {
            if (currentServiceName.split('@')[0] === serviceName) {
                const versionMapper = getVersionMapper(serviceName, serviceList);
                versionMapper.forEach((versionList, version) => {
                    if (serviceName + '@' + version === currentServiceName) {
                        refreshedServiceName = currentServiceName;
                        refreshedServiceCsp = versionList[0].csp.valueOf();
                        return false;
                    }
                });
                if (refreshedServiceName.length === 0) {
                    const firstVersionList: ServiceTemplateDetailVo[] = versionMapper.values().next()
                        .value as ServiceTemplateDetailVo[];
                    if (firstVersionList.length > 0) {
                        refreshedServiceName = serviceName + '@' + firstVersionList[0].version;
                        refreshedServiceCsp = firstVersionList[0].csp.valueOf();
                    }
                }
                return;
            } else {
                const firstServiceList: ServiceTemplateDetailVo[] = categoryOclData.values().next()
                    .value as ServiceTemplateDetailVo[];
                if (firstServiceList.length > 0) {
                    refreshedServiceName = serviceName + '@' + firstServiceList[0].version;
                    refreshedServiceCsp = firstServiceList[0].csp.valueOf();
                }
            }
        });
        getServiceKey(refreshedServiceName);
        getCsp(refreshedServiceCsp);
        getHostType(defaultDisplayedService !== undefined ? defaultDisplayedService.serviceHostingType.valueOf() : '');
    }

    return (
        <div className={'update-unregister-btn-class'}>
            <Popconfirm
                title='Unregister the service'
                description='Are you sure to unregister this service?'
                cancelText='Yes'
                okText='No'
                onCancel={() => {
                    unregister();
                }}
            >
                <Button
                    icon={<CloseCircleOutlined />}
                    type='primary'
                    style={{ marginLeft: '50px', marginTop: '20px' }}
                    disabled={unregisterRequest.isSuccess}
                >
                    Unregister
                </Button>
            </Popconfirm>
        </div>
    );
}

export default UnregisterService;
