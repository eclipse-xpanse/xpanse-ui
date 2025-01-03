/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import catalogStyles from '../../../../../styles/catalog.module.css';
import { ServiceTemplateDetailVo, ServiceTemplateRequestHistory } from '../../../../../xpanse-api/generated';
import ServiceTemplateHistory from './ServiceTemplateHistory';
import useServiceTemplateHistoryQuery from './useServiceTemplateHistoryQuery';

function HistoryService({ serviceDetail }: { serviceDetail: ServiceTemplateDetailVo }): React.JSX.Element {
    const serviceTemplateHistoryQuery = useServiceTemplateHistoryQuery(serviceDetail.serviceTemplateId);
    const [isServiceTemplateHistoryModalOpen, setIsServiceTemplateHistoryModalOpen] = useState(false);

    let serviceTemplateRequestHistoryList: ServiceTemplateRequestHistory[] = [];
    if (serviceTemplateHistoryQuery.isSuccess) {
        serviceTemplateRequestHistoryList = serviceTemplateHistoryQuery.data;
    }

    const handleServiceTemplateHistoryOpenModal = () => {
        setIsServiceTemplateHistoryModalOpen(true);
    };

    const handleServiceTemplateHistoryModalClose = () => {
        setIsServiceTemplateHistoryModalOpen(false);
    };

    return (
        <div>
            {isServiceTemplateHistoryModalOpen && serviceTemplateRequestHistoryList.length > 0 ? (
                <Modal
                    title={'Service Template History'}
                    width={1600}
                    footer={null}
                    open={isServiceTemplateHistoryModalOpen}
                    onCancel={handleServiceTemplateHistoryModalClose}
                >
                    <ServiceTemplateHistory data={serviceTemplateRequestHistoryList} />
                </Modal>
            ) : null}
            {serviceTemplateHistoryQuery.isSuccess && serviceTemplateHistoryQuery.data.length > 0 ? (
                <Button
                    icon={<CloseCircleOutlined />}
                    type='primary'
                    onClick={() => {
                        handleServiceTemplateHistoryOpenModal();
                    }}
                    className={catalogStyles.catalogManageBtnClass}
                >
                    History
                </Button>
            ) : null}
        </div>
    );
}

export default HistoryService;
