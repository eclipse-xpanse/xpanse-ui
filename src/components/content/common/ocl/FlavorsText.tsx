/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { OrderedListOutlined } from '@ant-design/icons/lib/icons';
import { Badge, Flex, Popover, Radio } from 'antd';
import React from 'react';
import YAML from 'yaml';
import catalogStyles from '../../../../styles/catalog.module.css';
import flavorStyles from '../../../../styles/flavor.module.css';
import oclDisplayStyles from '../../../../styles/ocl-display.module.css';
import serviceOrderStyles from '../../../../styles/service-order.module.css';
import { ServiceFlavor } from '../../../../xpanse-api/generated';
import { FlavorFeatures } from '../../order/common/FlavorFeatures.tsx';
import { FlavorTitle } from '../../order/common/FlavorTitle.tsx';

export function FlavorsText({ flavors }: { flavors: ServiceFlavor[] }): React.JSX.Element {
    // These warnings must be suppressed because the Ocl object here is created from the import file and the data not necessarily contains all the mandatory fields.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (flavors) {
        const sortedFlavors = [...flavors].sort((a, b) => a.priority - b.priority);
        const flavorPops: React.JSX.Element[] = sortedFlavors.map((flavor, _) => {
            const yamlDocument = new YAML.Document();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            yamlDocument.contents = flavor;
            return (
                <div key={flavor.name}>
                    <Badge.Ribbon
                        className={oclDisplayStyles.oclDataDisplayFlavorBtn}
                        text={'prio '.concat(String(flavor.priority))}
                        color={'green'}
                    >
                        <Popover
                            content={
                                <pre className={oclDisplayStyles.oclFlavorsItemContent}>{yamlDocument.toString()}</pre>
                            }
                            title='Flavor Details'
                            trigger='hover'
                        >
                            <Radio.Button
                                key={flavor.name}
                                value={flavor.name}
                                disabled={true}
                                className={flavorStyles.customRadioButtonContent}
                            >
                                <FlavorTitle title={flavor.name} />
                                <FlavorFeatures flavor={flavor} />
                            </Radio.Button>
                        </Popover>
                    </Badge.Ribbon>
                </div>
            );
        });

        return (
            <>
                <div>
                    <h3 className={catalogStyles.catalogDetailsH3}>
                        <OrderedListOutlined />
                        &nbsp;Flavors
                    </h3>
                    <div
                        className={`${serviceOrderStyles.orderFormSelectionStyle} ${flavorStyles.regionFlavorContent} ${serviceOrderStyles.orderFormItemName}`}
                    >
                        <Flex vertical gap='middle'>
                            <Radio.Group optionType={'button'} className={flavorStyles.antRadioGroup}>
                                {flavorPops}{' '}
                            </Radio.Group>
                        </Flex>
                    </div>
                </div>
            </>
        );
    }
    return <></>;
}
