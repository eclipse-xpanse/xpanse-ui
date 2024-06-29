/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

export type ApiResult<TData = any> = {
    readonly body: TData;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly url: string;
};
