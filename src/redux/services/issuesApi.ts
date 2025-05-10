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
    // Number of KSA
    numberOfKsa: builder.mutation({
      query: (data) => ({
        url: "/KSA/NumberOfKsa",
        method: "POST",
        body: data,
      }),
    }),
    // Issue details
    issueDetails: builder.mutation({
      query: (data) => ({
        url: "/KSA/IssueDetails",
        method: "POST",
        body: data,
      }),
    }),
    issuesLikes: builder.mutation({
      query: (data) => ({
        url: "/KSA/IssueLikesManage",
        method: "POST",
        body: data,
      }),
    }),
    issuesSolutions: builder.mutation({
      query: (data) => ({
        url: "/KSA/IssueSolution",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateAIssueMutation,
  useManageIssuesMutation,
  useNumberOfKsaMutation,
  useIssueDetailsMutation,
  useIssuesLikesMutation,
  useIssuesSolutionsMutation
} = issuesApis;

export default issuesApis;
