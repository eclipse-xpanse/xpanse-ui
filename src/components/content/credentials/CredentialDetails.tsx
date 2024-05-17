/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { CredentialVariable } from '../../../xpanse-api/generated';

function CredentialDetails({ credentialDetails }: { credentialDetails: CredentialVariable[] }): React.JSX.Element {
    const columns: ColumnsType<CredentialVariable> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Value',
            dataIndex: 'value',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
    ];

    return (
        <div className={'credential-details'}>
            <Table columns={columns} dataSource={credentialDetails}></Table>
        </div>
    );
}

export default CredentialDetails;
