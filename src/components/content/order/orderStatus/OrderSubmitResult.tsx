/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Alert, Button, Row } from 'antd';
import React, { useEffect } from 'react';
import { StopwatchResult } from 'react-timer-hook';
import errorAlertStyles from '../../../../styles/error-alert.module.css';
import submitAlertStyles from '../../../../styles/submit-alert.module.css';
import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText';
import DeploymentTimerNew from './DeploymentTimer';
import OrderSubmitResultDetails from './OrderSubmitResultDetails';

export const OrderSubmitResult = ({
    msg,
    uuid,
    type,
    stopWatch,
    contactServiceDetails,
    retryRequest,
    onClose,
}: {
    msg: string | React.JSX.Element;
    uuid: string;
    type: 'success' | 'error';
    stopWatch: StopwatchResult;
    contactServiceDetails: ServiceProviderContactDetails | undefined;
    retryRequest: () => void;
    onClose: () => void;
}): React.JSX.Element => {
    useEffect(() => {
        if (!stopWatch.isRunning) {
            stopWatch.reset();
            stopWatch.start();
        }
    }, [stopWatch]);

    return (
        <div className={submitAlertStyles.submitAlertTip}>
            {' '}
            <Alert
                message={`Processing Status`}
                description={<OrderSubmitResultDetails msg={msg} uuid={uuid} />}
                showIcon
                closable={true}
                onClose={onClose}
                type={type}
                action={
                    <>
                        {type === 'error' ? (
                            <Row>
                                <Button
                                    className={errorAlertStyles.tryAgainBtnInAlertClass}
                                    size='small'
                                    type='primary'
                                    onClick={retryRequest}
                                    danger={true}
                                >
                                    Retry Request
                                </Button>
                            </Row>
                        ) : (
                            <></>
                        )}
                        {contactServiceDetails !== undefined ? (
                            <Row>
                                <ContactDetailsText
                                    serviceProviderContactDetails={contactServiceDetails}
                                    showFor={ContactDetailsShowType.Order}
                                />
                            </Row>
                        ) : (
                            <></>
                        )}
                        <Row>
                            <DeploymentTimerNew stopWatch={stopWatch} />
                        </Row>
                    </>
                }
            />{' '}
        </div>
    );
};
