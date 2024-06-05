import { baseApi } from "../../../store/baseQuery";

const authSignInApi = baseApi.injectEndpoints({
  endpoints: build => ({
    signIn: build.mutation<
      // Expected response type (replace with your actual type)
      {
        message: string
      },
      // Request body type

      {
        phoneNumber: string;
        otp: number
        // phoneNumber:number
      }

    >({
      query: ({ phoneNumber, otp }) => ({
        url: 'auth/login',
        method: 'POST',
        body: { phoneNumber, otp },
        // body: { phoneNumber, otp },
      }),
      transformErrorResponse: (response: any) => {
        // Handle and log errors if needed
        return {
          status: response.status,
          message: response.data || "An error occurred",
        };
      },
    }),
  }),
});

export const { useSignInMutation } = authSignInApi;
