import { Page } from 'playwright-core';
import { policiesUpdateUrl, policiesUrl, policyDeleteUrl } from './endpoints.ts';

interface PolicyRequestBody {
    policy: string;
    csp: string;
    enabled: boolean;
}

export const mockPoliciesSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(policiesUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    userPolicyId: '12a3dfbe-8ee2-45a3-8216-4ddf0982c90d',
                    policy: 'import future.keywords.if\nimport future.keywords.in\n\ndefault deny := false\n\nallow if {\n    input.method == "GET"\n    input.path == ["salary", input.subject.user]\n}\n\nallow if is_admin\n\nis_admin if "admin" in input.subject.groups',
                    csp: 'HuaweiCloud',
                    enabled: true,
                    createTime: '2025-01-22 09:44:27 +08:00',
                    lastModifiedTime: '2025-01-22 09:44:27 +08:00',
                },
            ]),
        });
    });
};

export const mockPolicyDeleteSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(policyDeleteUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 204,
            contentType: 'application/json',
        });
    });
};

export const mockPolicyPostSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(policiesUrl, async (route, request) => {
        if (request.method() === 'POST') {
            const requestBody = (await request.postDataJSON()) as PolicyRequestBody;

            await new Promise((resolve) => {
                setTimeout(resolve, timeToWaitForResponse);
            });

            const responseBody = {
                userPolicyId: '23f6dfbe-8ee2-45a3-8216-4ddf0982c90d',
                policy: requestBody.policy,
                csp: requestBody.csp,
                enabled: requestBody.enabled,
                createTime: '2025-01-22 09:44:27 +08:00',
                lastModifiedTime: '2025-01-22 09:44:27 +08:00',
            };

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(responseBody),
            });
        } else {
            await route.continue();
        }
    });
};

export const mockPolicyPutSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(policiesUpdateUrl, async (route, request) => {
        if (request.method() === 'PUT') {
            const requestBody = (await request.postDataJSON()) as PolicyRequestBody;

            await new Promise((resolve) => {
                setTimeout(resolve, timeToWaitForResponse);
            });

            const responseBody = {
                userPolicyId: '12a3dfbe-8ee2-45a3-8216-4ddf0982c90d',
                policy: requestBody.policy,
                csp: requestBody.csp,
                enabled: requestBody.enabled,
                createTime: '2025-01-22 09:44:27 +08:00',
                lastModifiedTime: '2025-01-22 09:44:27 +08:00',
            };

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(responseBody),
            });
        } else {
            await route.continue();
        }
    });
};

export const mockPolicyPostErrorResponse = async (
    page: Page,
    timeToWaitForResponse: number,
    statusCode: number,
    errorMessage: string
) => {
    await page.route(policiesUrl, async (route, request) => {
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

export const mockPolicyPutErrorResponse = async (
    page: Page,
    timeToWaitForResponse: number,
    statusCode: number,
    errorMessage: string
) => {
    await page.route(policiesUpdateUrl, async (route, request) => {
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

export const mockPolicyDeleteErrorResponse = async (
    page: Page,
    timeToWaitForResponse: number,
    statusCode: number,
    errorMessage: string
) => {
    await page.route(policyDeleteUrl, async (route, request) => {
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
