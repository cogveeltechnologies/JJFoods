import { baseApi } from "../../../../../store/baseQuery";

const razorPayConfirmationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    razorPayConfirmation: build.mutation<string, {
      orderId: string,
      rPaymentId: string,
      rSignature: string,
      rOrderId: string,
    }>({
      query: ({ orderId, rOrderId, rPaymentId, rSignature }) => ({
        method: 'POST',
        url: `razorpay/fetchPaymentById`,
        body: { orderId, rOrderId, rPaymentId, rSignature },
      }),
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          message: response.data?.message || "An error occurred",
        };
      },
    }),
  }),
});

export const { useRazorPayConfirmationMutation } = razorPayConfirmationApi;
