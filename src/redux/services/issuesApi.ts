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

    suggestedPeople: builder.mutation({
      query: (data) => ({
        url: "/KSA/SuggestedPeople",
        method: "POST",
        body: data,
      }),
    }),
    issueShare: builder.mutation({
      query: (data) => ({
        url: "/KSA/IssueShare",
        method: "POST",
        body: data,
      }),
    }),
    updaeIssueContent: builder.mutation({
      query: (data) => ({
        url: "/KSA/UpdateIssueContent",
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
  useIssuesSolutionsMutation,
  useSuggestedPeopleMutation,
  useIssueShareMutation,
  useUpdaeIssueContentMutation
} = issuesApis;

export default issuesApis;
