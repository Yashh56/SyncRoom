/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useCallback } from 'react';
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

const MaterialsPage = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [currentFolder, setCurrentFolder] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const roomId = useParams().id;
    // Sample data
    const materials = [
        {
            id: 1,
            name: 'Presentations',
            type: 'folder',
            items: 8,
            updatedBy: 'Sarah Chen',
            updatedAt: '2 hours ago',
            size: null
        },
        {
            id: 2,
            name: 'Images',
            type: 'folder',
            items: 15,
            updatedBy: 'Mike Johnson',
            updatedAt: 'yesterday',
            size: null
        },
        {
            id: 3,
            name: 'Project Proposal.pdf',
            type: 'pdf',
            updatedAt: '3 hours ago',
            size: '2.4 MB'
        },
        {
            id: 4,
            name: 'Meeting Notes.docx',
            type: 'document',
            updatedAt: '1 day ago',
            size: '845 KB'
        },
        {
            id: 5,
            name: 'Design Mockup.jpg',
            type: 'image',
            updatedAt: '2 days ago',
            size: '1.8 MB'
        },
        {
            id: 6,
            name: 'Demo Video.mp4',
            type: 'video',
            updatedAt: '3 days ago',
            size: '15.2 MB'
        }
    ];

    const recentFiles = [
        { id: 1, name: 'Project Proposal.pdf', type: 'pdf', accessedAt: '2 minutes ago' },
        { id: 2, name: 'Meeting Notes.docx', type: 'document', accessedAt: '1 hour ago' },
        { id: 3, name: 'Design Mockup.jpg', type: 'image', accessedAt: '3 hours ago' }
    ];

    const getFileIcon = (type) => {
        const iconMap = {
            folder: <Folder className="w-6 h-6" />,
            pdf: <FileText className="w-6 h-6" />,
            document: <FileText className="w-6 h-6" />,
            image: <Image className="w-6 h-6" />,
            video: <Video className="w-6 h-6" />,
            default: <File className="w-6 h-6" />
        };
        return iconMap[type] || iconMap.default;
    };

    const getIconBg = (type) => {
        const bgMap = {
            folder: 'bg-gradient-to-br from-purple-500 to-purple-600',
            pdf: 'bg-gradient-to-br from-blue-500 to-blue-600',
            document: 'bg-gradient-to-br from-blue-500 to-blue-600',
            image: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            video: 'bg-gradient-to-br from-amber-500 to-amber-600',
            default: 'bg-gradient-to-br from-gray-500 to-gray-600'
        };
        return bgMap[type] || bgMap.default;
    };

    const handleFileUpload = useCallback((files) => {
        setSelectedFiles(Array.from(files));
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    }, [handleFileUpload]);

    const startUpload = () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                const newProgress = prev + Math.random() * 20;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setShowUploadModal(false);
                        setSelectedFiles([]);
                        setIsUploading(false);
                        setUploadProgress(0);
                    }, 500);
                    return 100;
                }
                return newProgress;
            });
        }, 200);
    };

    const filteredMaterials = materials.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/25"
                        >
                            <Upload className="w-5 h-5" />
                            <span>Upload Files</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all duration-300">
                            <FolderPlus className="w-5 h-5" />
                            <span>New Folder</span>
                        </button>
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
                        <div className="text-3xl font-bold text-emerald-400 mb-2">24</div>
                        <div className="text-gray-400 text-sm">Total Files</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
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
                    </div>
                </div>

                {/* Materials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {filteredMaterials.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-emerald-500/30 hover:transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl ${getIconBg(item.type)} flex items-center justify-center text-white mb-4`}>
                                    {getFileIcon(item.type)}
                                </div>

                                <h3 className="font-semibold text-lg mb-2 text-gray-100 truncate">{item.name}</h3>

                                <div className="text-sm text-gray-400 mb-1">
                                    {item.type === 'folder'
                                        ? `${item.items} files • Updated ${item.updatedAt}`
                                        : `${item.type.toUpperCase()} • Added ${item.updatedAt}`
                                    }
                                </div>

                                <div className="text-xs text-gray-500">
                                    {item.type === 'folder' ? `By ${item.updatedBy}` : item.size}
                                </div>

                                {/* Action buttons */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center space-x-1">
                                        <button className="p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Files */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-6 text-gray-100">Recently Accessed</h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                        {recentFiles.map((file, index) => (
                            <div
                                key={file.id}
                                className={`flex items-center p-6 hover:bg-white/5 cursor-pointer transition-colors ${index !== recentFiles.length - 1 ? 'border-b border-white/5' : ''
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg ${getIconBg(file.type)} flex items-center justify-center text-white mr-4`}>
                                    {getFileIcon(file.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-100">{file.name}</div>
                                    <div className="text-sm text-gray-400">Opened {file.accessedAt}</div>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        ))}
                    </div>
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
                            onClick={() => document.getElementById('fileInput').click()}
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
                                onClick={() => setShowUploadModal(false)}
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