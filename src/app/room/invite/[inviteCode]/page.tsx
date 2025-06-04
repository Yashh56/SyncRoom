/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { Users, Lock, Globe, FileText, ArrowRight, Loader2, CheckCircle, XCircle, Hash, Crown, Shield, Download } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import AnimatedLoader from '@/components/loader';
import { localURL } from '@/lib/url';

const RoomInvitePage = () => {
  const params = useParams();
  const inviteCode = params?.inviteCode || "U7MTMR"; // Fallback for demo

  type Member = {
    id: string;
    user: {
      id: string;
      name: string;
      image: string;
      status: string;
    };
    role: string;
  };

  type Material = {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    attachmentUrl?: string;
  };

  type RoomData = {
    id: string;
    name: string;
    description?: string;
    banner?: string;
    mode: string;
    inviteCode: string;
    createdAt: string;
    members: Member[];
    Materials: Material[];
  };

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState<'success' | 'error' | null>(null);
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const getRoomInfo = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${localURL}/room/invite/${inviteCode}`, { withCredentials: true });
        console.log(res.data)
        const data = res.data.data;

        setRoomData(data);
        setIsLoading(false);
        document.title = `Room: ${data.name}`;
      } catch (error) {
        console.log(error);
        setError("Failed to load room information");
        setIsLoading(false);
      }
    };

    getRoomInfo();
  }, [inviteCode]);

  const joinRoom = async () => {
    try {
      setIsJoining(true);
      setJoinStatus(null);

      const res = await axios.post(`${localURL}/room/join`, {
        inviteCode: inviteCode
      }, { withCredentials: true });

      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      setJoinStatus('success');
      setTimeout(() => {
        // Redirect to room dashboard or chat
        if (res.data.status === 'success') {
          window.location.href = `/room/${res.data.data.id}`;
        }
      }, 1500);

    } catch (error) {
      console.log(error);
      setJoinStatus('error');
    } finally {
      setIsJoining(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Crown className="w-3 h-3 text-yellow-400" />;
      case 'MODERATOR': return <Shield className="w-3 h-3 text-blue-400" />;
      default: return null;
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading || !roomData) {
    return (
     <AnimatedLoader/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="text-center p-8">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-white mb-2">Invite Invalid</CardTitle>
            <CardDescription className="text-gray-400 mb-6">{error}</CardDescription>
            <Button variant="destructive" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onlineMembers = roomData.members.filter(m => m.user.status === 'online').length;

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950  flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Invite Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden shadow-2xl">
          {/* Header with Banner */}
          <div className="relative">
            {roomData.banner && (
              <div className="h-32 w-full overflow-hidden">
                <img
                  loading='lazy'
                  src={roomData.banner}
                  alt="Room banner"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <CardHeader className={`${roomData.banner ? 'relative -mt-8' : ''} pb-4`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 border-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <Avatar className='w-12 h-12 border-2 border-gray-800'> 
                    <AvatarImage src={roomData.banner} referrerPolicy="no-referrer" />
                    <AvatarFallback className={`${!roomData.banner && 'bg-indigo-500 text-white text-xs'} `}>
                      {getInitials(roomData.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className=" text-black font-semibold text-lg truncate">
                    {roomData.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={roomData.mode === 'PRIVATE' ? 'secondary' : 'outline'} className="text-xs">
                      {roomData.mode === 'PRIVATE' ?
                        <><Lock className="w-3 h-3 mr-1" /> Private</> :
                        <><Globe className="w-3 h-3 mr-1" /> Public</>
                      }
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </div>

          <CardContent className="space-y-4">
            {/* Description */}
            {roomData.description && (
              <div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {roomData.description}
                </p>
              </div>
            )}

            {/* Members Count */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{onlineMembers} Online</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{roomData.members.length} Members</span>
              </div>
            </div>

            {/* Member Avatars */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex -space-x-2">
                  {roomData.members.slice(0, 5).map((member, index) => (
                    <div key={member.id} className="relative">
                      <Avatar className="w-8 h-8 border-2 border-gray-800">
                        <AvatarImage src={member.user.image} referrerPolicy="no-referrer" />
                        <AvatarFallback className="bg-indigo-500 text-white text-xs">
                          {getInitials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Status indicator */}
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(member.user.status)} rounded-full border-2 border-gray-800`}></div>

                      {/* Role indicator */}
                      {member.role === 'ADMIN' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center">
                          {getRoleIcon(member.role)}
                        </div>
                      )}
                    </div>
                  ))}
                  {roomData.members.length > 5 && (
                    <Avatar className="w-8 h-8 bg-gray-700 border-2 border-gray-800">
                      <AvatarFallback className="text-gray-400 text-xs">
                        +{roomData.members.length - 5}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Materials Preview */}
            {roomData.Materials.length > 0 && (
              <div>
                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center">
                  <FileText className="w-3 h-3 mr-1" />
                  Materials ({roomData.Materials.length})
                </h4>
                <div className="space-y-1">
                  {roomData.Materials.slice(0, 3).map((material) => (
                    <div key={material.id} className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-300 text-sm truncate block">****</span>
                        {material.description && (
                          <span className="text-gray-500 text-xs truncate block">*********</span>
                        )}
                        <span className="text-gray-500 text-xs">Added {formatDate(material.createdAt)}</span>
                      </div>
                      {/* {material.attachmentUrl && (
                        <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                          <Download className="w-3 h-3" />
                        </Button>
                      )} */}
                    </div>
                  ))}
                  {roomData.Materials.length > 3 && (
                    <div className="text-xs text-gray-500 ml-6">
                      and {roomData.Materials.length - 3} more...
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          {/* Join Button */}
          <div className="p-4 bg-gray-750 border-t border-gray-700">
            {joinStatus === 'success' ? (
              <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                <CheckCircle className="w-4 h-4 mr-2" />
                Joined successfully!
              </Button>
            ) : joinStatus === 'error' ? (
              <div className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700" disabled>
                  <XCircle className="w-4 h-4 mr-2" />
                  Failed to join
                </Button>
                <Button onClick={joinRoom} className="w-full">
                  Try Again
                </Button>
              </div>
            ) : (
              roomData.members.some((m: Member) => m.user.id === user?.id) ? (
                <Button className="w-full bg-gray-600 hover:bg-gray-700" disabled>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Already a member
                </Button>
              ) : (
                <Button onClick={joinRoom} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  {isJoining ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Join Room
                    </>
                  )}
                </Button>
              )

            )}
          </div>
        </Card>

        {/* Invite Code */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs mb-2">Invite Code</p>
          <Badge variant="outline" className="font-mono text-sm px-3 py-1">
            {roomData.inviteCode}
          </Badge>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            By joining, you agree to the community guidelines
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Room created on {formatDate(roomData.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomInvitePage;