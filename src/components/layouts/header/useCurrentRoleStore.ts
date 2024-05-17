/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { createJSONStorage, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface CurrentUserRoleStore {
    currentUserRole: string | undefined;
}

const initialState: CurrentUserRoleStore = {
    currentUserRole: undefined,
};

interface updateState {
    addCurrentUserRole: (currentUserRole: string) => void;
    clearCurrentUserRole: () => void;
}

export const useCurrentUserRoleStore = createWithEqualityFn<CurrentUserRoleStore & updateState>()(
    persist(
        (set) => ({
            ...initialState,
            addCurrentUserRole: (currentUserRole) => {
                set({ currentUserRole: currentUserRole });
            },
            clearCurrentUserRole: () => {
                set(initialState);
            },
        }),
        {
            name: 'storage',
            storage: createJSONStorage(() => localStorage),
        }
    ),
    shallow
);
