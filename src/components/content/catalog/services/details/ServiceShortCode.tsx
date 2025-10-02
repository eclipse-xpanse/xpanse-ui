import { Tag } from 'antd';
import React from 'react';

export function ServiceShortCode({ shortCode }: { shortCode: string }): React.JSX.Element {
    return (
        <Tag color={'red'} bordered={false}>
            {shortCode}
        </Tag>
    );
}
