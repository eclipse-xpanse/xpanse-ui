/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { ServiceTemplateRequestHistory } from '../../../../../xpanse-api/generated';
import ServiceTemplateRequested from './ServiceTemplateRequested';

function ServiceTemplateHistory({ data }: { data: ServiceTemplateRequestHistory[] }): React.JSX.Element {
    const [isRequestedServiceTemplateQuery, setIsRequestedServiceTemplateQuery] = useState<boolean>(false);
    const [serviceTemplateRequestId, setServiceTemplateRequestHistoryId] = useState('');

    const columns: ColumnsType<ServiceTemplateRequestHistory> = [
        {
            title: 'RequestId',
            dataIndex: 'requestId',
            align: 'center',
        },
        {
            title: 'RequestType',
            dataIndex: 'requestType',
            align: 'center',
            render: (_text, record) => {
                if (record.requestType === 'register') {
                    return <Tag color='default'>{record.requestType}</Tag>;
                } else if (record.requestType === 'republish') {
                    return <Tag color='success'>{record.requestType}</Tag>;
                } else if (record.requestType === 'unpublish') {
                    return <Tag color='error'>{record.requestType}</Tag>;
                } else {
                    return <Tag color='processing'>{record.requestType}</Tag>;
                }
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            align: 'center',
            render: (_text, record) => {
                if (record.status === 'in-review') {
                    return <Tag color='processing'>{record.status}</Tag>;
                } else if (record.status === 'accepted') {
                    return <Tag color='success'>{record.status}</Tag>;
                } else if (record.status === 'rejected') {
                    return <Tag color='error'>{record.status}</Tag>;
                } else {
                    return <Tag color='default'>{record.status}</Tag>;
                }
            },
        },
        {
            title: 'ReviewComment',
            dataIndex: 'reviewComment',
            align: 'center',
        },
        {
            title: 'CreateTime',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: 'LastModifiedTime',
            dataIndex: 'lastModifiedTime',
            align: 'center',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_text: string, record) => {
                return (
                    <>
                        <Button
                            type='primary'
                            icon={<InfoCircleOutlined />}
                            onClick={() => {
                                handleRequestedServiceTemplateOpenModal(record);
                            }}
                        >
                            template request
                        </Button>
                    </>
                );
            },
            align: 'center',
        },
    ];

    const handleRequestedServiceTemplateOpenModal = (record: ServiceTemplateRequestHistory) => {
        setIsRequestedServiceTemplateQuery(true);
        setServiceTemplateRequestHistoryId(record.requestId);
    };

    const handleRequestedServiceTemplateModalClose = () => {
        setIsRequestedServiceTemplateQuery(false);
        setServiceTemplateRequestHistoryId('');
    };

    return (
        <div>
            {isRequestedServiceTemplateQuery && serviceTemplateRequestId ? (
                <Modal
                    title={'Requested Service Template'}
                    width={1600}
                    footer={null}
                    open={isRequestedServiceTemplateQuery}
                    onCancel={handleRequestedServiceTemplateModalClose}
                >
                    <ServiceTemplateRequested requestId={serviceTemplateRequestId} />
                </Modal>
            ) : null}

            <Table columns={columns} dataSource={data} rowKey={'id'} />
        </div>
    );
}

export default ServiceTemplateHistory;
