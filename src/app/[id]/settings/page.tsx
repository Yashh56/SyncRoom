/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'

import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import {
  Settings,
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  Lock,
  Unlock,
  Users,
  Globe,
  Shield,
  Crown,
  Copy,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import AnimatedLoader from '@/components/loader'
import { localURL } from '@/lib/url'

interface RoomDetails {
  id: string
  name: string
  description: string
  banner?: string
  inviteCode: string
  isPrivate: boolean
  allowMemberInvites: boolean
  maxMembers?: number
  createdAt: string
  members: Array<{
    userId: string
    role: 'ADMIN' | 'MODERATOR' | 'MEMBER'
  }>
}

interface ApiResponse {
  status: 'success' | 'error'
  data?: any
  message?: string
}

const RoomSettingsPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const currentUser = useAuthStore((state) => state.user)

  // Room data
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    allowMemberInvites: true,
    maxMembers: 100
  })
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [showInviteCode, setShowInviteCode] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [roomDescription, setRoomDescription] = useState('')
  const [mode, setMode] = useState(false)


  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || localURL

  // Check permissions
  const currentUserMembership = roomDetails?.members.find(m => m.userId === currentUser?.id)
  const isAdmin = currentUserMembership?.role === 'ADMIN'
  const canManageRoom = isAdmin

  // Fetch room details
  const getRoomDetails = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const res = await axios.get<ApiResponse>(`${baseApiUrl}/room/details/${id}`, {
        withCredentials: true,
        timeout: 10000,
      })
      console.log(res.data.data)
      if (res.data.status === 'success' && res.data.data) {
        const room = res.data.data
        setRoomDetails(room)
        setFormData({
          name: room.name || '',
          description: room.description || '',
          isPrivate: room.mode || false,
          allowMemberInvites: room.allowMemberInvites ?? true,
          maxMembers: room.maxMembers || 100
        })
        setRoomName(room.name)
        setRoomDescription(room.description || '')
        setBannerPreview(room.banner || null)
        setMode(room.mode)
      } else {
        throw new Error(res.data.message || 'Failed to fetch room details')
      }
    } catch (error: any) {
      console.error('Failed to fetch room details:', error)
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Failed to load room settings'
      setError(errorMessage)

      if (error.response?.status === 403) {
        toast.error('You do not have permission to access room settings')
        router.back()
      }
    } finally {
      setLoading(false)
    }
  }, [id, baseApiUrl, router])

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle banner upload
  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setBannerFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setBannerPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Remove banner
  const removeBanner = () => {
    setBannerFile(null)
    setBannerPreview(null)
  }

  // Save room settings
  const saveSettings = async () => {
    if (!canManageRoom) {
      toast.error('You do not have permission to modify room settings')
      return
    }

    if (!formData.name.trim()) {
      toast.error('Room name is required')
      return
    }

    try {
      setSaving(true)

      // Prepare form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name.trim())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('isPrivate', formData.isPrivate.toString())
      formDataToSend.append('allowMemberInvites', formData.allowMemberInvites.toString())
      formDataToSend.append('maxMembers', formData.maxMembers.toString())

      if (bannerFile) {
        formDataToSend.append('banner', bannerFile)
      }

      const res = await axios.patch<ApiResponse>(
        `${baseApiUrl}/room/${id}/settings`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (res.data.status === 'success') {
        toast.success('Room settings updated successfully!')
        getRoomDetails() // Refresh data
        setBannerFile(null)
        setBannerPreview(null)
      } else {
        throw new Error(res.data.message || 'Failed to update room settings')
      }
    } catch (error: any) {
      console.error('Failed to update room settings:', error)
      toast.error(error.response?.data?.message || 'Failed to update room settings')
    } finally {
      setSaving(false)
    }
  }

  // Generate new invite code
  const regenerateInviteCode = async () => {
    if (!canManageRoom) {
      toast.error('You do not have permission to regenerate invite code')
      return
    }

    try {
      const res = await axios.post<ApiResponse>(
        `${baseApiUrl}/room/${id}/regenerate-invite`,
        {},
        { withCredentials: true }
      )

      if (res.data.status === 'success') {
        toast.success('New invite code generated!')
        getRoomDetails()
      } else {
        throw new Error(res.data.message || 'Failed to regenerate invite code')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to regenerate invite code')
    }
  }

  // Copy invite code
  const copyInviteCode = () => {
    if (roomDetails?.inviteCode) {
      navigator.clipboard.writeText(roomDetails.inviteCode)
      toast.success('Invite code copied to clipboard!')
    }
  }

  // Delete room
  const deleteRoom = async () => {
    if (!isAdmin) {
      toast.error('Only room admins can delete the room')
      return
    }

    if (deleteConfirmText !== roomDetails?.name) {
      toast.error('Please type the room name exactly to confirm deletion')
      return
    }

    try {
      setDeleting(true)

      const res = await axios.delete<ApiResponse>(
        `${baseApiUrl}/room/${id}`,
        { withCredentials: true }
      )

      if (res.data.status === 'success') {
        toast.success('Room deleted successfully')
        router.push('/') // Redirect to dashboard
      } else {
        throw new Error(res.data.message || 'Failed to delete room')
      }
    } catch (error: any) {
      console.error('Failed to delete room:', error)
      toast.error(error.response?.data?.message || 'Failed to delete room')
    } finally {
      setDeleting(false)
    }
  }

  const updateRoom = async () => {
    try {
      const res = await axios.put(`${baseApiUrl}/room/${id}`, {
        name: roomName,
        description: roomDescription,
        mode: mode,
        banner: 'https://i.pinimg.com/736x/d9/ab/45/d9ab4584e795b62f3717a989ef933e0e.jpg',
      }, { withCredentials: true })
      console.log(res.data)
      if (res.data.status === 'success') {
        toast.success('Room updated successfully')
        getRoomDetails()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getRoomDetails()
  }, [getRoomDetails])

  if (loading) {
    return (
      <AnimatedLoader />
    )
  }

  if (error || !roomDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full space-y-6">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Unable to Load Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'Room not found or you may not have access'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={getRoomDetails}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!canManageRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full space-y-6">
        <Lock className="w-16 h-16 text-yellow-500" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Access Restricted
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only room administrators can access settings
          </p>
        </div>
        <Button onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Room Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure your room preferences and settings
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={updateRoom}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="absolute top-20 right-8 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 rounded-full blur-2xl animate-pulse delay-700 pointer-events-none"></div>
      <div className="absolute bottom-40 left-12 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000 pointer-events-none"></div>


      <div className="grid gap-8">
        {/* Basic Information */}
        <div className=" rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Basic Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Room Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Room Name *</label>
              <input
                type="text"
                value={roomName}
                // value={formData.name}
                onChange={(e) => setRoomName(e.target.value)}
                // onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter room name"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={50}
              />
              <p className="text-xs text-gray-400">{formData.name.length}/50 characters</p>
            </div>

            {/* Max Members */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Maximum Members</label>
              <input
                type="number"
                value={formData.maxMembers}
                onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value) || 100)}
                min="1"
                max="1000"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              // value={formData.description}
              // onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your room..."
              rows={3}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-400">{formData.description.length}/500 characters</p>
          </div>
        </div>

        {/* Room Banner */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Room Banner</h2>
          </div>

          <div className="space-y-4">
            {/* Current/Preview Banner */}
            <div className="relative">
              <img
                src={bannerPreview || roomDetails.banner || '/api/placeholder/800/200'}
                alt="Room banner"
                className="w-full h-48 object-cover rounded-lg border border-white/20"
              />
              {bannerPreview && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Preview
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition">
                <Upload className="w-4 h-4" />
                Upload New Banner
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </label>

              {(bannerPreview || roomDetails.banner) && (
                <Button
                  onClick={removeBanner}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Banner
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Recommended size: 800x200px. Max file size: 5MB. Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>

        {/* Privacy & Access */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Privacy & Access</h2>
          </div>

          <div className="space-y-4">
            {/* Private Room Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                {/* {formData.isPrivate ? (
                  <Lock className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Globe className="w-5 h-5 text-green-500" />
                )} */}
                {mode ? (
                  <Lock className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Globe className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <h3 className="font-medium text-white">Private Room</h3>
                  <p className="text-sm text-gray-400">
                    {formData.isPrivate
                      ? 'Only invited members can join this room'
                      : 'Anyone with the invite code can join'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMode(!mode)}
                // onClick={() => handleInputChange('isPrivate', !formData.isPrivate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isPrivate ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isPrivate ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Member Invites Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-medium text-white">Allow Member Invites</h3>
                  <p className="text-sm text-gray-400">
                    Let regular members invite others to this room
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleInputChange('allowMemberInvites', !formData.allowMemberInvites)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.allowMemberInvites ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.allowMemberInvites ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Invite Code Management */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Copy className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Invite Code</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-lg font-mono text-green-400">
                {showInviteCode ? roomDetails.inviteCode : '••••••••••••'}
              </div>
              <Button
                onClick={() => setShowInviteCode(!showInviteCode)}
                variant="ghost"
                size="sm"
              >
                {showInviteCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                onClick={copyInviteCode}
                variant="outline"
                size="sm"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={regenerateInviteCode}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Generate New Code
            </Button>
            <p className="text-xs text-gray-400">
              Warning: Generating a new code will invalidate the current one
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        {isAdmin && (
          <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h3 className="font-medium text-red-400 mb-2">Delete Room</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Once you delete this room, there is no going back. This action cannot be undone.
                  All messages, files, and member data will be permanently deleted.
                </p>

                {!showDeleteConfirm ? (
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Room
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-red-400 block mb-2">
                        Type "{roomDetails.name}&#34; to confirm deletion:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder={roomDetails.name}
                        className="w-full px-4 py-2 bg-white/10 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={deleteRoom}
                        disabled={deleting || deleteConfirmText !== roomDetails.name}
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        {deleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {deleting ? 'Deleting...' : 'I understand, delete this room'}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeleteConfirmText('')
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomSettingsPage