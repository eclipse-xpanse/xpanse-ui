/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Checkbox, Form, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import React, { Dispatch, SetStateAction } from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { AgreementText } from '../../common/ocl/AgreementText';

export const EulaInfo = ({
    eula,
    isEulaAccepted,
    setIsEulaAccepted,
}: {
    eula: string | undefined;
    isEulaAccepted: boolean;
    setIsEulaAccepted: Dispatch<SetStateAction<boolean>>;
}): React.JSX.Element => {
    const onChange = (e: CheckboxChangeEvent) => {
        setIsEulaAccepted(e.target.checked);
    };

    return (
        <>
            {eula && eula.length > 0 ? (
                <div className={serviceOrderStyles.orderFormSelectionStyle}>
                    <Form.Item
                        name='Terms and Conditions'
                        label='Terms and Conditions'
                        required={true}
                        rules={[{ required: true, message: 'Eula needs to be accepted' }]}
                    >
                        <Space wrap>
                            <Checkbox checked={isEulaAccepted} name='isEulaAccepted' onChange={onChange}>
                                I have read and agreed to the <AgreementText eula={eula} /> of the service.
                            </Checkbox>
                        </Space>
                    </Form.Item>
                </div>
            ) : null}
        </>
    );
};
