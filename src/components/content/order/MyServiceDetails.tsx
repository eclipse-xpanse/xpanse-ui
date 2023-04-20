/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import '../../../styles/app.css';
import { convertMapToUnorderedList } from '../../utils/generateUnorderedList';
export const MyServiceDetails = ({
    endPointInfo,
    requestParamsInfo,
}: {
    endPointInfo: Map<string, string>;
    requestParamsInfo: Map<string, string>;
}): JSX.Element => {
    function getContent(content: Map<string, string>, requestParams: Map<string, string>): string | JSX.Element {
        const items: JSX.Element[] = [];
        console.log('content', content);
        if (content.size > 0) {
            console.log('size', content.size);
            const endPointInfo: string | JSX.Element = convertMapToUnorderedList(content, 'Endpoint Information');
            items.push(endPointInfo as JSX.Element);
        }
        if (requestParams.size > 0) {
            const requestParam: string | JSX.Element = convertMapToUnorderedList(requestParams, 'Request Parameters');
            items.push(requestParam as JSX.Element);
        }
        return <span>{items}</span>;
    }

    return <>{getContent(endPointInfo, requestParamsInfo)}</>;
};
