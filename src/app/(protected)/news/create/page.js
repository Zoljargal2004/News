"use client"

import { FileInput } from "@/components/news/create/file-input";
import { NewsEdit } from "@/components/news/create/news-edit";

export default function CreateNewsPage() {
    return <div className="flex flex-col align-center w-full max-w-[870] mx-auto">
        <FileInput/>
        <NewsEdit/>
    </div>
}