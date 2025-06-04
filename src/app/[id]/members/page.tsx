/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'

import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import {
    Users,
    Crown,
    Shield,
    User,
    Search,
    MoreVertical,
    UserMinus,
    UserPlus,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Mail,
    Calendar,
    Filter,
    RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AnimatedLoader from '@/components/loader'
import { localURL } from '@/lib/url'

interface Member {
    id: string
    userId: string
    role: 'ADMIN' | 'MODERATOR' | 'USER'
    joinedAt: string
    user: {
        id: string
        name: string
        email: string
        image?: string
        isOnline?: boolean
        lastSeen?: string
    }
}

interface RoomDetails {
    id: string
    name: string
    description: string
    members: Member[]
    createdAt: string
    inviteCode: string
    banner?: string
}

interface ApiResponse {
    status: 'success' | 'error'
    data: RoomDetails
    message?: string
}

type RoleFilter = 'ALL' | 'ADMIN' | 'MODERATOR' | 'USER'

const MembersPage = () => {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const currentUser = useAuthStore((state) => state.user)

    const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL')
    const [selectedMember, setSelectedMember] = useState<string | null>(null)

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || localURL

    // Get room details including members
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

                setRoomDetails(res.data.data)
            } else {
                throw new Error(res.data.message || 'Failed to fetch room details')
            }
        } catch (error) {
            console.error('Failed to fetch room details:', error)
            const errorMessage = 'Failed to load room details'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [id, baseApiUrl])
    console.log(roomDetails)
    // Check if current user can manage members
    const currentUserMembership = roomDetails?.members.find(m => m.userId === currentUser?.id)
    const canManageMembers = currentUserMembership?.role === 'ADMIN' || currentUserMembership?.role === 'MODERATOR'
    const isAdmin = currentUserMembership?.role === 'ADMIN'

    // Filter members based on search and role
    const filteredMembers = roomDetails?.members.filter(member => {
        const matchesSearch = member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === 'ALL' || member.role === roleFilter
        return matchesSearch && matchesRole
    }) || []

    // Group members by role
    const membersByRole = {
        ADMIN: filteredMembers.filter(m => m.role === 'ADMIN'),
        MODERATOR: filteredMembers.filter(m => m.role === 'MODERATOR'),
        USER: filteredMembers.filter(m => m.role === 'USER')
    }

    // Handle member role change
    const handleRoleChange = async (memberId: string, newRole: 'ADMIN' | 'MODERATOR' | 'USER') => {
        if (!canManageMembers) {
            toast.error('You do not have permission to change member roles')
            return
        }

        try {
            setActionLoading(memberId)

            const res = await axios.patch(
                `${baseApiUrl}/room/${id}/members/${memberId}/role`,
                { role: newRole },
                { withCredentials: true }
            )

            if (res.data.status === 'success') {
                toast.success(`Member role updated to ${newRole.toLowerCase()}`)
                getRoomDetails() // Refresh data
            } else {
                throw new Error(res.data.message || 'Failed to update member role')
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to update member role')
            } else {
                toast.error('Failed to update member role')
            }
        } finally {
            setActionLoading(null)
        }
    }

    // Handle member removal
    const handleRemoveMember = async (memberId: string, memberName: string) => {
        if (!canManageMembers) {
            toast.error('You do not have permission to remove members')
            return
        }

        if (memberId === currentUser?.id) {
            toast.error('You cannot remove yourself from the room')
            return
        }

        if (window.confirm(`Are you sure you want to remove ${memberName} from this room?`)) {
            try {
                setActionLoading(memberId)

                const res = await axios.delete(
                    `${baseApiUrl}/room/${id}/members/${memberId}`,
                    { withCredentials: true }
                )

                if (res.data.status === 'success') {
                    toast.success(`${memberName} has been removed from the room`)
                    getRoomDetails() // Refresh data
                } else {
                    throw new Error(res.data.message || 'Failed to remove member')
                }
            } catch (error) {
                toast.error('Failed to remove member')
            } finally {
                setActionLoading(null)
            }
        }
    }

    // Copy invite code
    const copyInviteCode = () => {
        if (roomDetails?.inviteCode) {
            navigator.clipboard.writeText(`http://localhost:3000/room/invite/${roomDetails.inviteCode}`)
            toast.success('Invite code copied to clipboard!')
        }
    }

    // Get role icon and color
    const getRoleDisplay = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'Admin' }
            case 'MODERATOR':
                return { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/20', label: 'Moderator' }
            default:
                return { icon: User, color: 'text-gray-500', bg: 'bg-gray-500/20', label: 'Member' }
        }
    }

    // Format join date
    const formatJoinDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
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
                <AlertCircle className="w-16 h-16 text-red-500" />
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Unable to Load Members
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

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 dark:bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Room Members
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {roomDetails.name} • {roomDetails.members.length} members
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        onClick={copyInviteCode}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Members
                    </Button>
                    <Button
                        onClick={getRoomDetails}
                        variant="ghost"
                        size="sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search members by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
                        <SelectTrigger className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-40">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Roles</SelectItem>
                            <SelectItem value="ADMIN">Admins</SelectItem>
                            <SelectItem value="MODERATOR">Moderators</SelectItem>
                            <SelectItem value="USER">Members</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                    <Crown className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold text-white">{membersByRole.ADMIN.length}</p>
                    <p className="text-sm text-gray-400">Admins</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                    <Shield className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold text-white">{membersByRole.MODERATOR.length}</p>
                    <p className="text-sm text-gray-400">Moderators</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                    <User className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                    <p className="text-2xl font-bold text-white">{membersByRole.USER.length}</p>
                    <p className="text-sm text-gray-400">Members</p>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold text-white">{roomDetails.members.length}</p>
                    <p className="text-sm text-gray-400">Total</p>
                </div>
            </div>

            {/* Members List */}
            <div className="space-y-6">
                {filteredMembers.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-white mb-2">No members found</h3>
                        <p className="text-gray-400">
                            {searchTerm || roleFilter !== 'ALL'
                                ? 'Try adjusting your search or filter criteria'
                                : 'This room has no members yet'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Render members by role */}
                        {(['ADMIN', 'MODERATOR', 'USER'] as const).map((role) => {
                            const members = membersByRole[role]
                            if (members.length === 0) return null

                            const roleDisplay = getRoleDisplay(role)
                            const RoleIcon = roleDisplay.icon

                            return (
                                <div key={role} className="space-y-3">
                                    <div className="flex items-center gap-2 px-2">
                                        <RoleIcon className={`w-5 h-5 ${roleDisplay.color}`} />
                                        <h2 className="text-lg font-semibold text-white">
                                            {roleDisplay.label}s ({members.length})
                                        </h2>
                                    </div>

                                    <div className="grid gap-3">
                                        {members.map((member) => {
                                            const memberRoleDisplay = getRoleDisplay(member.role)
                                            const MemberRoleIcon = memberRoleDisplay.icon
                                            const isCurrentUser = member.userId === currentUser?.id
                                            const isLoadingAction = actionLoading === member.id

                                            return (
                                                <div
                                                    key={member.id}
                                                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            {/* Avatar */}
                                                            <div className="relative">
                                                                <Avatar>
                                                                    <AvatarImage src={member.user.image} referrerPolicy="no-referrer"
                                                                        alt={member.user.name} />
                                                                    <AvatarFallback>
                                                                        {member.user.name?.[0] /* or initials like: member.user.name?.slice(0, 2) */}
                                                                    </AvatarFallback>
                                                                </Avatar>

                                                                {member.user.isOnline && (
                                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                                                )}
                                                            </div>

                                                            {/* Member Info */}
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-semibold text-white">
                                                                        {member.user.name}
                                                                        {isCurrentUser && (
                                                                            <span className="text-xs text-blue-400 ml-2">(You)</span>
                                                                        )}
                                                                    </h3>
                                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${memberRoleDisplay.bg}`}>
                                                                        <MemberRoleIcon className={`w-3 h-3 ${memberRoleDisplay.color}`} />
                                                                        <span className={memberRoleDisplay.color}>{memberRoleDisplay.label}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                                                    <div className="flex items-center gap-1">
                                                                        <Mail className="w-3 h-3" />
                                                                        <span>{member.user.email}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        <span>Joined {formatJoinDate(member.joinedAt)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        {canManageMembers && !isCurrentUser && (
                                                            <div className="flex items-center space-x-2">
                                                                {isLoadingAction ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                                                ) : (
                                                                    <>
                                                                        {/* Role Change Dropdown */}
                                                                        {isAdmin && (
                                                                            <Select
                                                                                value={member.role}
                                                                                onValueChange={(value) => handleRoleChange(member.id, value as 'ADMIN' | 'MODERATOR' | 'USER')}
                                                                            >
                                                                                <SelectTrigger className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-28">
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="USER">Member</SelectItem>
                                                                                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                                                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}

                                                                        {/* Remove Member */}
                                                                        <Button
                                                                            onClick={() => handleRemoveMember(member.id, member.user.name)}
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                        >
                                                                            <UserMinus className="w-4 h-4" />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )}
                <div className="absolute top-20 right-8 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 rounded-full blur-2xl animate-pulse delay-700 pointer-events-none"></div>
                <div className="absolute bottom-40 left-12 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000 pointer-events-none"></div>

            </div>
        </div>
    )
}

export default MembersPage