import store from "../store";
import { urbApiClient } from "../../config/axiosConfig";
import { accountStatementActions } from "../reducers/accountStatement";

const { dispatch } = store;

export const fetchAccountStatement = async ({
  detailType = "ALL",
  fromDate,
  toDate,
  userId = "",
}) => {
  dispatch(accountStatementActions.requestStart());

  try {
    const response = await urbApiClient.post("/ant-pro/get-accstt-chpdtl", {
      detailType,
      fromDate,
      toDate,
      userId,
    });

    const rows = response?.data?.data || [];
    dispatch(accountStatementActions.requestSuccess(rows));
    return { success: true, data: rows };
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Unable to fetch account statement";

    dispatch(accountStatementActions.requestFail(errorMessage));
    return { success: false, error: errorMessage };
  }
};