import React from 'react';
import { Card, Skeleton } from 'antd';

export function ServicesDashboardSkeleton(): React.JSX.Element {
    return (
        <Card title='Services Dashboard' bordered={true}>
            <Skeleton avatar={false} active={true} paragraph={{ rows: 1 }} style={{ width: '300px' }} />
        </Card>
    );
}
