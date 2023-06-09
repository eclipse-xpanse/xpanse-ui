/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { CloudServiceProvider, UserAvailableServiceVo } from '../../../../xpanse-api/generated';
import { OrderItem } from '../OrderSubmit';
import { DeployParam, getDeployParams, ParamOnChangeHandler } from '../formElements/CommonTypes';
import { ApiDoc } from '../ApiDoc';
import { Form, FormInstance, Input, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { ChangeEvent, Ref, useState } from 'react';

export const ShowDeploy = ({
    userAvailableServiceVoList,
    selectCsp,
    selectArea,
    selectRegion,
    selectFlavor,
    onFinish,
    deploying,
    formRef,
}: {
    userAvailableServiceVoList: UserAvailableServiceVo[];
    selectCsp: CloudServiceProvider.name | undefined;
    selectArea: string;
    selectRegion: string;
    selectFlavor: string;
    onFinish: (values: Record<string, never>) => void;
    deploying: boolean;
    formRef: Ref<FormInstance<Record<string, never>>> | undefined;
}): JSX.Element => {
    const props = getDeployParams(userAvailableServiceVoList, selectCsp, selectArea, selectRegion, selectFlavor);
    const [parameters, setParameters] = useState<DeployParam[]>(props.params);

    function GetOnChangeHandler(parameter: DeployParam): ParamOnChangeHandler {
        if (parameter.type === 'string') {
            return (event: ChangeEvent<HTMLInputElement>) => {
                setParameters(
                    parameters.map((item) => {
                        if (item.name === parameter.name) {
                            return { ...item, value: event.target.value };
                        }
                        return item;
                    })
                );
            };
        }
        if (parameter.type === 'number') {
            return (value: string | number | null) => {
                setParameters(
                    parameters.map((item) => {
                        if (item.name === parameter.name) {
                            return { ...item, value: value as string };
                        }
                        return item;
                    })
                );
            };
        }
        if (parameter.type === 'boolean') {
            return (checked: boolean) => {
                setParameters(
                    parameters.map((item) => {
                        if (item.name === parameter.name) {
                            return { ...item, value: checked ? 'true' : 'false' };
                        }
                        return item;
                    })
                );
            };
        }
        return (value: unknown) => {
            console.log(value);
        };
    }

    return (
        <div className={'migrate-show-deploy-class'}>
            <div className={'services-content'}>
                <div className={'content-title'}>
                    <div className={'content-title-order'}>
                        <ApiDoc id={props.id} styleClass={'content-title-api'}></ApiDoc>
                    </div>
                </div>
            </div>

            <div className={'order-param-item-left'} />
            <Form
                layout='vertical'
                autoComplete='off'
                ref={formRef}
                onFinish={onFinish}
                validateTrigger={['onSubmit', 'onBlur', 'onChange']}
                key='deploy'
                disabled={deploying}
            >
                <Form.Item
                    name={'Name'}
                    label={'Name: Service Name'}
                    rules={[{ required: true }, { type: 'string', min: 5 }]}
                    colon={true}
                >
                    <Input
                        name={'Name'}
                        showCount
                        placeholder={'customer defined name for service ordered'}
                        maxLength={256}
                        className={'order-param-item-content'}
                        suffix={
                            <Tooltip title={'Customer defined name for the service instance created'}>
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />
                </Form.Item>
                <div className={deploying ? 'deploying order-param-item-row' : ''}>
                    {parameters.map((item) =>
                        item.kind === 'variable' || item.kind === 'env' ? (
                            <OrderItem key={item.name} item={item} onChangeHandler={GetOnChangeHandler(item)} />
                        ) : (
                            <></>
                        )
                    )}
                </div>
            </Form>
        </div>
    );
};
