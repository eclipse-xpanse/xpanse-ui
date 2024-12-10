/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { PlusCircleOutlined } from '@ant-design/icons';
import { UseMutationResult } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';

function ReRegisterService({
    setIsViewDisabled,
    reRegisterRequest,
    activeServiceDetail,
}: {
    setIsViewDisabled: (isViewDisabled: boolean) => void;
    reRegisterRequest: UseMutationResult<ServiceTemplateDetailVo, Error, void>;
    activeServiceDetail: ServiceTemplateDetailVo;
}): React.JSX.Element {
    const reRegister = () => {
        setIsViewDisabled(true);
        reRegisterRequest.mutate();
    };

    return (
        <div className={catalogStyles.updateUnregisterBtnClass}>
            <Popconfirm
                title='re-register the service'
                description='Are you sure to re-register this service?'
                cancelText='Yes'
                okText='No'
                onCancel={() => {
                    reRegister();
                }}
            >
                <Button
                    icon={<PlusCircleOutlined />}
                    type='primary'
                    className={catalogStyles.catalogManageBtnClass}
                    disabled={
                        reRegisterRequest.isSuccess ||
                        activeServiceDetail.availableInCatalog ||
                        activeServiceDetail.serviceTemplateRegistrationState !== 'approved'
                    }
                >
                    Re-register
                </Button>
            </Popconfirm>
        </div>
    );
}

export default ReRegisterService;
