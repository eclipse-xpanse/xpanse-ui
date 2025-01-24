import { Page } from 'playwright-core';
import {
    credentialsCapabilitiesUrl,
    credentialsCspUrl,
    credentialsDeleteUrl,
    credentialsSiteUrl,
    credentialsTypeUrl,
    credentialsUrl,
} from './endpoints.ts';

export const mockCredentialsSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(credentialsUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    csp: 'HuaweiCloud',
                    site: 'International',
                    type: 'variables',
                    name: 'AK_SK',
                    description: 'Using The access key and security key authentication.',
                    userId: null,
                    timeToLive: null,
                    variables: [
                        {
                            name: 'HW_ACCESS_KEY',
                            description: 'The access key.',
                            isMandatory: true,
                            isSensitive: true,
                            value: 'value to be provided by creating credential or adding environment variables.',
                        },
                        {
                            name: 'HW_SECRET_KEY',
                            description: 'The security key.',
                            isMandatory: true,
                            isSensitive: true,
                            value: 'value to be provided by creating credential or adding environment variables.',
                        },
                    ],
                    uniqueKey: 'HUAWEI_CLOUD-International-VARIABLES-AK_SK',
                },
            ]),
        });
    });
};

export const mockCredentialsDeleteSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(credentialsDeleteUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 204,
            contentType: 'application/json',
        });
    });
};

export const mockCredentialsCspSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(credentialsCspUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });

        const response = {
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(['HuaweiCloud', 'FlexibleEngine']),
        };

        await route.fulfill(response);
    });
};

export const mockCredentialsSiteSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(credentialsSiteUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });

        const response = {
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(['International', 'Chinese Mainland', 'Europe']),
        };

        await route.fulfill(response);
    });
};

export const mockCredentialsTypeSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(credentialsTypeUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });

        const response = {
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(['variables']),
        };

        await route.fulfill(response);
    });
};

export const mockCredentialsCapabilitiesSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(credentialsCapabilitiesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });

        const response = {
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    csp: 'HuaweiCloud',
                    site: 'International',
                    type: 'variables',
                    name: 'AK_SK',
                    description: 'Using The access key and security key authentication.',
                    userId: null,
                    timeToLive: null,
                    variables: [
                        {
                            name: 'HW_ACCESS_KEY',
                            description: 'The access key.',
                            isMandatory: true,
                            isSensitive: true,
                            value: 'value to be provided by creating credential or adding environment variables.',
                        },
                        {
                            name: 'HW_SECRET_KEY',
                            description: 'The security key.',
                            isMandatory: true,
                            isSensitive: true,
                            value: 'value to be provided by creating credential or adding environment variables.',
                        },
                    ],
                    uniqueKey: 'HUAWEI_CLOUD-International-VARIABLES-AK_SK',
                },
            ]),
        };

        await route.fulfill(response);
    });
};

export const mockCredentialsPostErrorResponse = async (
    page: Page,
    timeToWaitForResponse: number,
    statusCode: number,
    errorMessage: string
) => {
    await page.route(credentialsUrl, async (route, request) => {
        if (request.method() === 'POST') {
            await new Promise((resolve) => {
                setTimeout(resolve, timeToWaitForResponse);
            });

            await route.fulfill({
                status: statusCode,
                contentType: 'application/json',
                body: JSON.stringify({ error: errorMessage }),
            });
        } else {
            await route.continue();
        }
    });
};

export const mockCredentialsPutErrorResponse = async (
    page: Page,
    timeToWaitForResponse: number,
    statusCode: number,
    errorMessage: string
) => {
    await page.route(credentialsUrl, async (route, request) => {
        if (request.method() === 'PUT') {
            await new Promise((resolve) => {
                setTimeout(resolve, timeToWaitForResponse);
            });

            await route.fulfill({
                status: statusCode,
                contentType: 'application/json',
                body: JSON.stringify({ error: errorMessage }),
            });
        } else {
            await route.continue();
        }
    });
};

export const mockCredentialsDeleteErrorResponse = async (
    page: Page,
    timeToWaitForResponse: number,
    statusCode: number,
    errorMessage: string
) => {
    await page.route(credentialsDeleteUrl, async (route, request) => {
        if (request.method() === 'DELETE') {
            await new Promise((resolve) => {
                setTimeout(resolve, timeToWaitForResponse);
            });

            await route.fulfill({
                status: statusCode,
                contentType: 'application/json',
                body: JSON.stringify({ error: errorMessage }),
            });
        } else {
            await route.continue();
        }
    });
};
