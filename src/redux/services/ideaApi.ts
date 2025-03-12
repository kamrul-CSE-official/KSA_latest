import rootApi from "../api";

const ideaApis = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    saveIdea: builder.mutation({
      query: (data) => ({
        url: "/KSA/saveIdea",
        method: "POST",
        body: data,
        invalidatesTags: [{ type: "ideas", id: "LIST" }],
      }),
    }),
    getIdeas: builder.mutation({
      query: (data) => ({
        url: "/KSA/getListIdea",
        method: "POST",
        body: data,
        providesTags: ["ideas"],
      }),
    }),
    createWorkspace: builder.mutation({
      query: (data) => ({
        url: "/KSA/WorkSpace",
        method: "POST",
        body: data,
      }),
    }),
    workspaceList: builder.mutation({
      query: (data) => ({
        url: "/KSA/WorkSpace",
        method: "POST",
        body: data,
      }),
    }),
    tagAnother: builder.mutation({
      query: (data) => ({
        url: "/KSA/WorkSpace",
        method: "POST",
        body: data,
      }),
    }),
    createADocument: builder.mutation({
      query: (data) => ({
        url: "/KSA/CreateDocnumet",
        method: "POST",
        body: data,
      }),
    }),
    getIdeaList: builder.mutation({
      query: (data) => ({
        url: "/KSA/GetDocumentList",
        method: "POST",
        body: data,
      }),
    }),
    deleteAIdea: builder.mutation({
      query: (data) => ({
        url: "/KSA/DeleteAIdea",
        method: "POST",
        body: data,
      }),
    }),
    updateIdea: builder.mutation({
      query: (data) => ({
        url: "/KSA/UpdateIdea",
        method: "POST",
        body: data,
      }),
    }),
    getIdeaDetails: builder.mutation({
      query: (data) => ({
        url: "/KSA/GetIdeaDetails",
        method: "POST",
        body: data,
      }),
    }),
    workspaceShareManage: builder.mutation({
      query: (data) => ({
        url: "/KSA/WorkspaceShareManage",
        method: "POST",
        body: data,
      }),
    }),

    ideaInfo: builder.mutation({
      query: (data) => ({
        url: "/KSA/ideaInfo",
        method: "POST",
        body: data,
      }),
    }),

    commentSend: builder.mutation({
      query: (data) => ({
        url: "/KSA/Comments",
        method: "POST",
        body: data,
      }),
    }),

    ideaTitleUpdate: builder.mutation({
      query: (data) => ({
        url: "/KSA/UpdateIdeaTitle",
        method: "POST",
        body: data,
      }),
    }),

    ideaCoverImgUpdate: builder.mutation({
      query: (data) => ({
        url: "/KSA/UpdateIdeaCoverImg",
        method: "POST",
        body: data,
      }),
    }),

    ideaEmojiUpdate: builder.mutation({
      query: (data) => ({
        url: "/KSA/UpdateIdeaEmoji",
        method: "POST",
        body: data,
      }),
    }),

    ideaContentUpdate: builder.mutation({
      query: (data) => ({
        url: "/KSA/UpdateIdeaContent",
        method: "POST",
        body: data,
      }),
    }),
    ideaShareManage: builder.mutation({
      query: (data) => ({
        url: "/KSA/IdeaShareManage",
        method: "POST",
        body: data,
      }),
    }),

    dashboard: builder.mutation({
      query: (data) => ({
        url: "/KSA/Dashboard",
        method: "POST",
        body: data,
      }),
    }),

    askFRomAI: builder.mutation({
      query: (data) => ({
        url: "/KSA/GenerateAIPromptAsync",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSaveIdeaMutation,
  useGetIdeasMutation,
  useCreateWorkspaceMutation,
  useWorkspaceListMutation,
  useTagAnotherMutation,
  useCreateADocumentMutation,
  useGetIdeaListMutation,
  useDeleteAIdeaMutation,
  useUpdateIdeaMutation,
  useGetIdeaDetailsMutation,
  useWorkspaceShareManageMutation,
  useIdeaInfoMutation,
  useCommentSendMutation,
  useIdeaTitleUpdateMutation,
  useIdeaCoverImgUpdateMutation,
  useIdeaEmojiUpdateMutation,
  useIdeaContentUpdateMutation,
  useIdeaShareManageMutation,
  useDashboardMutation,
  useAskFRomAIMutation
} = ideaApis;

export default ideaApis;
