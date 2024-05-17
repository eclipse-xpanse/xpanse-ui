/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

/**
 * the env object contains a combination of configuration loaded from .env and values injected via environment variables
 * for production builds running via docker images. The values from environment vars get priority.
 */
const env: Record<string, string | undefined> = {
    ...import.meta.env,
    ...window.injectedEnv,
};

export { env };
