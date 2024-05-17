/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface OrderFormStore {
    deployParams: Record<string, unknown>;
}

const initialState: OrderFormStore = {
    deployParams: {},
};

interface updateState {
    addDeployVariable: (deployVariableName: string, deployVariableValue: unknown) => void;
    clearFormVariables: () => void;
}

export const useOrderFormStore = createWithEqualityFn<OrderFormStore & updateState>()(
    (set, getState) => ({
        ...initialState,
        addDeployVariable: (deployVariableName: string, deployVariableValue: unknown) => {
            if (
                !deployVariableValue &&
                Object.prototype.hasOwnProperty.call(getState().deployParams, deployVariableName)
            ) {
                delete getState().deployParams[deployVariableName];
                set((state) => ({
                    deployParams: { ...state.deployParams },
                }));
            } else {
                set((state) => ({
                    deployParams: { ...state.deployParams, [deployVariableName]: deployVariableValue },
                }));
            }
        },
        clearFormVariables: () => {
            set(initialState);
        },
    }),
    shallow
);
