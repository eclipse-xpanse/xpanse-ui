/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

import '../../../styles/app.css';
import { convertMapToUnorderedList } from '../../utils/generateUnorderedList';
export const MyServiceDetails = ({
    endPointInfo,
    requestParamsInfo,
    resultMessage,
}: {
    endPointInfo: Map<string, string>;
    requestParamsInfo: Map<string, string>;
    resultMessage: Map<string, string>;
}): JSX.Element => {
    function getContent(
        content: Map<string, string>,
        requestParams: Map<string, string>,
        resultMessage: Map<string, string>
    ): string | JSX.Element {
        const items: JSX.Element[] = [];
        if (content.size > 0) {
            const endPointInfo: string | JSX.Element = convertMapToUnorderedList(content, 'Endpoint Information');
            items.push(endPointInfo as JSX.Element);
        }
        if (requestParams.size > 0) {
            const requestParam: string | JSX.Element = convertMapToUnorderedList(requestParams, 'Request Parameters');
            items.push(requestParam as JSX.Element);
        }
        if (resultMessage.size > 0) {
            const result: string | JSX.Element = convertMapToUnorderedList(resultMessage, 'Result Message');
            items.push(result as JSX.Element);
        }
        return <span>{items}</span>;
    }

    return <>{getContent(endPointInfo, requestParamsInfo, resultMessage)}</>;
};
