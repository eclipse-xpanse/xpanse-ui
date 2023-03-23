/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import Navigate from './Navigate';
import '../../../styles/service_order.css';
import { To, useLocation } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { DeployParam, DeployParamItem, ParamOnChangeHandler } from './orderInputItem/OrderCommon';
import { OrderTextInput } from './orderInputItem/OrderTextInput';
import { OrderNumberInput } from './orderInputItem/OrderNumberInput';
import { OrderSwitch } from './orderInputItem/OrderSwitch';
import { Alert, Button, Form } from 'antd';
import { CreateRequest, CreateRequestCategoryEnum, CreateRequestCspEnum } from '../../../xpanse-api/generated';
import { serviceApi } from '../../../xpanse-api/xpanseRestApiClient';

// 1 hour.
const deployTimeout: number = 3600000;
// 5 seconds.
const waitServicePeriod: number = 5000;

function OrderItem(props: DeployParamItem) {
    if (props.item.type === 'string') {
        return <OrderTextInput item={props.item} onChangeHandler={props.onChangeHandler} />;
    }
    if (props.item.type === 'number') {
        return <OrderNumberInput item={props.item} onChangeHandler={props.onChangeHandler} />;
    }
    if (props.item.type === 'boolean') {
        return <OrderSwitch item={props.item} onChangeHandler={props.onChangeHandler} />;
    }

    return <></>;
}

export interface OrderSubmitProps {
    // The category of the service
    category: CreateRequestCategoryEnum;
    // The name of the service
    name: string;
    // The version of service
    version: string;
    // The region of the provider.
    region: string;
    // The csp of the Service.
    csp: CreateRequestCspEnum;
    // The flavor of the Service.
    flavor: string;
    // The deployment context
    params: DeployParam[];
}

function OrderSubmit(props: OrderSubmitProps): JSX.Element {
    const [tip, setTip] = useState<JSX.Element | undefined>(undefined);
    const [parameters, setParameters] = useState<DeployParam[]>(props.params);
    const [deploying, setDeploying] = useState<boolean>(false);

    function Tip(type: 'error' | 'success', msg: string) {
        setTip(<Alert message={msg} description='' type={type} />);
    }

    function TipClear() {
        setTip(undefined);
    }

    function GetOnChangeHandler(parameter: DeployParam): ParamOnChangeHandler {
        console.log(parameters);
        if (parameter.type === 'string') {
            return (event: ChangeEvent<HTMLInputElement>) => {
                TipClear();
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
                TipClear();
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
                TipClear();
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
        return (value: any) => {
            console.log(value);
        };
    }

    function waitingServiceReady(uuid: string, timeout: number, date: Date) {
        Tip(
            'success',
            (('Deploying, Please wait... [' + Math.ceil((new Date().getTime() - date.getTime()) / 1000)) as string) +
                's]'
        );
        serviceApi
            .serviceDetail(uuid)
            .then((response) => {
                // success, exit from deploying.
                setDeploying(false);
                if (response.serviceState === 'DEPLOY_SUCCESS') {
                    Tip('success', 'Deploy success.');
                } else {
                    Tip('error', 'Deploy failed.');
                }
            })
            .catch((error) => {
                console.log('waitingServiceReady error', error);
                if (timeout > 0) {
                    setTimeout(() => {
                        waitingServiceReady(uuid, timeout - waitServicePeriod, date);
                    }, waitServicePeriod);
                } else {
                    setDeploying(false);
                    TipClear();
                }
            })
            .finally(() => {});
    }

    function OnSubmit() {
        let createRequest = new CreateRequest();
        createRequest.name = props.name;
        createRequest.version = props.version;
        createRequest.category = props.category;
        createRequest.csp = props.csp;
        createRequest.region = props.region;
        createRequest.flavor = props.flavor;
        createRequest.property = {};
        for (let item of parameters) {
            if (item.kind === 'variable' || item.kind === 'env') {
                createRequest.property[item.name] = item.value as string;
            }
        }
        // Start deploying
        setDeploying(true);

        serviceApi
            .deploy(createRequest)
            .then((response) => {
                console.log('success ', response);
                Tip('success', response);
                waitingServiceReady(response, deployTimeout, new Date());
                // setUuid(response);
            })
            .catch((error) => {
                console.error(error);
                Tip('error', 'Create service deploy failed.');
                setDeploying(false);
                // setUuid(undefined);
            })
            .finally(() => {});
    }

    return (
        <>
            <div>
                <Navigate text={'<< Back'} to={-1 as To} />
                <div className={'Line'} />
                <div className={'services-content'}>
                    <div className={'content-title'}>
                        Service: {props.name}@{props.version}
                    </div>
                </div>
            </div>
            <div>{tip}</div>
            <Form
                layout='vertical'
                autoComplete='off'
                onFinish={OnSubmit}
                validateTrigger={['onSubmit', 'onBlur', 'onChange']}
                key='deploy'
            >
                <div className={deploying ? 'deploying order-param-item-row' : ''}>
                    {parameters.map((item) =>
                        item.kind === 'variable' || item.kind === 'env' ? (
                            <OrderItem key={item.name} item={item} onChangeHandler={GetOnChangeHandler(item)} />
                        ) : (
                            <></>
                        )
                    )}
                </div>
                <div className={'Line'} />
                <div className={'order-param-item-row'}>
                    <div className={'order-param-item-left'} />
                    <div className={'order-param-submit'}>
                        <Button type='primary' loading={deploying} htmlType='submit'>
                            Deploy
                        </Button>
                    </div>
                </div>
            </Form>
        </>
    );
}

export function OrderSubmitPage(): JSX.Element {
    const { state } = useLocation();
    const { props } = state;
    return OrderSubmit(props);
}

export default OrderSubmitPage;
