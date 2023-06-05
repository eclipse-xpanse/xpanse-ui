export interface Queue<T> {
    enqueue: (item: T) => Queue<T>;
    dequeue: () => { item: T; queue: Queue<T> } | undefined;
    peek: (i: number) => { item: T } | undefined;
    isFull: () => boolean;
    isEmpty: () => boolean;
    size: () => number;
    clear: () => Queue<T>;
}
export const arrayQueue = <T>(maxSize: number): Queue<T> => {
    const data: T[] = [];
    const enqueue = (item: T): Queue<T> => {
        if (isFull()) {
            throw new Error('Queue is full.');
        }
        data.push(item);
        return queue;
    };
    const dequeue = (): { item: T; queue: Queue<T> } | undefined => {
        if (isEmpty()) {
            return undefined;
        }
        const item = data.shift() as T;
        return { item, queue };
    };

    const peek = (i: number): { item: T } | undefined => {
        if (isEmpty()) {
            return undefined;
        }
        const item = data[i];
        return { item };
    };
    const isFull = (): boolean => data.length === maxSize;
    const isEmpty = (): boolean => data.length === 0;
    const size = (): number => data.length;
    const clear = (): Queue<T> => {
        data.length = 0;
        return queue;
    };

    const queue: Queue<T> = {
        enqueue,
        dequeue,
        peek,
        isFull,
        isEmpty,
        size,
        clear,
    };
    return queue;
};
