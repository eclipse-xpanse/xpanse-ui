import { Page } from 'playwright-core';
import { VariableKind } from '../../../src/xpanse-api/generated';
import {
    catalogServicesUrl,
    deployDetailsUrl,
    deployServiceUrl,
    deployTaskStatusUrl,
    myServicesDetailsUrl,
    retryDeployUrl,
    selectAzsUrl,
    selectPriceUrl,
    selectServiceUrl,
    vmResourceUrl,
} from './endpoints.ts';

export const mockServicesSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(catalogServicesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceTemplateId: '10c2baff-36a8-4ea9-9041-b51409b0f291',
                    category: 'compute',
                    name: 'terraform-ecs',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    regions: [
                        {
                            name: 'cn-southwest-2',
                            site: 'Chinese Mainland',
                            area: 'Asia China',
                        },
                        {
                            name: 'cn-southwest-2',
                            site: 'International',
                            area: 'Asia China',
                        },
                        {
                            name: 'eu-west-0',
                            site: 'International',
                            area: 'Europe Pairs',
                        },
                        {
                            name: 'eu-west-101',
                            site: 'Europe',
                            area: 'Europe Dublin',
                        },
                    ],
                    serviceVendor: 'ISV-A',
                    description: 'This is an enhanced compute services by ISV-A.',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACg0lEQVR4nO2dP24TURCHf65IxwFcADVHMSUHAKfCHTeIFIocgXAEXITUVrJNjsABYg6AJaBf9MRYeiAWBTn7dmbyfdLI1vqPZvx7M7OzK+tJAAAAAAAAAAAwATNJx5IuJW2S2KWkpcUWipk53ye1T9FEOa6cv3Wwsjf3ZLdVXCVTwrDPjhLAI+XhSNK2ypIwdOZ0ecxGFzG2kE5nji2k05ljC+l05thCOp05trs43Tu3IRBECNI0Q24knTmxGzJEOpEfThAEQdyVrCkyZCXpu6Q3fxwnQyYSZG2L4SOC+MiQuaS39lhDhtBD2uC9hwxBhjiYyHsm9V9M/YP3CPI7TOoNoYc4A0Gc4V2QFZO6L0HWTOq+BJkzqfsSZAgGQwRpA/fUnYEgzuCeujO8zyFD0NQRpA3eM2TFpO5LkDWTui9B5kzqvgQZgqaOIG1gMHQGggQU5My5Pbj/h0SlixhbSKczxxbS6cyxhXQ6c2whnc4c212cfizpueLRZRXks73npWLRIYgv0gpCyWpIyFWUOTYyxBk09QcqyAtJV5J+2D3y8nyhcaFkDfDuH39JO9V4pBVEB2ZGb/ZV0rnZrjo+VqakFeSQ097rSown1fGnlSilfI1BWkEO6SHf7LPv//Laub1W3jMGCPKfgnxAkPYl68q+f2dlas8zStY0ab2omvfOylTJDJr6hNeyTjnt9TcYLqx8laGQwdCBIFOQ9iyLy+8NCbmKMsdGhjiDHuIMBHEGJcsZIRtf5thCOp05tpBOZ45tv23e1raay8KRpC8Rt81bVldjtw42hNzck+3FKPZagZjZCuqT2kW0rVdlDi9NmE0Su5D0KqIYAAAAAAAAAACKz09haty1w+ee7QAAAABJRU5ErkJggg==',
                    inputVariables: [
                        {
                            name: 'admin_passwd',
                            kind: 'variable',
                            dataType: 'string',
                            example: null,
                            description:
                                'The admin password of the compute instance. If the value is empty, will create a random password.',
                            value: null,
                            mandatory: false,
                            valueSchema: {
                                minLength: 8,
                                maxLength: 16,
                                pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$',
                            },
                            sensitiveScope: 'always',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'image_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'Ubuntu 22.04 server 64bit',
                            description:
                                'The image name of the compute instance. If the value is empty, will use the default value to create compute instance.',
                            value: 'Ubuntu 22.04 server 64bit',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'vpc_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'ecs-vpc-default',
                            description:
                                'The vpc name of the compute instance. If the value is empty, will use the default value to find or create VPC.',
                            value: 'ecs-vpc-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'subnet_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'ecs-subnet-default',
                            description:
                                'The sub network name of the compute instance. If the value is empty, will use the default value to find or create subnet.',
                            value: 'ecs-subnet-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                        {
                            name: 'secgroup_name',
                            kind: 'variable',
                            dataType: 'string',
                            example: 'ecs-secgroup-default',
                            description:
                                'The security group name of the compute instance. If the value is empty, will use the default value to find or create security group.',
                            value: 'ecs-secgroup-default',
                            mandatory: false,
                            valueSchema: null,
                            sensitiveScope: 'none',
                            autoFill: null,
                            modificationImpact: {
                                isDataLost: false,
                                isServiceInterrupted: true,
                            },
                        },
                    ],
                    outputVariables: [
                        {
                            name: 'admin_passwd',
                            dataType: 'string',
                            description: 'The admin password of the compute instance.',
                            sensitiveScope: 'always',
                        },
                        {
                            name: 'ecs_host',
                            dataType: 'string',
                            description: 'The host of the compute instance.',
                            sensitiveScope: 'none',
                        },
                        {
                            name: 'ecs_public_ip',
                            dataType: 'string',
                            description: 'The public ip of the compute instance.',
                            sensitiveScope: 'none',
                        },
                    ],
                    flavors: {
                        name: null,
                        properties: null,
                        priority: null,
                        features: null,
                        serviceFlavors: [
                            {
                                name: '1vCPUs-1GB-normal',
                                properties: {
                                    flavor_id: 's6.small.1',
                                },
                                priority: 3,
                                features: ['High Availability', 'Maximum performance'],
                            },
                            {
                                name: '2vCPUs-4GB-normal',
                                properties: {
                                    flavor_id: 's6.large.2',
                                },
                                priority: 2,
                                features: ['High Availability', 'Maximum performance'],
                            },
                            {
                                name: '2vCPUs-8GB-normal',
                                properties: {
                                    flavor_id: 's6.large.4',
                                },
                                priority: 1,
                                features: ['High Availability', 'Maximum performance'],
                            },
                        ],
                        modificationImpact: {
                            isDataLost: false,
                            isServiceInterrupted: true,
                        },
                        isDowngradeAllowed: true,
                        downgradeAllowed: true,
                    },
                    billing: {
                        billingModes: ['Fixed', 'Pay per Use'],
                        defaultBillingMode: 'Pay per Use',
                    },
                    serviceHostingType: 'self',
                    serviceProviderContactDetails: {
                        emails: ['test30@test.com', 'test31@test.com'],
                        phones: ['011-13422222222', '022-13344444444'],
                        chats: ['test1234', 'test1235'],
                        websites: ['https://hw.com', 'https://hwcloud.com'],
                    },
                    serviceAvailabilityConfig: [
                        {
                            displayName: 'Availability Zone',
                            varName: 'availability_zone',
                            mandatory: false,
                            description:
                                'The availability zone to deploy the service instance. If the value is empty, the service instance will be deployed in a random availability zone.',
                        },
                    ],
                    eula: 'This Acceptable Use Policy ("Policy") lists prohibited conduct and content when using the services provided by or on behalf of HUAWEI CLOUD and its affiliates. This Policy is an integral part of the HUAWEI CLOUD User Agreement ("User Agreement"). The examples and restrictions listed below are not exhaustive. We may update this Policy from time to time, and the updated Policy will be posted on the Website. By continuing to use the Services, you agree to abide by the latest version of this Policy. You acknowledge and agree that we may suspend or terminate the Services if you or your users violate this Policy. Terms used in the User Agreement have the same meanings in this Policy.\n\nProhibited Conduct\nWhen accessing or using the Services, or allowing others to access or use the Services, you may not:\n1. Violate any local, national or international laws, regulations and rules;\n2. Infringe or violate the rights of others, including but not limited to privacy rights or intellectual property rights;\n3. Engage in, encourage, assist or allow others to engage in any illegal, unlawful, infringing, harmful or fraudulent behavior, including but not limited to any of the following activities: harming or attempting to harm minors in any way, pornography, illegal gambling, illegal VPN construction, Ponzi schemes, cyber attacks, phishing or damage, privately intercepting any system, program or data, monitoring service data or traffic without permission, engaging in virtual currency "mining" or virtual currency transactions;\n4. Transmit, provide, upload, download, use or reuse, disseminate or distribute any illegal, infringing, offensive, or harmful content or materials, including but not limited to those listed in the "Prohibited Content" below;\n5. Transmit any data, send or upload any material that contains viruses, worms, Trojan horses, time bombs, keyboard loggers, spyware, adware or any other harmful programs or similar computer code designed to adversely affect the operation or security of any computer hardware or software;\n6. Attack, interfere with, disrupt or adversely affect any service, hardware, software, system, website or network, including but not limited to accessing or attacking any service, hardware, software, system, website or network using large amounts of automated means (including robots, crawlers, scripts or similar data gathering or extraction methods);\n7. Access any part of the Service, account or system without authorization, or attempt to do so;\n8. Violate or adversely affect the security or integrity of the Services, hardware, software, systems, websites or networks;\n9. Distribute, disseminate or send unsolicited email, bulk email or other messages, promotions, advertising or solicitations (such as "spam");\n10. Fraudulent offers of goods or services, or any advertising, promotional or other materials containing false, deceptive or misleading statements.\n',
                    configurationParameters: null,
                    serviceActions: null,
                    links: [
                        {
                            rel: 'openApi',
                            href: 'http://localhost:8080/xpanse/catalog/services/10c2baff-36a8-4ea9-9041-b51409b0f291/openapi',
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockSelectServicesSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    const mockResponseData = [
        {
            serviceTemplateId: '10c2baff-36a8-4ea9-9041-b51409b0f291',
            category: 'compute',
            name: 'terraform-ecs',
            version: '1.0.0',
            csp: 'HuaweiCloud',
            regions: [
                {
                    name: 'cn-southwest-2',
                    site: 'Chinese Mainland',
                    area: 'Asia China',
                },
                {
                    name: 'cn-southwest-2',
                    site: 'International',
                    area: 'Asia China',
                },
                {
                    name: 'eu-west-0',
                    site: 'International',
                    area: 'Europe Pairs',
                },
                {
                    name: 'eu-west-101',
                    site: 'Europe',
                    area: 'Europe Dublin',
                },
            ],
            serviceVendor: 'ISV-A',
            description: 'This is an enhanced compute services by ISV-A.',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACg0lEQVR4nO2dP24TURCHf65IxwFcADVHMSUHAKfCHTeIFIocgXAEXITUVrJNjsABYg6AJaBf9MRYeiAWBTn7dmbyfdLI1vqPZvx7M7OzK+tJAAAAAAAAAAAwATNJx5IuJW2S2KWkpcUWipk53ye1T9FEOa6cv3Wwsjf3ZLdVXCVTwrDPjhLAI+XhSNK2ypIwdOZ0ecxGFzG2kE5nji2k05ljC+l05thCOp05trs43Tu3IRBECNI0Q24knTmxGzJEOpEfThAEQdyVrCkyZCXpu6Q3fxwnQyYSZG2L4SOC+MiQuaS39lhDhtBD2uC9hwxBhjiYyHsm9V9M/YP3CPI7TOoNoYc4A0Gc4V2QFZO6L0HWTOq+BJkzqfsSZAgGQwRpA/fUnYEgzuCeujO8zyFD0NQRpA3eM2TFpO5LkDWTui9B5kzqvgQZgqaOIG1gMHQGggQU5My5Pbj/h0SlixhbSKczxxbS6cyxhXQ6c2whnc4c212cfizpueLRZRXks73npWLRIYgv0gpCyWpIyFWUOTYyxBk09QcqyAtJV5J+2D3y8nyhcaFkDfDuH39JO9V4pBVEB2ZGb/ZV0rnZrjo+VqakFeSQ097rSown1fGnlSilfI1BWkEO6SHf7LPv//Laub1W3jMGCPKfgnxAkPYl68q+f2dlas8zStY0ab2omvfOylTJDJr6hNeyTjnt9TcYLqx8laGQwdCBIFOQ9iyLy+8NCbmKMsdGhjiDHuIMBHEGJcsZIRtf5thCOp05tpBOZ45tv23e1raay8KRpC8Rt81bVldjtw42hNzck+3FKPZagZjZCuqT2kW0rVdlDi9NmE0Su5D0KqIYAAAAAAAAAACKz09haty1w+ee7QAAAABJRU5ErkJggg==',
            inputVariables: [
                {
                    name: 'admin_passwd',
                    kind: 'variable' as VariableKind,
                    dataType: 'string',
                    example: undefined,
                    description:
                        'The admin password of the compute instance. If the value is empty, will create a random password.',
                    value: undefined,
                    mandatory: false,
                    valueSchema: {
                        minLength: 8,
                        maxLength: 16,
                        pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$',
                    },
                    sensitiveScope: 'always',
                    autoFill: undefined,
                    modificationImpact: {
                        isDataLost: false,
                        isServiceInterrupted: true,
                    },
                },
                {
                    name: 'image_name',
                    kind: 'variable' as VariableKind,
                    dataType: 'string',
                    example: 'Ubuntu 22.04 server 64bit',
                    description:
                        'The image name of the compute instance. If the value is empty, will use the default value to create compute instance.',
                    value: 'Ubuntu 22.04 server 64bit',
                    mandatory: false,
                    valueSchema: undefined,
                    sensitiveScope: 'none',
                    autoFill: undefined,
                    modificationImpact: {
                        isDataLost: false,
                        isServiceInterrupted: true,
                    },
                },
                {
                    name: 'vpc_name',
                    kind: 'variable' as VariableKind,
                    dataType: 'string',
                    example: 'ecs-vpc-default',
                    description:
                        'The vpc name of the compute instance. If the value is empty, will use the default value to find or create VPC.',
                    value: 'ecs-vpc-default',
                    mandatory: false,
                    valueSchema: undefined,
                    sensitiveScope: 'none',
                    autoFill: undefined,
                    modificationImpact: {
                        isDataLost: false,
                        isServiceInterrupted: true,
                    },
                },
                {
                    name: 'subnet_name',
                    kind: 'variable' as VariableKind,
                    dataType: 'string',
                    example: 'ecs-subnet-default',
                    description:
                        'The sub network name of the compute instance. If the value is empty, will use the default value to find or create subnet.',
                    value: 'ecs-subnet-default',
                    mandatory: false,
                    valueSchema: undefined,
                    sensitiveScope: 'none',
                    autoFill: undefined,
                    modificationImpact: {
                        isDataLost: false,
                        isServiceInterrupted: true,
                    },
                },
                {
                    name: 'secgroup_name',
                    kind: 'variable' as VariableKind,
                    dataType: 'string',
                    example: 'ecs-secgroup-default',
                    description:
                        'The security group name of the compute instance. If the value is empty, will use the default value to find or create security group.',
                    value: 'ecs-secgroup-default',
                    mandatory: false,
                    valueSchema: undefined,
                    sensitiveScope: 'none',
                    autoFill: undefined,
                    modificationImpact: {
                        isDataLost: false,
                        isServiceInterrupted: true,
                    },
                },
            ],
            outputVariables: [
                {
                    name: 'admin_passwd',
                    dataType: 'string',
                    description: 'The admin password of the compute instance.',
                    sensitiveScope: 'always',
                },
                {
                    name: 'ecs_host',
                    dataType: 'string',
                    description: 'The host of the compute instance.',
                    sensitiveScope: 'none',
                },
                {
                    name: 'ecs_public_ip',
                    dataType: 'string',
                    description: 'The public ip of the compute instance.',
                    sensitiveScope: 'none',
                },
            ],
            flavors: {
                name: '',
                properties: { p: '' },
                priority: 0,
                features: undefined,
                serviceFlavors: [
                    {
                        name: '1vCPUs-1GB-normal',
                        properties: {
                            flavor_id: 's6.small.1',
                        },
                        priority: 3,
                        features: ['High Availability', 'Maximum performance'],
                    },
                    {
                        name: '2vCPUs-4GB-normal',
                        properties: {
                            flavor_id: 's6.large.2',
                        },
                        priority: 2,
                        features: ['High Availability', 'Maximum performance'],
                    },
                    {
                        name: '2vCPUs-8GB-normal',
                        properties: {
                            flavor_id: 's6.large.4',
                        },
                        priority: 1,
                        features: ['High Availability', 'Maximum performance'],
                    },
                ],
                modificationImpact: {
                    isDataLost: false,
                    isServiceInterrupted: true,
                },
                isDowngradeAllowed: true,
                downgradeAllowed: true,
            },
            billing: {
                billingModes: ['Fixed', 'Pay per Use'],
                defaultBillingMode: 'Pay per Use',
            },
            serviceHostingType: 'self',
            serviceProviderContactDetails: {
                emails: ['test30@test.com', 'test31@test.com'],
                phones: ['011-13422222222', '022-13344444444'],
                chats: ['test1234', 'test1235'],
                websites: ['https://hw.com', 'https://hwcloud.com'],
            },
            serviceAvailabilityConfig: [
                {
                    displayName: 'Availability Zone',
                    varName: 'availability_zone',
                    mandatory: false,
                    description:
                        'The availability zone to deploy the service instance. If the value is empty, the service instance will be deployed in a random availability zone.',
                },
            ],
            eula: "This Acceptable Use Policy ('Policy') lists prohibited conduct and content when using the services provided by or on behalf of HUAWEI CLOUD and its affiliates. This Policy is an integral part of the HUAWEI CLOUD User Agreement ('User Agreement'). The examples and restrictions listed below are not exhaustive. We may update this Policy from time to time, and the updated Policy will be posted on the Website. By continuing to use the Services, you agree to abide by the latest version of this Policy. You acknowledge and agree that we may suspend or terminate the Services if you or your users violate this Policy. Terms used in the User Agreement have the same meanings in this Policy.\n\nProhibited Conduct\nWhen accessing or using the Services, or allowing others to access or use the Services, you may not:\n1. Violate any local, national or international laws, regulations and rules;\n2. Infringe or violate the rights of others, including but not limited to privacy rights or intellectual property rights;\n3. Engage in, encourage, assist or allow others to engage in any illegal, unlawful, infringing, harmful or fraudulent behavior, including but not limited to any of the following activities: harming or attempting to harm minors in any way, pornography, illegal gambling, illegal VPN construction, Ponzi schemes, cyber attacks, phishing or damage, privately intercepting any system, program or data, monitoring service data or traffic without permission, engaging in virtual currency 'mining' or virtual currency transactions;\n4. Transmit, provide, upload, download, use or reuse, disseminate or distribute any illegal, infringing, offensive, or harmful content or materials, including but not limited to those listed in the 'Prohibited Content' below;\n5. Transmit any data, send or upload any material that contains viruses, worms, Trojan horses, time bombs, keyboard loggers, spyware, adware or any other harmful programs or similar computer code designed to adversely affect the operation or security of any computer hardware or software;\n6. Attack, interfere with, disrupt or adversely affect any service, hardware, software, system, website or network, including but not limited to accessing or attacking any service, hardware, software, system, website or network using large amounts of automated means (including robots, crawlers, scripts or similar data gathering or extraction methods);\n7. Access any part of the Service, account or system without authorization, or attempt to do so;\n8. Violate or adversely affect the security or integrity of the Services, hardware, software, systems, websites or networks;\n9. Distribute, disseminate or send unsolicited email, bulk email or other messages, promotions, advertising or solicitations (such as 'spam');\n10. Fraudulent offers of goods or services, or any advertising, promotional or other materials containing false, deceptive or misleading statements.\n",
            configurationParameters: undefined,
            serviceActions: undefined,
            links: [
                {
                    rel: 'openApi',
                    href: 'http://localhost:8080/xpanse/catalog/services/10c2baff-36a8-4ea9-9041-b51409b0f291/openapi',
                },
            ],
        },
    ];

    await page.route(selectServiceUrl, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, timeToWaitForResponse));
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockResponseData),
        });
    });

    return mockResponseData;
};

export const mockSelectAzsSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(selectAzsUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(['cn-southwest-2a', 'cn-southwest-2d', 'cn-southwest-2e']),
        });
    });
};

export const mockSelectPriceSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(selectPriceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    flavorName: '1vCPUs-1GB-normal',
                    billingMode: 'Pay per Use',
                    recurringPrice: {
                        cost: '1.4270',
                        currency: 'CNY',
                        period: 'hourly',
                    },
                    oneTimePaymentPrice: null,
                    errorMessage: null,
                    successful: true,
                },
                {
                    flavorName: '2vCPUs-4GB-normal',
                    billingMode: 'Pay per Use',
                    recurringPrice: {
                        cost: '1.6590',
                        currency: 'CNY',
                        period: 'hourly',
                    },
                    oneTimePaymentPrice: null,
                    errorMessage: null,
                    successful: true,
                },
                {
                    flavorName: '2vCPUs-8GB-normal',
                    billingMode: 'Pay per Use',
                    recurringPrice: {
                        cost: '1.9150',
                        currency: 'CNY',
                        period: 'hourly',
                    },
                    oneTimePaymentPrice: null,
                    errorMessage: null,
                    successful: true,
                },
            ]),
        });
    });
};

export const mockDeploySuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(deployServiceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                orderId: '9c830b70-c2d5-4608-9dea-826becd122bb',
                serviceId: '868326e9-3611-43d6-ad88-c15d514f3f57',
            }),
        });
    });
};

export const mockDeployTaskStatusSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(deployTaskStatusUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ orderStatus: 'successful', isOrderCompleted: true, error: null }),
        });
    });
};

export const mockDeployDetailsSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(deployDetailsUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                serviceId: '868326e9-3611-43d6-ad88-c15d514f3f57',
                category: 'compute',
                name: 'terrafrm-ecs',
                customerServiceName: 'testDeploy',
                version: '1.0.0',
                csp: 'HuaweiCloud',
                serviceHostingType: 'self',
                region: {
                    name: 'cn-southwest-2',
                    site: 'Chinese Mainland',
                    area: 'Asia China',
                },
                availabilityZones: null,
                flavor: '2vCPUs-8GB-normal',
                billingMode: 'Pay per Use',
                inputProperties: {},
                deployedServiceProperties: {
                    ecs_host: '192.168.10.37',
                    ecs_public_ip: '116.63.185.89',
                    admin_passwd: 'r%wAK1dVDCyX',
                },
                serviceTemplateId: '10c2baff-36a8-4ea9-9041-b51409b0f291',
                userId: '308947175381925890',
                serviceDeploymentState: 'deployment successful',
                serviceState: 'running',
                createdTime: '2025-03-20 09:48:48 +08:00',
                lastModifiedTime: '2025-03-20 09:50:00 +08:00',
                lastStartedAt: '2025-03-20 09:50:00 +08:00',
                lastStoppedAt: null,
                lockConfig: {
                    modifyLocked: false,
                    destroyLocked: false,
                },
                serviceConfigurationDetails: null,
                deployResources: [
                    {
                        groupType: 'huaweicloud_compute_instance',
                        groupName: 'ecs-tf',
                        resourceId: '14647598-f5bf-4de8-ae58-3935760f002a',
                        resourceName: 'ecs-tf-66f45e6f',
                        resourceKind: 'vm',
                        properties: {
                            image_name: 'Ubuntu 22.04 server 64bit',
                            image_id: '0bcd8945-dd10-4990-8963-150f26aefdf1',
                            region: 'cn-southwest-2',
                            ip: '192.168.10.37',
                        },
                    },
                    {
                        groupType: 'huaweicloud_evs_volume',
                        groupName: 'volume',
                        resourceId: '983bbf10-98c4-446a-8db1-c75c0c9ca2cc',
                        resourceName: 'volume-tf-66f45e6f',
                        resourceKind: 'volume',
                        properties: {
                            size: '40',
                            type: 'SSD',
                        },
                    },
                    {
                        groupType: 'huaweicloud_vpc_eip',
                        groupName: 'eip-tf',
                        resourceId: 'fbea6dbc-6937-4a9b-9164-b396bd525362',
                        resourceName: 'fbea6dbc-6937-4a9b-9164-b396bd525362',
                        resourceKind: 'publicIP',
                        properties: {
                            ip: '116.63.185.89',
                        },
                    },
                ],
            }),
        });
    });
};

export const mockMyServicesSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(myServicesDetailsUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    serviceId: '868326e9-3611-43d6-ad88-c15d514f3f57',
                    category: 'compute',
                    name: 'terraform-ecs',
                    customerServiceName: 'testDeploy',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    serviceHostingType: 'self',
                    region: {
                        name: 'cn-southwest-2',
                        site: 'Chinese Mainland',
                        area: 'Asia China',
                    },
                    availabilityZones: null,
                    flavor: '2vCPUs-8GB-normal',
                    billingMode: 'Pay per Use',
                    inputProperties: {},
                    deployedServiceProperties: {
                        ecs_host: '192.168.10.37',
                        ecs_public_ip: '116.63.185.89',
                        admin_passwd: 'r%wAK1dVDCyX',
                    },
                    serviceTemplateId: '10c2baff-36a8-4ea9-9041-b51409b0f291',
                    userId: '308947175381925890',
                    serviceDeploymentState: 'deployment successful',
                    serviceState: 'running',
                    createdTime: '2025-03-20 09:48:48 +08:00',
                    lastModifiedTime: '2025-03-20 09:50:00 +08:00',
                    lastStartedAt: '2025-03-20 09:50:00 +08:00',
                    lastStoppedAt: null,
                    lockConfig: {
                        modifyLocked: false,
                        destroyLocked: false,
                    },
                    serviceConfigurationDetails: null,
                    deployResources: [
                        {
                            groupType: 'huaweicloud_compute_instance',
                            groupName: 'ecs-tf',
                            resourceId: '14647598-f5bf-4de8-ae58-3935760f002a',
                            resourceName: 'ecs-tf-66f45e6f',
                            resourceKind: 'vm',
                            properties: {
                                image_name: 'Ubuntu 22.04 server 64bit',
                                image_id: '0bcd8945-dd10-4990-8963-150f26aefdf1',
                                region: 'cn-southwest-2',
                                ip: '192.168.10.37',
                            },
                        },
                        {
                            groupType: 'huaweicloud_evs_volume',
                            groupName: 'volume',
                            resourceId: '983bbf10-98c4-446a-8db1-c75c0c9ca2cc',
                            resourceName: 'volume-tf-66f45e6f',
                            resourceKind: 'volume',
                            properties: {
                                size: '40',
                                type: 'SSD',
                            },
                        },
                        {
                            groupType: 'huaweicloud_vpc_eip',
                            groupName: 'eip-tf',
                            resourceId: 'fbea6dbc-6937-4a9b-9164-b396bd525362',
                            resourceName: 'fbea6dbc-6937-4a9b-9164-b396bd525362',
                            resourceKind: 'publicIP',
                            properties: {
                                ip: '116.63.185.89',
                            },
                        },
                    ],
                },
                {
                    serviceId: '6b554bca-5129-4d12-bbd4-5c7c22ab8797',
                    category: 'compute',
                    name: 'terraform-ecs',
                    customerServiceName: '11111',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    serviceHostingType: 'self',
                    region: {
                        name: 'cn-southwest-2',
                        site: 'Chinese Mainland',
                        area: 'Asia China',
                    },
                    availabilityZones: null,
                    flavor: '2vCPUs-8GB-normal',
                    billingMode: 'Pay per Use',
                    inputProperties: {},
                    deployedServiceProperties: {
                        ecs_host: '192.168.10.62',
                        ecs_public_ip: '122.9.159.246',
                        admin_passwd: '7@jmKM@6SGoT',
                    },
                    serviceTemplateId: '10c2baff-36a8-4ea9-9041-b51409b0f291',
                    userId: '308947175381925890',
                    serviceDeploymentState: 'deployment successful',
                    serviceState: 'running',
                    createdTime: '2025-03-19 17:10:31 +08:00',
                    lastModifiedTime: '2025-03-19 17:11:42 +08:00',
                    lastStartedAt: '2025-03-19 17:11:42 +08:00',
                    lastStoppedAt: null,
                    lockConfig: {
                        modifyLocked: false,
                        destroyLocked: false,
                    },
                    serviceConfigurationDetails: null,
                    deployResources: [
                        {
                            groupType: 'huaweicloud_compute_instance',
                            groupName: 'ecs-tf',
                            resourceId: '6525af66-3c3c-4f45-a434-50d9b2f8bddf',
                            resourceName: 'ecs-tf-f42a4320',
                            resourceKind: 'vm',
                            properties: {
                                image_name: 'Ubuntu 22.04 server 64bit',
                                image_id: '0bcd8945-dd10-4990-8963-150f26aefdf1',
                                region: 'cn-southwest-2',
                                ip: '192.168.10.62',
                            },
                        },
                        {
                            groupType: 'huaweicloud_evs_volume',
                            groupName: 'volume',
                            resourceId: '08b43222-ff52-42f6-8aab-5bbaa902ba2b',
                            resourceName: 'volume-tf-f42a4320',
                            resourceKind: 'volume',
                            properties: {
                                size: '40',
                                type: 'SSD',
                            },
                        },
                        {
                            groupType: 'huaweicloud_vpc_eip',
                            groupName: 'eip-tf',
                            resourceId: 'be670b0f-c722-4a79-b9ae-014b7f7ba085',
                            resourceName: 'be670b0f-c722-4a79-b9ae-014b7f7ba085',
                            resourceKind: 'publicIP',
                            properties: {
                                ip: '122.9.159.246',
                            },
                        },
                    ],
                },
                {
                    serviceId: 'e05be0ba-5735-44f7-ba84-97a9e64dc61d',
                    category: 'compute',
                    name: 'terraform-ecs',
                    customerServiceName: '22222222222222',
                    version: '1.0.0',
                    csp: 'HuaweiCloud',
                    serviceHostingType: 'self',
                    region: {
                        name: 'cn-southwest-2',
                        site: 'Chinese Mainland',
                        area: 'Asia China',
                    },
                    availabilityZones: null,
                    flavor: '1vCPUs-1GB-normal',
                    billingMode: 'Pay per Use',
                    inputProperties: {},
                    deployedServiceProperties: {
                        ecs_host: '192.168.10.163',
                        ecs_public_ip: '116.63.128.244',
                        admin_passwd: '@@3#WJC5nzgB',
                    },
                    serviceTemplateId: '10c2baff-36a8-4ea9-9041-b51409b0f291',
                    userId: '308947175381925890',
                    serviceDeploymentState: 'deployment successful',
                    serviceState: 'running',
                    createdTime: '2025-03-18 16:56:21 +08:00',
                    lastModifiedTime: '2025-03-18 16:57:25 +08:00',
                    lastStartedAt: '2025-03-18 16:57:25 +08:00',
                    lastStoppedAt: null,
                    lockConfig: {
                        modifyLocked: false,
                        destroyLocked: false,
                    },
                    serviceConfigurationDetails: null,
                    deployResources: [
                        {
                            groupType: 'huaweicloud_compute_instance',
                            groupName: 'ecs-tf',
                            resourceId: 'f0544956-2553-43c3-8348-1f47d9d68f20',
                            resourceName: 'ecs-tf-3533f5b9',
                            resourceKind: 'vm',
                            properties: {
                                image_name: 'Ubuntu 22.04 server 64bit',
                                image_id: '0bcd8945-dd10-4990-8963-150f26aefdf1',
                                region: 'cn-southwest-2',
                                ip: '192.168.10.163',
                            },
                        },
                        {
                            groupType: 'huaweicloud_evs_volume',
                            groupName: 'volume',
                            resourceId: '27409eef-be73-41c0-854f-c00c83db4395',
                            resourceName: 'volume-tf-3533f5b9',
                            resourceKind: 'volume',
                            properties: {
                                size: '40',
                                type: 'SSD',
                            },
                        },
                        {
                            groupType: 'huaweicloud_vpc_eip',
                            groupName: 'eip-tf',
                            resourceId: '2a85c02d-c83b-40e1-bdda-dcdb6f082a17',
                            resourceName: '2a85c02d-c83b-40e1-bdda-dcdb6f082a17',
                            resourceKind: 'publicIP',
                            properties: {
                                ip: '116.63.128.244',
                            },
                        },
                    ],
                },
            ]),
        });
    });
};

export const mockVmResourceSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(vmResourceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
        });
    });
};

export const mockRetryDeployFailedResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(retryDeployUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                errorType: 'Deployment Failed Exception',
                details: [
                    'OpenTofuExecutor Exception:OpenTofuExecutor.tfPlan failed.\r\nError: Authentication failed\r\n\r\n  with provider["registry.opentofu.org/huaweicloud/huaweicloud"],\r\n  on provider.tf line 10, in provider "huaweicloud":\r\n  10: provider "huaweicloud" {\r\n',
                ],
                serviceId: '868326e9-3611-43d6-ad88-c15d514f3f57',
                orderId: 'test-OrderId',
            }),
        });
    });
};

export const mockDeployFailedResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(deployServiceUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                errorType: 'Deployment Failed Exception',
                details: [
                    'OpenTofuExecutor Exception:OpenTofuExecutor.tfPlan failed.\r\nError: Authentication failed\r\n\r\n  with provider["registry.opentofu.org/huaweicloud/huaweicloud"],\r\n  on provider.tf line 10, in provider "huaweicloud":\r\n  10: provider "huaweicloud" {\r\n',
                ],
                serviceId: '868326e9-3611-43d6-ad88-c15d514f3f57',
                orderId: 'test-OrderId',
            }),
        });
    });
};
