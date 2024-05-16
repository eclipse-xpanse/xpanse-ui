/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

declare global {
    interface Window {
        injectedEnv: Record<string, never>;
    }
}

export {};
