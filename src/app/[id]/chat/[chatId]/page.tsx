/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import ChatInterface from '@/components/chat/chatInterface'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const param = useParams()
  const idParam = param.id ?? ''
  const id = Array.isArray(idParam) ? idParam[0] : idParam
  return (
    <ChatInterface roomId={id} />
  )
}

export default page