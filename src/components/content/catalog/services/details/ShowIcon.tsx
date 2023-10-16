/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { ServiceTemplateDetailVo } from '../../../../../xpanse-api/generated';

export function ShowIcon({ serviceDetails }: { serviceDetails: ServiceTemplateDetailVo }): JSX.Element {
    return (
        <div className={'catalog-service-icon'}>
            <img width={25} height={25} src={serviceDetails.icon} alt='Service Icon' referrerPolicy='no-referrer' />
            &nbsp;
            {serviceDetails.name}
        </div>
    );
}
