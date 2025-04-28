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
    // Manage issues
    manageIssues: builder.mutation({
      query: (data) => ({
        url: "/KSA/ManageIssues",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateAIssueMutation, useManageIssuesMutation } = issuesApis;

export default issuesApis;
