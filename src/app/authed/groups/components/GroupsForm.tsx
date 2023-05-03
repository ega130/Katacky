"use client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input as TextInput } from "~/components/common";
import { Label } from "~/components/common/label";
import { QRCodeScanner } from "~/lib/qr/QRCodeScanner";
import { trpc } from "~/lib/trpc/connectNext";
import { useInput } from "~/util/form";

type GroupFormProps = {
  user: User;
};

export const GroupsForm = ({ user }: GroupFormProps) => {
  const groupNameInput = useInput("");
  const createGroup = trpc.group.create.useMutation();
  const updateUser = trpc.user.update.useMutation();
  const [isGroupRegister, setIsGroupRegister] = useState<boolean>(false);
  const [groupToken, setGroupToken] = useState<string>();
  const { isFetching, data: group } = trpc.group.groupByToken.useQuery(
    {
      token: groupToken!,
    },
    { enabled: !!groupToken }
  );
  const router = useRouter();
  const onClickButton = async () => {
    if (!user) {
      return;
    }
    const targetGroup = isGroupRegister
      ? group
      : await createGroup.mutateAsync({
          name: groupNameInput.value,
        });
    if (!targetGroup) {
      return;
    }
    await updateUser.mutateAsync({ id: user?.id, groupId: targetGroup.id });
    router.refresh();
  };

  return (
    <form className="flex flex-col gap-4">
      {!isGroupRegister ? (
        <div>
          <div className="mb-2 block">
            <Label htmlFor="groupName">グループ名</Label>
          </div>
          <TextInput
            id="groupName"
            type="text"
            placeholder="グループ名を入力してください"
            required={true}
            {...groupNameInput}
          />
        </div>
      ) : (
        <>
          {isFetching && <p>グループを検索中...</p>}
          {group && <p>グループ名: {group.name}</p>}
          {!isFetching && !group && <QRCodeScanner setData={setGroupToken} />}
        </>
      )}
      <Button type="button" onClick={onClickButton}>
        登録
      </Button>
      <Button type="button" onClick={() => setIsGroupRegister((now) => !now)}>
        {!isGroupRegister ? "他の人のグループに入る" : "グループを作成する"}
      </Button>
    </form>
  );
};