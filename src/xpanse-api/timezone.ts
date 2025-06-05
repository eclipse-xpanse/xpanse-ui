/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export const timezoneInterceptor = async (response: Response): Promise<Response> => {
    if (
        !response.ok ||
        response.headers.get('content-length') === '0' ||
        response.headers.get('Content-Type') !== 'application/json'
    ) {
        return response;
    }
    // Clone the response to read it as JSON and modify it
    const responseData = await response.clone().json();

    const convertTimestamps = (obj: any): any => {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }

        // List of known timestamp fields from the API. This must be updated if new fields are added.
        const timestampFields = [
            'createdTime',
            'lastModifiedTime',
            'timeStamp',
            'startedTime',
            'completedTime',
            'lastStartedAt',
            'lastStoppedAt',
            'updatedTime',
        ];

        if (Array.isArray(obj)) {
            return obj.map((item) => convertTimestamps(item));
        }

        const result: Record<string, any> = {};
        for (const [key, value] of Object.entries(obj)) {
            if (timestampFields.includes(key) && value) {
                try {
                    // Convert UTC to local timezone
                    result[key] = new Date(value as string).toLocaleString();
                } catch (e) {
                    result[key] = value;
                }
            } else if (value && typeof value === 'object') {
                // Recursively convert nested objects
                result[key] = convertTimestamps(value);
            } else {
                result[key] = value;
            }
        }
        return result;
    };

    const modifiedData = convertTimestamps(responseData);

    return new Response(JSON.stringify(modifiedData), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    });
};
