/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { Modal } from 'antd';
import { DeployedServiceDetails, VendorHostedDeployedServiceDetails } from '../../../../xpanse-api/generated';
import { ServiceTitle } from '../common/ServiceTitle.tsx';
import { Scale } from './Scale.tsx';

export function ScaleModal({
    handleCancelScaleModel,
    isScaleModalOpen,
    activeRecord,
    icon,
}: {
    handleCancelScaleModel: () => void;
    isScaleModalOpen: boolean;
    activeRecord: DeployedServiceDetails | VendorHostedDeployedServiceDetails;
    icon: string;
}) {
    return (
        <Modal
            open={isScaleModalOpen}
            title={<ServiceTitle title={activeRecord.name} version={activeRecord.version} icon={icon} />}
            closable={true}
            maskClosable={false}
            destroyOnHidden={true}
            footer={null}
            onCancel={handleCancelScaleModel}
            width={1400}
            mask={true}
        >
            <Scale currentSelectedService={activeRecord} />
        </Modal>
    );
}
