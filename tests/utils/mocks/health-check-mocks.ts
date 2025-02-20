import { Page } from 'playwright-core';
import { healthCheckUrl } from './endpoints.ts';

export const mockHealthCheckSuccessResponse = async (page: Page, timeToWaitForResponse: number) => {
    await page.route(healthCheckUrl, async (route) => {
        await new Promise((resolve) => {
            setTimeout(resolve, timeToWaitForResponse);
        });
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                healthStatus: 'OK',
                backendSystemStatuses: [
                    {
                        backendSystemType: 'Database',
                        name: 'mysql',
                        healthStatus: 'OK',
                        endpoint:
                            'jdbc:mysql://localhost:3306/xpanse?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8&characterSetResults=utf8&useSSL=false&allowPublicKeyRetrieval=true',
                        details: null,
                    },
                    {
                        backendSystemType: 'Terra Boot',
                        name: 'Terra Boot',
                        healthStatus: 'OK',
                        endpoint: 'http://localhost:9090',
                        details: null,
                    },
                    {
                        backendSystemType: 'Tofu Maker',
                        name: 'Tofu Maker',
                        healthStatus: 'OK',
                        endpoint: 'http://localhost:9092',
                        details: null,
                    },
                    {
                        backendSystemType: 'Policy Man',
                        name: 'Policy Man',
                        healthStatus: 'OK',
                        endpoint: 'http://localhost:8090',
                        details: null,
                    },
                    {
                        backendSystemType: 'Cache Provider',
                        name: 'Caffeine',
                        healthStatus: 'OK',
                        endpoint: 'local',
                        details: null,
                    },
                ],
            }),
        });
    });
};
