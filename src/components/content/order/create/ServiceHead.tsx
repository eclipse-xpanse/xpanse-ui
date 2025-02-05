/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import React from 'react';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { ServiceProviderContactDetails } from '../../../../xpanse-api/generated';
import { ApiDoc } from '../../common/doc/ApiDoc.tsx';
import { ContactDetailsShowType } from '../../common/ocl/ContactDetailsShowType.ts';
import { ContactDetailsText } from '../../common/ocl/ContactDetailsText.tsx';
import { IsvNameDisplay } from '../common/IsvNameDisplay.tsx';
import { ServiceTitle } from '../common/ServiceTitle.tsx';

export const ServiceHead = ({
    title,
    version,
    icon,
    id,
    serviceVendor,
    contactServiceDetails,
}: {
    title: string;
    version?: string;
    icon: string;
    id: string;
    serviceVendor: string;
    contactServiceDetails: ServiceProviderContactDetails | undefined;
}): React.JSX.Element => {
    return (
        <div className={serviceOrderStyles.serviceHeadClass}>
            <div className={serviceOrderStyles.serviceHeadLeftContent}>
                <ServiceTitle title={title} version={version} icon={icon} />
            </div>
            <div className={serviceOrderStyles.serviceVendorContactClass}>
                <div className={serviceOrderStyles.serviceOrderSubmitApiDocClass}>
                    <ApiDoc serviceTemplateId={id} styleClass={serviceOrderStyles.contentTitleApi}></ApiDoc>
                </div>
                <div className={serviceOrderStyles.serviceOrderSubmitOptionVendor}>
                    <IsvNameDisplay serviceVendor={serviceVendor} />
                </div>
                {contactServiceDetails ? (
                    <div className={serviceOrderStyles.serviceApiDocVendorClass}>
                        <ContactDetailsText
                            serviceProviderContactDetails={contactServiceDetails}
                            showFor={ContactDetailsShowType.Order}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
};
