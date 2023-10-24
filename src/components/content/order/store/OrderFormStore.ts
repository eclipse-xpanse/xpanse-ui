/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

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
    (set) => ({
        ...initialState,
        addDeployVariable: (deployVariableName: string, deployVariableValue: unknown) => {
            set((state) => ({
                deployParams: { ...state.deployParams, [deployVariableName]: deployVariableValue },
            }));
        },
        clearFormVariables: () => {
            set(initialState);
        },
    }),
    shallow
);
