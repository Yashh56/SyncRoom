/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Button } from '../ui/button'
import { PlusCircle, Loader2, ImageIcon, Globe, Lock } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { toast } from 'sonner'
import { useEdgeStore } from '@/lib/edgeStore'
import { localURL } from '@/lib/url'

const CreateRoom = () => {
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState('')
    const [banner, setBanner] = React.useState('')
    const [mode, setMode] = React.useState('PUBLIC')
    const [loading, setLoading] = React.useState(false)
    const { edgestore } = useEdgeStore();
    const [file, setFile] = React.useState<File>();
    const [description, setDescription] = React.useState('')

    const resetForm = () => {
        setName('')
        setBanner('')
        setDescription('')
        setMode('PUBLIC')
    }


    const createRoom = async () => {
        if (!name.trim()) {
            toast.error('Room name is required')
            return
        }

        setLoading(true)

        try {
            let uploadedBannerUrl = banner

            // Upload file if present
            if (file) {
                const uploadResult = await edgestore.publicFiles.upload({
                    file,
                    onProgressChange: (progress) => {
                        // console.log('Upload progress:', progress)
                    },
                })
                uploadedBannerUrl = uploadResult.url
                setBanner(uploadedBannerUrl)
            }

            // Proceed only if we have a banner URL
            if (!uploadedBannerUrl) {
                toast.error('Banner image upload failed')
                return
            }

            const response = await axios.post(
                `${localURL}/room/create`,
                {
                    name,
                    banner: uploadedBannerUrl,
                    mode,
                    description
                },
                { withCredentials: true }
            )

            const { status, message } = response.data

            if (status === 'success') {
                toast.success('Room created successfully')
                resetForm()
                setOpen(false)
            } else {
                toast.error(message || 'Failed to create room')
            }
        } catch (error) {
            console.error('Room creation error:', error)
            toast.error('Unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                    <PlusCircle size={18} />
                    <span>Create Room</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-md">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-2xl font-semibold text-center">Create a New Room</DialogTitle>
                    <p className="text-center text-muted-foreground text-sm">
                        Fill in the details to create your custom room
                    </p>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    {/* Banner preview */}
                    <div className="flex justify-center mb-4">
                        {banner ? (
                            <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                <img
                                    src={banner}
                                    alt="Room Banner Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        toast.error("Invalid image URL")
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full h-32 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25">
                                <div className="flex flex-col items-center text-muted-foreground">
                                    <ImageIcon size={24} className="mb-2" />
                                    <span className="text-sm">Banner preview</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Room Name<span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter a room name"
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description
                            </Label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter a brief description of the room"
                                rows={4}
                                className="w-full px-3 py-2 border rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background text-foreground"
                            />
                            <p className="text-xs text-muted-foreground">
                                Add some context or purpose for the room (optional)
                            </p>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="banner" className="text-sm font-medium">
                                Banner URL
                            </Label>
                            <Input
                                id="banner"
                                type='file'
                                onChange={(e) => {
                                    setFile(e.target.files?.[0]);
                                }}
                                // onChange={(e) => setBanner(e.target.value)}
                                placeholder="Enter banner image URL"
                                className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                                Provide a URL to an image for your room banner
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mode" className="text-sm font-medium">
                                Room Visibility
                            </Label>
                            <Select value={mode} onValueChange={setMode}>
                                <SelectTrigger id="mode" className="w-full">
                                    <SelectValue placeholder="Select visibility mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="PUBLIC" className="flex items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <Globe size={16} />
                                                <span>Public</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="PRIVATE" className="flex items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <Lock size={16} />
                                                <span>Private</span>
                                            </div>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {mode === 'PUBLIC' ?
                                    'Public rooms are visible to everyone' :
                                    'Private rooms are only visible to invited members'}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-1/2"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={createRoom}
                        className="w-full sm:w-1/2 bg-primary"
                        disabled={loading || !name.trim()}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                <span>Creating...</span>
                            </div>
                        ) : (
                            <span>Create Room</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateRoom;