// "use client";

// import type { ChatRequestOptions, CreateMessage, Message } from "ai";
// import { motion } from "framer-motion";
// import type React from "react";
// import {
//   useRef,
//   useEffect,
//   useCallback,
//   type Dispatch,
//   type SetStateAction,
// } from "react";
// import { toast } from "sonner";
// import { useLocalStorage, useWindowSize } from "usehooks-ts";

// import { cn, sanitizeUIMessages } from "@/lib/utils";

// import { ArrowUpIcon, StopIcon } from "./icons";
// import { Button } from "./ui/button";
// import { Textarea } from "./ui/textarea";

// const suggestedActions = [
//   {
//     title: "What is the weather",
//     label: "in San Francisco?",
//     action: "What is the weather in San Francisco?",
//   },
//   {
//     title: "How is python useful",
//     label: "for AI engineers?",
//     action: "How is python useful for AI engineers?",
//   },
// ];

// export function MultimodalInput({
//   chatId,
//   input,
//   setInput,
//   isLoading,
//   stop,
//   messages,
//   setMessages,
//   append,
//   handleSubmit,
//   className,
// }: {
//   chatId: string;
//   input: string;
//   setInput: (value: string) => void;
//   isLoading: boolean;
//   stop: () => void;
//   messages: Array<Message>;
//   setMessages: Dispatch<SetStateAction<Array<Message>>>;
//   append: (
//     message: Message | CreateMessage,
//     chatRequestOptions?: ChatRequestOptions,
//   ) => Promise<string | null | undefined>;
//   handleSubmit: (
//     event?: {
//       preventDefault?: () => void;
//     },
//     chatRequestOptions?: ChatRequestOptions,
//   ) => void;
//   className?: string;
// }) {
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const { width } = useWindowSize();

//   useEffect(() => {
//     if (textareaRef.current) {
//       adjustHeight();
//     }
//   }, []);

//   const adjustHeight = () => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
//     }
//   };

//   const [localStorageInput, setLocalStorageInput] = useLocalStorage(
//     "input",
//     "",
//   );

//   useEffect(() => {
//     if (textareaRef.current) {
//       const domValue = textareaRef.current.value;
//       // Prefer DOM value over localStorage to handle hydration
//       const finalValue = domValue || localStorageInput || "";
//       setInput(finalValue);
//       adjustHeight();
//     }
//     // Only run once after hydration
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     setLocalStorageInput(input);
//   }, [input, setLocalStorageInput]);

//   const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setInput(event.target.value);
//     adjustHeight();
//   };

//   const submitForm = useCallback(() => {
//     handleSubmit(undefined, {});
//     setLocalStorageInput("");

//     if (width && width > 768) {
//       textareaRef.current?.focus();
//     }
//   }, [handleSubmit, setLocalStorageInput, width]);

//   return (
//     <div className="relative w-full flex flex-col gap-4">
//       {messages.length === 0 && (
//         <div className="grid sm:grid-cols-2 gap-2 w-full">
//           {suggestedActions.map((suggestedAction, index) => (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//               transition={{ delay: 0.05 * index }}
//               key={`suggested-action-${suggestedAction.title}-${index}`}
//               className={index > 1 ? "hidden sm:block" : "block"}
//             >
//               <Button
//                 variant="ghost"
//                 onClick={async () => {
//                   append({
//                     role: "user",
//                     content: suggestedAction.action,
//                   });
//                 }}
//                 className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
//               >
//                 <span className="font-medium">{suggestedAction.title}</span>
//                 <span className="text-muted-foreground">
//                   {suggestedAction.label}
//                 </span>
//               </Button>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       <Textarea
//         ref={textareaRef}
//         placeholder="Send a message..."
//         value={input}
//         onChange={handleInput}
//         className={cn(
//           "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl !text-base bg-muted",
//           className,
//         )}
//         rows={3}
//         autoFocus
//         onKeyDown={(event) => {
//           if (event.key === "Enter" && !event.shiftKey) {
//             event.preventDefault();

//             if (isLoading) {
//               toast.error("Please wait for the model to finish its response!");
//             } else {
//               submitForm();
//             }
//           }
//         }}
//       />

//       {isLoading ? (
//         <Button
//           className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
//           onClick={(event) => {
//             event.preventDefault();
//             stop();
//             setMessages((messages) => sanitizeUIMessages(messages));
//           }}
//         >
//           <StopIcon size={14} />
//         </Button>
//       ) : (
//         <Button
//           className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
//           onClick={(event) => {
//             event.preventDefault();
//             submitForm();
//           }}
//           disabled={input.length === 0}
//         >
//           <ArrowUpIcon size={14} />
//         </Button>
//       )}
//     </div>
//   );
// }


"use client";

import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import { Paperclip, X } from "lucide-react";
import type React from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { cn, sanitizeUIMessages } from "@/lib/utils";

import { ArrowUpIcon, StopIcon } from "./icons";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";



export function MultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    opts?: { contentOverride?: string; data?: any },
  ) => void;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPageDragOver, setIsPageDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasPageDragOverRef = useRef(false);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };
  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    "",
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  // Ensure the textarea shrinks back after external value changes (e.g., clearing on submit)
  useEffect(() => {
    if (textareaRef.current) {
      // reset to auto first to allow shrink
      textareaRef.current.style.height = "auto";
    }
    adjustHeight();
  }, [input]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Filter for supported file types
      const supportedTypes = [
        'application/pdf',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];

      const validFiles = Array.from(files).filter(file => {
        const isValidType = supportedTypes.includes(file.type) ||
          file.name.toLowerCase().endsWith('.csv') ||
          file.name.toLowerCase().endsWith('.xlsx') ||
          file.name.toLowerCase().endsWith('.xls');

        if (!isValidType) {
          toast.error(`${file.name}: Unsupported file type. Please upload PDF, CSV, Excel (.xlsx, .xls), or text files.`);
        }

        // Check file size (limit to 10MB for data files)
        const maxSize = file.type.includes('pdf') ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for PDFs, 10MB for others
        if (file.size > maxSize) {
          toast.error(`${file.name}: File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
          return false;
        }

        return isValidType;
      });

      setAttachments((prev) => [...prev, ...validFiles]);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Prevent default behavior on attachment removal
  const handleRemoveAttachment = (e: React.MouseEvent, indexToRemove: number) => {
    e.preventDefault();
    e.stopPropagation();
    removeAttachment(indexToRemove);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over if dragging files
    if (e.dataTransfer?.types.includes('Files')) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Use setTimeout to prevent flickering when moving between child elements
    setTimeout(() => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragOver(false);
      }
    }, 10);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setIsPageDragOver(false);
    setDragCounter(0);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Filter for supported file types
      const supportedTypes = [
        'application/pdf',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];

      const validFiles = Array.from(files).filter(file => {
        const isValidType = supportedTypes.includes(file.type) ||
          file.name.toLowerCase().endsWith('.csv') ||
          file.name.toLowerCase().endsWith('.xlsx') ||
          file.name.toLowerCase().endsWith('.xls');

        if (!isValidType) {
          toast.error(`${file.name}: Unsupported file type. Please upload PDF, CSV, Excel (.xlsx, .xls), or text files.`);
        }

        // Check file size (limit to 10MB for data files)
        const maxSize = file.type.includes('pdf') ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for PDFs, 10MB for others
        if (file.size > maxSize) {
          toast.error(`${file.name}: File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
          return false;
        }

        return isValidType;
      });

      setAttachments((prev) => [...prev, ...validFiles]);
    }
  };

  // Enable dropping files anywhere on the page
  useEffect(() => {
    const onWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter((prev) => prev + 1);
      if (e.dataTransfer?.types.includes('Files')) {
        setIsPageDragOver(true);
        wasPageDragOverRef.current = true;
      }
    };
    const onWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const onWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter(0);
      setIsPageDragOver(false);
      // Only handle drops when page overlay is active (dropping in empty space)
      // Local component drops are handled by the component's own drop handler
      const files = e.dataTransfer?.files;
      if (files && files.length > 0 && wasPageDragOverRef.current) {
        // Filter for supported file types
        const supportedTypes = [
          'application/pdf',
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain'
        ];

        const validFiles = Array.from(files).filter(file => {
          const isValidType = supportedTypes.includes(file.type) ||
            file.name.toLowerCase().endsWith('.csv') ||
            file.name.toLowerCase().endsWith('.xlsx') ||
            file.name.toLowerCase().endsWith('.xls');

          if (!isValidType) {
            toast.error(`${file.name}: Unsupported file type. Please upload PDF, CSV, Excel (.xlsx, .xls), or text files.`);
          }

          // Check file size (limit to 10MB for data files)
          const maxSize = file.type.includes('pdf') ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for PDFs, 10MB for others
          if (file.size > maxSize) {
            toast.error(`${file.name}: File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
            return false;
          }

          return isValidType;
        });

        setAttachments((prev) => [...prev, ...validFiles]);
      }
      wasPageDragOverRef.current = false;
    };
    const onWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter((prev) => {
        const newCounter = prev - 1;
        if (newCounter <= 0) {
          setIsPageDragOver(false);
          wasPageDragOverRef.current = false;
          return 0;
        }
        return newCounter;
      });
    };

    window.addEventListener("dragenter", onWindowDragEnter);
    window.addEventListener("dragover", onWindowDragOver);
    window.addEventListener("drop", onWindowDrop);
    window.addEventListener("dragleave", onWindowDragLeave);

    return () => {
      window.removeEventListener("dragenter", onWindowDragEnter);
      window.removeEventListener("dragover", onWindowDragOver);
      window.removeEventListener("drop", onWindowDrop);
      window.removeEventListener("dragleave", onWindowDragLeave);
    };
  }, []);

  const submitForm = useCallback(() => {
    const fileToDataUrl = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const processSubmit = async () => {
      const attachmentData = await Promise.all(
        attachments.map(async (file) => ({
          name: file.name,
          type: file.type,
          content: await fileToDataUrl(file),
        })),
      );

      handleSubmit(undefined, {
        data: {
          attachments: attachmentData,
        },
      });

      // Clear attachments so they don't appear on the next prompt
      setAttachments([]);
      if (fileInputRef.current) {
        try {
          // reset the native input so selecting the same file again re-triggers onChange
          fileInputRef.current.value = "";
        } catch {}
      }

      setLocalStorageInput("");
      resetHeight();

      if (width && width > 768) {
        textareaRef.current?.focus();
      }
    };

    processSubmit();
  }, [handleSubmit, setLocalStorageInput, width, attachments]);

  return (
    <div className="relative w-full flex flex-col gap-2">
      {isPageDragOver && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            setIsPageDragOver(false);
            setDragCounter(0);
            wasPageDragOverRef.current = false;
            if (files && files.length > 0) {
              // Filter for supported file types
              const supportedTypes = [
                'application/pdf',
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain'
              ];

              const validFiles = Array.from(files).filter(file => {
                const isValidType = supportedTypes.includes(file.type) ||
                  file.name.toLowerCase().endsWith('.csv') ||
                  file.name.toLowerCase().endsWith('.xlsx') ||
                  file.name.toLowerCase().endsWith('.xls');

                if (!isValidType) {
                  toast.error(`${file.name}: Unsupported file type. Please upload PDF, CSV, Excel (.xlsx, .xls), or text files.`);
                }

                // Check file size (limit to 10MB for data files)
                const maxSize = file.type.includes('pdf') ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for PDFs, 10MB for others
                if (file.size > maxSize) {
                  toast.error(`${file.name}: File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
                  return false;
                }

                return isValidType;
              });

              setAttachments((prev) => [...prev, ...validFiles]);
            }
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragCounter((prev) => {
              const newCounter = prev - 1;
              if (newCounter <= 0) {
                setIsPageDragOver(false);
                wasPageDragOverRef.current = false;
                return 0;
              }
              return newCounter;
            });
          }}
        >
          <div className="rounded-2xl border-2 border-dashed border-foreground/40 px-6 py-4 text-sm">
            Drop files to attach
          </div>
        </div>
      )}
      {attachments.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {attachments.map((file, index) => (
            <motion.div
              key={`${file.name}-${file.size}-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-muted p-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <span>{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full flex-shrink-0"
                onClick={(e) => handleRemoveAttachment(e, index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}



      <div
        className={cn(
          "relative flex w-full rounded-2xl border border-border/60 bg-muted/50 transition-all hover:border-border",
          isDragOver && "bg-primary/20 border-primary/40",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex w-full p-4 pr-14">
          <Textarea
            ref={textareaRef}
            placeholder="Send a message..."
            value={input}
            onChange={handleInput}
            className={cn(
              "min-h-[80px] max-h-[calc(75dvh)] w-full resize-none border-none bg-transparent !text-base shadow-none focus-visible:ring-0 pt-0 pl-0 pr-0",
              className,
            )}
            rows={3}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();

                if (isLoading) {
                  toast.error(
                    "Please wait for the model to finish its response!",
                  );
                } else {
                  submitForm();
                }
              }
            }}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-3 left-3 flex-shrink-0 h-9 w-9"
          onClick={handleAttachClick}
        >
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>

        {isLoading ? (
          <Button
            className="absolute bottom-3 right-3 rounded-full p-2 h-9 w-9 flex-shrink-0"
            onClick={(event) => {
              event.preventDefault();
              stop();
              setMessages((messages) => sanitizeUIMessages(messages));
            }}
          >
            <StopIcon size={16} />
          </Button>
        ) : (
          <Button
            className="absolute bottom-3 right-3 rounded-full p-2 h-9 w-9 flex-shrink-0"
            onClick={(event) => {
              event.preventDefault();
              submitForm();
            }}
            disabled={input.length === 0 && attachments.length === 0}
          >
            <ArrowUpIcon size={16} />
          </Button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
      </div>
    </div>
  );
}
