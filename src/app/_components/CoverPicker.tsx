"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Upload } from "lucide-react";
import CoverOption from "@/_shared/CoverOption";
import useImageUpload from "@/utils/UploadImage";

function CoverPicker({
  children,
  setNewCover,
}: {
  children: React.ReactNode;
  setNewCover: (cover: string) => void;
}) {
  const [selectedCover, setSelectedCover] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { uploadImages, uploading, error, imageUrls } = useImageUpload();

  const handleUpdateCover = () => {
    if (selectedCover) {
      setNewCover(selectedCover);
    }
    setOpen(false);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const uploadedUrls = await uploadImages(event.target.files);
      if (uploadedUrls.length > 0) {
        setSelectedCover(uploadedUrls[0] || "/assets/cover.jpg");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-full">
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[700px]" style={{ zIndex: 950 }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Choose a Cover
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            Select or upload a cover image for your workspace.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] mt-4 pr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {/* Default Cover Options */}
              {CoverOption?.map((cover, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCover(cover?.imageUrl)}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                >
                  <div
                    className={`absolute inset-0 border-2 rounded-lg z-10 ${
                      selectedCover === cover?.imageUrl
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    {selectedCover === cover?.imageUrl && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={cover?.imageUrl || "/placeholder.svg"}
                      alt={`Cover option ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </motion.div>
              ))}

              {/* Uploaded Images */}
              {imageUrls.map((url, index) => (
                <motion.div
                  key={`uploaded-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCover(url)}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                >
                  <div
                    className={`absolute inset-0 border-2 rounded-lg z-10 ${
                      selectedCover === url
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    {selectedCover === url && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={url}
                      alt={`Uploaded Cover ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </motion.div>
              ))}

              {/* Upload Button */}
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative rounded-lg overflow-hidden cursor-pointer border border-dashed border-gray-400 flex items-center justify-center aspect-video"
              >
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                >
                  <Upload className="h-6 w-6 text-gray-500" />
                  <span className="text-gray-500 text-sm">Upload Image</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Uploading/Error Messages */}
        {uploading && (
          <p className="text-sm text-blue-500 mt-2">Uploading image...</p>
        )}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleUpdateCover}
            disabled={!selectedCover}
          >
            Apply Cover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CoverPicker;
