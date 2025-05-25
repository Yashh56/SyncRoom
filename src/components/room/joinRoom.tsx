import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import axios from 'axios'
import { toast } from 'sonner'
import { Users } from 'lucide-react'

const JoinRoom = () => {
  const [value, setValue] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const Join = async () => {
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/room/join', {
        inviteCode: value,
      }, { withCredentials: true })
      if (res.data.status === 'success') {
        toast.success('Room joined successfully')
      } else {
        toast.error('Error joining room')
      }
    } catch (error) {
      toast.error('Error joining room')
    }
    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-slate-200 hover:bg-slate-100 transition-all duration-200 hover:border-slate-300">
          <Users size={16} className="text-slate-500" />
          <span>Join Room</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6  rounded-lg shadow-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Join a Room</DialogTitle>

        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inviteCode" className="text-right">
              Invite Code
            </Label>
            <div className="col-span-3">
              <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
                className="border p-2 rounded-md"
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="text-center text-sm mt-2">
                <span className="text-muted-foreground">
                  Enter the 6-digit Invite Code to join the room.
                </span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-center">
          <Button
            onClick={() => { if (value.length === 6) Join(); }}
            disabled={loading || value.length !== 6}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-primary'} transition duration-200`}
          >
            {loading ? "Joining..." : "Join Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default JoinRoom
