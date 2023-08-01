/*
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: Huawei Inc.
 */

function OrderSubmitResultDetails({ msg, uuid }: { msg: string | JSX.Element; uuid: string }): JSX.Element {
    return (
        <>
            Request ID: <b>{uuid}</b>
            <br />
            {msg}
        </>
    );
}

export default OrderSubmitResultDetails;
