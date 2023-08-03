/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Input, Table } from 'antd';
import { CredentialVariable } from '../../../xpanse-api/generated';
import { ColumnsType } from 'antd/es/table';

interface DataType {
    key: React.Key;
    name: string;
    description: string;
    isMandatory?: boolean;
    isSensitive: boolean;
    value: string;
}
function CredentialDetails({ credentialDetails }: { credentialDetails: CredentialVariable[] }): JSX.Element {
    const data: DataType[] = credentialDetails.map((credentialVariable: CredentialVariable, index: number) => {
        const dataItem: DataType = {
            key: String(index),
            name: credentialVariable.name,
            description: credentialVariable.description,
            isMandatory: credentialVariable.isMandatory,
            isSensitive: credentialVariable.isSensitive,
            value: credentialVariable.value,
        };
        return dataItem;
    });

    const columns: ColumnsType<CredentialVariable> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            render: (value: string) => (
                <>
                    <Input.Password
                        className={'credential-details-value'}
                        value={value}
                        visibilityToggle
                        bordered={false}
                    />
                </>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
    ];

    return (
        <div className={'credential-details'}>
            <Table columns={columns} dataSource={data}></Table>
        </div>
    );
}

export default CredentialDetails;
