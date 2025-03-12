"use client";

import { toast } from "sonner";
import { SmilePlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import CoverPicker from "@/app/_components/CoverPicker";
import React, { useEffect, useState, useCallback, memo } from "react";
import EmojiPickerComponent from "../../_components/EmojiPickerComponent";
import {
  useGetIdeaDetailsMutation,
  useIdeaCoverImgUpdateMutation,
  useIdeaEmojiUpdateMutation,
  useIdeaTitleUpdateMutation,
  useUpdateIdeaMutation,
} from "@/redux/services/ideaApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IIdea {
  Title: string;
  ShareTypeID: number;
  CompanyID: number;
  EnterdBy: number;
  Emoji: string;
  WorkSpaceID: number;
  IdeaID: number;
  CoverImg: string;
}

function DocumentInfo() {
  const [coverImage, setCoverImage] = useState("/cover.png");
  const [emoji, setEmoji] = useState("😊");
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [exestingData, setExestingData] = useState<IIdea | null>(null);

  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const ideaId = searchParams.get("ideaId");

  const [updateIdeaReq] = useUpdateIdeaMutation();
  const [getIdeaDetailsReq] = useGetIdeaDetailsMutation();

  const [updateIdeaTitleReq] = useIdeaTitleUpdateMutation();
  const [updateIdeaCoverImgReq] = useIdeaCoverImgUpdateMutation();
  const [updateIdeaEmojiReq] = useIdeaEmojiUpdateMutation();

  const { userData } = useSelector((state: RootState) => state.user);

  /**
   * Fetch document info and update state
   */
  const fetchDocumentInfo = useCallback(async () => {
    if (!workspaceId || !ideaId) return;

    try {
      const response = await getIdeaDetailsReq({
        WorkSpaceID: Number(workspaceId),
        IdeaID: Number(ideaId),
      }).unwrap();

      const docData = response?.[0];

      console.log("Doc Data: ", docData);
      setExestingData(docData);

      if (docData) {
        setDocumentTitle((prev) =>
          prev !== docData.Title ? docData.Title : prev
        );
        setEmoji((prev) => (prev !== docData.Emoji ? docData.Emoji : prev));
        setCoverImage((prev) =>
          prev !== docData.CoverImg ? docData.CoverImg : prev
        );
      }
    } catch (error) {
      toast.error("Failed to fetch document info.");
    }
  }, [workspaceId, ideaId, getIdeaDetailsReq]);

  useEffect(() => {
    fetchDocumentInfo();
  }, []);

  /**
   * Update document information
   */

  // Update idea cover img
  const updateIdeaCover = useCallback(
    async (value: string) => {
      if (!value) return;

      try {
        await updateIdeaCoverImgReq({
          WorkSpaceID: workspaceId,
          IdeaID: ideaId,
          CoverImg: value,
        })
          .then((res) => {
            toast.success("Document Updated!");
          })
          .catch((err) => {
            toast.error("Failed to update document.");
          });
      } catch (error) {
        toast.error("Failed to update document.");
      }
    },
    [workspaceId, ideaId, updateIdeaReq]
  );

  // Update idea title
  const updateIdeaTitle = useCallback(
    async (value: string) => {
      if (!value) return;

      try {
        await updateIdeaTitleReq({
          WorkSpaceID: workspaceId,
          IdeaID: ideaId,
          Title: value,
        })
          .then((res) => {
            toast.success("Document Updated!");
          })
          .catch((err) => {
            toast.error("Failed to update document.");
          });
      } catch (error) {
        toast.error("Failed to update document.");
      }
    },
    [workspaceId, ideaId, updateIdeaReq]
  );

  // Update idea emoji
  const updateIdeaEmoji = useCallback(
    async (value: string) => {
      if (!value) return;

      try {
        await updateIdeaEmojiReq({
          WorkSpaceID: workspaceId,
          IdeaID: ideaId,
          Emoji: value,
        })
          .then((res) => {
            toast.success("Document Updated!");
          })
          .catch((err) => {
            toast.error("Failed to update document.");
          });
      } catch (error) {
        toast.error("Failed to update document.");
      }
    },
    [workspaceId, ideaId, updateIdeaReq]
  );

  return (
    <div className="w-full">
      {/* Cover Picker */}
      <CoverPicker
        setNewCover={(cover) => {
          setCoverImage(cover);
          updateIdeaCover(cover);
        }}
      >
        <div className="relative group cursor-pointer">
          <h2 className="hidden absolute p-4 w-full h-full flex items-center justify-center group-hover:flex">
            Change Cover
          </h2>
          <div className="group-hover:opacity-40">
            <img
              src={coverImage || "/assets/cover.png"}
              width={400}
              height={200}
              className="w-full h-[200px] object-cover"
              alt="Cover Image"
            />
          </div>
        </div>
      </CoverPicker>

      {/* Emoji Picker */}
      <div className="absolute ml-10 px-20 mt-[-40px] cursor-pointer">
        <EmojiPickerComponent
          setEmojiIcon={(selectedEmoji) => {
            setEmoji(selectedEmoji);
            updateIdeaEmoji(selectedEmoji);
          }}
        >
          <div className="bg-[#ffffffb0] p-4 rounded-md">
            {emoji ? (
              <span className="text-5xl">{emoji}</span>
            ) : (
              <SmilePlus className="h-10 w-10 text-gray-500" />
            )}
          </div>
        </EmojiPickerComponent>
      </div>

      {/* Document Title */}
      <div className="mt-10 px-20 ml-10 p-10">
        <input
          type="text"
          placeholder="Untitled Document"
          value={documentTitle}
          className="font-bold text-4xl outline-none w-full"
          onChange={(e) => setDocumentTitle(e.target.value)}
          onBlur={(e) => updateIdeaTitle(e.target.value)}
        />
      </div>
    </div>
  );
}

export default memo(DocumentInfo);
