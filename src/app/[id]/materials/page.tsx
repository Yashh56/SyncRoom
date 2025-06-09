/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useCallback, useEffect } from 'react';
import {
    Upload,
    FolderPlus,
    Search,
    Filter,
    Download,
    Share2,
    Trash2,
    File,
    Folder,
    Image,
    Video,
    FileText,
    ArrowLeft,
    MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useEdgeStore } from '@/lib/edgeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { localURL } from '@/lib/url';

const MaterialsPage = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [currentFolder, setCurrentFolder] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    type Member = {
        id: string;
        user: { id: string };
        role: string;
        // add other properties if needed
    };
    const [members, setMembers] = useState<Member[]>([]);
    const roomId = useParams().id;
    const user = useAuthStore((state) => state.user);
    type Material = {
        id: string;
        title: string;
        description?: string;
        attachmentUrl: string;
        createdAt: string;
        // add other properties as needed
    };
    const [materials, setMaterials] = useState<Material[]>([]);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const getMaterials = async () => {
            try {
                const res = await axios.get(`${localURL}/materials/${roomId}`, {
                    withCredentials: true
                });
                // console.log(res.data)
                setMaterials(res.data.data)
            } catch (error) {
                // console.log(error)
            }
        }

        const getRoomDetails = async () => {
            try {
                const res = await axios.get(`${localURL}/room/details/${roomId}`, {
                    withCredentials: true
                });
                // console.log(res.data.data.members);
                setMembers(res.data.data.members);
            } catch (error) {
                // console.log(error);
            }
        }


        getRoomDetails();
        getMaterials();
    }, []);

    const { edgestore } = useEdgeStore();

    const insertMaterial = async (fileToUpload: File) => {
        try {
            setIsUploading(true);
            let uploadAttachmentUrl = '';

            if (fileToUpload) {
                const uploadResult = await edgestore.publicFiles.upload({
                    file: fileToUpload,
                    onProgressChange: (progress) => {
                        // console.log('Upload progress:', progress);
                        setUploadProgress(progress);
                    },
                });
                uploadAttachmentUrl = uploadResult.url;
            }

            const res = await axios.post(`${localURL}/materials/${roomId}`, {
                title: fileToUpload?.name || 'New Material',
                description: 'This is a new material',
                attachmentUrl: uploadAttachmentUrl,
            }, {
                withCredentials: true
            });

            // console.log(res.data);

            // Refresh materials list
            const updatedMaterials = await axios.get(`${localURL}/materials/${roomId}`, {
                withCredentials: true
            });
            setMaterials(updatedMaterials.data.data);

            // Close modal and reset states
            setTimeout(() => {
                setShowUploadModal(false);
                setSelectedFiles([]);
                setFile(null);
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);

        } catch (error) {
            // console.log(error);
            setIsUploading(false);
        }
    };

    // Function to determine file type from URL or filename
    const getFileType = (filename: string, attachmentUrl: string) => {
        const extension = filename.split('.').pop()?.toLowerCase() || '';
        const url = attachmentUrl?.toLowerCase() || '';

        if (['pdf'].includes(extension) || url.includes('.pdf')) return 'pdf';
        if (['doc', 'docx', 'txt', 'rtf'].includes(extension) || url.includes('.doc')) return 'document';
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension) ||
            url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif')) return 'image';
        if (['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm'].includes(extension) ||
            url.includes('.mp4') || url.includes('.mov')) return 'video';
        if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) return 'audio';
        return 'file';
    };

    const getFileIcon = (type: string) => {
        const iconMap = {
            folder: <Folder className="w-6 h-6" />,
            pdf: <FileText className="w-6 h-6" />,
            document: <FileText className="w-6 h-6" />,
            image: <Image className="w-6 h-6" />,
            video: <Video className="w-6 h-6" />,
            audio: <Video className="w-6 h-6" />,
            file: <File className="w-6 h-6" />,
            default: <File className="w-6 h-6" />
        };
        return iconMap[type as keyof typeof iconMap] || iconMap.default;
    };

    const getIconBg = (type: string) => {
        const bgMap = {
            folder: 'bg-gradient-to-br from-purple-500 to-purple-600',
            pdf: 'bg-gradient-to-br from-red-500 to-red-600',
            document: 'bg-gradient-to-br from-blue-500 to-blue-600',
            image: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            video: 'bg-gradient-to-br from-amber-500 to-amber-600',
            audio: 'bg-gradient-to-br from-purple-500 to-purple-600',
            file: 'bg-gradient-to-br from-gray-500 to-gray-600',
            default: 'bg-gradient-to-br from-gray-500 to-gray-600'
        };
        return bgMap[type as keyof typeof bgMap] || bgMap.default;
    };

    // Function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',  // 'short' for "May", 'long' for "May"
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,   // Set to false for 24-hour format
        };

        return date.toLocaleString('en-US', options);
    };

    // Function to get file size (placeholder - you might want to fetch this from your backend)
    const getFileSize = (url: string) => {
        // This is a placeholder. In a real app, you'd want to store file size in your database
        // or fetch it from the file URL
        return 'Unknown size';
    };

    const handleFileUpload = useCallback((files: FileList | null) => {
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            setSelectedFiles(fileArray);
            setFile(fileArray[0]); // Set the first file as the main file

            // Automatically call insertMaterial when file is selected
            if (fileArray[0]) {
                insertMaterial(fileArray[0]);
            }
        }
    }, []);

    const handleDragOver = useCallback((e: { preventDefault: () => void; }) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: { preventDefault: () => void; dataTransfer: { files: FileList; }; }) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    }, [handleFileUpload]);

    const startUpload = () => {
        if (selectedFiles.length === 0 || !file) return;
        insertMaterial(file);
    };

    const filteredMaterials = materials.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const deleteMaterial = async (id: string, attachmentUrl: string) => {
        try {
            const res = await axios.delete(`${localURL}/materials/${id}`, { withCredentials: true })
            // console.log(res.data)
            // Refresh materials list after deletion
            if (res.data.status === 'success') {
                await edgestore.publicFiles.delete({
                    url: attachmentUrl
                })

                const updatedMaterials = await axios.get(`${localURL}/materials/${roomId}`, {
                    withCredentials: true
                });
                setMaterials(updatedMaterials.data.data);
            }
        } catch (error) {
            // console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href={`/room/${roomId}`}>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-300">
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Back to Room</span>
                                </button>
                            </Link>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                                📚 Materials
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Action Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div className="flex items-center space-x-4">
                        {
                            members.map((m) =>
                                m.user.id === user?.id && m.role === 'ADMIN' ? (
                                    <button
                                        key={m.id}
                                        onClick={() => setShowUploadModal(true)}
                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/25"
                                    >
                                        <Upload className="w-5 h-5" />
                                        <span>Upload Files</span>
                                    </button>
                                ) : null
                            )
                        }


                        {/* <button className="flex items-center space-x-2 px-6 py-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all duration-300">
                            <FolderPlus className="w-5 h-5" />
                            <span>New Folder</span>
                        </button> */}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search materials..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 w-64"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="date">Sort by Date</option>
                            <option value="size">Sort by Size</option>
                            <option value="type">Sort by Type</option>
                        </select>
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
                    <span className="cursor-pointer hover:text-emerald-400 transition-colors">📂 Materials</span>
                    {currentFolder && (
                        <>
                            <span>/</span>
                            <span className="text-gray-100">{currentFolder}</span>
                        </>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                        <div className="text-3xl font-bold text-emerald-400 mb-2">{materials.length}</div>
                        <div className="text-gray-400 text-sm">Total Files</div>
                    </div>
                    {/* <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                        <div className="text-3xl font-bold text-purple-400 mb-2">6</div>
                        <div className="text-gray-400 text-sm">Folders</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                        <div className="text-3xl font-bold text-blue-400 mb-2">156 MB</div>
                        <div className="text-gray-400 text-sm">Storage Used</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                        <div className="text-3xl font-bold text-amber-400 mb-2">12</div>
                        <div className="text-gray-400 text-sm">Shared Items</div>
                    </div> */}
                </div>

                {/* Materials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {filteredMaterials.map((item, index) => {
                        const fileType = getFileType(item.title, item.attachmentUrl);
                        return (
                            <div
                                key={item.id}
                                className="group bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-emerald-500/30 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-xl ${getIconBg(fileType)} flex items-center justify-center text-white mb-4`}>
                                        {getFileIcon(fileType)}
                                    </div>

                                    <h3 className="font-semibold text-lg mb-2 text-gray-100 truncate" title={item.title}>
                                        {item.title}
                                    </h3>

                                    <div className="text-sm text-gray-400 mb-1">
                                        {fileType.toUpperCase()} • Uploaded {formatDate(item.createdAt)}
                                    </div>

                                    <div className="text-xs text-gray-500 truncate">
                                        {item.description}
                                    </div>

                                    {/* File size and download link */}
                                    <div className="text-xs text-gray-500 mt-2">
                                        Size: {getFileSize(item.attachmentUrl)}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center space-x-1">
                                            <a
                                                href={item.attachmentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
                                                title="Download/View"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                            <button
                                                className="p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
                                                title="Share"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(item.attachmentUrl);
                                                    // You could add a toast notification here
                                                }}
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors text-red-400"
                                                title="Delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Are you sure you want to delete "${item.title}"?`))
                                                        deleteMaterial(item.id, item.attachmentUrl);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Click to preview/open */}
                                <div
                                    className="absolute inset-0 cursor-pointer"
                                    onClick={() => {
                                        // Open file in new tab
                                        window.open(item.attachmentUrl, '_blank');
                                    }}
                                />
                            </div>
                        );
                    })}

                    {/* Empty state */}
                    {filteredMaterials.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                            <div className="text-6xl mb-4">📁</div>
                            <h3 className="text-xl font-semibold mb-2">No materials found</h3>
                            <p className="text-center">
                                {searchQuery ?
                                    `No materials match "${searchQuery}". Try a different search term.` :
                                    'Upload your first file to get started!'
                                }
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                                >
                                    Upload Files
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900/95 border border-gray-700 rounded-3xl p-8 max-w-lg w-full">
                        <h3 className="text-2xl font-bold mb-6 text-center">Upload Files</h3>

                        <div
                            className="border-2 border-dashed border-emerald-500/30 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all duration-300"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => {
                                const input = document.getElementById('fileInput');
                                if (input) input.click();
                            }}
                        >
                            <div className="text-6xl mb-4">📤</div>
                            {selectedFiles.length > 0 ? (
                                <div>
                                    <div className="text-lg font-medium mb-2">{selectedFiles.length} file(s) selected</div>
                                    <div className="text-sm text-gray-400">
                                        {selectedFiles.map(f => f.name).join(', ')}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-lg mb-2">Drag and drop files here or click to browse</div>
                                    <div className="text-sm text-gray-400">Maximum file size: 50MB</div>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            id="fileInput"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
                        />

                        {isUploading && (
                            <div className="mt-6">
                                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <div className="text-center text-sm text-gray-400">
                                    Uploading... {Math.round(uploadProgress)}%
                                </div>
                            </div>
                        )}

                        <div className="flex items-center space-x-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFiles([]);
                                    setFile(null);
                                }}
                                className="flex-1 px-6 py-3 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors"
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={startUpload}
                                disabled={selectedFiles.length === 0 || isUploading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialsPage;