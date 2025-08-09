import { create } from 'zustand';
import type { BucketUIState } from '@type/metric-bucket-types';

export const useBucketUIStore = create<BucketUIState>((set) => ({
    collapsedBuckets: {},

    toggleBucketCollapse: (idx: string | number) =>
        set((state) => ({
            collapsedBuckets: {
                ...state.collapsedBuckets,
                [idx]: !state.collapsedBuckets[idx],
            },
        })),

    setBucketCollapsed: (collapsed: Record<string | number, boolean>) =>
        set({ collapsedBuckets: collapsed }),

    resetBuckets: () => set({ collapsedBuckets: {} }),
}));
