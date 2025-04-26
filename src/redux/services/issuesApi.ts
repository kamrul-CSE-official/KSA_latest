import rootApi from "../api";

const issuesApis = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create issue
    createAIssue: builder.mutation({
      query: (data) => ({
        url: "/KSA/CreateAIssue",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateAIssueMutation } = issuesApis;

export default issuesApis;
