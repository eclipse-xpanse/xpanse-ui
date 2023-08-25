import { create } from 'zustand';
import { OrderSubmitProps } from '../content/order/create/OrderSubmit';
import { DeployParam } from '../content/order/formElements/CommonTypes';

interface OrderPropsState {
    oldCustomerServiceName: string;
    deployProps: OrderSubmitProps | undefined;
    deployParams: DeployParam[];
    setParams: (
        oldCustomerServiceName: string,
        deployProps: OrderSubmitProps | undefined,
        deployParams: DeployParam[]
    ) => void;
    removeAllParams: () => void;
}

export const useOrderPropsStore = create<OrderPropsState>()((set) => ({
    oldCustomerServiceName: '',
    deployProps: undefined,
    deployParams: [],
    setParams: (
        oldCustomerServiceName: string,
        deployProps: OrderSubmitProps | undefined,
        deployParams: DeployParam[]
    ) => {
        set({
            oldCustomerServiceName: oldCustomerServiceName,
            deployProps: deployProps,
            deployParams: deployParams,
        });
    },
    removeAllParams: () => set(() => ({ oldCustomerServiceName: '', deployProps: undefined, deployParams: [] })),
}));
