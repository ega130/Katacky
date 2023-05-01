"use client";
import { Ticket } from "@prisma/client";
import { useState } from "react";
import { Button } from "~/components/common";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/common/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select";
import { useUserInfo } from "~/lib/auth/hooks/useUser";
import { trpc } from "~/lib/trpc/connectNext";
import { useInput } from "~/util/form";
import { UnionNullToUndefined } from "~/util/types";

type TicketAssignDialogProps = {
  ticket: UnionNullToUndefined<Ticket>;
};

export const TicketAssignDialog = ({ ticket }: TicketAssignDialogProps) => {
  const userInfo = useUserInfo();
  const { data: users } = trpc.user.byGroup.useQuery(
    {
      groupId: userInfo?.groupId!,
    },
    { enabled: Boolean(userInfo?.groupId) }
  );
  const sendTicket = trpc.ticket.send.useMutation();
  const [userId, setUserId] = useState<string>();
  const onClickSendTicket = async () => {
    if (!ticket.id) {
      return;
    }
    await sendTicket.mutateAsync({ id: ticket.id, userId: Number(userId) });
  };

  return (
    <Dialog>
      <DialogTrigger
        type="button"
        className="mt-4 flex justify-center w-full"
        disabled={!users || users.length === 0}
      >
        チケットを送る
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>チケットの送り先を選択してください</DialogTitle>
          <DialogDescription>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              className="w-full mt-2"
              onClick={onClickSendTicket}
            >
              送信する
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};