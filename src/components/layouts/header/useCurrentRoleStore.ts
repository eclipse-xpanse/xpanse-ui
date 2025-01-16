/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import { createJSONStorage, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface CurrentUserRoleStore {
    currentUserRole: string | undefined;
    isRoleUpdated: boolean;
}

const initialState: CurrentUserRoleStore = {
    currentUserRole: undefined,
    isRoleUpdated: false,
};

interface updateState {
    addCurrentUserRole: (currentUserRole: string, isRoleUpdated: boolean) => void;
    clearCurrentUserRole: () => void;
    isPageLoadedWithoutRoleChange: (isRoleUpdated: boolean) => void;
}

export const useCurrentUserRoleStore = createWithEqualityFn<CurrentUserRoleStore & updateState>()(
    persist(
        (set) => ({
            ...initialState,
            addCurrentUserRole: (currentUserRole, isRoleUpdated) => {
                set({ currentUserRole: currentUserRole, isRoleUpdated: isRoleUpdated });
            },
            isPageLoadedWithoutRoleChange: (isRoleUpdated: boolean) => {
                set({ isRoleUpdated: !isRoleUpdated });
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
