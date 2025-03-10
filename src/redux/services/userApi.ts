import rootApi from "../api";

const UserApis = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // login
    login: builder.mutation({
      query: (data) => ({
        url: "/Login/IsValidUserWithJWTToken",
        method: "POST",
        body: data,
      }),
    }),
    userDeatils: builder.mutation({
      query: (data) => ({
        url: "/User/GetRequesterDetails",
        method: "POST",
        body: data,
      }),
    }),

    suggestForTag: builder.mutation({
      query: (data) => ({
        url: "/KSA/getSuggestPesson",
        method: "POST",
        body: data,
      }),
    }),

    searchEmploy: builder.mutation({
      query: (data) => ({
        url: "/User/GetRequesterDetails",
        method: "POST",
        body: data,
      }),
    }),

    getEmp: builder.mutation({
      query: (data) => ({
        url: "/KSA/getEmpProfile",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useUserDeatilsMutation,
  useSuggestForTagMutation,
  useSearchEmployMutation,
  useGetEmpMutation
} = UserApis;

export default UserApis;
